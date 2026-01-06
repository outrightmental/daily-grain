const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const MessageService = require('../services/MessageService');

// Webhook endpoint for incoming SMS
router.post('/sms', async (req, res) => {
  try {
    const { From: fromNumber, Body: messageBody } = req.body;

    // Handle the message
    const response = await MessageService.handleIncomingMessage(fromNumber, messageBody);

    // Create TwiML response
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(response);

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error handling SMS:', error);
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Sorry, there was an error processing your message. Please try again.');
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
