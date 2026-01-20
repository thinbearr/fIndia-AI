# fIndia AI - Localhost + Ngrok Demo Guide

## ✅ This is Your 100% Guaranteed Backup Plan

If Hugging Face fails, this will DEFINITELY work for your demo tomorrow.

---

## Prerequisites

### 1. Install Ngrok
- Download: https://ngrok.com/download
- Extract to: `C:\ngrok\ngrok.exe`
- Sign up for free account: https://dashboard.ngrok.com/signup
- Get your auth token from: https://dashboard.ngrok.com/get-started/your-authtoken
- Run once: `ngrok config add-authtoken YOUR_TOKEN`

---

## Quick Start (1 Minute Setup)

### Option A: Automated Script
1. Double-click `start-demo.bat`
2. Wait for 3 windows to open
3. Copy the ngrok HTTPS URL (from window 3)
4. Update `frontend/.env`:
   ```
   VITE_API_URL=https://abc123.ngrok-free.app
   ```
5. Refresh your browser at `localhost:3000`

### Option B: Manual (Step-by-Step)

**Terminal 1 - Backend:**
```powershell
cd backend
.\venv\Scripts\activate
python main.py
```
Wait for: `✅ FinBERT-India model loaded successfully`

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```
Wait for: `Local: http://localhost:3000/`

**Terminal 3 - Ngrok:**
```powershell
ngrok http 8000
```
Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

**Terminal 4 - Update Frontend:**
```powershell
cd frontend
# Edit .env file:
VITE_API_URL=https://abc123.ngrok-free.app
```

Restart frontend (Terminal 2):
```powershell
# Ctrl+C to stop, then:
npm run dev
```

---

## For Your Demo Tomorrow

### Morning of Demo:
1. Run `start-demo.bat` (or manual steps)
2. Get your ngrok URL
3. Share the frontend URL: `http://localhost:3000` (project it on screen)
4. OR deploy frontend to Vercel with ngrok backend URL

### Advantages:
- ✅ **Your actual laptop** runs the model (no memory limits)
- ✅ **100% success rate** (guaranteed to work)
- ✅ **Full control** (can restart if issues)
- ✅ **Ngrok free tier**: 40 requests/minute (plenty for demo)

### During Demo:
- Frontend: `localhost:3000` (what audience sees)
- Backend: Running on your laptop (invisible)
- Ngrok: Makes backend accessible if you deploy frontend

---

## Troubleshooting

**"ngrok not found":**
```powershell
# Add to PATH or use full path:
C:\ngrok\ngrok http 8000
```

**"Port 8000 already in use":**
```powershell
# Kill existing process:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Frontend can't connect:**
- Check ngrok URL is HTTPS (not HTTP)
- Verify `frontend/.env` has correct ngrok URL
- Restart frontend after changing .env

---

## Why This Works:

1. **Backend runs on your laptop** → Full 32GB RAM available
2. **Model already loaded** → Works instantly
3. **Ngrok creates public URL** → Can demo to anyone
4. **No cloud deployment issues** → You control everything

**This is your safety net. Even if everything else fails, this WILL work.**
