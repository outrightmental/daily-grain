# Usage Examples

This document provides example conversations showing how to use Daily Grain.

## First-Time User

**Day 1: Sign Up & Add First Habit**

```
User: Hi
Bot: Daily Grain

Commands:
• ADD [name] - Add a habit
• REMOVE [name] - Remove a habit
• LIST - See your habits
• STATUS - View stats
• TIME HH:MM - Set check-in time
• PAUSE / RESUME - Pause/resume
• STOP - Unsubscribe

---

User: ADD Morning run
Bot: Adding habit: "Morning run"

What's the frequency?
1. Daily
2. Multiple times per day
3. X times per week

Reply with a number (1-3)

---

User: 1
Bot: Added daily habit: "Morning run"
Reply LIST to see all habits.
```

## Adding Multiple Habits

**Adding a habit that needs to be done multiple times per day:**

```
User: ADD Drink water
Bot: Adding habit: "Drink water"

What's the frequency?
1. Daily
2. Multiple times per day
3. X times per week

Reply with a number (1-3)

---

User: 2
Bot: How many times per day? (Reply with a number)

---

User: 8
Bot: Added habit: "Drink water" (8x per day)
Reply LIST to see all habits.
```

**Adding a habit for specific times per week:**

```
User: ADD Gym workout
Bot: Adding habit: "Gym workout"

What's the frequency?
1. Daily
2. Multiple times per day
3. X times per week

Reply with a number (1-3)

---

User: 3
Bot: How many times per week? (Reply with a number)

---

User: 3
Bot: Added habit: "Gym workout" (3x per week)
Reply LIST to see all habits.
```

## Daily Check-In

**Morning digest (sent automatically at your chosen time):**

```
Bot: Daily Check-in:

Morning run (Daily): 4-day streak
Read 10 pages (Daily): missed yesterday
Gym (3x/week): 1 of 3 this week

Reply: Y N Y
Text STATUS anytime for details.
```

**User logs completed habits with Y/N:**

```
User: Y N Y
Bot: Logged: Morning run, Gym
Text STATUS anytime for details.
```

**Flexible reply formats:**

```
User: yes no yes
Bot: Logged: Morning run, Gym
Text STATUS anytime for details.

User: yep nope y
Bot: Logged: Morning run, Gym
Text STATUS anytime for details.
```

## Checking Status

**Any time during the day:**

```
User: STATUS
Bot: Status Report:

Morning run
Current streak: 7 days
Last 7 days: 100.0% (7/7)
Last 30 days: 90.0% (27/30)

Read 10 pages
Current streak: 5 days
Last 7 days: 85.7% (6/7)
Last 30 days: 83.3% (25/30)

Gym
Current streak: 2 days
Last 7 days: 42.9% (3/7)
Last 30 days: 40.0% (12/30)
```

## Listing Habits

**Check your habits any time:**

```
User: LIST
Bot: Daily Check-in:

Morning run (Daily): 7-day streak
Read 10 pages (Daily): 6-day streak
Gym (3x/week): 2 of 3 this week

Reply: Y N Y
Text STATUS anytime for details.
```

## Managing Your Account

**Change your check-in time:**

```
User: TIME 08:30
Bot: Daily check-in time set to 08:30.

User: TIME 20:00
Bot: Daily check-in time set to 20:00.
```

**Remove a habit:**

```
User: REMOVE Gym
Bot: Removed: Gym

User: LIST
Bot: Daily Check-in:

Morning run (Daily): 7-day streak
Read 10 pages (Daily): 6-day streak

Reply: Y N
Text STATUS anytime for details.
```

**Pause and resume:**

```
User: PAUSE
Bot: Daily check-ins paused. Text RESUME to continue.

[Time passes...]

User: RESUME
Bot: Daily check-ins resumed. You'll receive your next check-in at 09:00.
```

**Unsubscribe:**

```
User: STOP
Bot: You've been unsubscribed. Text START to resume.
```

## Complete Workflow Example

**Week 1: Building the Habit**

Day 1:
```
User: ADD Morning meditation
Bot: [setup flow]
User: 1
Bot: Added daily habit: "Morning meditation"
Reply LIST to see all habits.
```

Day 2-7: Daily check-ins
```
Bot (9 AM): Daily Check-in:

Morning meditation (Daily): starting fresh

Reply: Y N Y
Text STATUS anytime for details.

User (various times): Y
Bot: Logged: Morning meditation
Text STATUS anytime for details.
```

Day 7:
```
User: STATUS
Bot: Status Report:

Morning meditation
Current streak: 6 days
Last 7 days: 85.7% (6/7)
Last 30 days: 85.7% (6/7)
```

## Backward Compatibility

**Number-based logging still works:**

```
User: LIST
Bot: Daily Check-in:

Morning run (Daily): 4-day streak
Read 10 pages (Daily): missed yesterday
Gym (3x/week): 1 of 3 this week

Reply: Y N Y
Text STATUS anytime for details.

User: 1 3
Bot: Logged: Morning run, Gym
Text STATUS anytime for details.
```

## Tips

1. **Reply to the daily check-in** - It's designed to be quick and easy
2. **Use Y/N format** - Faster than typing habit numbers
3. **Check STATUS regularly** - See your progress when you want it
4. **Set your preferred time** - Use TIME command to change when you get the digest
5. **Start small** - Add one or two habits first before adding more
6. **Be honest** - Log what you actually did, not what you wish you had done

## Command Reference

| Command | Description | Example |
|---------|-------------|---------|
| `ADD [name]` | Add a new habit | `ADD Reading` |
| `REMOVE [name]` | Remove a habit | `REMOVE Reading` |
| `LIST` | See all your habits | `LIST` |
| `STATUS` | View detailed stats | `STATUS` |
| `TIME HH:MM` | Set check-in time | `TIME 08:30` |
| `PAUSE` | Pause check-ins | `PAUSE` |
| `RESUME` | Resume check-ins | `RESUME` |
| `STOP` | Unsubscribe | `STOP` |
| `Y N Y` | Log habits (Yes/No) | `Y N Y` |
| `[numbers]` | Log habits by number | `1 3 5` |

## Frequency Types

1. **Daily**: Habit should be done once per day
2. **Multiple per day**: Habit should be done X times per day (e.g., drink water 8x/day)
3. **X per week**: Habit should be done X times per week (e.g., gym 3x/week)

## Design Philosophy

Daily Grain is designed to be:
- **Calm**: One message per day, no pressure
- **Flexible**: Reply when you want, how you want
- **Supportive**: Neutral tone, no judgment
- **Long-term**: Built for months of use, not quick wins
