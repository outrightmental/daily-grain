# CI/CD Setup Guide

This guide explains how to set up the automated CI/CD workflows for Firebase deployment.

## Overview

The project includes three GitHub Actions workflows:

1. **firebase-deploy.yml** - Deploys to production on push to `main`
2. **firebase-preview.yml** - Creates preview environments for pull requests
3. **firebase-cleanup.yml** - Cleans up preview environments when PRs close

## Prerequisites

- A Firebase project configured (see [DEPLOYMENT.md](DEPLOYMENT.md))
- Admin access to the GitHub repository
- Firebase CLI installed locally: `npm install -g firebase-tools`

## Setup Steps

### 1. Generate Firebase CI Token

Run the following command locally:

```bash
firebase login:ci
```

This will:
1. Open your browser for authentication
2. Ask you to authorize the Firebase CLI
3. Output a CI token (starts with "1//...")

**Important:** Keep this token secure. It provides full access to your Firebase project.

### 2. Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Click on **Settings**
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Enter:
   - **Name:** `FIREBASE_TOKEN`
   - **Secret:** Paste the token from step 1
6. Click **Add secret**

### 3. Verify Setup

To test the workflows:

1. **Production Deployment:**
   - Push a commit to the `main` branch
   - Go to the **Actions** tab
   - Watch the "Deploy to Firebase" workflow run

2. **Preview Deployment:**
   - Create a pull request
   - The "Deploy Preview" workflow will run automatically
   - A comment will be posted with the preview URL
   - Each new commit updates the preview

3. **Preview Cleanup:**
   - Close or merge the PR
   - The "Cleanup Preview" workflow will delete the preview channel
   - A confirmation comment will be posted

## Workflow Details

### Production Deployment

**Trigger:** Push to `main` branch

**Actions:**
- Checks out code
- Sets up Node.js 20
- Installs Firebase CLI
- Installs function dependencies
- Deploys all Firebase services (Functions, Hosting, Firestore)

**Duration:** ~2-5 minutes

### Preview Deployment

**Trigger:** PR opened, synchronized, or reopened

**Actions:**
- Checks out code
- Sets up Node.js 20
- Installs Firebase CLI
- Installs function dependencies
- Deploys to preview channel `pr-{number}`
- Posts/updates PR comment with preview URL

**Preview Features:**
- Unique URL per PR (e.g., `https://daily-grain--pr-5-xyz.web.app`)
- Expires after 7 days
- Updated on each new commit
- Isolated from production

**Duration:** ~2-5 minutes

### Preview Cleanup

**Trigger:** PR closed or merged

**Actions:**
- Deletes the preview channel
- Posts confirmation comment

**Duration:** ~30 seconds

## Customization

### Change Preview Expiration

Edit `.github/workflows/firebase-preview.yml`:

```yaml
firebase hosting:channel:deploy $CHANNEL_ID \
  --expires 14d \  # Change from 7d to 14d
```

### Deploy Only Specific Services

Edit `.github/workflows/firebase-deploy.yml`:

```yaml
run: firebase deploy --only functions,hosting --token "$FIREBASE_TOKEN"
```

### Add Deployment Notifications

Add a step to send Slack/Discord notifications:

```yaml
- name: Notify Slack
  if: success()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Deployed to production! 🚀"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Troubleshooting

### "Permission denied" or "Unauthorized"

**Problem:** Firebase token is invalid or expired

**Solution:**
1. Generate a new token: `firebase login:ci`
2. Update the `FIREBASE_TOKEN` secret in GitHub
3. Re-run the workflow

### Preview URL not appearing in comments

**Problem:** Workflow doesn't have permission to comment

**Solution:**
1. Go to repository Settings → Actions → General
2. Under "Workflow permissions", select:
   - **Read and write permissions**
3. Save changes
4. Re-run the workflow

### Deploy fails: "Project not found"

**Problem:** Firebase project ID mismatch

**Solution:**
1. Check `.firebaserc` for correct project ID
2. Verify the project exists: `firebase projects:list`
3. Update if needed: `firebase use your-project-id`

### "Functions dependencies failed to install"

**Problem:** `package-lock.json` is out of sync

**Solution:**
1. Delete `functions/node_modules` and `functions/package-lock.json`
2. Run `cd functions && npm install`
3. Commit the updated `package-lock.json`

## Security Best Practices

1. **Never commit the Firebase token** to the repository
2. **Rotate tokens periodically** (every 3-6 months)
3. **Use service accounts** for production (more advanced)
4. **Review workflow runs** regularly for suspicious activity
5. **Limit preview expiration** to minimum needed (7-14 days)

## Monitoring

### View Deployment Logs

**GitHub Actions:**
- Go to **Actions** tab
- Click on a workflow run
- Expand steps to see detailed logs

**Firebase Console:**
- [Firebase Console](https://console.firebase.google.com/)
- Select your project
- Functions → Logs
- Hosting → Release History

### Check Preview Channels

**Firebase Console:**
- Go to Hosting → Channels
- View all active preview channels
- Manually delete if needed

**Firebase CLI:**
```bash
firebase hosting:channel:list
firebase hosting:channel:delete pr-123
```

## Additional Resources

- [Firebase CI/CD Documentation](https://firebase.google.com/docs/hosting/github-integration)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Firebase Preview Channels](https://firebase.google.com/docs/hosting/test-preview-deploy)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

## Support

If you encounter issues:

1. Check the workflow logs in the Actions tab
2. Review Firebase Console for deployment status
3. Consult the troubleshooting section above
4. Open an issue in the repository

---

**Last Updated:** January 2026
