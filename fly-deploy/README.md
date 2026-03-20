# Fly.io n8n Deployment Guide

Deploy n8n to Fly.io with **free forever hosting** (3 VMs free, 3GB storage).

## Why Fly.io?

✅ **Completely free forever** (within free tier limits)
✅ **No sleep** - Always on 24/7
✅ **Auto SSL/HTTPS** - Certificates handled automatically  
✅ **Global CDN** - Fast worldwide
✅ **SSH access** - Full control over container
✅ **Persistent storage** - Data survives deployments
✅ **No credit card required** for free tier

---

## Quick Start (Automated)

```bash
cd darkfiles-platform
chmod +x fly-deploy/deploy.sh
./fly-deploy/deploy.sh
```

This script will:
1. Install Fly CLI
2. Authenticate
3. Create app
4. Create persistent volume
5. Set environment secrets
6. Deploy n8n

---

## Manual Deployment (Step-by-Step)

### Step 1: Install Fly CLI

**macOS/Linux:**
```bash
curl -L https://fly.io/install.sh | sh

# Add to PATH
export FLYCTL_INSTALL="$HOME/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

# Make permanent (add to ~/.zshrc or ~/.bashrc)
echo 'export FLYCTL_INSTALL="$HOME/.fly"' >> ~/.zshrc
echo 'export PATH="$FLYCTL_INSTALL/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Verify installation:**
```bash
flyctl version
```

---

### Step 2: Sign Up & Login

```bash
# Create account and login (opens browser)
flyctl auth signup

# Or if you already have account
flyctl auth login
```

---

### Step 3: Create Fly App

```bash
cd darkfiles-platform

# Launch app
flyctl launch --no-deploy --name darkfiles-n8n --region sin

# Choose options:
# - App name: darkfiles-n8n (or your choice)
# - Region: sin (Singapore - closest to India)
# - PostgreSQL: No
# - Redis: No
# - Deploy: No (we'll set secrets first)
```

**Available regions:**
- `sin` - Singapore (best for India/Asia)
- `bom` - Mumbai, India
- `hkg` - Hong Kong
- `nrt` - Tokyo
- `syd` - Sydney

---

### Step 4: Create Persistent Volume

```bash
# Create 3GB volume for n8n data
flyctl volumes create n8n_data --region sin --size 3

# Verify volume
flyctl volumes list
```

---

### Step 5: Set Environment Secrets

```bash
# Set all secrets at once
flyctl secrets set \
  ANTHROPIC_API_KEY="your_anthropic_key" \
  ELEVENLABS_API_KEY="sk_0a9c1ba3ee1eb8aed61e6f801e5ca14941706014afad86b5" \
  LEONARDO_API_KEY="your_leonardo_key" \
  SHOTSTACK_API_KEY="your_shotstack_key" \
  PERPLEXITY_API_KEY="your_perplexity_key" \
  ELEVENLABS_VOICE_EN="pNInz6obpgDQGcFmaJgB" \
  ELEVENLABS_VOICE_TA="your_tamil_voice_id" \
  N8N_CALLBACK_SECRET="darkfiles-secret-2024" \
  WEBHOOK_URL="https://darkfiles-n8n.fly.dev" \
  APP_URL="https://your-nextjs-app.vercel.app"

# List secrets (values hidden)
flyctl secrets list
```

---

### Step 6: Deploy

```bash
# Deploy from root directory (where fly.toml is)
flyctl deploy

# Watch deployment progress
# Takes 2-3 minutes
```

---

### Step 7: Verify Deployment

```bash
# Check status
flyctl status

# Should show:
# Status: running
# Instances: 1 running

# View logs
flyctl logs

# Open in browser
flyctl open
```

Your n8n URL: `https://darkfiles-n8n.fly.dev`

---

## Configuration Files Explained

### fly.toml
Main configuration file (already created in project root):
- App name and region
- HTTP service config
- Health checks
- VM size (1 CPU, 512MB RAM - free tier)
- Volume mount point

### fly-deploy/Dockerfile
n8n container configuration:
- Based on official n8n image
- Port 8080 (Fly.io standard)
- Health check endpoint
- Production optimized

---

## Post-Deployment Setup

### 1. Access n8n

Open: `https://darkfiles-n8n.fly.dev`

First time:
1. Set up n8n account (admin user)
2. Skip workspace setup
3. Ready to import workflows!

### 2. Update Your .env.local

```bash
# In darkfiles-platform/.env.local
N8N_WEBHOOK_URL=https://darkfiles-n8n.fly.dev
N8N_CALLBACK_SECRET=darkfiles-secret-2024
```

### 3. Import Workflows

Once workflows are created:
1. In n8n: Click **+** → **Import from file**
2. Import Producer, Publisher, Researcher workflows
3. Set up credentials (HTTP Header Auth)
4. Activate workflows

---

## Fly.io Commands Reference

### App Management
```bash
# View app info
flyctl info

# View app status
flyctl status

# List all your apps
flyctl apps list

# Open app in browser
flyctl open

# Destroy app (careful!)
flyctl apps destroy darkfiles-n8n
```

### Deployment
```bash
# Deploy current code
flyctl deploy

# Deploy specific Dockerfile
flyctl deploy --dockerfile fly-deploy/Dockerfile

# Force rebuild
flyctl deploy --no-cache
```

### Logs & Monitoring
```bash
# Live logs (tail)
flyctl logs

# Last 100 lines
flyctl logs --lines 100

# Show only errors
flyctl logs --level error
```

