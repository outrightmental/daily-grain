# Quick Start Guide

Get Daily Grain up and running in 5 minutes.

## Prerequisites

- Node.js 20+ installed
- A Twilio account (free trial works!)
- Git

## Step 1: Clone and Install

```bash
git clone https://github.com/outrightmental/daily-grain.git
cd daily-grain
npm install
```

## Step 2: Get Twilio Credentials

1. Sign up at [twilio.com](https://www.twilio.com/try-twilio) (free trial available)
2. Get a phone number with SMS capabilities
3. Find your Account SID and Auth Token on the Twilio Console dashboard

## Step 3: Configure Environment

```bash
cp .env.example .env
nano .env  # or use your favorite editor
```

Update with your Twilio credentials:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+15551234567
```

## Step 4: Start the Server

```bash
npm start
```

You should see:
```
Twilio client initialized successfully
Daily Grain server running on port 3000
Webhook URL: http://localhost:3000/webhook/sms
```

## Step 5: Expose Your Server (Development)

For local testing, use [ngrok](https://ngrok.com/):

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

## Step 6: Configure Twilio Webhook

1. Go to [Twilio Console → Phone Numbers](https://console.twilio.com/us1/develop/phone-numbers/manage/incoming)
2. Click on your phone number
3. Scroll to "Messaging Configuration"
4. Under "A MESSAGE COMES IN":
   - Webhook: `https://your-ngrok-url.ngrok.io/webhook/sms`
   - HTTP: `POST`
5. Click "Save"

## Step 7: Test It!

Send a text message to your Twilio number:

```
You: HELP
```

You should receive:
```
Bot: Welcome to Daily Grain! 🌾

Commands:
• ADD [name] - Add a new habit
• LIST - See all your habits
• STATUS - View streaks and stats
• [numbers] - Log habits (e.g., '1 3')
• HELP - Show this message
```

## Your First Habit

```
You: ADD Morning run
Bot: Adding habit: "Morning run"

What's the frequency?
1. Daily
2. Multiple times per day
3. X times per week

Reply with a number (1-3)

You: 1
Bot: ✓ Added daily habit: "Morning run"

Reply 'LIST' to see all habits.

You: LIST
Bot: Daily Habits Check-in:

1. ○ Morning run (daily)

Reply with numbers to log (e.g., '1 3' for habits 1 and 3)
Reply 'STATUS' for detailed stats
Reply 'ADD [name]' to add a habit

You: 1
Bot: ✓ Logged: Morning run

Great work! Reply 'STATUS' to see your progress.
```

## What's Next?

### For Development
- The database is stored in `data/habits.db`
- Check server logs for debugging
- Modify `DIGEST_CRON` in `.env` to test daily digests

### For Production
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment guides
- Use a proper hosting platform (Heroku, Railway, etc.)
- Set up proper logging and monitoring
- Consider switching to PostgreSQL for larger scale

### Testing
Run the integration test:
```bash
npm test
```

## Troubleshooting

### Messages not being received
- Check Twilio webhook URL is correct and accessible
- Verify your server is running
- Check Twilio debugger in console for errors

### Server won't start
- Verify all dependencies are installed: `npm install`
- Check if port 3000 is available
- Review environment variables in `.env`

### Database errors
- Ensure `data` directory exists and is writable
- Check file permissions
- Delete `data/habits.db` to reset

## Learn More

- [Full Documentation](README.md)
- [Usage Examples](USAGE.md)
- [Deployment Guide](DEPLOYMENT.md)

## Support

For issues and questions:
- Check the [README](README.md) for detailed documentation
- Review [USAGE.md](USAGE.md) for command examples
- Open an issue on GitHub

---

**Congratulations!** 🎉 You now have a working SMS-based habit tracker!
