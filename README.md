# Daily Grain

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
Sent at a user-selected time.

Includes:
- All active habits
- Current status (streaks, weekly progress)
- A single prompt to log updates

Example:

> Daily Check-in:
> Wash face (Daily): 4-day streak
> Read 10 pages (Daily): missed yesterday
> Gym (3x/week): 1 of 3 this week
> Reply: Y N Y
> Text STATUS anytime for details.

No other reminders are sent that day.

---

### 3. Simple Reply Logging
- Users reply once with short answers (e.g. `Y N Y`)
- Parser accepts flexible responses (`yes/y/yep`, `no/n`)
- Weekly habits aggregate daily replies into weekly totals
- Missed replies are logged silently (no nagging)

---

### 4. On-Demand Status Reports
Users can text `STATUS` at any time.

Response includes:
- Completion rates
- Current and best streaks
- Weekly goal progress
- Simple text-based visuals if helpful

Stats are **never pushed automatically**—only returned on request.

---

### 5. Habit Management via SMS
Supported commands:
- `ADD` – create a new habit
- `REMOVE <habit>`
- `TIME <HH:MM>` – change digest time
- `PAUSE` / `RESUME`
- `STOP` – unsubscribe

---

## What This Platform Is Not

- No mobile app
- No AI coaching or therapy language
- No social features
- No points, badges, or leaderboards
- No real-time or multiple daily notifications
- No qualitative scoring (“how well” you did)

---

## Design Rationale

- **Consistency beats intensity**  
  One reliable daily cue is more effective than many interruptions.

- **Autonomy drives habit formation**  
  Users pull insight when they want it; the system never demands attention.

- **Low stimulation supports long-term success**  
  Avoids dopamine fatigue, shame cycles, and notification burnout.

The system should feel like it’s working *for* the user—not managing them.

---

## Success Metrics

- Daily reply rate to digests
- Multi-month retention (2–3+ months)
- Improvement in habit adherence over time
- Low opt-out rate
- User-reported habit internalization

---

## Technical Notes (MVP)

- SMS gateway (e.g. Twilio)
- Lightweight reply parser
- Minimal data storage (phone + habit logs)
- SMS compliance (STOP, opt-out messaging)
- Messages kept concise to avoid segmentation

---

## License / Status

Early-stage MVP concept.  
Built to be simple, boring, and effective.
# Daily Grain 🌾

A minimalist SMS-based habit tracking platform. No apps, no gamification, no extra notifications—just quiet, user-controlled, long-term habit formation.

## Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get up and running in 5 minutes
- **[Usage Examples](USAGE.md)** - See example conversations and commands
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to production platforms

## Features

- **SMS-Based Interface**: Users interact entirely via text messages
- **Multi-Habit Tracking**: Track multiple habits with different frequencies
  - Daily habits
  - Multiple times per day (e.g., 3x/day)
  - X times per week (e.g., 4x/week)
- **Daily Digest**: Automatic morning SMS summarizing all habits and requesting updates
- **Simple Logging**: Reply with numbers to log multiple habits at once
- **On-Demand Stats**: Text "STATUS" anytime to get streaks and completion rates
- **Minimalist Design**: No apps, no accounts, no complexity

## How It Works

### For Users

1. **Sign Up**: Text any message to the Daily Grain phone number
2. **Add Habits**: Text `ADD Morning run` to create a new habit
3. **Daily Check-in**: Receive a morning SMS listing all your habits
4. **Log Progress**: Reply with numbers (e.g., `1 3` to log habits 1 and 3)
5. **Check Status**: Text `STATUS` anytime for detailed stats and streaks

### Commands

- `ADD [habit name]` - Add a new habit (will ask for frequency)
- `LIST` - See all your habits
- `STATUS` - View detailed stats, streaks, and completion rates
- `[numbers]` - Log habits (e.g., `1 2 3`)
- `HELP` - Show help message

## Setup

### Prerequisites

- Node.js 14 or higher
- A Twilio account with SMS capabilities
- A phone number from Twilio

