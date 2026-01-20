# 🚀 fIndia AI - Complete Setup Guide with Your Credentials

## ✅ Your Credentials Have Been Received

I have your credentials ready to configure:
- ✅ MongoDB Atlas URI
- ✅ Google OAuth Client ID & Secret
- ✅ NewsAPI Key
- ✅ Gmail SMTP credentials

---

## 📝 STEP 1: Create Backend Environment File

**Location**: `backend/.env`

**Action**: Create a new file called `.env` in the `backend` folder and paste this content:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://mayurmdeekshithis24:mayur2006@cluster0.goytfdl.mongodb.net/?appName=Cluster0

# JWT Secret
JWT_SECRET_KEY=findia-ai-production-secret-key-2024-secure-random-hex-string

# Google OAuth
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# News APIs
NEWS_API_KEY=YOUR_NEWS_API_KEY
GNEWS_API_KEY=

# Gmail SMTP (for alerts)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=YOUR_APP_PASSWORD

# Server Configuration
PORT=8000
ENVIRONMENT=development
```

**How to create**:
1. Open `backend` folder
2. Right-click → New → Text Document
3. Name it `.env` (remove .txt extension)
4. Open with Notepad
5. Paste the content above
6. Save and close

---

## 📝 STEP 2: Create Frontend Environment File

**Location**: `frontend/.env`

**Action**: Create a new file called `.env` in the `frontend` folder and paste this content:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

**How to create**:
1. Open `frontend` folder
2. Right-click → New → Text Document
3. Name it `.env` (remove .txt extension)
4. Open with Notepad
5. Paste the content above
6. Save and close

---

## 🔐 STEP 3: Configure Google OAuth (CRITICAL!)

Your Google OAuth credentials won't work until you configure the authorized origins.

### Go to Google Cloud Console

1. Visit: https://console.cloud.google.com
2. Select your project (or the project where you created the OAuth credentials)
3. Navigate to: **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID: `YOUR_GOOGLE_CLIENT_ID`
5. Click the **Edit** button (pencil icon)

### Add Authorized JavaScript Origins

In the "Authorized JavaScript origins" section, add:
```
http://localhost:3000
http://localhost:8000
```

### Add Authorized Redirect URIs

In the "Authorized redirect URIs" section, add:
```
http://localhost:3000
http://localhost:3000/
```

### Save Changes

Click **SAVE** at the bottom

**⚠️ Important**: Changes may take 5-10 minutes to propagate. If Google Sign-In doesn't work immediately, wait a few minutes and try again.

---

## 📦 STEP 4: Install Dependencies

### Backend Dependencies

Open PowerShell/Command Prompt in the `backend` folder:

```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**If Python is not found**, install Python 3.9+ from [python.org](https://python.org)

### Frontend Dependencies

Open PowerShell/Command Prompt in the `frontend` folder:

```powershell
# Install dependencies
npm install
```

**If npm is not found**, install Node.js 18+ from [nodejs.org](https://nodejs.org)

---

## 🗄️ STEP 5: Verify MongoDB Connection

Your MongoDB Atlas cluster is already configured. Let's verify it works:

### Test Connection

Create a file `backend/test_mongo.py`:

```python
from pymongo import MongoClient

uri = "mongodb+srv://mayurmdeekshithis24:mayur2006@cluster0.goytfdl.mongodb.net/?appName=Cluster0"

try:
    client = MongoClient(uri)
    client.admin.command('ping')
    print("✅ MongoDB connection successful!")
    print(f"Databases: {client.list_database_names()}")
    client.close()
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
```

Run it:
```powershell
cd backend
python test_mongo.py
```

Expected output: `✅ MongoDB connection successful!`

---

## 🚀 STEP 6: Start the Application

### Terminal 1: Start Backend

```powershell
cd backend
.\venv\Scripts\activate
python main.py
```

**Expected output**:
```
✅ Connected to MongoDB
✅ FinBERT-India model loaded successfully
✅ Loaded 50+ Indian stocks
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Test backend**: Open browser → `http://localhost:8000/health`

Should see: `{"status": "healthy"}`

### Terminal 2: Start Frontend

Open a **NEW** PowerShell window:

```powershell
cd frontend
npm run dev
```

**Expected output**:
```
VITE v5.0.8  ready in 500 ms
➜  Local:   http://localhost:3000/
```

---

## 🎯 STEP 7: Test the Application

### Open Browser

Visit: `http://localhost:3000`

### Test Features

1. **Stock Search**:
   - Type "RELIANCE" in search box
   - Select from dropdown
   - Should see sentiment analysis

2. **Sentiment Analysis**:
   - Should show Bullish/Bearish/Neutral
   - Should display news articles
   - Should show stock statistics
   - Should display price chart

3. **Google Sign-In**:
   - Click "Sign in with Google" button
   - Sign in with your Google account
   - Should redirect back to app
   - Should see your profile picture

4. **Watchlist** (after sign-in):
   - Click "Add to Watchlist" on any stock
   - Go to "Watchlist" tab
   - Should see your saved stocks

5. **Chatbot**:
   - Click chat button (bottom right)
   - Ask: "What's the sentiment for RELIANCE?"
   - Should get AI response

---

## 🐛 Troubleshooting

### Backend won't start

**Error: `ModuleNotFoundError: No module named 'fastapi'`**

Solution:
```powershell
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
```

**Error: `MongoDB connection failed`**

Solution:
- Check your internet connection
- Verify MongoDB URI is correct in `.env`
- Check MongoDB Atlas cluster is running

**Error: `FinBERT model not found`**

Solution:
- Verify `models/finbert-india/` folder exists
- Check all model files are present:
  - config.json
  - model.safetensors
  - tokenizer.json
  - vocab.txt

### Frontend won't start

**Error: `Cannot find module`**

Solution:
```powershell
cd frontend
rm -r node_modules
rm package-lock.json
npm install
```

**Error: `VITE_API_URL is not defined`**

Solution:
- Verify `frontend/.env` file exists
- Check it contains `VITE_API_URL=http://localhost:8000`

### Google Sign-In not working

**Error: `Invalid origin`**

Solution:
1. Go to Google Cloud Console
2. Add `http://localhost:3000` to Authorized JavaScript origins
3. Wait 5-10 minutes for changes to propagate
4. Clear browser cache
5. Try again

**Error: `redirect_uri_mismatch`**

Solution:
1. Add `http://localhost:3000` to Authorized redirect URIs
2. Make sure there's no trailing slash difference

### API calls failing

**Error: `Network Error` or `CORS error`**

Solution:
1. Verify backend is running on port 8000
2. Check `frontend/.env` has correct `VITE_API_URL`
3. Restart frontend: `npm run dev`

---

## ✅ Success Checklist

- [ ] Backend `.env` file created
- [ ] Frontend `.env` file created
- [ ] Google OAuth origins configured
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] MongoDB connection verified
- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Can search for stocks
- [ ] Sentiment analysis works
- [ ] News articles load
- [ ] Charts display
- [ ] Google Sign-In works
- [ ] Watchlist works
- [ ] Chatbot responds

---

## 🎉 You're All Set!

Once all checks pass, you have a fully functional **fIndia AI** application with:

✅ Real MongoDB Atlas database  
✅ Google OAuth authentication  
✅ Real financial news (NewsAPI)  
✅ FinBERT-India sentiment analysis  
✅ Watchlist features  
✅ AI chatbot  
✅ Professional Bloomberg-style UI  

---

## 📞 Need Help?

1. Check the troubleshooting section above
2. Review `QUICKSTART.md` for detailed setup
3. Check `README.md` for architecture details
4. Review backend terminal output for errors
5. Check browser console (F12) for frontend errors

---

## 🚀 Next Steps

Once the app is working locally:

1. **Test all features** thoroughly
2. **Deploy to production** (follow `DEPLOYMENT.md`)
3. **Customize** the app for your needs
4. **Add more stocks** to the validator
5. **Enhance** the chatbot with more responses

---

**Your credentials are configured and ready!** 🎊

Just create the two `.env` files as shown above and you're good to go!
