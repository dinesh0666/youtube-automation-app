#!/bin/bash

# Fly.io n8n Deployment Script for Dark Files Platform
# This script automates the deployment of n8n to Fly.io

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "=========================================="
echo "   Dark Files - Fly.io n8n Deployment"
echo "=========================================="
echo -e "${NC}"

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo -e "${YELLOW}[1/7] Installing Fly.io CLI...${NC}"
    curl -L https://fly.io/install.sh | sh
    
    # Add to PATH for current session
    export FLYCTL_INSTALL="/Users/$(whoami)/.fly"
    export PATH="$FLYCTL_INSTALL/bin:$PATH"
    
    echo -e "${GREEN}Fly CLI installed!${NC}"
    echo -e "${YELLOW}Please restart your terminal or run:${NC}"
    echo "export FLYCTL_INSTALL=\"/Users/$(whoami)/.fly\""
    echo "export PATH=\"\$FLYCTL_INSTALL/bin:\$PATH\""
    echo ""
    echo -e "${YELLOW}Then run this script again.${NC}"
    exit 0
else
    echo -e "${GREEN}✓ Fly CLI already installed${NC}"
fi

echo ""
echo -e "${YELLOW}[2/7] Authenticating with Fly.io...${NC}"
echo "This will open your browser for login."
flyctl auth login

echo ""
echo -e "${YELLOW}[3/7] Creating Fly.io app...${NC}"
echo "App name: darkfiles-n8n"
echo "Region: Singapore (sin) - closest to India"

# Launch app (creates but doesn't deploy yet)
flyctl launch --no-deploy --copy-config --name darkfiles-n8n --region sin

echo ""
echo -e "${YELLOW}[4/7] Creating persistent volume for n8n data...${NC}"
flyctl volumes create n8n_data --region sin --size 3

echo ""
echo -e "${YELLOW}[5/7] Setting environment secrets...${NC}"
echo "You'll need to enter your API keys now."
echo ""

# Prompt for API keys
read -p "Enter ANTHROPIC_API_KEY: " ANTHROPIC_KEY
read -p "Enter ELEVENLABS_API_KEY: " ELEVENLABS_KEY
read -p "Enter LEONARDO_API_KEY: " LEONARDO_KEY
read -p "Enter SHOTSTACK_API_KEY: " SHOTSTACK_KEY
read -p "Enter PERPLEXITY_API_KEY: " PERPLEXITY_KEY
read -p "Enter ElevenLabs Tamil Voice ID (optional): " VOICE_TA

# Get the app URL
APP_URL=$(flyctl info --json | grep -o '"Hostname":"[^"]*' | cut -d'"' -f4)
WEBHOOK_URL="https://${APP_URL}"

echo ""
echo -e "${GREEN}Your n8n URL will be: ${WEBHOOK_URL}${NC}"
echo ""

# Set secrets
flyctl secrets set \
  ANTHROPIC_API_KEY="${ANTHROPIC_KEY}" \
  ELEVENLABS_API_KEY="${ELEVENLABS_KEY}" \
  LEONARDO_API_KEY="${LEONARDO_KEY}" \
  SHOTSTACK_API_KEY="${SHOTSTACK_KEY}" \
  PERPLEXITY_API_KEY="${PERPLEXITY_KEY}" \
  ELEVENLABS_VOICE_EN="pNInz6obpgDQGcFmaJgB" \
  ELEVENLABS_VOICE_TA="${VOICE_TA}" \
  N8N_CALLBACK_SECRET="darkfiles-secret-2024" \
  WEBHOOK_URL="${WEBHOOK_URL}" \
  APP_URL="http://localhost:3000"

echo ""
echo -e "${YELLOW}[6/7] Deploying n8n to Fly.io...${NC}"
flyctl deploy

echo ""
echo -e "${YELLOW}[7/7] Opening n8n in browser...${NC}"
flyctl open

echo ""
echo -e "${GREEN}"
echo "=========================================="
echo "   ✅ Deployment Complete!"
echo "=========================================="
echo -e "${NC}"
echo ""
echo -e "${GREEN}Your n8n is now live at:${NC}"
echo "  ${WEBHOOK_URL}"
echo ""
echo -e "${YELLOW}Important: Update your .env.local with:${NC}"
echo "  N8N_WEBHOOK_URL=${WEBHOOK_URL}"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo "  flyctl status              - Check app status"
echo "  flyctl logs                - View live logs"
echo "  flyctl ssh console         - SSH into container"
echo "  flyctl scale count 1       - Ensure 1 instance running"
echo "  flyctl open                - Open n8n in browser"
echo ""
