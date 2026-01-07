# Web UI Usage Guide

## Overview

Daily Grain now includes a web dashboard that allows you to view detailed analytics and reports for your habits. Authentication is done exclusively through SMS verification - no passwords or web-based signups required.

## Features

### 📊 Dashboard Overview
- **Total Habits**: View the count of all your tracked habits
- **Active Streaks**: See how many habits you're currently maintaining streaks on
- **Average Completion**: 7-day average completion rate across all habits
- **Longest Streak**: Your best streak across all habits

### 📈 Habit Analytics
For each habit, you can view:
- Current streak (consecutive days completed)
- 7-day completion rate with visual progress bar
- 30-day completion rate with visual progress bar
- Habit frequency (Daily, Xx/day, Xx/week)

## How to Access the Dashboard

### 1. Navigate to the Login Page
Visit your Daily Grain web dashboard URL and click "Login to Dashboard" or go directly to `/login.html`

### 2. Enter Your Phone Number
- Enter your phone number with country code (e.g., +1234567890)
- Complete the reCAPTCHA verification
- Click "Send Verification Code"

### 3. Verify Your Phone
- You'll receive an SMS with a 6-digit verification code
- Enter the code in the verification form
- Click "Verify & Sign In"

### 4. View Your Dashboard
Once authenticated, you'll be redirected to your personal dashboard showing:
- Overview statistics
- Complete list of all your habits
- Detailed metrics for each habit

## Security

- **Phone-Based Authentication**: Login requires SMS verification to your registered phone number
- **Session Management**: Your session is maintained securely through Firebase Authentication
- **Data Privacy**: You can only view your own data; each user's information is isolated

## Logout

Click the "Logout" button in the top-right corner to sign out of your session.

## Limitations

- **Read-Only**: The web dashboard is currently for viewing analytics only
- **No Habit Editing**: To add, remove, or modify habits, continue to use SMS commands
- **No Data Export**: Export features may be added in future updates

## SMS Commands (Still Available)

All SMS commands continue to work as before:
- `ADD [name]` - Create a new habit
- `REMOVE [name]` - Remove a habit
- `LIST` - See all your habits
- `STATUS` - View detailed stats
- `TIME HH:MM` - Set check-in time
- `PAUSE / RESUME` - Pause/resume check-ins
- `Y N Y` - Log daily habits

## Troubleshooting

### Can't receive verification code?
- Ensure your phone number is correct and includes country code
- Check that you have SMS service available
- Wait a few minutes and try again

### Not seeing your habits?
- Make sure you're using the same phone number you use for SMS
- Ensure you've created habits via SMS first
- Try logging out and back in

### Dashboard not loading?
- Check your internet connection
- Try refreshing the page
- Clear your browser cache and cookies

## Future Enhancements

Potential features for future releases:
- Calendar view of habit completion
- Trend graphs and charts
- Data export functionality
- Custom date range filters
- Weekly/monthly summary reports

## Support

For issues or questions:
- Check the main [README.md](README.md) for general information
- Report bugs via GitHub Issues
- Contact support through your configured support channels
