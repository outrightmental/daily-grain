# Firebase Deployment Guide

This guide covers deploying Daily Grain to Firebase Cloud Platform.

## Prerequisites

- Node.js 20.x or higher
- A [Firebase](https://firebase.google.com/) account (free tier available)
- A [Twilio](https://www.twilio.com/) account with SMS capabilities
- Firebase CLI installed: `npm install -g firebase-tools`

## Initial Setup

### 1. Create Firebase Project

```bash
# Login to Firebase
firebase login

# Create a new project
firebase projects:create daily-grain-your-name
```

You can also create the project via [Firebase Console](https://console.firebase.google.com/)

### 2. Initialize Project

```bash
# Clone the repository
git clone https://github.com/outrightmental/daily-grain.git
cd daily-grain

# Select your Firebase project
firebase use daily-grain-your-name
```

### 3. Install Dependencies

```bash
cd functions
npm install
cd ..
```

### 4. Configure Twilio Credentials

**Using Firebase Secrets (Recommended)**

```bash
firebase functions:secrets:set TWILIO_ACCOUNT_SID
# Enter: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

firebase functions:secrets:set TWILIO_AUTH_TOKEN
# Enter: your_auth_token_here

firebase functions:secrets:set TWILIO_PHONE_NUMBER
# Enter: +15551234567
```

### 5. Deploy to Firebase

```bash
# Deploy everything: Functions, Firestore rules, Hosting
firebase deploy
```

**Deploy specific components:**

```bash
firebase deploy --only functions
firebase deploy --only hosting
firebase deploy --only firestore
```

### 6. Configure Twilio Webhook

After deployment, get your function URL from the output:

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Phone Numbers** → **Manage** → **Active Numbers**
3. Click on your Daily Grain phone number
4. Under "Messaging Configuration" → "A MESSAGE COMES IN":
   - Set URL to: `https://us-central1-YOUR-PROJECT.cloudfunctions.net/webhook/sms`
   - Set HTTP Method to: `POST`
5. Click **Save**

## Local Development

### Using Firebase Emulators

```bash
cd functions
npm run serve
```

This starts Functions and Firestore emulators. Your webhook will be at:
```
http://localhost:5001/YOUR-PROJECT/us-central1/webhook/sms
```

### Testing Locally

```bash
curl -X POST http://localhost:5001/YOUR-PROJECT/us-central1/webhook/sms \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=+15551234567&Body=HELP"
```

## Monitoring & Logs

### View Logs

```bash
# Stream logs
firebase functions:log

# View specific function
firebase functions:log --only webhook

# Limit number of lines
firebase functions:log -n 100
```

### Health Check

```bash
curl https://REGION-PROJECT.cloudfunctions.net/webhook/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-06T12:00:00.000Z"
}
```

## Cloud Functions

### Available Functions

1. **webhook** (HTTP Function)
   - Handles incoming SMS from Twilio
   - Endpoints: `/sms`, `/health`

2. **sendDailyDigests** (Scheduled Function)
   - Sends daily habit check-in messages
   - Schedule: Every day at 9:00 AM Eastern Time

### Customizing Schedule

Edit `functions/index.js`:

```javascript
exports.sendDailyDigests = onSchedule({
  schedule: 'every day 08:00',  // Change time
  timeZone: 'America/Los_Angeles',  // Change timezone
  memory: '256MiB',
}, async (event) => {
  // Function logic
});
```

## Firestore Database

### Collections

- `users` - User profiles and preferences
- `habits` - User habits with frequency settings
- `habitLogs` - Daily completion logs
- `userStates` - Conversation state for multi-step flows

### Backup & Export

```bash
# Export Firestore data
gcloud firestore export gs://YOUR-BUCKET/backup-$(date +%Y%m%d)

# Import from backup
gcloud firestore import gs://YOUR-BUCKET/backup-20260106
```

## Troubleshooting

### SMS Not Working

1. Check Twilio webhook URL in Twilio Console
2. View function logs: `firebase functions:log --only webhook`
3. Verify Twilio credentials: `firebase functions:secrets:access TWILIO_ACCOUNT_SID`
4. Test function directly with curl

### Daily Digests Not Sending

1. Check scheduler logs: `firebase functions:log --only sendDailyDigests`
2. Verify scheduler is enabled in [Cloud Scheduler Console](https://console.cloud.google.com/cloudscheduler)
3. Manually trigger: `gcloud functions call sendDailyDigests`

### Deployment Failed

1. Check Node.js version in `functions/package.json` (should be "20")
2. Reinstall dependencies:
   ```bash
   cd functions
   rm -rf node_modules package-lock.json
   npm install
   ```
3. Deploy with debug: `firebase deploy --only functions --debug`

## Cost Optimization

### Firebase Free Tier (Spark Plan)

**Included:**
- Cloud Functions: 2M invocations/month
- Firestore: 1 GiB storage, 50K reads, 20K writes/day
- Hosting: 10 GB storage, 360 MB/day transfer
- Cloud Scheduler: 3 jobs

**Estimated usage for small deployment (< 100 users): FREE**

### Blaze Plan (Pay as You Go)

**Typical monthly cost for 1000 active users: $5-10**

- Functions: First 2M invocations free, then $0.40 per million
- Firestore reads: $0.06 per 100K
- Firestore writes: $0.18 per 100K

## Security

### Best Practices

1. **Keep secrets secure**
   - Never commit credentials to Git
   - Use Firebase Secrets for sensitive data
   - Rotate credentials regularly

2. **Firestore security rules**
   - Review rules in `firestore.rules`
   - Test with Firestore Rules Emulator

3. **HTTPS only**
   - Firebase Functions enforce HTTPS by default

4. **Monitor access**
   - Enable Cloud Audit Logs
   - Set up alerts for suspicious activity

## Advanced Configuration

### Multiple Environments

```bash
# Create separate projects for dev/prod
firebase use dev
firebase deploy

firebase use prod
firebase deploy
```

### CI/CD Integration

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: cd functions && npm ci
      - run: |
          npm install -g firebase-tools
          firebase deploy --token "${{ secrets.FIREBASE_TOKEN }}"
```

Generate token: `firebase login:ci`

## Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloud Functions Docs](https://firebase.google.com/docs/functions)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Twilio Documentation](https://www.twilio.com/docs)

---

**See DEPLOYMENT.md.legacy for alternative deployment options (Heroku, Railway, Docker, etc.)**