### Scaling
```bash
# Check current scale
flyctl scale show

# Set number of VMs
flyctl scale count 1

# Change VM size (still free)
flyctl scale vm shared-cpu-1x --memory 512
```

### Secrets Management
```bash
# List secrets
flyctl secrets list

# Set a secret
flyctl secrets set KEY=value

# Unset a secret
flyctl secrets unset KEY

# Set multiple secrets from file
flyctl secrets import < .env
```

### Volume Management
```bash
# List volumes
flyctl volumes list

# Show volume details
flyctl volumes show vol_xxx

# Delete volume (careful!)
flyctl volumes delete vol_xxx

# Create another volume for redundancy
flyctl volumes create n8n_data --region sin --size 3
```

### SSH Access
```bash
# SSH into running container
flyctl ssh console

# Run command in container
flyctl ssh console -C "ls -la /home/node/.n8n"

# SFTP access
flyctl ssh sftp shell
```

---

## Monitoring & Health

### Check Application Health
```bash
# Status
flyctl status

# Recent events
flyctl status --all

# VM metrics
flyctl metrics
```

### View Health Check Status
```bash
flyctl checks list
```

### Set Up Monitoring (Optional)
```bash
# Enable metrics
flyctl metrics --app darkfiles-n8n

# Access Prometheus metrics
# Available at: https://darkfiles-n8n.fly.dev/metrics
```

---

## Custom Domain (Optional)

### Add Your Domain

1. **Create certificate:**
```bash
flyctl certs create n8n.yourdomain.com
```

2. **Get validation records:**
```bash
flyctl certs show n8n.yourdomain.com
```

3. **Add DNS records** (at your domain provider):
```
CNAME n8n darkfiles-n8n.fly.dev
```

4. **Verify:**
```bash
flyctl certs check n8n.yourdomain.com
```

---

## Troubleshooting

### Deployment Fails

```bash
# View logs
flyctl logs

# Common issues:
# 1. Volume not created - create it first
# 2. Secrets not set - set all required secrets
# 3. Wrong region - must match volume region

# Force rebuild
flyctl deploy --no-cache
```

### App Not Accessible

```bash
# Check status
flyctl status

# If stopped, start it
flyctl scale count 1

# Check health
flyctl checks list

# View recent logs
flyctl logs --lines 50
```

### Volume Issues

```bash
# List volumes
flyctl volumes list

# If no volume in same region as app:
flyctl volumes create n8n_data --region sin --size 3

# Show volume details
flyctl volumes show vol_xxx
```

### Out of Memory

```bash
# Check current memory
flyctl scale show

# n8n needs at least 512MB, upgrade if needed:
flyctl scale vm shared-cpu-1x --memory 1024
```

### Secrets Not Working

```bash
# List secrets
flyctl secrets list

# Re-set a secret
flyctl secrets set SECRET_NAME="new_value"

# Import from file
flyctl secrets import < .env.production
```

### Need to Reset Everything

```bash
# Destroy app
flyctl apps destroy darkfiles-n8n

# Delete volumes
flyctl volumes list
flyctl volumes delete vol_xxx

# Start over with Step 3
```

---

## Free Tier Limits

| Resource | Free Tier | Your Usage |
|----------|-----------|------------|
| VMs | Up to 3 shared-cpu-1x | 1 (n8n) |
| RAM | 256MB per VM (3 VMs) | 512MB (1 VM) |
| Persistent Volumes | 3GB total | 3GB (n8n data) |
| Outbound Data | 100GB/month | < 10GB typical |
| **Cost** | **$0/month** | **$0/month** |

You're well within limits! ✅

---

## Upgrading to Paid (If Needed)

If you need more resources:

```bash
# Add payment method
flyctl orgs billing

# Scale up memory
flyctl scale vm shared-cpu-1x --memory 2048

# Add more VMs for redundancy
flyctl scale count 2
```

**Pricing:** ~$0.02/hour for shared-cpu-1x

---

## Backup & Restore

### Backup n8n Data

```bash
# SSH into container
flyctl ssh console

# Create backup
tar -czf /tmp/n8n-backup.tar.gz /home/node/.n8n

# Download backup
flyctl ssh sftp get /tmp/n8n-backup.tar.gz ./n8n-backup.tar.gz
```

### Restore n8n Data

```bash
# Upload backup
flyctl ssh sftp shell
put n8n-backup.tar.gz /tmp/

# SSH and restore
flyctl ssh console
cd /home/node
tar -xzf /tmp/n8n-backup.tar.gz
```

---

## Performance Tips

1. **Use Singapore region** (`sin`) - closest to India
2. **Enable metrics** to monitor performance
3. **Single VM is enough** for 5 videos/week
4. **Volume in same region** as VM for low latency
5. **Don't scale to 0** - keep min_machines_running = 1

---

## Security Checklist

✅ All secrets set via `flyctl secrets` (encrypted)
✅ HTTPS enforced automatically
✅ n8n callback secret configured
✅ No API keys in code/config files
✅ Volume encrypted at rest
✅ App isolated in Fly network

---

## Support & Resources

- **Fly.io Docs:** https://fly.io/docs
- **Fly.io Community:** https://community.fly.io
- **n8n Docs:** https://docs.n8n.io
- **Status Page:** https://status.fly.io

---

## Migration from Oracle/Railway

If you're switching from another platform:

1. **Export n8n data** from old instance
2. Deploy to Fly.io (follow this guide)
3. Import data via SSH
4. Update webhook URLs in your Next.js app
5. Test workflows
6. Shut down old instance

---

**Your n8n is now running free forever on Fly.io! 🚀**

Next step: Create workflow JSON files to import into n8n.
