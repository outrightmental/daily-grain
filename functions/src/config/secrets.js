const { defineSecret } = require('firebase-functions/params');

// Define Firebase Secrets for Twilio credentials
const twilioAccountSid = defineSecret('TWILIO_ACCOUNT_SID');
const twilioAuthToken = defineSecret('TWILIO_AUTH_TOKEN');
const twilioPhoneNumber = defineSecret('TWILIO_PHONE_NUMBER');

module.exports = {
  twilioAccountSid,
  twilioAuthToken,
  twilioPhoneNumber
};
