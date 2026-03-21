#!/bin/bash

# Dark Files - Render + Nhost Setup Helper
# This script helps you prepare for deployment

set -e

echo "=========================================="
echo "   Dark Files - Render + Nhost Setup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Pre-Deployment Checklist${NC}"
echo ""

# Check if git repo is clean
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
    echo ""
    read -p "Do you want to commit and push now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add render-deploy/
        git commit -m "Add Render + Nhost deployment configuration"
        git push origin main
        echo -e "${GREEN}✅ Code pushed to GitHub${NC}"
    else
        echo -e "${YELLOW}⚠️  Please commit and push before deploying${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Git repository is clean${NC}"
fi

echo ""
echo -e "${BLUE}📝 Setup Instructions${NC}"
echo ""
echo "Step 1: Create Nhost Database"
echo "  → Visit: https://nhost.io/"
echo "  → Sign up with GitHub"
echo "  → Create project: darkfiles-n8n (Singapore region)"
echo "  → Copy database credentials"
echo ""
echo "Step 2: Deploy to Render"
echo "  → Visit: https://dashboard.render.com/"
echo "  → New → Web Service"
echo "  → Connect repo: dinesh0666/youtube-automation-app"
echo "  → Use Dockerfile: ./render-deploy/Dockerfile"
echo "  → Add environment variables (see README.md)"
echo ""
echo "Step 3: Access n8n"
echo "  → URL: https://darkfiles-n8n.onrender.com"
echo "  → Create admin account"
echo "  → Start building workflows!"
echo ""
echo -e "${GREEN}📖 Full guide: render-deploy/README.md${NC}"
echo ""

# Open README in default editor
read -p "Open full README now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open render-deploy/README.md
    else
        xdg-open render-deploy/README.md 2>/dev/null || cat render-deploy/README.md
    fi
fi

echo ""
echo -e "${GREEN}🚀 Ready to deploy!${NC}"
echo ""
