# Oracle Cloud n8n Deployment Guide

Complete deployment guide for hosting n8n on Oracle Cloud Free Tier (₹0/month forever).

## Prerequisites

1. Oracle Cloud account (free tier)
2. SSH client
3. DuckDNS account (free domain)
4. API keys from AI providers

---

## Step 1: Create Oracle Cloud VM

1. Go to [Oracle Cloud Console](https://cloud.oracle.com)
2. Create a free account (no credit card required for free tier in India)
3. Navigate to **Compute** → **Instances** → **Create Instance**

**Configuration:**
- Name: `n8n-darkfiles`
- Image: **Ubuntu 22.04** (Canonical)
- Shape: **VM.Standard.A1.Flex** (Ampere ARM)
  - OCPUs: 2
  - Memory: 12 GB
- Boot volume: 100 GB (increase from default 50 GB)
- Add SSH key: Upload or paste your public SSH key

4. Click **Create**
5. Wait 2-3 minutes for provisioning
6. Copy the **Public IP address**

---

## Step 2: Configure Security List (Firewall)

1. Go to **Networking** → **Virtual Cloud Networks**
2. Click your VCN → **Security Lists** → Default Security List
3. Add Ingress Rules:

| Type | Source | Protocol | Port Range |
|------|--------|----------|------------|
| HTTP | 0.0.0.0/0 | TCP | 80 |
| HTTPS | 0.0.0.0/0 | TCP | 443 |
| SSH | 0.0.0.0/0 | TCP | 22 |

---

## Step 3: Get a Free Domain (DuckDNS)

1. Go to [DuckDNS.org](https://www.duckdns.org)
2. Sign in with any social account
3. Create a subdomain: `darkfiles-n8n` (or any name you want)
4. Copy your **token**
5. Update the IP to your Oracle VM IP:

```bash
curl "https://www.duckdns.org/update?domains=darkfiles-n8n&token=YOUR_TOKEN&ip=YOUR_ORACLE_VM_IP"
```

You should see: `OK`

Your domain is now: `https://darkfiles-n8n.duckdns.org`

---

## Step 4: SSH into Oracle VM

```bash
ssh ubuntu@YOUR_ORACLE_VM_IP
```

Or if using a key file:
```bash
ssh -i ~/.ssh/your-key.pem ubuntu@YOUR_ORACLE_VM_IP
```

---

## Step 5: Run Deployment Script

```bash
# Download deployment scripts
cd ~
git clone https://github.com/dinesh0666/youtube-automation-app.git darkfiles
cd darkfiles/oracle-deploy

# Make scripts executable
chmod +x deploy.sh configure-nginx.sh

# Run main deployment
bash deploy.sh
```

This will install:
- Docker & Docker Compose
- Nginx reverse proxy
- Certbot for SSL
- n8n directory structure

---

## Step 6: Configure Environment Variables

```bash
cd ~/n8n
nano .env
```

Update with your actual values:

```bash
# Domain Configuration
WEBHOOK_URL=https://darkfiles-n8n.duckdns.org

# Your Next.js Dashboard URL (deploy to Vercel first)
APP_URL=https://your-app.vercel.app

# Security
N8N_CALLBACK_SECRET=darkfiles-secret-2024

# AI Provider API Keys
ANTHROPIC_API_KEY=sk-ant-...
ELEVENLABS_API_KEY=sk_...
LEONARDO_API_KEY=...
SHOTSTACK_API_KEY=...
PERPLEXITY_API_KEY=pplx-...

# ElevenLabs Voice IDs
ELEVENLABS_VOICE_EN=pNInz6obpgDQGcFmaJgB
ELEVENLABS_VOICE_TA=your_tamil_voice_id
```

Save: `Ctrl+X`, `Y`, `Enter`

---

## Step 7: Configure Nginx

```bash
cd ~/n8n
sudo bash configure-nginx.sh darkfiles-n8n.duckdns.org
```

---

## Step 8: Start n8n

```bash
cd ~/n8n
docker-compose up -d
```

Check logs:
```bash
docker-compose logs -f n8n
```

Wait for: `Editor is now accessible via: http://localhost:5678/`

---

## Step 9: Set Up SSL Certificate

```bash
sudo certbot --nginx -d darkfiles-n8n.duckdns.org
```

Follow prompts:
- Enter email
- Agree to terms
- Choose redirect HTTP to HTTPS: **Yes**

---

## Step 10: Access n8n

Open: `https://darkfiles-n8n.duckdns.org`

**First-time setup:**
1. Create admin account (email + password)
2. Skip workspace setup
3. You're in!

---

## Step 11: Import Workflows

1. In n8n, click **+ Add Workflow**
2. Click **⋮** (three dots) → **Import from URL**
3. Import these 3 workflows:
   - Producer workflow
   - Publisher workflow  
   - AI Researcher workflow

(Workflow JSON files will be created next)

---

## Step 12: Set Up Credentials

1. Go to **Settings** → **Credentials** → **Add Credential**
2. Search for **HTTP Header Auth**
3. Name: `App Callback Secret`
4. Header Name: `x-n8n-secret`
5. Header Value: `darkfiles-secret-2024`
6. Save

---

## Step 13: Copy Webhook URLs

After importing each workflow:
1. Click on the **Webhook** trigger node
2. Copy the **Production URL** (not Test URL)
3. Update your Next.js `.env.local`:

```bash
N8N_WEBHOOK_URL=https://darkfiles-n8n.duckdns.org
N8N_PRODUCER_WEBHOOK_PATH=/webhook/darkfiles-producer
N8N_PUBLISHER_WEBHOOK_PATH=/webhook/darkfiles-publisher
N8N_RESEARCHER_WEBHOOK_PATH=/webhook/darkfiles-researcher
```

---

## Step 14: Activate Workflows

Toggle each workflow **ON** (switch in top right corner)

---

## Maintenance Commands

```bash
# SSH into VM
ssh ubuntu@YOUR_ORACLE_VM_IP

# View n8n logs
cd ~/n8n && docker-compose logs -f n8n

# Restart n8n
docker-compose restart n8n

# Stop n8n
docker-compose stop

# Start n8n
docker-compose up -d

# Update n8n to latest version
docker-compose pull && docker-compose up -d

# Check n8n status
docker-compose ps
```

---

## Auto-Update DuckDNS IP (Optional)

If Oracle VM IP changes, auto-update DuckDNS:

```bash
crontab -e
```

Add this line:
```
*/5 * * * * curl "https://www.duckdns.org/update?domains=YOUR_DOMAIN&token=YOUR_TOKEN" >/dev/null 2>&1
```

---

## Troubleshooting

### n8n not accessible
```bash
# Check if n8n is running
docker ps

# Check logs
cd ~/n8n && docker-compose logs -f n8n

# Restart
docker-compose restart n8n
```

### Firewall issues
```bash
# Check iptables
sudo iptables -L -n

# Re-add rules
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

### SSL certificate issues
```bash
# Test certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Force renew
sudo certbot renew --force-renewal
```

---

## Cost Estimate

| Service | Cost |
|---------|------|
| Oracle Cloud VM | ₹0 (Always Free) |
| DuckDNS Domain | ₹0 |
| SSL Certificate | ₹0 (Let's Encrypt) |
| **Total** | **₹0/month** |

---

## Next Steps

After n8n is running:
1. Create the 3 workflow JSON files (Producer, Publisher, Researcher)
2. Import them into n8n
3. Deploy your Next.js dashboard to Vercel
4. Connect the two via webhook URLs

---

**Your n8n instance is now live 24/7 at ₹0/month! 🚀**
