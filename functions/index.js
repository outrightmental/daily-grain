const { onRequest } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const twilio = require('twilio');
const { admin } = require('./src/models/firestore');
const MessageService = require('./src/services/MessageService');
const TwilioService = require('./src/services/TwilioService');
const DigestService = require('./src/services/DigestService');
const HabitService = require('./src/services/HabitService');
const User = require('./src/models/User');

/**
 * Webhook endpoint for incoming SMS messages from Twilio
 */
exports.webhook = onRequest(async (req, res) => {
  try {
    // Only handle POST requests
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    // Handle SMS webhook
    if (req.path === '/sms' || req.path === '/webhook/sms') {
      const { From: fromNumber, Body: messageBody } = req.body;

      if (!fromNumber || !messageBody) {
        res.status(400).send('Missing required parameters');
        return;
      }

      // Handle the message
      const response = await MessageService.handleIncomingMessage(fromNumber, messageBody);

      // Create TwiML response
      const twiml = new twilio.twiml.MessagingResponse();
      twiml.message(response);

      res.type('text/xml');
      res.send(twiml.toString());
      return;
    }

    // Health check endpoint
    if (req.path === '/health' || req.path === '/webhook/health') {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
      return;
    }

    // Default response
    res.json({
      name: 'Daily Grain',
      description: 'SMS-based habit tracking platform',
      version: '1.1.0',
      endpoints: {
        sms: '/webhook/sms',
        health: '/webhook/health'
      }
    });
  } catch (error) {
    console.error('Error handling request:', error);
    
    // If it's an SMS request, respond with TwiML
    if (req.body && req.body.From) {
      const twiml = new twilio.twiml.MessagingResponse();
      twiml.message('Sorry, there was an error processing your message. Please try again.');
      res.type('text/xml');
      res.send(twiml.toString());
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

/**
 * API endpoint for web dashboard
 * Requires authentication via Firebase Auth
 */
exports.api = onRequest({ cors: true }, async (req, res) => {
  try {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ error: 'Invalid authentication token' });
      return;
    }

    const phoneNumber = decodedToken.phone_number;
    if (!phoneNumber) {
      res.status(401).json({ error: 'Phone number not found in token' });
      return;
    }

    // Get user from database
    const user = await User.findByPhoneNumber(phoneNumber);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Route API requests
    if (req.path === '/dashboard' || req.path === '/api/dashboard') {
      await handleDashboardRequest(user, res);
      return;
    }

    res.status(404).json({ error: 'Endpoint not found' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Handle dashboard data request
 */
async function handleDashboardRequest(user, res) {
  try {
    // Get all user stats
    const statsArray = await HabitService.getAllUserStats(user.id);
    
    // Format habits with their stats
    const habits = statsArray.map(stat => {
      if (!stat) return null;
      return {
        id: stat.habit.id,
        name: stat.habit.name,
        frequencyType: stat.habit.frequencyType,
        targetCount: stat.habit.targetCount,
        streak: stat.streak,
        last7Days: stat.last7Days,
        last30Days: stat.last30Days
      };
    }).filter(h => h !== null);

    // Calculate overall stats
    const totalHabits = habits.length;
    const activeStreaks = habits.filter(h => h.streak > 0).length;
    const longestStreak = habits.length > 0 
      ? Math.max(...habits.map(h => h.streak)) 
      : 0;
    
    // Calculate average 7-day completion
    const avgCompletion = habits.length > 0
      ? Math.round(
          habits.reduce((sum, h) => sum + (h.last7Days?.completionRate || 0), 0) / habits.length
        )
      : 0;

    res.json({
      habits,
      stats: {
        totalHabits,
        activeStreaks,
        longestStreak,
        avgCompletion
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
}

/**
 * Scheduled function to send daily digests
 * Runs every day at 9 AM by default (configurable)
 */
exports.sendDailyDigests = onSchedule({
  schedule: 'every day 09:00',
  timeZone: 'America/New_York',
  memory: '256MiB',
}, async (event) => {
  try {
    console.log('Starting daily digest job...');
    
    // Get all active (non-paused) users
    const users = await User.getAll();
    console.log(`Sending daily digest to ${users.length} users...`);

    const messages = [];
    for (const user of users) {
      const message = await DigestService.generateDailyDigest(user.id);
      messages.push({
        phoneNumber: user.phoneNumber,
        message: message
      });
    }

    // Send SMS to each user
    const results = await TwilioService.sendDailyDigests(messages);
    
    const successful = results.filter(r => r.success).length;
    console.log(`Daily digest sent: ${successful}/${users.length} successful`);
    
    return { success: true, sent: successful, total: users.length };
  } catch (error) {
    console.error('Error sending daily digests:', error);
    throw error;
  }
});
