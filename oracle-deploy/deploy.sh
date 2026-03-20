#!/bin/bash

# Dark Files - Oracle Cloud n8n Deployment Script
# Run this on your Oracle Cloud Ubuntu VM

set -e

echo "=========================================="
echo "Dark Files n8n Deployment for Oracle Cloud"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}Please do not run as root. Run as regular user with sudo access.${NC}"
   exit 1
fi

echo -e "${GREEN}[1/9] Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

echo -e "${GREEN}[2/9] Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    sudo apt install -y docker.io
    sudo systemctl enable docker
    sudo systemctl start docker
    sudo usermod -aG docker $USER
    echo -e "${YELLOW}Docker installed. You may need to log out and back in for group changes.${NC}"
else
    echo "Docker already installed."
fi

echo -e "${GREEN}[3/9] Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    sudo apt install -y docker-compose
else
    echo "Docker Compose already installed."
fi

echo -e "${GREEN}[4/9] Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
else
    echo "Nginx already installed."
fi

echo -e "${GREEN}[5/9] Installing Certbot for SSL...${NC}"
if ! command -v certbot &> /dev/null; then
    sudo apt install -y certbot python3-certbot-nginx
else
    echo "Certbot already installed."
fi

echo -e "${GREEN}[6/9] Creating n8n directory structure...${NC}"
mkdir -p ~/n8n/n8n_data
cd ~/n8n

echo -e "${GREEN}[7/9] Creating docker-compose.yml...${NC}"
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=${WEBHOOK_URL}
      - GENERIC_TIMEZONE=Asia/Kolkata
      - N8N_METRICS=true
      
      # API Keys for AI services
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY}
      - LEONARDO_API_KEY=${LEONARDO_API_KEY}
      - SHOTSTACK_API_KEY=${SHOTSTACK_API_KEY}
      - PERPLEXITY_API_KEY=${PERPLEXITY_API_KEY}
      
      # Voice IDs
      - ELEVENLABS_VOICE_EN=${ELEVENLABS_VOICE_EN:-pNInz6obpgDQGcFmaJgB}
      - ELEVENLABS_VOICE_TA=${ELEVENLABS_VOICE_TA}
      
      # App callback
      - APP_URL=${APP_URL}
      - N8N_CALLBACK_SECRET=${N8N_CALLBACK_SECRET:-darkfiles-secret-2024}
      
    volumes:
      - ./n8n_data:/home/node/.n8n
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:5678/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3
EOF

echo -e "${GREEN}[8/9] Creating .env template...${NC}"
cat > .env.example << 'EOF'
# Domain Configuration
WEBHOOK_URL=https://your-domain.duckdns.org

# Your Next.js Dashboard URL (after Vercel deployment)
APP_URL=https://your-app.vercel.app

# Security
N8N_CALLBACK_SECRET=darkfiles-secret-2024

# AI Provider API Keys
ANTHROPIC_API_KEY=your_anthropic_key_here
ELEVENLABS_API_KEY=your_elevenlabs_key_here
LEONARDO_API_KEY=your_leonardo_key_here
SHOTSTACK_API_KEY=your_shotstack_key_here
PERPLEXITY_API_KEY=your_perplexity_key_here

# ElevenLabs Voice IDs
ELEVENLABS_VOICE_EN=pNInz6obpgDQGcFmaJgB
ELEVENLABS_VOICE_TA=your_tamil_voice_id_here
EOF

if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}Created .env file. Please edit it with your actual values:${NC}"
    echo "  nano ~/n8n/.env"
else
    echo ".env file already exists."
fi

echo ""
echo -e "${GREEN}[9/9] Opening Oracle Cloud Firewall...${NC}"
echo "Adding iptables rules for ports 80 and 443..."
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save

echo ""
echo -e "${GREEN}=========================================="
echo "Installation Complete! 🎉"
echo "==========================================${NC}"
echo ""
echo -e "${YELLOW}NEXT STEPS:${NC}"
echo ""
echo "1. Set up a free domain at https://www.duckdns.org"
echo "   - Create account and get a domain (e.g., darkfiles-n8n.duckdns.org)"
echo "   - Update your IP: curl \"https://www.duckdns.org/update?domains=YOUR_DOMAIN&token=YOUR_TOKEN\""
echo ""
echo "2. Edit the .env file with your API keys and domain:"
echo "   nano ~/n8n/.env"
echo ""
echo "3. Run the Nginx configuration script:"
echo "   cd ~/n8n && sudo bash configure-nginx.sh YOUR_DOMAIN.duckdns.org"
echo ""
echo "4. Start n8n:"
echo "   cd ~/n8n && docker-compose up -d"
echo ""
echo "5. View logs:"
echo "   docker-compose logs -f n8n"
echo ""
echo "6. Access n8n at: http://YOUR_DOMAIN.duckdns.org"
echo ""
echo -e "${YELLOW}Don't forget to configure SSL after initial setup!${NC}"
echo ""
