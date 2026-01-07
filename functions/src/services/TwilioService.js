const twilio = require('twilio');
const { defineSecret } = require('firebase-functions/params');

// Define config parameters from Firebase Secrets
const twilioAccountSid = defineSecret('TWILIO_ACCOUNT_SID');
const twilioAuthToken = defineSecret('TWILIO_AUTH_TOKEN');
const twilioPhoneNumber = defineSecret('TWILIO_PHONE_NUMBER');

class TwilioService {
  constructor() {
    // For local development, allow process.env fallback
    // In production, Firebase Secrets should be used
    const isLocal = process.env.FUNCTIONS_EMULATOR === 'true';
    
    this.accountSid = isLocal ? process.env.TWILIO_ACCOUNT_SID : twilioAccountSid.value();
    this.authToken = isLocal ? process.env.TWILIO_AUTH_TOKEN : twilioAuthToken.value();
    this.phoneNumber = isLocal ? process.env.TWILIO_PHONE_NUMBER : twilioPhoneNumber.value();
    
    // Only initialize Twilio client if valid credentials are provided
    if (this.accountSid && 
        this.authToken && 
        this.accountSid.startsWith('AC')) {
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