### Installation

1. Clone the repository:
```bash
git clone https://github.com/outrightmental/daily-grain.git
cd daily-grain
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Twilio credentials:
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

4. Start the server:
```bash
npm start
```

### Twilio Configuration

1. Log in to your [Twilio Console](https://console.twilio.com/)
2. Get a phone number with SMS capabilities
3. Configure the webhook URL for incoming messages:
   - Go to Phone Numbers → Active Numbers → Select your number
   - Under "Messaging", set the webhook URL to: `https://your-domain.com/webhook/sms`
   - Method: `POST`

### Deployment

The application can be deployed to any Node.js hosting platform:

- **Heroku**: Add Twilio add-on and set environment variables
- **Railway**: Connect repo and configure environment variables
- **DigitalOcean**: Deploy as a Node.js app
- **AWS/Google Cloud**: Use container or serverless deployment

Make sure to:
1. Set all environment variables
2. Expose the webhook endpoint publicly
3. Configure Twilio webhook to point to your deployment

## Architecture

```
daily-grain/
├── src/
│   ├── models/          # Database models and schema
│   │   ├── database.js  # SQLite database initialization
│   │   ├── User.js      # User model
│   │   ├── Habit.js     # Habit model
│   │   ├── HabitLog.js  # Habit logging and stats
│   │   └── UserState.js # Conversation state management
│   ├── services/        # Business logic
│   │   ├── HabitService.js      # Habit management
│   │   ├── DigestService.js     # Daily digest generation
│   │   ├── MessageService.js    # SMS message handling
│   │   ├── TwilioService.js     # Twilio API wrapper
│   │   └── SchedulerService.js  # Cron jobs for digests
│   ├── routes/          # API routes
│   │   └── webhook.js   # Twilio webhook endpoint
│   └── index.js         # Main application entry point
├── data/                # SQLite database storage
└── package.json
```

## Database Schema

### Users
- `id`: Primary key
- `phone_number`: Unique phone number
- `timezone`: User timezone (default: America/New_York)
- `created_at`: Registration timestamp

### Habits
- `id`: Primary key
- `user_id`: Foreign key to users
- `name`: Habit name
- `frequency_type`: daily | multiple_per_day | x_per_week
- `target_count`: Number of times (for multiple_per_day and x_per_week)
- `created_at`: Creation timestamp

### Habit Logs
- `id`: Primary key
- `habit_id`: Foreign key to habits
- `completed_count`: Number of completions
- `log_date`: Date of log (unique per habit per day)
- `logged_at`: Timestamp of logging

### User State
- `user_id`: Foreign key to users (primary key)
- `state`: Current conversation state
- `state_data`: JSON data for multi-step flows
- `updated_at`: Last update timestamp

## Configuration

### Environment Variables

- `TWILIO_ACCOUNT_SID`: Twilio account SID
- `TWILIO_AUTH_TOKEN`: Twilio auth token
- `TWILIO_PHONE_NUMBER`: Your Twilio phone number
- `PORT`: Server port (default: 3000)
- `DB_PATH`: Database file path (default: ./data/habits.db)
- `ENABLE_SCHEDULER`: Enable daily digest scheduler (default: true)
- `DIGEST_CRON`: Cron expression for daily digest (default: 0 9 * * *)

### Scheduling

Daily digests are sent using cron. The default is 9 AM daily (`0 9 * * *`).

To customize:
```env
DIGEST_CRON=0 8 * * *  # 8 AM daily
DIGEST_CRON=0 9 * * 1-5  # 9 AM weekdays only
```

## Design Philosophy

Daily Grain follows these principles:

1. **Minimalist**: No apps, no complex interfaces, just SMS
2. **User-Controlled**: Users decide when to check in (except one daily digest)
3. **No Gamification**: No badges, points, or artificial rewards
4. **Privacy-First**: Minimal data collection, stored locally
5. **Long-Term Focus**: Designed for sustainable habit formation
6. **Quiet**: One message per day unless user initiates

## License

ISC

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.
