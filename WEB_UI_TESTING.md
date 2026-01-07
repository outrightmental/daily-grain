# Web UI Testing Guide

This document outlines how to test the web UI functionality once deployed to Firebase.

## Prerequisites

- Deployed Firebase project with all components
- Firebase Authentication enabled (Phone provider)
- At least one test user with habits created via SMS
- Access to a phone that can receive SMS

## Testing Checklist

### 1. Landing Page Test

**URL:** `https://YOUR-PROJECT.web.app/`

**Expected Results:**
- [ ] Page loads without errors
- [ ] "Login to Dashboard" button is visible
- [ ] All content displays correctly
- [ ] Links to GitHub work
- [ ] Mobile responsive design works

### 2. Login Page Test

**URL:** `https://YOUR-PROJECT.web.app/login.html`

**Steps:**
1. Navigate to login page
2. Enter phone number with country code (e.g., +1234567890)
3. Complete reCAPTCHA
4. Click "Send Verification Code"
5. Check phone for SMS
6. Enter 6-digit verification code
7. Click "Verify & Sign In"

**Expected Results:**
- [ ] Phone number input validates format
- [ ] reCAPTCHA displays and works
- [ ] SMS verification code is received within 30 seconds
- [ ] Success message shows after verification
- [ ] Redirects to dashboard after successful login
- [ ] Error messages display for invalid codes
- [ ] Can retry with different phone number

**Common Issues:**
- reCAPTCHA not loading → Check Firebase Auth configuration
- SMS not received → Verify Twilio is configured, check phone number format
- Invalid code error → Ensure code is entered within time limit

### 3. Dashboard Page Test

**URL:** `https://YOUR-PROJECT.web.app/dashboard.html`

**Pre-requisites:**
- User must be logged in
- User should have created habits via SMS

**Steps:**
1. Login successfully
2. Wait for dashboard to load
3. Review all sections

**Expected Results:**
- [ ] Dashboard loads without errors
- [ ] User's phone number displays in header
- [ ] Overview statistics show correct counts
  - [ ] Total Habits count matches actual habits
  - [ ] Active Streaks count is accurate
  - [ ] Average Completion percentage is calculated
  - [ ] Longest Streak shows maximum value
- [ ] All habits are listed
- [ ] Each habit shows:
  - [ ] Habit name
  - [ ] Frequency (Daily, Xx/day, Xx/week)
  - [ ] Current streak with flame icon
  - [ ] 7-day completion rate with progress bar
  - [ ] 30-day completion rate with progress bar
- [ ] Logout button works
- [ ] Mobile responsive design works

**Edge Cases:**
- [ ] User with no habits sees empty state message
- [ ] User with 0 streaks shows "0 days" badge (gray)
- [ ] User with habits but no logs shows 0% completion

### 4. Authentication Flow Test

**Test Session Persistence:**
1. Login to dashboard
2. Close browser tab
3. Open new tab and navigate to dashboard URL
4. Should remain logged in (session persists)

**Test Logout:**
1. Login to dashboard
2. Click "Logout" button
3. Should redirect to login page
4. Try accessing dashboard URL directly
5. Should redirect to login page (not authenticated)

**Test Multiple Devices:**
1. Login on Device A
2. Login on Device B with same phone number
3. Both should work independently
4. Logout on Device A
5. Device B should still be logged in

**Expected Results:**
- [ ] Session persists across page refreshes
- [ ] Logout clears session properly
- [ ] Cannot access dashboard without authentication
- [ ] Multiple simultaneous sessions work

### 5. API Endpoint Test

**Test Dashboard API:**

```bash
# Get a valid Firebase ID token first (from browser console after login)
# In browser console: firebase.auth().currentUser.getIdToken().then(console.log)

curl -X GET https://YOUR-PROJECT.web.app/api/dashboard \
  -H "Authorization: Bearer YOUR_ID_TOKEN"
```

**Expected Response:**
```json
{
  "habits": [
    {
      "id": "habit_id",
      "name": "Morning run",
      "frequencyType": "daily",
      "targetCount": 1,
      "streak": 4,
      "last7Days": {
        "completionRate": 85,
        "completedDays": 6,
        "totalDays": 7
      },
      "last30Days": {
        "completionRate": 80,
        "completedDays": 24,
        "totalDays": 30
      }
    }
  ],
  "stats": {
    "totalHabits": 1,
    "activeStreaks": 1,
    "longestStreak": 4,
    "avgCompletion": 85
  }
}
```

**Expected Results:**
- [ ] API returns 401 without auth token
- [ ] API returns 401 with invalid token
- [ ] API returns 200 with valid token
- [ ] Response includes all habits
- [ ] Stats are calculated correctly

### 6. Security Test

**Test Unauthorized Access:**
1. Access dashboard URL without logging in
2. Should redirect to login page

**Test Data Isolation:**
1. Create two test accounts with different phone numbers
2. Login as User A, note habits
3. Logout and login as User B
4. User B should only see their own habits

**Test Token Expiration:**
1. Login to dashboard
2. Wait for token to expire (default: 1 hour)
3. Refresh page or try to fetch data
4. Should redirect to login page

**Expected Results:**
- [ ] Unauthenticated users cannot access dashboard
- [ ] Users can only view their own data
- [ ] Expired sessions require re-login
- [ ] No XSS vulnerabilities in habit names
- [ ] No CSRF vulnerabilities

### 7. Performance Test

**Load Time Test:**
1. Login to dashboard
2. Measure page load time
3. Check browser DevTools Network tab

**Expected Results:**
- [ ] Login page loads in < 2 seconds
- [ ] Dashboard loads in < 3 seconds
- [ ] API response time < 1 second
- [ ] Images/assets load from CDN
- [ ] No console errors

### 8. Browser Compatibility Test

Test on multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

**Expected Results:**
- [ ] All features work on all browsers
- [ ] Layout is consistent
- [ ] SMS login works on mobile browsers
- [ ] Touch interactions work on mobile

## Reporting Issues

When reporting issues, include:
- Browser and version
- Phone number format used (anonymized)
- Error messages from browser console
- Screenshots of the issue
- Steps to reproduce

## Post-Test Verification

After completing all tests:
- [ ] All critical functionality works
- [ ] No security vulnerabilities found
- [ ] Performance is acceptable
- [ ] Documentation is accurate
- [ ] User experience is smooth

## Known Limitations

Current version limitations (not bugs):
- Read-only dashboard (cannot edit habits via web)
- No calendar view (coming in future release)
- No data export (coming in future release)
- No trend charts (coming in future release)
- Phone authentication only (no email/password)

## Next Steps

If all tests pass:
1. Mark PR as ready for review
2. Update issue with test results
3. Plan future enhancements
4. Monitor production logs for errors
