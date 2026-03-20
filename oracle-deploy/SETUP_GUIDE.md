# Oracle Cloud n8n Deployment Guide

## Your Configuration
- **Domain:** dk-youtube-automation.duckdns.org
- **DuckDNS Token:** da96fbf2-b329-467e-939c-1d61e0e0ae80
- **SSL:** Will be configured with Let's Encrypt

---

## Step 1: Create Oracle Cloud VM

1. Go to [Oracle Cloud Console](https://cloud.oracle.com)
2. Navigate to: **Compute → Instances → Create Instance**
3. Configure:
   - **Name:** n8n-darkfiles
   - **Image:** Ubuntu 22.04 (Always Free Eligible)
   - **Shape:** VM.Standard.A1.Flex (Ampere, 4 OCPUs, 24GB RAM - Free)
   - **SSH Keys:** Upload your public key or generate new pair
   - **Networking:** Use default VCN with public subnet
4. Click **Create**
5. Note the **Public IP Address** after creation

---

## Step 2: Update DuckDNS with Your VM IP

```bash
# Replace YOUR_PUBLIC_IP with the IP from Oracle Cloud
curl "https://www.duckdns.org/update?domains=dk-youtube-automation&token=da96fbf2-b329-467e-939c-1d61e0e0ae80&ip=YOUR_PUBLIC_IP"

# Should return: OK
```

---

## Step 3: SSH into Your VM

```bash
ssh ubuntu@YOUR_PUBLIC_IP
```

---

## Step 4: Run Deployment Script

```bash
# Download and run the deployment script
wget https://raw.githubusercontent.com/dinesh0666/youtube-automation-app/main/oracle-deploy/deploy.sh
chmod +x deploy.sh
./deploy.sh
```

Or copy the script manually:

```bash
# Create directory
mkdir -p ~/n8n && cd ~/n8n

# Download scripts from your repo
# Or follow the manual steps below
```

---

## Step 5: Configure Environment Variables

```bash
cd ~/n8n
nano .env
```

Update with your actual values:

```bash
# Domain Configuration
WEBHOOK_URL=https://dk-youtube-automation.duckdns.org

# Your Next.js Dashboard URL (update after Vercel deployment)
APP_URL=https://your-app.vercel.app

# Security
N8N_CALLBACK_SECRET=darkfiles-secret-2024

# AI Provider API Keys
ANTHROPIC_API_KEY=your_anthropic_key_here
ELEVENLABS_API_KEY=sk_0a9c1ba3ee1eb8aed61e6f801e5ca14941706014afad86b5
LEONARDO_API_KEY=your_leonardo_key_here
SHOTSTACK_API_KEY=your_shotstack_key_here
PERPLEXITY_API_KEY=your_perplexity_key_here

# ElevenLabs Voice IDs
ELEVENLABS_VOICE_EN=pNInz6obpgDQGcFmaJgB
ELEVENLABS_VOICE_TA=your_tamil_voice_id_here
```

Save and exit (Ctrl+X, Y, Enter)

---

## Step 6: Configure Nginx

```bash
cd ~/n8n
sudo bash configure-nginx.sh dk-youtube-automation.duckdns.org
```

---

## Step 7: Start n8n

```bash
cd ~/n8n
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f n8n
```

---

## Step 8: Get SSL Certificate

```bash
sudo certbot --nginx -d dk-youtube-automation.duckdns.org --non-interactive --agree-tos -m your-email@example.com
```

Replace `your-email@example.com` with your actual email.

---

## Step 9: Access n8n

Open your browser: **https://dk-youtube-automation.duckdns.org**

1. Complete n8n setup wizard
2. Create admin account
3. You're ready to import workflows!

---

## Step 10: Update Your Local .env.local

Update your Next.js app:

```bash
# /Users/dhineshkumar/Documents/dark-files-automation/darkfiles-platform/.env.local

N8N_WEBHOOK_URL=https://dk-youtube-automation.duckdns.org
N8N_CALLBACK_SECRET=darkfiles-secret-2024
```

---

## Useful Commands

```bash
# Check n8n status
cd ~/n8n && docker-compose ps

# View logs
docker-compose logs -f n8n

# Restart n8n
docker-compose restart n8n

# Stop n8n
docker-compose down

# Update n8n to latest version
docker-compose pull && docker-compose up -d

# Check Nginx status
sudo systemctl status nginx

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Renew SSL (automatic but can be manual)
sudo certbot renew --dry-run
```

---

## Troubleshooting

### Can't access n8n on port 80/443?

```bash
# Check if firewall rules are set
sudo iptables -L -n | grep -E "80|443"

# Add rules if missing
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

### n8n won't start?

```bash
# Check logs
docker-compose logs n8n

# Check if port 5678 is already in use
sudo netstat -tulpn | grep 5678

# Restart Docker
sudo systemctl restart docker
docker-compose up -d
```

### DuckDNS not updating?

```bash
# Test your token
curl "https://www.duckdns.org/update?domains=dk-youtube-automation&token=da96fbf2-b329-467e-939c-1d61e0e0ae80&verbose=true"

# Set up auto-update cron (every 5 minutes)
crontab -e

# Add this line:
*/5 * * * * curl -s "https://www.duckdns.org/update?domains=dk-youtube-automation&token=da96fbf2-b329-467e-939c-1d61e0e0ae80" > /dev/null 2>&1
```

---

## Security Checklist

- ✅ SSH key authentication (no password login)
- ✅ HTTPS with Let's Encrypt SSL
- ✅ Firewall configured (only ports 22, 80, 443 open)
- ✅ API keys in .env file (not committed to git)
- ✅ n8n callback secret configured
- ✅ Regular security updates: `sudo apt update && sudo apt upgrade -y`

---

**Your n8n instance will be live at:** https://dk-youtube-automation.duckdns.org 🚀
