# Troubleshooting: Database Connection Timeout

## Issue
```
Database connection timed out
```

n8n can't connect to Nhost PostgreSQL database.

## Quick Fix Options

### Option 1: Use Render's Built-in PostgreSQL (Easiest)

Render has a free PostgreSQL database that works seamlessly with their services.

1. In Render Dashboard, click **New** → **PostgreSQL**
2. Configure:
   - **Name**: `darkfiles-n8n-db`
   - **Region**: Singapore
   - **Instance Type**: Free
3. Wait 2-3 minutes for creation
4. Copy the **Internal Database URL**
5. In your web service, go to **Environment**
6. Replace all `DB_POSTGRESDB_*` variables with single variable:
   ```
   DATABASE_URL=[paste internal database URL]
   ```
7. Remove these variables:
   - `DB_TYPE`
   - `DB_POSTGRESDB_HOST`
   - `DB_POSTGRESDB_PORT`
   - `DB_POSTGRESDB_DATABASE`
   - `DB_POSTGRESDB_USER`
   - `DB_POSTGRESDB_PASSWORD`
8. Add new variable:
   ```
   DB_TYPE=postgresdb
   DB_POSTGRESDB_CONNECTION_URL=[paste internal database URL]
   ```
9. Click **Manual Deploy** → **Deploy latest commit**

### Option 2: Fix Nhost Connection

1. Go to [Nhost Dashboard](https://app.nhost.io/)
2. Select your `darkfiles-n8n` project
3. Go to **Settings** → **Networking** or **Allowed IPs**
4. Add Render's IP ranges (or allow all: `0.0.0.0/0`)
5. Save changes
6. In Render, click **Manual Deploy** → **Clear build cache & deploy**

### Option 3: Use SQLite (Development Only)

For quick testing without database:

1. In Render Environment, change:
   ```
   DB_TYPE=sqlite
   ```
2. Remove all `DB_POSTGRESDB_*` variables
3. Deploy

⚠️ **Warning**: SQLite on Render will lose data on redeploys. Use PostgreSQL for production.

## Recommended: Option 1 (Render PostgreSQL)

This is the easiest and most reliable since both services are in the same network.

**Benefits**:
- ✅ No IP whitelisting needed
- ✅ Fast internal connection
- ✅ Free tier: 90 days free, then $7/month (still cheaper than issues)
- ✅ Automatic backups
- ✅ Same region = low latency

## After Fixing

Once deployed successfully:
1. Visit: https://youtube-automation-app-j19x.onrender.com/
2. Create admin account
3. Start building workflows

---

**Current Status**: Database connection timeout with Nhost
**Recommended Fix**: Use Render's PostgreSQL (Option 1)
**Time to Fix**: 5-10 minutes
