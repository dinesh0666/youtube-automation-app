#!/bin/bash

# Nginx Configuration Script for n8n with SSL
# Usage: sudo bash configure-nginx.sh your-domain.duckdns.org

if [ "$EUID" -ne 0 ]; then 
   echo "Please run as root: sudo bash configure-nginx.sh YOUR_DOMAIN"
   exit 1
fi

if [ -z "$1" ]; then
    echo "Usage: sudo bash configure-nginx.sh YOUR_DOMAIN.duckdns.org"
    exit 1
fi

DOMAIN=$1

echo "Configuring Nginx for domain: $DOMAIN"

# Create Nginx configuration
cat > /etc/nginx/sites-available/n8n << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    # Increase client body size for file uploads
    client_max_body_size 100M;
    
    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        
        # WebSocket support
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Standard proxy headers
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Disable buffering for webhooks
        proxy_buffering off;
        proxy_cache off;
        
        # Timeouts
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/

# Remove default site if exists
rm -f /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

if [ $? -eq 0 ]; then
    echo "Nginx configuration is valid."
    systemctl reload nginx
    echo "Nginx reloaded successfully."
    echo ""
    echo "Next step: Set up SSL certificate"
    echo "Run: sudo certbot --nginx -d $DOMAIN"
else
    echo "Nginx configuration test failed!"
    exit 1
fi
