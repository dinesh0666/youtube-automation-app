# Environment Variables for Render

Copy-paste these into Render Dashboard → Environment Variables:

## Required Configuration

```
N8N_HOST=darkfiles-n8n.onrender.com
N8N_PORT=10000
N8N_PROTOCOL=https
WEBHOOK_URL=https://darkfiles-n8n.onrender.com
GENERIC_TIMEZONE=Asia/Kolkata
```

## Database (Nhost PostgreSQL)

```
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=kkhlblitmwyyxdaeqinj.db.ap-southeast-1.nhost.run
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=postgres
DB_POSTGRESDB_USER=postgres
DB_POSTGRESDB_PASSWORD=MdEaE9nNy6U2wkHx
```

## Security

```
N8N_ENCRYPTION_KEY=
```
**⚠️ Important:** In Render, click the "Generate" button for this value

## API Keys (Add these after n8n is running)

```
ANTHROPIC_API_KEY=
ELEVENLABS_API_KEY=sk_0a9c1ba3ee1eb8aed61e6f801e5ca14941706014afad86b5
LEONARDO_API_KEY=
SHOTSTACK_API_KEY=
PERPLEXITY_API_KEY=
```

---

## Quick Deploy Steps

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Web Service**
3. Connect repo: `dinesh0666/youtube-automation-app`
4. Configure:
   - **Name**: darkfiles-n8n
   - **Region**: Singapore
   - **Branch**: main
   - **Environment**: Docker
   - **Dockerfile Path**: `./render-deploy/Dockerfile`
   - **Instance Type**: Free
5. Add all environment variables above
6. Click **Create Web Service**
7. Wait 5-10 minutes for deployment
8. Visit: https://darkfiles-n8n.onrender.com

## After Deployment

1. Create admin account in n8n
2. Set up credentials (Anthropic, ElevenLabs, etc.)
3. Import workflow JSON files
4. Test webhooks from dashboard
