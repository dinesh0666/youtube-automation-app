#!/bin/bash

# Quick Setup Script for Oracle Cloud n8n
# This script contains all commands to copy/paste

echo "=========================================="
echo "Quick Setup Commands"
echo "=========================================="
echo ""

echo "1. UPDATE DUCKDNS (run on your local machine):"
echo "curl \"https://www.duckdns.org/update?domains=dk-youtube-automation&token=da96fbf2-b329-467e-939c-1d61e0e0ae80&ip=YOUR_ORACLE_VM_IP\""
echo ""

echo "2. SSH INTO ORACLE VM:"
echo "ssh ubuntu@YOUR_ORACLE_VM_IP"
echo ""

echo "3. INSTALL DEPENDENCIES (on Oracle VM):"
cat << 'EOF'
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx
sudo systemctl enable docker && sudo systemctl start docker
sudo usermod -aG docker $USER
EOF
echo ""

echo "4. CREATE N8N DIRECTORY (on Oracle VM):"
cat << 'EOF'
mkdir -p ~/n8n && cd ~/n8n
EOF
echo ""

echo "5. CREATE DOCKER-COMPOSE.YML (on Oracle VM):"
cat << 'EOF'
cat > docker-compose.yml << 'DOCKEREOF'
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
      - WEBHOOK_URL=https://dk-youtube-automation.duckdns.org
      - GENERIC_TIMEZONE=Asia/Kolkata
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY}
      - LEONARDO_API_KEY=${LEONARDO_API_KEY}
      - SHOTSTACK_API_KEY=${SHOTSTACK_API_KEY}
      - PERPLEXITY_API_KEY=${PERPLEXITY_API_KEY}
      - ELEVENLABS_VOICE_EN=pNInz6obpgDQGcFmaJgB
      - ELEVENLABS_VOICE_TA=${ELEVENLABS_VOICE_TA}
      - APP_URL=${APP_URL}
      - N8N_CALLBACK_SECRET=darkfiles-secret-2024
    volumes:
      - ./n8n_data:/home/node/.n8n
DOCKEREOF
EOF
echo ""

echo "6. CREATE .ENV FILE (on Oracle VM):"
cat << 'EOF'
cat > .env << 'ENVEOF'
WEBHOOK_URL=https://dk-youtube-automation.duckdns.org
APP_URL=http://localhost:3000
ANTHROPIC_API_KEY=your_key_here
ELEVENLABS_API_KEY=sk_0a9c1ba3ee1eb8aed61e6f801e5ca14941706014afad86b5
LEONARDO_API_KEY=your_key_here
SHOTSTACK_API_KEY=your_key_here
PERPLEXITY_API_KEY=your_key_here
ELEVENLABS_VOICE_TA=your_tamil_voice_id
ENVEOF

nano .env  # Edit with your actual keys
EOF
echo ""

echo "7. CONFIGURE NGINX (on Oracle VM):"
cat << 'EOF'
sudo tee /etc/nginx/sites-available/n8n > /dev/null << 'NGINXEOF'
server {
    listen 80;
    server_name dk-youtube-automation.duckdns.org;
    client_max_body_size 100M;
    
    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        proxy_cache off;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
NGINXEOF

sudo ln -sf /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
EOF
echo ""

echo "8. OPEN FIREWALL (on Oracle VM):"
cat << 'EOF'
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save || echo "netfilter-persistent not installed"
EOF
echo ""

echo "9. START N8N (on Oracle VM):"
cat << 'EOF'
cd ~/n8n
docker-compose up -d
docker-compose logs -f
EOF
echo ""

echo "10. GET SSL CERTIFICATE (on Oracle VM):"
cat << 'EOF'
sudo certbot --nginx -d dk-youtube-automation.duckdns.org --non-interactive --agree-tos -m your-email@example.com
EOF
echo ""

echo "=========================================="
echo "ACCESS YOUR N8N:"
echo "https://dk-youtube-automation.duckdns.org"
echo "=========================================="
