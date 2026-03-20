# Railway n8n Deployment Guide

Deploy n8n to Railway in 5 minutes with automatic SSL and public URL.

## Prerequisites
- GitHub account
- Railway account (sign up at https://railway.app)

---

## Step 1: Prepare Your Project

Create a `railway.json` file in your project root:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Create a `Dockerfile` in project root:

```dockerfile
FROM n8nio/n8n:latest

# Railway provides PORT environment variable
ENV N8N_PORT=5678
ENV N8N_PROTOCOL=https
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5678/healthz || exit 1

EXPOSE 5678

CMD ["n8n"]
```

---

## Step 2: Deploy to Railway

### Option A: Via Railway Dashboard

1. Go to https://railway.app/new
2. Click **Deploy from GitHub repo**
3. Select `youtube-automation-app` repository
4. Railway will auto-detect and deploy
5. Wait 2-3 minutes

### Option B: Via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

---

## Step 3: Configure Environment Variables

In Railway dashboard:

1. Click your service → **Variables**
2. Add these variables:

```bash
# Core n8n settings
N8N_HOST=0.0.0.0
WEBHOOK_URL=https://your-app.railway.app
GENERIC_TIMEZONE=Asia/Kolkata

# Your Next.js app URL (update after Vercel deployment)
APP_URL=https://your-nextjs-app.vercel.app
N8N_CALLBACK_SECRET=darkfiles-secret-2024

# AI Provider API Keys
ANTHROPIC_API_KEY=your_key_here
ELEVENLABS_API_KEY=sk_0a9c1ba3ee1eb8aed61e6f801e5ca14941706014afad86b5
LEONARDO_API_KEY=your_key_here
SHOTSTACK_API_KEY=your_key_here
PERPLEXITY_API_KEY=your_key_here

# ElevenLabs Voice IDs
ELEVENLABS_VOICE_EN=pNInz6obpgDQGcFmaJgB
ELEVENLABS_VOICE_TA=your_tamil_voice_id
```

3. Click **Deploy** to restart with new variables

---

## Step 4: Get Your Public URL

1. In Railway dashboard, click **Settings**
2. Under **Networking** → Click **Generate Domain**
3. You'll get: `https://your-app.up.railway.app`
4. Copy this URL

---

## Step 5: Enable Persistent Storage (Optional)

To keep n8n data between deployments:

1. Click **+ New** → **Volume**
2. Mount path: `/home/node/.n8n`
3. Click **Add**

---

## Step 6: Update Your .env.local

Update your Next.js app:

```bash
N8N_WEBHOOK_URL=https://your-app.up.railway.app
N8N_CALLBACK_SECRET=darkfiles-secret-2024
```

---

## Step 7: Access n8n

Open: `https://your-app.up.railway.app`

1. Complete n8n setup wizard
2. Create admin account
3. Ready to import workflows!

---

## Monitoring & Debugging

### View Logs
```bash
# Via CLI
railway logs

# Or in dashboard: Click service → Logs tab
```

### Check Metrics
Dashboard shows:
- CPU usage
- Memory usage
- Request count
- Deployment history

### Restart Service
```bash
railway service restart
```

---

## Custom Domain (Optional)

1. In Railway: **Settings** → **Networking** → **Custom Domain**
2. Add your domain: `n8n.yourdomain.com`
3. Add CNAME record in your DNS:
   ```
   CNAME n8n your-app.up.railway.app
   ```
4. SSL certificate auto-provisioned

---

## Pricing

**Starter Plan (Free):**
- $5 free credits per month
- ~80 hours of runtime for n8n
- Suitable for: Development, testing

**Developer Plan ($5/month):**
- $5 credits + pay-as-you-go
- Unlimited usage
- Suitable for: Production

---

## Advantages of Railway

✅ **Zero configuration** - Just push and deploy
✅ **Auto-SSL** - HTTPS automatically configured
✅ **GitHub integration** - Auto-deploy on push
✅ **Environment variables** - Easy to manage
✅ **Logs and metrics** - Built-in monitoring
✅ **No server management** - Focus on workflows
✅ **Instant rollback** - One-click deployment history
✅ **Custom domains** - Add your own domain

---

## Disadvantages

❌ **Free tier limits** - $5 credits may run out
❌ **Not truly free forever** - Need credit card after trial
❌ **Less control** - Can't SSH into server

---

## Cost Estimate for 24/7 Operation

| Item | Cost |
|------|------|
| Railway Developer Plan | $5/month minimum |
| Additional usage (if over) | ~$3-5/month |
| **Total** | **$5-10/month** |

---

## Alternative: Render (True Free Tier)

If you want truly free (but with 15-min sleep):

```bash
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Runtime: Docker
5. Free plan selected by default
6. Add environment variables
7. Deploy

# To prevent sleep:
- Use UptimeRobot to ping every 5 minutes (free)
- Your n8n will stay awake during work hours
```

---

## Troubleshooting

**Build fails:**
```bash
# Check Railway logs
railway logs

# Common issues:
- Missing Dockerfile
- Wrong port configuration
- Environment variables not set
```

**n8n not accessible:**
```bash
# Check if service is running
railway status

# Restart
railway service restart
```

**Out of credits:**
```bash
# Check usage
railway usage

# Upgrade to Developer plan or switch to free alternative
```

---

**Railway deployment is perfect for getting started quickly!** 🚀

Once you validate your workflows, you can switch to Oracle Cloud for free forever hosting.
