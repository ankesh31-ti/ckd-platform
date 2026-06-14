# CKD Predictive Care Platform

A full-stack Clinical Decision Support System (CDSS) for nephrologists — predictive risk stratification, KDIGO 2024-aligned diagnostics, and longitudinal patient tracking for 30 active patients.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite + React 18 + TypeScript + Tailwind CSS |
| Charts | Recharts |
| Backend | Express.js + Node.js (TypeScript) |
| Database | JSON file DB (patients_db.json, alerts_db.json) |
| Hosting | Vercel (frontend) + Render.com (backend) |

---

## Features

- **Clinician Dashboard** — 30-patient worklist, sortable by risk, filterable by stage
- **KDIGO 2024 Diagnostic Audit** — automated G-stage, 90-day verification, CGA risk matrix
- **Longitudinal GFR Trend** — least-squares regression, annualized slope, 6-month prediction
- **Clinical Alerts** — real-time flags for hyperkalemia, anemia, rapid decline, G5 critical threshold
- **Clinical AI Chat** — KDIGO Guard (stub — connect your LLM API key to activate)
- **Lab Digitizer** — Vision AI OCR stub (connect Claude Vision / Google Vision to activate)
- **Patient Portal** — medication checklist, symptom logger, simplified vital trends

---

## Local Development

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/ckd-platform.git
cd ckd-platform
```

### 2. Install dependencies

```bash
# Install both frontend and backend
npm run install:all
```

### 3. Run backend (terminal 1)

```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

### 4. Run frontend (terminal 2)

```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

The frontend proxies `/api` calls to the backend automatically (configured in `vite.config.ts`).

---

## Deploy to GitHub + Vercel + Render

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — CKD Predictive Care Platform"
git remote add origin https://github.com/YOUR_USERNAME/ckd-platform.git
git push -u origin main
```

### Step 2 — Deploy backend on Render.com (free tier)

1. Go to [render.com](https://render.com) → New → **Web Service**
2. Connect your GitHub repo
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. Click **Deploy**
5. Copy your Render URL: `https://ckd-platform-backend.onrender.com`

### Step 3 — Deploy frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Vercel will auto-detect `vercel.json` at the root
3. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://ckd-platform-backend.onrender.com/api`
4. Click **Deploy**
5. Your frontend is live at `https://ckd-platform.vercel.app`

### Step 4 — Update CORS on backend

In `backend/src/server.ts`, update the CORS origin to your Vercel URL:

```typescript
app.use(cors({ origin: 'https://ckd-platform.vercel.app' }));
```

Redeploy backend after this change.

---

## Activating the AI Chat (KDIGO Guard)

The chat feature is stubbed in `backend/src/server.ts` → `/api/chat` route.

### Option A — Claude (Anthropic)

```bash
cd backend && npm install @anthropic-ai/sdk
```

```typescript
// In server.ts /api/chat route:
import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  system: 'You are KDIGO Guard, a nephrology clinical decision support AI. Reference KDIGO 2024 guidelines. Always recommend physician verification.',
  messages: [
    { role: 'user', content: `Patient: ${JSON.stringify(patientContext)}\n\nQuestion: ${message}` }
  ]
});
res.json({ reply: response.content[0].text, isStub: false });
```

Add to Render environment variables: `ANTHROPIC_API_KEY=sk-ant-...`

### Option B — OpenAI

```bash
cd backend && npm install openai
```

```typescript
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: 'You are KDIGO Guard...' },
    { role: 'user', content: `Patient: ${JSON.stringify(patientContext)}\n\n${message}` }
  ]
});
res.json({ reply: completion.choices[0].message.content, isStub: false });
```

---

## Activating Lab Digitizer

Connect a Vision API in `backend/src/server.ts` → `/api/lab-digitizer` route.

Use `multer` for file uploads:

```bash
cd backend && npm install multer @types/multer
```

Then pass the image to Claude Vision or Google Vision API to extract structured lab values.

---

## Project Structure

```
ckd-platform/
├── frontend/
│   ├── src/
│   │   ├── types/         # TypeScript interfaces (Patient, Alert, etc.)
│   │   ├── services/      # API call layer (axios)
│   │   ├── components/    # Shared UI components (Sidebar, badges, cards)
│   │   └── pages/         # Dashboard, PatientDetail, Alerts, Chat, Portal
│   ├── vite.config.ts
│   └── tailwind.config.js
├── backend/
│   ├── src/
│   │   ├── services/      # riskEngine.ts — KDIGO calculations
│   │   ├── data/          # mockData.ts — 30 Indian patients
│   │   └── server.ts      # Express routes + DB helpers
│   └── tsconfig.json
├── vercel.json            # Vercel deployment config
└── README.md
```

---

## Clinical Logic Summary

The risk engine (`backend/src/services/riskEngine.ts`) runs 5 stages on every patient save:

1. **G-Stage Classification** — Latest eGFR → G1 through G5 (KDIGO 2024)
2. **Linear Regression Slope** — Least-squares across all historical labs → ml/min/yr
3. **CKD Verification** — Requires abnormal markers persisting ≥ 90 days
4. **Multi-Factor Risk Stratification** — eGFR slope + UACR + K+ + BP + Hb → LOW / MEDIUM / HIGH
5. **6-Month Prediction** — Projects eGFR using current slope × 0.5 years

---

## License

MIT — built for educational and clinical demonstration purposes. Not for production medical use without regulatory clearance.
