# n8n Workflows Import Guide

Complete guide to importing and configuring the Dark Files automation workflows in n8n.

## 📋 Prerequisites

Before importing workflows, ensure you have:

✅ n8n running at: `https://youtube-automation-app-j19x.onrender.com/`  
✅ Admin account created  
✅ API keys ready:
- Anthropic (Claude) - **Required** for research, script writing, and case generation
- ElevenLabs - **Required** for voiceover
- Leonardo or Pollinations - **Optional** for images (Pollinations is free)
- Shotstack - **Required** for video editing
- Google/YouTube OAuth - **Required** for publishing

## 🚀 Quick Start (15 minutes)

### Step 1: Add Environment Variables to Render

Go to [Render Dashboard](https://dashboard.render.com/) → your n8n service → Environment

Add these API keys (if not already added):

```bash
# Already configured
N8N_HOST=youtube-automation-app-j19x.onrender.com
N8N_PORT=10000
N8N_PROTOCOL=https
WEBHOOK_URL=https://youtube-automation-app-j19x.onrender.com
GENERIC_TIMEZONE=Asia/Kolkata
DB_POSTGRESDB_CONNECTION_URL=[your database URL]
N8N_ENCRYPTION_KEY=[auto-generated]

# Add these API keys
ANTHROPIC_API_KEY=sk-ant-your-key-here
ELEVENLABS_API_KEY=sk_your-key-here
ELEVENLABS_VOICE_EN=pNInz6obpgDQGcFmaJgB
ELEVENLABS_VOICE_TA=your-tamil-voice-id
LEONARDO_API_KEY=your-key-here
SHOTSTACK_API_KEY=your-key-here
SHOTSTACK_ENV=stage
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
YOUTUBE_REFRESH_TOKEN_CH1=your-refresh-token-1
YOUTUBE_REFRESH_TOKEN_CH2=your-refresh-token-2
YOUTUBE_CHANNEL_ID_CH1=your-channel-id-1
YOUTUBE_CHANNEL_ID_CH2=your-channel-id-2
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id
```

After adding, click **Manual Deploy** → **Deploy latest commit**

### Step 2: Import Workflows

1. **Log in to n8n**: `https://youtube-automation-app-j19x.onrender.com/`

2. **Import Producer Workflow**:
   - Click **Workflows** in sidebar
   - Click **+** → **Import from File**
   - Upload: `n8n-workflows/1-producer-workflow.json`
   - Click **Import**

3. **Import Publisher Workflow**:
   - Click **+** → **Import from File**
   - Upload: `n8n-workflows/2-publisher-workflow.json`
   - Click **Import**

4. **Import AI Researcher Workflow**:
   - Click **+** → **Import from File**
   - Upload: `n8n-workflows/3-ai-researcher-workflow.json`
   - Click **Import**

### Step 3: Configure Webhook Authentication

Each workflow needs HTTP Header Auth credential:

1. Click **Credentials** in sidebar
2. Click **+ Add Credential**
3. Search for **Header Auth**
4. Configure:
   - **Name**: `darkfiles-webhook-auth`
   - **Header Name**: `x-n8n-secret`
   - **Header Value**: `darkfiles-secret-2024`
5. Click **Save**

### Step 4: Update Webhook Triggers

For **Producer** and **Publisher** workflows:

1. Open workflow
2. Click the **Webhook Trigger** node
3. Under **Authentication**, select: `darkfiles-webhook-auth`
4. Click **Save**
5. Copy the **Production Webhook URL**
6. Click **Activate** workflow (toggle in top-right)

### Step 5: Update Dashboard Webhook URLs

Update your local `.env.local`:

```bash
# Producer workflow webhook
N8N_WEBHOOK_URL=https://youtube-automation-app-j19x.onrender.com
N8N_PRODUCER_WEBHOOK_PATH=/webhook/darkfiles-producer
N8N_PUBLISHER_WEBHOOK_PATH=/webhook/darkfiles-publisher
N8N_RESEARCHER_WEBHOOK_PATH=/webhook/darkfiles-researcher
N8N_CALLBACK_SECRET=darkfiles-secret-2024
```

Restart your dev server:
```bash
cd /Users/dhineshkumar/Documents/dark-files-automation/darkfiles-platform
npm run dev
```

### Step 6: Test Workflows

#### Test Producer Workflow

From your dashboard at `http://localhost:3000/dashboard/queue`:

1. Click on a case
2. Click **"Start Production"**
3. Monitor in n8n: **Workflows** → **Producer** → **Executions**
4. Should see: Research → Script → Review → Voiceover → Images → Video
5. Video appears in dashboard Approve page

#### Test Publisher Workflow

From `http://localhost:3000/dashboard/approve`:

1. Click **"Approve & Publish"**
2. Select channel and schedule
3. Monitor in n8n: **Workflows** → **Publisher** → **Executions**
4. Video uploads to YouTube

#### Test AI Researcher (Manual)

1. Open AI Researcher workflow in n8n
2. Click **"Execute Workflow"** (manual trigger)
3. Wait 30-60 seconds
4. Check dashboard queue - should see 15 new cases

## 📊 Workflow Details

### 1. Producer Workflow

**Trigger**: Webhook from dashboard  
**Schedule**: On-demand (when user clicks "Start Production")  
**Duration**: 5-10 minutes per video

**Flow**:
```
Webhook → Verify Secret
  ↓
Research Case (Claude) → Find facts, timeline, evidence from training data
  ↓
Write Script (Claude) → 8-10 minute conversational script
  ↓
AI Review Script (Claude) → Check accuracy and engagement
  ↓
Generate Voiceover (ElevenLabs) → Text-to-speech
  ↓
Generate Image Prompts (Claude) → 8 cinematic scenes
  ↓
Generate Images (Pollinations) → Free AI images
  ↓
Create Video (Shotstack) → Combine audio + images
  ↓
Send Callback → Dashboard gets video URL
```

**Webhook Payload**:
```json
{
  "secret": "darkfiles-secret-2024",
  "contentId": "row-123",
  "title": "The Mysterious Case of...",
  "victim": "Jane Doe",
  "perpetrator": "John Smith",
  "summary": "Brief description",
  "callbackUrl": "http://localhost:3000/api/webhook/n8n"
}
```

### 2. Publisher Workflow

**Trigger**: Webhook from dashboard  
**Schedule**: On-demand (when user approves video)  
**Duration**: 2-5 minutes

**Flow**:
```
Webhook → Verify Secret
  ↓
Determine Channel → CH1 or CH2
  ↓
Get YouTube Access Token → OAuth refresh
  ↓
Initialize Upload → Create YouTube video entry
  ↓
Download Video → Get from Shotstack
  ↓
Upload to YouTube → Resumable upload
  ↓
Send Callback → Dashboard gets YouTube URL
```

**Webhook Payload**:
```json
{
  "secret": "darkfiles-secret-2024",
  "contentId": "row-123",
  "videoUrl": "https://shotstack.io/video.mp4",
  "title": "The Mysterious Case of...",
  "description": "Video description...",
  "tags": ["true crime", "documentary"],
  "channelNumber": 1,
  "publishNow": false,
  "scheduledDate": "2026-03-25T18:00:00Z",
  "callbackUrl": "http://localhost:3000/api/webhook/n8n"
}
```

### 3. AI Researcher Workflow

**Trigger**: Schedule (3x per month)  
**Schedule**: 1st, 11th, 21st of each month at midnight  
**Duration**: 1-2 minutes

**Flow**:
```
Schedule Trigger (3x/month)
  ↓
Research 15 Cases (Claude) → Generate compelling case ideas from training data
  ↓
Parse Cases → Extract structured data
  ↓
Add to Content Queue → POST to dashboard API
  ↓
Send Notification → Telegram/webhook
```

**Output**: 15 cases per run × 3 runs = 45 cases/month

## 🔧 Troubleshooting

### Issue: "Webhook not found"

**Fix**:
1. Check workflow is **Activated** (toggle in top-right)
2. Verify webhook path matches `.env.local`
3. Restart n8n: Render Dashboard → **Manual Deploy**

### Issue: "Authentication failed"

**Fix**:
1. Check `N8N_CALLBACK_SECRET` in dashboard `.env.local`
2. Verify Header Auth credential in n8n
3. Ensure webhook payload includes correct `secret`

### Issue: "API key invalid"

**Fix**:
1. Go to Render → Environment
2. Update the API key
3. Click **Save** → **Manual Deploy**
4. Wait for deployment to complete (~2 min)

### Issue: "Database connection lost"

**Fix**:
1. Render free tier spins down after 15 min inactivity
2. First request will take 30-60 seconds (cold start)
3. Visit n8n URL to wake it up
4. Optional: Use [UptimeRobot](https://uptimerobot.com/) to ping every 5 min

### Issue: "Video generation failed"

**Fix**:
1. Check n8n execution logs: **Workflows** → **Executions**
2. Click failed execution → See which node failed
3. Common issues:
   - ElevenLabs: Check API credits
   - Shotstack: Verify API key for correct environment (stage/production)
   - Pollinations: Free service, sometimes slow

### Issue: "YouTube upload failed"

**Fix**:
1. Verify Google OAuth tokens are valid
2. Check YouTube API quota (10,000 units/day)
3. Ensure video file is accessible (Shotstack URL)

## 📈 Monitoring & Maintenance

### Check Workflow Health

1. **n8n Dashboard**: `https://youtube-automation-app-j19x.onrender.com/`
2. Go to **Workflows** → Select workflow → **Executions**
3. View success/failure rates

### Monitor Costs

Free tiers:
- ✅ Render: 750 hours/month
- ✅ n8n: Unlimited workflows on self-hosted
- ⚠️ APIs have usage limits:
  - Anthropic: $5 free credit, then pay-as-you-go (~$3-5 per video)
  - ElevenLabs: 10k characters/month free
  - Shotstack: 20 renders/month free (stage env)
  - YouTube: 10k API units/day
  - Pollinations: Free unlimited AI images

### Optimize Performance

1. **Reduce API Calls**: Cache research results
2. **Batch Operations**: Process multiple cases at once
3. **Error Handling**: Add retry logic to workflows
4. **Webhooks**: Use webhook callbacks instead of polling

## 🎯 Next Steps

Once workflows are running:

1. **Deploy Dashboard to Vercel**:
   ```bash
   cd /Users/dhineshkumar/Documents/dark-files-automation/darkfiles-platform
   vercel
   ```

2. **Update n8n URLs**: Change from `localhost:3000` to your Vercel URL

3. **Set up Telegram Bot**: Get notifications on mobile

4. **Monitor Analytics**: Track video performance

5. **Scale Up**: Upgrade API limits as needed

---

## 📚 Resources

- [n8n Documentation](https://docs.n8n.io/)
- [Webhook Authentication](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [Error Handling](https://docs.n8n.io/workflows/errorhandling/)
- [Render Docs](https://render.com/docs)

---

**Your Workflows**:
- ✅ Producer: Research → Script → Video (5-10 min)
- ✅ Publisher: Approve → YouTube (2-5 min)
- ✅ AI Researcher: Auto-generate 45 cases/month

**Status**: Ready to import! 🚀
