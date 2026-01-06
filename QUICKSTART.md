# Quick Start Guide - Firebase

Get Daily Grain up and running on Firebase in 5 minutes.

## Prerequisites

- Node.js 20+ installed
- A Firebase account (free tier available)
- A Twilio account (free trial works!)
- Git

## Step 1: Clone Repository

```bash
git clone https://github.com/outrightmental/daily-grain.git
cd daily-grain
```

## Step 2: Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

## Step 3: Create Firebase Project

```bash
firebase projects:create daily-grain-yourname
firebase use daily-grain-yourname
```

## Step 4: Get Twilio Credentials

1. Sign up at [twilio.com](https://www.twilio.com/try-twilio)
2. Get a phone number with SMS capabilities
3. Copy your Account SID and Auth Token

## Step 5: Configure Secrets

```bash
firebase functions:secrets:set TWILIO_ACCOUNT_SID
# Paste: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

firebase functions:secrets:set TWILIO_AUTH_TOKEN
# Paste: your_auth_token_here

firebase functions:secrets:set TWILIO_PHONE_NUMBER
# Paste: +15551234567
```

## Step 6: Install & Deploy

```bash
cd functions
npm install
cd ..
firebase deploy
```

After deployment, you'll see:
```
✔  Deploy complete!

Functions:
  https://us-central1-daily-grain-xxx.cloudfunctions.net/webhook
  https://us-central1-daily-grain-xxx.cloudfunctions.net/sendDailyDigests

Hosting URL: https://daily-grain-xxx.web.app
```

## Step 7: Configure Twilio Webhook

Copy your function URL and:

1. Go to [Twilio Console](https://console.twilio.com/) → Phone Numbers
2. Click your number
3. Under "Messaging", set webhook to:
   - URL: `https://us-central1-YOUR-PROJECT.cloudfunctions.net/webhook/sms`
   - Method: `POST`
4. Save

## Step 8: Test!

Text your Twilio number:
```
HELP
```

You should get a response:
```
Daily Grain

Commands:
• ADD [name] - Add a habit
• REMOVE [name] - Remove a habit
• LIST - See your habits
• STATUS - View stats
• TIME HH:MM - Set check-in time
• PAUSE / RESUME - Pause/resume
• STOP - Unsubscribe
```

## Create Your First Habit

```
You: ADD Morning run
Bot: Adding habit: "Morning run"

     What's the frequency?
     1. Daily
     2. Multiple times per day
     3. X times per week
     
     Reply with a number (1-3)

You: 1
Bot: Added daily habit: "Morning run"
     Reply LIST to see all habits.

You: LIST
Bot: Daily Check-in:

     Morning run (Daily): starting fresh

     Reply: Y N Y
     Text STATUS anytime for details.

You: Y
Bot: Logged: Morning run
     Text STATUS anytime for details.
```

## Monitor & Debug

```bash
# View logs
firebase functions:log

# Check health
curl https://YOUR-FUNCTION-URL/webhook/health
```

## Local Development

```bash
cd functions
npm run serve
```

This starts the Firebase emulators for local testing.

## What's Next?

### View Your Data
Visit [Firebase Console](https://console.firebase.google.com/):
- **Firestore Database** → View users, habits, logs
- **Functions** → Check logs and metrics
- **Hosting** → View your landing page

### Update Deployment
After making changes:
```bash
firebase deploy              # Deploy everything
firebase deploy --only functions   # Deploy only functions
```

### Cost
**Firebase Free Tier is perfect for personal use!**
- 2M function invocations/month
- 50K Firestore reads, 20K writes/day
- For ~1000 users: ~$5-10/month on Blaze plan

## Troubleshooting

### Messages not working
```bash
# Check logs
firebase functions:log --only webhook

# Test function
curl https://YOUR-FUNCTION-URL/webhook/health
```

### Deployment failed
```bash
cd functions
rm -rf node_modules package-lock.json
npm install
cd ..
firebase deploy --only functions
```

## Learn More

- [Full Documentation](README.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Usage Examples](USAGE.md)

---

**Congratulations! 🎉 Your habit tracker is live on Firebase!**

**Legacy Setup:** See [QUICKSTART.md.legacy](QUICKSTART.md.legacy) for the original Node.js/SQLite deployment.
