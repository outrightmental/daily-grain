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

### 5. Enable Firebase Authentication

The web dashboard requires Firebase Phone Authentication to be enabled:

```bash
# Enable Authentication in Firebase Console
# Or use the Firebase CLI (if available):
firebase init auth
```

Alternatively, enable it manually:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Phone** provider
5. Configure your domain for authentication (if using custom domain)

### 6. Deploy to Firebase

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

### 7. Configure Twilio Webhook

After deployment, get your function URL from the output:

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Phone Numbers** → **Manage** → **Active Numbers**
3. Click on your Daily Grain phone number
4. Under "Messaging Configuration" → "A MESSAGE COMES IN":
   - Set URL to: `https://us-central1-YOUR-PROJECT.cloudfunctions.net/webhook/sms`
   - Set HTTP Method to: `POST`
5. Click **Save**

### 8. Access the Web Dashboard

After deployment, the web UI will be available at:

```
https://YOUR-PROJECT.web.app/
```

Or with a custom domain:
```
https://your-custom-domain.com/
```

Users can:
1. Visit `/login.html` to login with their phone number
2. Receive SMS verification code
3. Access `/dashboard.html` to view their habit analytics

See [WEB_UI_GUIDE.md](WEB_UI_GUIDE.md) for detailed usage instructions.

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

2. **api** (HTTP Function)
   - Authenticated API for web dashboard
   - Endpoints: `/api/dashboard`
   - Requires Firebase Auth token

3. **sendDailyDigests** (Scheduled Function)
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

### Web Dashboard Login Not Working

1. Verify Firebase Authentication is enabled in Firebase Console
2. Check that Phone provider is enabled under Authentication → Sign-in method
3. Ensure your domain is authorized (check Authentication → Settings → Authorized domains)
4. Check browser console for JavaScript errors
5. Verify the `api` function is deployed: `firebase functions:list`

### Dashboard Not Showing Data

1. Verify user has created habits via SMS first
2. Check API function logs: `firebase functions:log --only api`
3. Ensure Firestore security rules are deployed: `firebase deploy --only firestore:rules`
4. Test API endpoint with curl (requires valid auth token)

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

### CI/CD Automation

The project includes automated deployment workflows using GitHub Actions for both production and preview environments.

#### Automated Production Deployment

**Workflow:** `.github/workflows/firebase-deploy.yml`

Automatically deploys to Firebase production on every push to the `main` branch.

**Features:**
- Installs dependencies
- Deploys all Firebase services (Functions, Hosting, Firestore)
- Runs on Node.js 20
- Uses Firebase CI token for authentication

#### Automated Preview Deployments

**Workflow:** `.github/workflows/firebase-preview.yml`

Creates preview environments for every pull request.

**Features:**
- Deploys to a unique preview channel (`pr-<number>`)
- Posts preview URL as a PR comment
- Previews expire after 7 days
- Automatically updates comment on new commits

**Preview Channel Cleanup:** `.github/workflows/firebase-cleanup.yml`

Automatically deletes preview channels when PRs are closed or merged.

#### Setup Instructions

1. **Generate Firebase CI Token:**
   ```bash
   firebase login:ci
   ```
   This will open a browser for authentication and output a token.

2. **Add Token to GitHub Secrets:**
   - Go to your repository on GitHub
   - Navigate to: Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `FIREBASE_TOKEN`
   - Value: Paste the token from step 1
   - Click "Add secret"

3. **Verify Setup:**
   - Push a commit to `main` to trigger production deployment
   - Open a PR to trigger a preview deployment
   - Check the Actions tab to monitor workflow runs

#### Manual Deployment

You can still deploy manually using the Firebase CLI:

```bash
# Production deployment
firebase deploy

# Deploy specific components
firebase deploy --only functions
firebase deploy --only hosting
firebase deploy --only firestore

# Preview channel deployment (manual)
firebase hosting:channel:deploy preview-test --expires 7d
```

#### Monitoring Deployments

**View workflow runs:**
- Go to the "Actions" tab in your GitHub repository
- Select a workflow to see its run history
- Click on a specific run to see logs and details

**Firebase Console:**
- [Firebase Console](https://console.firebase.google.com/)
- Select your project
- Navigate to "Hosting" to see deployments and preview channels
- Navigate to "Functions" to see deployed functions

#### Troubleshooting

**Deployment fails with "Permission denied":**
- Verify `FIREBASE_TOKEN` secret is set correctly
- Regenerate token: `firebase login:ci`
- Update the GitHub secret with the new token

**Preview URLs not appearing in PR comments:**
- Check workflow logs in the Actions tab
- Verify the workflow has write permissions for pull requests
- Check if the preview channel was created in Firebase Console

**Preview channel deployment fails:**
- Ensure Firebase Hosting is enabled in your project
- Verify `firebase.json` has hosting configuration
- Check that the project ID in `.firebaserc` is correct

### Multiple Environments

```bash
# Create separate projects for dev/prod
firebase use dev
firebase deploy

firebase use prod
firebase deploy
```

## Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloud Functions Docs](https://firebase.google.com/docs/functions)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Twilio Documentation](https://www.twilio.com/docs)

---

**See DEPLOYMENT.md.legacy for alternative deployment options (Heroku, Railway, Docker, etc.)**
