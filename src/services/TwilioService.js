const twilio = require('twilio');

class TwilioService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER;
    
    // Only initialize Twilio client if valid credentials are provided
    if (this.accountSid && 
        this.authToken && 
        this.accountSid.startsWith('AC') &&
        this.authToken.length > 0) {
      try {
        this.client = twilio(this.accountSid, this.authToken);
        console.log('Twilio client initialized successfully');
      } catch (error) {
        console.warn('Failed to initialize Twilio client:', error.message);
        this.client = null;
      }
    } else {
      console.warn('Twilio credentials not configured or invalid. SMS sending will be disabled.');
      this.client = null;
    }
  }

  async sendSMS(toPhoneNumber, message) {
    if (!this.client) {
      console.log('Twilio not configured. Would send SMS to', toPhoneNumber, ':', message);
      return { success: false, error: 'Twilio not configured' };
    }

    try {
      const result = await this.client.messages.create({
        body: message,
        from: this.phoneNumber,
        to: toPhoneNumber
      });
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { success: false, error: error.message };
    }
  }

  async sendDailyDigests(users) {
    const results = [];
    for (const user of users) {
      const result = await this.sendSMS(user.phoneNumber, user.message);
      results.push({ user: user.phoneNumber, ...result });
    }
    return results;
  }
}

module.exports = new TwilioService();
