# Usage Examples

This document provides example conversations showing how to use Daily Grain.

## First-Time User

**Day 1: Sign Up & Add First Habit**

```
User: Hi
Bot: Welcome to Daily Grain! 🌾

Commands:
• ADD [name] - Add a new habit
• LIST - See all your habits
• STATUS - View streaks and stats
• [numbers] - Log habits (e.g., '1 3')
• HELP - Show this message

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
Bot: ✓ Added daily habit: "Morning run"

Reply 'LIST' to see all habits.
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
Bot: ✓ Added habit: "Drink water" (8x per day)

Reply 'LIST' to see all habits.
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
Bot: ✓ Added habit: "Gym workout" (3x per week)

Reply 'LIST' to see all habits.
```

## Daily Check-In

**Morning digest (sent automatically at 9 AM):**

```
Bot: Daily Habits Check-in:

1. ○ Morning run (daily)
2. ○ Drink water (8x/day)
3. ○ Gym workout (3x/week)

Reply with numbers to log (e.g., '1 3' for habits 1 and 3)
Reply 'STATUS' for detailed stats
Reply 'ADD [name]' to add a habit
```

**User logs completed habits:**

```
User: 1 2
Bot: ✓ Logged: Morning run, Drink water

Great work! Reply 'STATUS' to see your progress.
```

## Checking Status

**Any time during the day:**

```
User: STATUS
Bot: Habit Status Report:

1. Morning run
   🔥 7 day streak
   📊 7d: 100.0% (7/7)
   📊 30d: 90.0% (27/30)

2. Drink water
   🔥 5 day streak
   📊 7d: 85.7% (6/7)
   📊 30d: 83.3% (25/30)

3. Gym workout
   🔥 2 day streak
   📊 7d: 42.9% (3/7)
   📊 30d: 40.0% (12/30)
```

## Listing Habits

**Check your habits any time:**

```
User: LIST
Bot: Daily Habits Check-in:

1. ✓ Morning run (daily)
2. ✓ Drink water (8x/day)
3. ○ Gym workout (3x/week)

Reply with numbers to log (e.g., '1 3' for habits 1 and 3)
Reply 'STATUS' for detailed stats
Reply 'ADD [name]' to add a habit
```

## Complete Workflow Example

**Week 1: Building the Habit**

Day 1:
```
User: ADD Morning meditation
Bot: [setup flow]
User: 1
Bot: ✓ Added daily habit: "Morning meditation"
```

Day 2-7: Daily check-ins
```
Bot (9 AM): Daily Habits Check-in:
1. ○ Morning meditation (daily)
[...]

User (various times): 1
Bot: ✓ Logged: Morning meditation
Great work! Reply 'STATUS' to see your progress.
```

Day 7:
```
User: STATUS
Bot: Habit Status Report:

1. Morning meditation
   🔥 6 day streak
   📊 7d: 85.7% (6/7)
   📊 30d: 85.7% (6/7)
```

## Tips

1. **Reply quickly** to the morning digest to build consistency
2. **Use STATUS** regularly to see your progress
3. **Be honest** with your logging - it's for you, not for anyone else
4. **Start small** - add one or two habits first before adding more
5. **Log as you go** - you can text numbers any time, not just in response to the digest

## Command Reference

| Command | Description | Example |
|---------|-------------|---------|
| `ADD [name]` | Add a new habit | `ADD Reading` |
| `LIST` | See all your habits | `LIST` |
| `STATUS` | View detailed stats | `STATUS` |
| `[numbers]` | Log completed habits | `1 3 5` |
| `HELP` | Show help message | `HELP` |

## Frequency Types

1. **Daily**: Habit should be done once per day
2. **Multiple per day**: Habit should be done X times per day (e.g., drink water 8x/day)
3. **X per week**: Habit should be done X times per week (e.g., gym 3x/week)
