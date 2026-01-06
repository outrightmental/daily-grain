const cron = require('node-cron');
const db = require('../models/database');
const DigestService = require('../services/DigestService');
const TwilioService = require('../services/TwilioService');

class SchedulerService {
  static startDailyDigest() {
    // Schedule daily digest at 9 AM every day
    // Cron format: minute hour day month dayOfWeek
    const cronExpression = process.env.DIGEST_CRON || '0 9 * * *';
    
    console.log(`Scheduling daily digest with cron: ${cronExpression}`);
    
    cron.schedule(cronExpression, async () => {
      console.log('Running daily digest job...');
      await SchedulerService.sendDailyDigests();
    });
  }

  static async sendDailyDigests() {
    try {
      // Get all users
      const stmt = db.prepare('SELECT * FROM users');
      const users = stmt.all();

      console.log(`Sending daily digest to ${users.length} users...`);

      const messages = users.map(user => ({
        phoneNumber: user.phone_number,
        message: DigestService.generateDailyDigest(user.id)
      }));

      // Send SMS to each user
      const results = await TwilioService.sendDailyDigests(messages);
      
      const successful = results.filter(r => r.success).length;
      console.log(`Daily digest sent: ${successful}/${users.length} successful`);
      
      return results;
    } catch (error) {
      console.error('Error sending daily digests:', error);
      throw error;
    }
  }

  static async sendDigestNow(phoneNumber = null) {
    if (phoneNumber) {
      // Send to specific user
      const stmt = db.prepare('SELECT * FROM users WHERE phone_number = ?');
      const user = stmt.get(phoneNumber);
      
      if (!user) {
        console.log('User not found:', phoneNumber);
        return { success: false, error: 'User not found' };
      }

      const message = DigestService.generateDailyDigest(user.id);
      return await TwilioService.sendSMS(phoneNumber, message);
    } else {
      // Send to all users
      return await SchedulerService.sendDailyDigests();
    }
  }
}

module.exports = SchedulerService;
