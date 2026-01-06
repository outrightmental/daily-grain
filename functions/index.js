const { onRequest } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const twilio = require('twilio');
const MessageService = require('./src/services/MessageService');
const TwilioService = require('./src/services/TwilioService');
const DigestService = require('./src/services/DigestService');
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
