require('dotenv').config();
const express = require('express');
const webhookRoutes = require('./routes/webhook');
const SchedulerService = require('./services/SchedulerService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use('/webhook', webhookRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Daily Grain',
    description: 'SMS-based habit tracking platform',
    version: '1.0.0'
  });
});

// Start daily digest scheduler
if (process.env.ENABLE_SCHEDULER !== 'false') {
  SchedulerService.startDailyDigest();
  console.log('Daily digest scheduler started');
}

// Start server
app.listen(PORT, () => {
  console.log(`Daily Grain server running on port ${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhook/sms`);
});

module.exports = app;
