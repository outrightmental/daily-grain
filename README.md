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
