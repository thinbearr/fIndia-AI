# fIndia AI - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will help you run fIndia AI locally on your machine.

---

## Prerequisites

Before you begin, ensure you have:

- ✅ **Python 3.9+** installed ([python.org](https://python.org))
- ✅ **Node.js 18+** installed ([nodejs.org](https://nodejs.org))
- ✅ **MongoDB** installed and running ([mongodb.com](https://mongodb.com))
- ✅ **Git** installed

---

## Step 1: Clone & Setup

### Windows
```bash
# Clone repository
git clone <your-repo-url>
cd fIndia-AI-main

# Run automated setup
setup.bat
```

### Mac/Linux
```bash
# Clone repository
git clone <your-repo-url>
cd fIndia-AI-main

# Make script executable
chmod +x setup.sh

# Run automated setup
./setup.sh
```

---

## Step 2: Configure Environment Variables

### Backend Configuration

Edit `backend/.env`:

```env
# MongoDB (leave as-is for local development)
MONGODB_URI=mongodb://localhost:27017

# JWT Secret (can use default for development)
JWT_SECRET_KEY=findia-ai-development-secret-key-change-in-production-2024

# Google OAuth (REQUIRED for sign-in feature)
# Get from: https://console.cloud.google.com
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com

# News APIs (OPTIONAL - app works without these)
NEWS_API_KEY=
GNEWS_API_KEY=

# Server
PORT=8000
ENVIRONMENT=development
```

### Frontend Configuration

Edit `frontend/.env`:

```env
# Backend URL
VITE_API_URL=http://localhost:8000

# Google OAuth (same as backend)
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

---

## Step 3: Get Google OAuth Credentials (Optional but Recommended)

**Note**: The app works without Google OAuth, but you won't be able to use watchlist features.

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project: "fIndia-AI-Dev"
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000`
5. Copy the Client ID
6. Paste it in both `.env` files

**Detailed guide**: See `DEPLOYMENT.md` → Step 2

---

## Step 4: Start MongoDB

### Windows
```bash
# Start MongoDB service
net start MongoDB

# Or run manually
mongod
```

### Mac
```bash
# Start MongoDB
brew services start mongodb-community

# Or run manually
mongod --config /usr/local/etc/mongod.conf
```

### Linux
```bash
# Start MongoDB
sudo systemctl start mongod

# Or run manually
mongod
```

**Verify MongoDB is running:**
```bash
mongosh
# Should connect successfully
```

---

## Step 5: Start Backend

```bash
cd backend

# Activate virtual environment
# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate

# Start server
python main.py
```

**Expected output:**
```
✅ Connected to MongoDB
✅ FinBERT-India model loaded successfully
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Test backend:**
Open browser: `http://localhost:8000/health`

Should see: `{"status": "healthy"}`

---

## Step 6: Start Frontend

**Open a new terminal:**

```bash
cd frontend

# Start development server
npm run dev
```

**Expected output:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

---

## Step 7: Use the Application

1. **Open browser**: `http://localhost:3000`

2. **Search for a stock**:
   - Type "RELIANCE" or "INFY" or "TCS"
   - Select from dropdown

3. **View sentiment analysis**:
   - AI-powered sentiment (Bullish/Bearish/Neutral)
   - News articles with sentiment scores
   - Stock statistics
   - Price charts

4. **Sign in** (optional):
   - Click "Sign in with Google"
   - Add stocks to watchlist
   - Get personalized AI chatbot

5. **Chat with AI**:
   - Click chat button (bottom right)
   - Ask questions like:
     - "What's the sentiment for RELIANCE?"
     - "How does the FinBERT model work?"
     - "Which stocks are in my watchlist?"

---

## Troubleshooting

### Backend won't start

**Error: `ModuleNotFoundError`**
```bash
# Reinstall dependencies
cd backend
pip install -r requirements.txt
```

**Error: `MongoDB connection failed`**
```bash
# Check if MongoDB is running
mongosh

# If not, start MongoDB (see Step 4)
```

**Error: `FinBERT model not found`**
```bash
# Verify model exists
ls models/finbert-india/

# Should show: config.json, model.safetensors, tokenizer.json, vocab.txt
```

### Frontend won't start

**Error: `Cannot find module`**
```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Error: `VITE_API_URL is not defined`**
```bash
# Create .env file
cp .env.example .env
# Edit with your values
```

### API calls failing

**Check backend is running:**
```bash
curl http://localhost:8000/health
```

**Check CORS:**
- Ensure backend `main.py` has `allow_origins=["*"]` for development

**Check browser console:**
- Press F12 → Console tab
- Look for error messages

### Google Sign-In not working

**Without Google OAuth:**
- App works fine, but watchlist features are disabled
- You can still use sentiment analysis and chatbot

**To enable:**
- Follow Step 3 to get Google Client ID
- Add to both `.env` files
- Restart backend and frontend

---

## Testing with Sample Stocks

Try these Indian stocks:

**IT Sector:**
- INFY (Infosys)
- TCS (Tata Consultancy Services)
- WIPRO (Wipro)

**Banking:**
- HDFCBANK (HDFC Bank)
- ICICIBANK (ICICI Bank)
- SBIN (State Bank of India)

**Energy:**
- RELIANCE (Reliance Industries)
- ONGC (Oil and Natural Gas Corporation)

**Automotive:**
- TATAMOTORS (Tata Motors)
- MARUTI (Maruti Suzuki)

---

## Development Tips

### Hot Reload

**Backend:**
- FastAPI auto-reloads on code changes
- No need to restart server

**Frontend:**
- Vite auto-reloads on code changes
- Changes appear instantly

### Debugging

**Backend:**
- Check terminal output for errors
- Add `print()` statements
- Use Python debugger: `import pdb; pdb.set_trace()`

**Frontend:**
- Use browser DevTools (F12)
- Check Console for errors
- Use React DevTools extension

### Database

**View MongoDB data:**
```bash
mongosh
use findia_ai
db.users.find()
db.watchlists.find()
db.stocks.find()
```

**Clear database:**
```bash
mongosh
use findia_ai
db.dropDatabase()
```

---

## Next Steps

Once you have the app running:

1. **Customize**: Edit code to add features
2. **Deploy**: Follow `DEPLOYMENT.md` for production deployment
3. **Extend**: Add more stocks, features, or integrations

---

## File Structure Reference

```
fIndia-AI-main/
├── backend/
│   ├── main.py              # Start here
│   ├── routers/             # API endpoints
│   ├── services/            # Business logic
│   └── .env                 # Configuration
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx         # Main UI
│   │   ├── api.ts          # API calls
│   │   ├── Chatbot.tsx     # Chat component
│   │   └── index.css       # Styling
│   └── .env                # Configuration
│
└── models/
    └── finbert-india/      # AI model
```

---

## Common Commands

**Backend:**
```bash
cd backend
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
python main.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**MongoDB:**
```bash
mongod                    # Start server
mongosh                   # Connect to shell
```

---

## Getting Help

1. **Check README.md** - Comprehensive documentation
2. **Check API_DOCUMENTATION.md** - API reference
3. **Check DEPLOYMENT.md** - Deployment guide
4. **Check code comments** - Inline documentation
5. **Check Railway logs** - Production debugging

---

## Success Checklist

- ✅ MongoDB running
- ✅ Backend running on port 8000
- ✅ Frontend running on port 3000
- ✅ Can search for stocks
- ✅ Sentiment analysis works
- ✅ News articles load
- ✅ Charts display
- ✅ Chatbot responds
- ✅ (Optional) Google sign-in works
- ✅ (Optional) Watchlist works

---

**You're all set!** 🎉

Enjoy using fIndia AI - your Bloomberg-style intelligence terminal for Indian stock markets!

---

**Need help?** Check the troubleshooting section above or review the detailed documentation files.
