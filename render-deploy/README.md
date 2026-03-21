# Deploy n8n to Render (100% Free Forever)

This guide helps you deploy n8n on **Render** with a **Nhost PostgreSQL** database - both completely free, no credit card tricks.

## ✅ Why Render + Nhost?

- **Render Free Tier**: 750 hours/month, auto-SSL, custom domains
- **Nhost Free Tier**: PostgreSQL database, 1GB storage, 5GB bandwidth
- **No Sleep Issues**: Unlike Heroku, Render keeps your app running
- **Persistent Data**: PostgreSQL ensures your workflows are never lost

## 🚀 Step-by-Step Setup

### Step 1: Create Nhost Database (5 minutes)

1. Go to [Nhost](https://nhost.io/)
2. Click **Sign Up** → Use GitHub for quick signup
3. Click **Create New Project**
   - Project Name: `darkfiles-n8n`
   - Region: **Singapore** (closest to India)
   - Plan: **Free** (automatically selected)
4. Wait 2-3 minutes for database provisioning
5. Once ready, click **Settings** → **Database** tab
6. Copy these values (you'll need them for Render):
   ```
   Host: [something].db.ap-southeast-1.nhost.run
   Port: 5432
   Database: postgres
   Username: postgres
   Password: [auto-generated password]
   ```

### Step 2: Deploy n8n to Render (10 minutes)

#### Option A: One-Click Deploy (Easiest)

1. Make sure your code is pushed to GitHub:
   ```bash
   cd /Users/dhineshkumar/Documents/dark-files-automation/darkfiles-platform
   git add render-deploy/
   git commit -m "Add Render deployment with Nhost PostgreSQL"
   git push origin main
   ```

2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click **Sign Up** → Use GitHub
4. Click **New** → **Web Service**
5. Connect your GitHub repo: `dinesh0666/youtube-automation-app`
6. Configure the service:
   - **Name**: `darkfiles-n8n`
   - **Region**: Singapore
   - **Branch**: `main`
   - **Root Directory**: (leave blank)
   - **Environment**: Docker
   - **Dockerfile Path**: `./render-deploy/Dockerfile`
   - **Instance Type**: Free

7. Click **Advanced** → Add Environment Variables:

   **Required Variables:**
   ```
   N8N_HOST = darkfiles-n8n.onrender.com
   N8N_PORT = 10000
   N8N_PROTOCOL = https
   WEBHOOK_URL = https://darkfiles-n8n.onrender.com
   GENERIC_TIMEZONE = Asia/Kolkata
   ```

   **Database Variables (from Nhost Step 1):**
   ```
   DB_TYPE = postgresdb
   DB_POSTGRESDB_HOST = [your-nhost-host].db.ap-southeast-1.nhost.run
   DB_POSTGRESDB_PORT = 5432
   DB_POSTGRESDB_DATABASE = postgres
   DB_POSTGRESDB_USER = postgres
   DB_POSTGRESDB_PASSWORD = [your-nhost-password]
   ```

   **Security:**
   ```
   N8N_ENCRYPTION_KEY = [click "Generate" button in Render]
   ```

   **API Keys (add later):**
   ```
   ANTHROPIC_API_KEY = sk-ant-xxx
   ELEVENLABS_API_KEY = sk_xxx
   LEONARDO_API_KEY = xxx
   SHOTSTACK_API_KEY = xxx
   PERPLEXITY_API_KEY = pplx-xxx
   ```

8. Click **Create Web Service**

9. Wait 5-10 minutes for deployment (watch logs)

10. Once deployed, visit: `https://darkfiles-n8n.onrender.com`

#### Option B: Using Blueprint (render.yaml)

1. Push code to GitHub (same as above)
2. In Render, click **New** → **Blueprint**
3. Select your repo
4. Render will detect `render.yaml` automatically
5. Add the database credentials manually in the dashboard
6. Deploy!

### Step 3: First-Time n8n Setup

1. Open `https://darkfiles-n8n.onrender.com`
2. Create admin account:
   - **Email**: dhineshkumar263@gmail.com
   - **Password**: [choose strong password]
3. Skip personalization wizard (click "Skip")
4. You're in! 🎉

### Step 4: Update Dashboard Webhook URL

Update your Next.js app to use the new n8n URL:

```bash
cd /Users/dhineshkumar/Documents/dark-files-automation/darkfiles-platform
```

Edit `.env.local`:
```env
N8N_WEBHOOK_URL=https://darkfiles-n8n.onrender.com
```

Restart your dev server:
```bash
npm run dev
```

## 📊 Free Tier Limits

### Render Free Tier
- ✅ 750 hours/month (more than enough)
- ✅ Auto-SSL certificates
- ✅ Custom domains supported
- ⚠️ Spins down after 15 min inactivity (cold start ~30s)
- ✅ 512MB RAM, 0.1 CPU

### Nhost Free Tier
- ✅ 1GB database storage
- ✅ 5GB bandwidth/month
- ✅ Unlimited database connections
- ✅ Daily backups

## 🔥 Pro Tips

1. **Prevent Cold Starts**: Use [Uptime Robot](https://uptimerobot.com/) to ping your n8n URL every 5 minutes (free)

2. **Custom Domain**: 
   - Add CNAME record: `n8n.your-domain.com` → `darkfiles-n8n.onrender.com`
   - In Render → Settings → Custom Domain → Add `n8n.your-domain.com`

3. **Monitor Logs**: Render Dashboard → Logs tab shows real-time n8n activity

4. **Database Backups**: Nhost automatically backs up daily (free tier = 7 days retention)

5. **Upgrade Path**: If you outgrow free tier:
   - Render: $7/month for no sleep + more resources
   - Nhost: $25/month for 10GB database

## 🐛 Troubleshooting

### Issue: "Database connection failed"
**Fix**: Double-check Nhost credentials, ensure no extra spaces

### Issue: "Service unavailable" after deployment
**Wait**: Render takes 5-10 minutes for first deployment

### Issue: n8n won't start
**Check Logs**: Render Dashboard → Logs → Look for error messages

### Issue: Webhooks not working
**Fix**: Ensure `WEBHOOK_URL=https://darkfiles-n8n.onrender.com` (no trailing slash)

## 🎯 Next Steps

Once n8n is running:

1. **Create workflows** (Producer, Publisher, AI Researcher)
2. **Set up credentials** (Anthropic, ElevenLabs, etc.)
3. **Configure webhooks** in your Next.js dashboard
4. **Deploy dashboard** to Vercel (free)
5. **Test end-to-end** workflow

## 📚 Resources

- [Render Docs](https://render.com/docs)
- [Nhost Docs](https://docs.nhost.io/)
- [n8n Docs](https://docs.n8n.io/)
- [Original Guide](https://dev.to/singhamandeep007/the-ultimate-guide-to-self-hosting-n8n-for-free-using-render-and-nhost-2d69)

---

**Your n8n URL**: https://darkfiles-n8n.onrender.com  
**Database**: Nhost PostgreSQL (Singapore region)  
**Status**: Ready to create workflows! 🚀
