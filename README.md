# Dark Files Platform

**AI-Powered YouTube Content Production Platform**

An automated end-to-end system for producing true crime documentary videos for YouTube. This platform uses AI to research cases, generate scripts, create voiceovers, render videos, and manage publishing — all with human approval gates.

---

## 🎯 Overview

Dark Files is a complete automation platform that takes a case name and produces a fully edited, narrated, ready-to-publish YouTube video. The system handles:

- ✅ **Case Research** (Perplexity AI)
- ✅ **Script Writing** (Claude AI in documentary storytelling style)
- ✅ **AI Review** (Authenticity + Guidelines check)
- ✅ **Voiceover Generation** (ElevenLabs)
- ✅ **Image Creation** (Leonardo AI - 13 cinematic scenes)
- ✅ **Video Rendering** (Shotstack - 1080p with music)
- ✅ **Human Approval** (Telegram + Web Dashboard)
- ✅ **YouTube Publishing** (Automated upload + scheduling)
- ✅ **Performance Tracking**

### Key Architecture Decisions

1. **No Traditional Database** — Google Sheets is the single source of truth
2. **n8n Workflows** — All AI orchestration happens in n8n (Oracle Cloud Free Tier)
3. **Next.js Dashboard** — Monitor, approve, and manage content
4. **Cost: ₹520/month** (ElevenLabs + Claude API only — everything else is free)

---

## 📁 Project Structure

```
darkfiles-platform/
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # Dashboard pages
│   │   │   ├── page.tsx           # Overview with stats
│   │   │   ├── queue/page.tsx     # Content pipeline
│   │   │   ├── approve/page.tsx   # Approval queue
│   │   │   ├── analytics/
│   │   │   └── settings/
│   │   ├── api/
│   │   │   ├── content/           # CRUD for content items
│   │   │   ├── webhook/n8n/       # Receives updates from n8n
│   │   │   ├── pipeline/toggle/   # Pause/resume pipeline
│   │   │   └── research/trigger/  # Manual AI research trigger
│   │   ├── layout.tsx             # Root layout with Providers
│   │   └── page.tsx               # Redirects to /dashboard
│   ├── components/                # Reusable UI components
│   ├── lib/
│   │   ├── sheets.ts              # ALL database operations
│   │   ├── types.ts               # TypeScript types
│   │   ├── constants.ts           # UI constants
│   │   └── utils.ts               # Helper functions
│   └── hooks/
│       └── useContent.ts          # React Query hooks
├── scripts/
│   └── setup-sheets.ts            # Initialize Google Sheets
├── .env.local                     # Environment variables
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Prerequisites

1. **Node.js 20+** installed
2. **Google Cloud Console** account
3. **n8n instance** (Oracle Cloud or Railway)
4. API keys from: Anthropic, ElevenLabs, Leonardo AI, Shotstack, Perplexity AI
5. **Google Sheet** created (3 tabs: Queue, Logs, Config)

### Installation

```bash
cd darkfiles-platform
npm install
```

### Set Up Google Sheets

1. Create a new Google Sheet with 3 tabs: `Queue`, `Logs`, `Config`
2. Get Service Account credentials from Google Cloud Console
3. Share your sheet with the service account email
4. Copy Sheet ID from URL

### Configure Environment

Copy `.env.example` to `.env.local` and fill in:

```bash
GOOGLE_SHEETS_ID=your_sheet_id
GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL=your_service_account@...
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Initialize Google Sheets

```bash
npx tsx scripts/setup-sheets.ts
```

### Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎛️ Features

### Dashboard
- Stats cards (Queued, Awaiting Approval, Published, Failed)
- Real-time updates (30s polling)
- Recent jobs table

### Queue Management
- View all content items
- Filter by status, language, channel
- Detailed status tracking

### Approval Workflow ⭐
- Video player with rendered output
- Script viewer
- Actions: Approve, Request Edit, Reject

---

## 📊 Architecture

```
Google Sheets (Database)
    ↓
Next.js Dashboard (Management)
    ↓
n8n Workflows (AI Orchestration)
    ↓
AI Pipeline:
  Perplexity → Claude → ElevenLabs → Leonardo → Shotstack
    ↓
YouTube Publishing
```

---

## 💰 Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| Oracle Cloud | ₹0 | Free tier (n8n hosting) |
| Google Sheets | ₹0 | Free up to 5M cells |
| Vercel | ₹0 | Free tier |
| Claude API | ~₹350/mo | 5 videos/week |
| ElevenLabs | ~₹170/mo | Creator plan |
| Leonardo AI | ₹0 | Free tier |
| Shotstack | ₹0 | Free tier |
| **TOTAL** | **₹520/mo** | |

---

## 📝 Next Steps

1. ✅ Dashboard is live
2. ⏳ Set up n8n workflows 
3. ⏳ Connect YouTube OAuth
4. ⏳ Set up Telegram bot
5. ⏳ Deploy to Vercel

---

## 📚 Resources

- **Full build guide:** [copilot-guid.md](../copilot-guid.md)
- **Architecture spec:** [dark-files.md](../dark-files.md)

---

## 📄 License

MIT License

---

**Happy Automating! 🚀**

