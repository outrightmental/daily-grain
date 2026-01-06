# Deployment Guide

This guide covers deploying Daily Grain to various platforms.

## Prerequisites

Before deploying, you need:
- A Twilio account with an active phone number
- Your Twilio Account SID and Auth Token
- A hosting platform account (Heroku, Railway, DigitalOcean, etc.)

## Platform-Specific Instructions

### Heroku

1. **Create a new Heroku app:**
```bash
heroku create your-app-name
```

2. **Set environment variables:**
```bash
heroku config:set TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
heroku config:set TWILIO_AUTH_TOKEN=your_auth_token
heroku config:set TWILIO_PHONE_NUMBER=+15551234567
heroku config:set ENABLE_SCHEDULER=true
heroku config:set DIGEST_CRON="0 9 * * *"
```

3. **Deploy:**
```bash
git push heroku main
```

4. **Configure Twilio webhook:**
- Go to your Twilio Console
- Navigate to Phone Numbers → Active Numbers → Select your number
- Under "Messaging", set webhook URL to: `https://your-app-name.herokuapp.com/webhook/sms`
- Set HTTP method to `POST`

### Railway

1. **Create a new Railway project** from your GitHub repo

2. **Set environment variables** in Railway dashboard:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+15551234567
ENABLE_SCHEDULER=true
DIGEST_CRON=0 9 * * *
```

3. **Deploy** automatically happens when you push to your repo

4. **Configure Twilio webhook:**
- Use your Railway URL: `https://your-project.railway.app/webhook/sms`

### DigitalOcean App Platform

1. **Create a new app** from your GitHub repo

2. **Configure environment variables:**
- Go to Settings → Environment Variables
- Add all required variables

3. **Configure build settings:**
- Build Command: `npm install`
- Run Command: `npm start`

4. **Deploy** and get your app URL

5. **Configure Twilio webhook** with your app URL

### Docker

1. **Build the Docker image:**
```bash
docker build -t daily-grain .
```

2. **Run the container:**
```bash
docker run -d \
  -p 3000:3000 \
  -e TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
  -e TWILIO_AUTH_TOKEN=your_auth_token \
  -e TWILIO_PHONE_NUMBER=+15551234567 \
  -e ENABLE_SCHEDULER=true \
  -v $(pwd)/data:/app/data \
  daily-grain
```

**Dockerfile:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### AWS EC2

1. **Launch an EC2 instance** (Amazon Linux 2 or Ubuntu)

2. **Install Node.js:**
```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

3. **Clone and setup:**
```bash
git clone https://github.com/yourusername/daily-grain.git
cd daily-grain
npm install
```

4. **Create .env file:**
```bash
nano .env
# Add your environment variables
```

5. **Run with PM2:**
```bash
npm install -g pm2
pm2 start src/index.js --name daily-grain
pm2 startup
pm2 save
```

6. **Configure security group** to allow HTTP traffic on port 3000

7. **Configure Twilio webhook** with your EC2 public IP

### Google Cloud Run

1. **Create a Dockerfile** (see Docker section above)

2. **Build and push to Google Container Registry:**
```bash
gcloud builds submit --tag gcr.io/PROJECT-ID/daily-grain
```

3. **Deploy to Cloud Run:**
```bash
gcloud run deploy daily-grain \
  --image gcr.io/PROJECT-ID/daily-grain \
  --platform managed \
  --region us-central1 \
  --set-env-vars TWILIO_ACCOUNT_SID=ACxxx,TWILIO_AUTH_TOKEN=xxx,TWILIO_PHONE_NUMBER=+1xxx
```

4. **Configure Twilio webhook** with your Cloud Run URL

## Twilio Setup

### Getting Your Credentials

1. Go to [Twilio Console](https://console.twilio.com/)
2. Find your Account SID and Auth Token on the dashboard
3. Buy a phone number with SMS capabilities (Phone Numbers → Buy a number)

### Configuring the Webhook

1. Go to Phone Numbers → Active Numbers
2. Click on your Daily Grain phone number
3. Scroll to "Messaging"
4. Set "A MESSAGE COMES IN" to:
   - URL: `https://your-deployment-url/webhook/sms`
   - HTTP Method: `POST`
5. Click "Save"

### Testing the Setup

Send a text to your Twilio number with "HELP" and you should receive a response.

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TWILIO_ACCOUNT_SID` | Yes | - | Your Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Yes | - | Your Twilio Auth Token |
| `TWILIO_PHONE_NUMBER` | Yes | - | Your Twilio phone number (+1XXXXXXXXXX) |
| `PORT` | No | 3000 | Server port |
| `DB_PATH` | No | ./data/habits.db | Database file path |
| `ENABLE_SCHEDULER` | No | true | Enable daily digest scheduler |
| `DIGEST_CRON` | No | 0 9 * * * | Cron expression for digest time |

## Scheduling Daily Digests

The app uses node-cron to send daily digests. The default is 9 AM every day.

### Cron Expression Examples

- `0 9 * * *` - 9 AM every day (default)
- `0 8 * * *` - 8 AM every day
- `0 9 * * 1-5` - 9 AM on weekdays only
- `0 20 * * *` - 8 PM every day

### Timezone Considerations

The cron job runs in the server's timezone. If you need different timezones per user, you'll need to modify the scheduler to account for user timezones stored in the database.

## Database Backup

The SQLite database is stored at `./data/habits.db`. Make sure to:

1. **Regular backups:**
```bash
# Create a backup
cp data/habits.db data/habits.db.backup.$(date +%Y%m%d)

# Or use sqlite3
sqlite3 data/habits.db ".backup data/habits.db.backup"
```

2. **Persistent storage:**
- Make sure your deployment platform uses persistent storage
- Use a volume mount for Docker deployments
- Consider using PostgreSQL for production if scaling

## Monitoring

### Health Check

The app provides a health check endpoint:
```
GET /webhook/health
```

Returns:
```json
{
  "status": "ok",
  "timestamp": "2026-01-06T00:00:00.000Z"
}
```

### Logs

Check logs for errors and activity:
```bash
# Heroku
heroku logs --tail

# Railway
railway logs

# PM2
pm2 logs daily-grain

# Docker
docker logs container-id
```

## Troubleshooting

### SMS not being received

1. Check Twilio webhook URL is correct
2. Verify endpoint is publicly accessible
3. Check Twilio logs in the console
4. Verify phone number format includes country code

### Daily digests not sending

1. Check `ENABLE_SCHEDULER` is set to `true`
2. Verify Twilio credentials are correct
3. Check server logs for cron job execution
4. Verify users exist in the database

### Database errors

1. Ensure `data` directory exists and is writable
2. Check `DB_PATH` environment variable
3. Verify SQLite is properly installed

## Security Best Practices

1. **Never commit .env files** - use .gitignore
2. **Use environment variables** for all secrets
3. **Enable HTTPS** on your deployment
4. **Validate Twilio requests** (optional enhancement)
5. **Regular backups** of the database
6. **Monitor logs** for suspicious activity

## Scaling Considerations

For larger deployments:

1. **Switch to PostgreSQL** instead of SQLite
2. **Add rate limiting** to prevent abuse
3. **Implement request validation** from Twilio
4. **Use a message queue** for SMS sending
5. **Add horizontal scaling** with multiple instances
6. **Implement proper logging** and monitoring
