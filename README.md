# Daily Grain

[![CI Tests](https://github.com/outrightmental/daily-grain/actions/workflows/ci.yml/badge.svg)](https://github.com/outrightmental/daily-grain/actions/workflows/ci.yml)
[![Deploy to Firebase](https://github.com/outrightmental/daily-grain/actions/workflows/firebase-deploy.yml/badge.svg)](https://github.com/outrightmental/daily-grain/actions/workflows/firebase-deploy.yml)

A minimalist, SMS-only habit-building agent designed to help users form lasting habits with **one calm daily check-in** and no notification overload.

This is not a motivation app.  
It is a low-noise habit status and reflection system.

---

## Overview

The Habit Builder SMS Platform operates entirely via text message.

Users:
- Sign up with a phone number
- Define multiple habits and their expected frequency
- Receive **one daily SMS digest**
- Reply once per day to log progress
- Request detailed stats only when they want them

The platform prioritizes long-term habit formation, autonomy, and attention respect.

---

## Core Principles

- **Single daily touchpoint**
- **User-controlled engagement**
- **No gamification or pressure**
- **Neutral, supportive tone**
- **Designed for months-long use**

---

## Key Features

### 1. Multi-Habit Tracking
- Track multiple habits simultaneously
- Each habit has a frequency:
  - Daily
  - Multiple times per day
  - X times per week
- No hard habit limit (UI naturally encourages 3–5)

---

### 2. Daily SMS Digest (Once Per Day)
Sent at a user-selected time (default 9:00 AM).

Includes:
- All active habits
- Current status (streaks, weekly progress)
- A single prompt to log updates

Example:

> Daily Check-in:
> 
> Morning run (Daily): 4-day streak
> Read 10 pages (Daily): missed yesterday
> Gym (3x/week): 1 of 3 this week
> 
> Reply: Y N Y
> Text STATUS anytime for details.

No other reminders are sent that day.

---

### 3. Simple Reply Logging
- Users reply once with short answers (e.g. `Y N Y`)
- Parser accepts flexible responses (`yes/y/yep`, `no/n/nope`)
- Weekly habits aggregate daily replies into weekly totals
- Missed replies are logged silently (no nagging)
- Number-based logging still supported for backward compatibility

---

### 4. On-Demand Status Reports
Users can text `STATUS` at any time.

Response includes:
- Completion rates
- Current and best streaks
- Weekly goal progress
- Simple text-based reports

Stats are **never pushed automatically**—only returned on request.

---

### 5. Habit Management via SMS
Supported commands:
- `ADD [name]` – create a new habit
- `REMOVE [name]` – remove a habit
- `TIME HH:MM` – change digest time
- `LIST` - see all habits
- `PAUSE` / `RESUME` – pause/resume check-ins
- `STOP` – unsubscribe

---

## What This Platform Is Not

- No mobile app
- No AI coaching or therapy language
- No social features
- No points, badges, or leaderboards
- No real-time or multiple daily notifications
- No qualitative scoring ("how well" you did)

---

## Design Rationale

- **Consistency beats intensity**  
  One reliable daily cue is more effective than many interruptions.

- **Autonomy drives habit formation**  
  Users pull insight when they want it; the system never demands attention.

- **Low stimulation supports long-term success**  
  Avoids dopamine fatigue, shame cycles, and notification burnout.

The system should feel like it's working *for* the user—not managing them.

---

## Setup

### Prerequisites

- Node.js 20.x or higher
- A [Firebase](https://firebase.google.com/) account (free tier available)
- A [Twilio](https://www.twilio.com/) account with SMS capabilities
- A phone number from Twilio
- Firebase CLI: `npm install -g firebase-tools`

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/outrightmental/daily-grain.git
cd daily-grain
```

2. Install Firebase CLI (if not already installed):
```bash
npm install -g firebase-tools
```

3. Login to Firebase:
```bash
firebase login
```

4. Create a new Firebase project:
```bash
firebase projects:create daily-grain-your-name
```

5. Select your project:
```bash
firebase use daily-grain-your-name
```

6. Install dependencies:
```bash
cd functions
npm install
cd ..
```

7. Configure Twilio credentials:
```bash
firebase functions:config:set \
  twilio.account_sid="your_account_sid" \
  twilio.auth_token="your_auth_token" \
  twilio.phone_number="+1234567890"
```

Or set them as Firebase secrets (recommended):
```bash
firebase functions:secrets:set TWILIO_ACCOUNT_SID
firebase functions:secrets:set TWILIO_AUTH_TOKEN
firebase functions:secrets:set TWILIO_PHONE_NUMBER
```

8. Deploy to Firebase:
```bash
firebase deploy
```

### Twilio Configuration

After deploying to Firebase, configure your Twilio webhook:

1. Log in to your [Twilio Console](https://console.twilio.com/)
2. Go to Phone Numbers → Active Numbers → Select your number
3. Under "Messaging", set the webhook URL to: `https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/webhook/sms`
4. Method: `POST`
5. Save your changes

### Local Development

For local development with Firebase emulators:

```bash
# Start the Firebase emulators
cd functions
npm run serve
```

This will start the Functions and Firestore emulators. The webhook will be available at:
`http://localhost:5001/YOUR_PROJECT/us-central1/webhook/sms`

### Deployment

The application is deployed as Firebase Cloud Functions with Firestore as the database. All infrastructure is managed by Firebase.

#### CI/CD Automation

The project includes automated deployment workflows using GitHub Actions:

**Production Deployment (main branch):**
- Automatically deploys to Firebase on every push to `main`
- Workflow: `.github/workflows/firebase-deploy.yml`
- Deploys all Firebase services (Functions, Hosting, Firestore rules)

**Preview Deployments (Pull Requests):**
- Automatically creates a preview environment for each PR
- Preview URLs are posted as PR comments
- Previews expire after 7 days
- Workflow: `.github/workflows/firebase-preview.yml`
- Preview channels are automatically cleaned up when PRs are closed

**Required Setup:**
1. Generate a Firebase CI token:
   ```bash
   firebase login:ci
   ```
2. Add the token as a GitHub repository secret named `FIREBASE_TOKEN`:
   - Go to your repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `FIREBASE_TOKEN`
   - Value: Paste the token from step 1

**Manual Deployment:**
```bash
# Deploy everything
firebase deploy

# Deploy specific components
firebase deploy --only functions
firebase deploy --only hosting
firebase deploy --only firestore
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed Firebase deployment instructions and [CI-CD-SETUP.md](CI-CD-SETUP.md) for complete CI/CD setup guide.

---

## Commands Reference

| Command | Description | Example |
|---------|-------------|---------|
| `ADD [name]` | Create a new habit | `ADD Morning run` |
| `REMOVE [name]` | Remove a habit | `REMOVE Morning run` |
| `LIST` | See all your habits | `LIST` |
| `STATUS` | View detailed stats | `STATUS` |
| `TIME HH:MM` | Set check-in time | `TIME 08:30` |
| `PAUSE` | Pause daily check-ins | `PAUSE` |
| `RESUME` | Resume daily check-ins | `RESUME` |
| `STOP` | Unsubscribe | `STOP` |
| `Y N Y` | Log habits (Yes/No) | `Y N Y` |

---

## Architecture

**Firebase Cloud Architecture:**

```
daily-grain/
├── functions/               # Firebase Cloud Functions
│   ├── src/
│   │   ├── models/         # Firestore data models
│   │   │   ├── firestore.js    # Firebase Admin initialization
│   │   │   ├── User.js         # User model (Firestore)
│   │   │   ├── Habit.js        # Habit model (Firestore)
│   │   │   ├── HabitLog.js     # Habit logging and stats
│   │   │   └── UserState.js    # Conversation state management
│   │   └── services/       # Business logic
│   │       ├── HabitService.js      # Habit management
│   │       ├── DigestService.js     # Daily digest generation
│   │       ├── MessageService.js    # SMS message handling
│   │       └── TwilioService.js     # Twilio API wrapper
│   ├── index.js            # Cloud Functions entry point
│   └── package.json        # Functions dependencies
├── public/                 # Firebase Hosting files
│   └── index.html          # Landing page
├── src/                    # Legacy code (kept for reference)
├── firebase.json           # Firebase project configuration
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore indexes
└── .firebaserc             # Firebase project aliases
```

**Cloud Functions:**
- `webhook` - HTTP function for Twilio SMS webhook
- `sendDailyDigests` - Scheduled function (runs daily at 9 AM)

**Firestore Collections:**
- `users` - User profiles and preferences
- `habits` - User habits with frequency settings
- `habitLogs` - Daily habit completion logs
- `userStates` - Conversation state for multi-step flows

## Firestore Data Model

### Users Collection (`users/{userId}`)
- `phoneNumber` (string): Unique phone number
- `timezone` (string): User timezone (default: "America/New_York")
- `digestTime` (string): Daily check-in time (default: "09:00")
- `isPaused` (boolean): Pause status
- `createdAt` (timestamp): Registration timestamp

### Habits Collection (`habits/{habitId}`)
- `userId` (string): Reference to user document ID
- `name` (string): Habit name
- `frequencyType` (string): "daily" | "multiple_per_day" | "x_per_week"
- `targetCount` (number): Number of times (for multiple_per_day and x_per_week)
- `createdAt` (timestamp): Creation timestamp

### Habit Logs Collection (`habitLogs/{habitId}_{date}`)
- `habitId` (string): Reference to habit document ID
- `logDate` (string): Date of log (YYYY-MM-DD format)
- `completedCount` (number): Number of completions
- `loggedAt` (timestamp): Timestamp of logging

### User States Collection (`userStates/{userId}`)
- `state` (string): Current conversation state
- `stateData` (object): JSON data for multi-step flows
- `updatedAt` (timestamp): Last update timestamp

---

## Configuration

### Firebase Configuration

Firebase configuration is managed through:
- **Functions Config**: Use `firebase functions:config:set` for configuration
- **Environment Secrets**: Use `firebase functions:secrets:set` for sensitive data (recommended)
- **firebase.json**: Project-level Firebase settings

**Required Secrets:**
- `TWILIO_ACCOUNT_SID`: Twilio account SID
- `TWILIO_AUTH_TOKEN`: Twilio auth token  
- `TWILIO_PHONE_NUMBER`: Your Twilio phone number

**Set secrets:**
```bash
firebase functions:secrets:set TWILIO_ACCOUNT_SID
firebase functions:secrets:set TWILIO_AUTH_TOKEN
firebase functions:secrets:set TWILIO_PHONE_NUMBER
```

### Scheduling

Daily digests are sent using Firebase Cloud Scheduler. The scheduled function `sendDailyDigests` runs every day at 9 AM Eastern Time by default.

To customize the schedule, edit `functions/index.js`:
```javascript
exports.sendDailyDigests = onSchedule({
  schedule: 'every day 08:00',  // Change time here
  timeZone: 'America/New_York',
  memory: '256MiB',
}, async (event) => {
  // ...
});
```

---

## Twilio A2P Campaign

### A2P Brand

> Outright Mental Inc

### Campaign description

> This campaign sends one-time authentication codes and daily habit tracking check-ins to end users who sign up for Daily Grain, an SMS-based habit building platform. Users receive one daily digest message at their preferred time (default 9 AM) listing their habits and progress, and can reply to log their habit completions.  Users can also text commands at any time to manage habits, view statistics, or adjust settings.

### Sample message #1

> Daily Check-in: 
> 
> Morning run (Daily): 4-day streak
> Read 10 pages (Daily): missed yesterday
> Gym (3x/week): 1 of 3 this week
> 
> Reply: Y N Y
> Text STATUS anytime for details.

### Sample message #2

> Your one-time passcode is 782456.

### Sample message #3

> Added daily habit: "Morning run"
> Reply LIST to see all habits.

### Sample message #4

> STATUS Report: 
> 
> Morning run (Daily)
> - Current streak: 4 days
> - Best streak: 12 days
> - 7-day rate: 85%
> - 30-day rate: 78%
> 
> Read 10 pages (Daily)
> - Current streak: 0 days
> - Best streak: 6 days
> - 7-day rate: 71%
> - 30-day rate: 65%
> 
> Text HELP for commands.

### Sample message #5

> Logged:  Morning run, Gym
> Text STATUS anytime for details.

### How do end-users consent to receive messages? (40-2048 characters)

End users opt-in by visiting dailygrain.example.com and entering their phone number to create an account, or by texting any command to our service number.  Upon first message, users receive an automatic welcome confirming opt-in.  Users can text STOP at any time to unsubscribe.  Additionally, end users create an account after texting their first message, which constitutes explicit opt-in to receive daily habit check-ins and respond to their commands.  Each daily digest includes instructions on how to text STOP to opt-out.

### Opt-in Keywords (max 255 characters)

> START, HELP, ADD, LIST, STATUS

###

Opt-in Message (20-320 characters)

> Welcome to Daily Grain!  You're now opted-in.  You'll receive one daily check-in at 9:00 AM. Reply with your habit progress anytime.  For help, reply HELP. To opt-out, reply STOP.

---

## Design Philosophy

Daily Grain follows these principles:

1. **Minimalist**: No apps, no complex interfaces, just SMS
2. **User-Controlled**: Users decide when to check in (except one daily digest)
3. **No Gamification**: No badges, points, or artificial rewards
4. **Privacy-First**: Minimal data collection, stored locally
5. **Long-Term Focus**: Designed for sustainable habit formation
6. **Quiet**: One message per day unless user initiates
7. **Neutral Tone**: Supportive without being pushy or exuberant

---

## Success Metrics

- Daily reply rate to digests
- Multi-month retention (2–3+ months)
- Improvement in habit adherence over time
- Low opt-out rate
- User-reported habit internalization

---

## Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get up and running in 5 minutes
- **[Usage Examples](USAGE.md)** - See example conversations and commands
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to production platforms
- **[CI/CD Setup Guide](CI-CD-SETUP.md)** - Configure automated deployments

---

## Technical Notes

- **Infrastructure**: Firebase Cloud Functions (serverless, auto-scaling)
- **Database**: Cloud Firestore (NoSQL, real-time, fully managed)
- **SMS Gateway**: Twilio API
- **Hosting**: Firebase Hosting (global CDN)
- **Scheduling**: Cloud Scheduler (managed cron jobs)
- **Authentication**: Phone number-based (no passwords)
- **Security**: Firestore security rules for data protection
- **Monitoring**: Firebase Console and Cloud Logging
- **SMS Compliance**: STOP/START opt-out messaging support
- **Development**: Firebase Local Emulator Suite for testing
- **Deployment**: Single command deployment (`firebase deploy`)
- **Scalability**: Automatic scaling with Firebase infrastructure
- **Cost**: Free tier available, pay-as-you-grow pricing

### Migration from Legacy SQLite Version

This project has been migrated from a Node.js/Express app with SQLite to Firebase. The legacy code is preserved in the `/src` directory for reference. Key changes:

- **Database**: SQLite → Cloud Firestore
- **Server**: Express on VM/container → Cloud Functions (serverless)
- **Scheduler**: node-cron → Cloud Scheduler
- **Hosting**: Self-hosted → Firebase Hosting
- **Deployment**: Manual server setup → `firebase deploy`

All API functionality remains the same. Twilio webhook configuration is the only external change needed.

---

## License

ISC

---

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

---

**Built to be simple, boring, and effective.**
