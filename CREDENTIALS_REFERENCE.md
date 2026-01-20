# 🔐 fIndia AI - Your Credentials Reference Card

## Quick Copy-Paste for .env Files

---

### Backend .env File
**Location**: `backend/.env`

```env
MONGODB_URI=mongodb+srv://mayurmdeekshithis24:mayur2006@cluster0.goytfdl.mongodb.net/?appName=Cluster0
JWT_SECRET_KEY=findia-ai-production-secret-key-2024-secure-random-hex-string
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
NEWS_API_KEY=YOUR_NEWS_API_KEY
GNEWS_API_KEY=
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=YOUR_APP_PASSWORD
PORT=8000
ENVIRONMENT=development
```

---

### Frontend .env File
**Location**: `frontend/.env`

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

---

### Google OAuth Configuration

**Console**: https://console.cloud.google.com

**Client ID**: `YOUR_GOOGLE_CLIENT_ID`

**Authorized JavaScript Origins** (add these):
```
http://localhost:3000
http://localhost:8000
```

**Authorized Redirect URIs** (add these):
```
http://localhost:3000
http://localhost:3000/
```

---

### MongoDB Atlas

**Connection URI**:
```
mongodb+srv://mayurmdeekshithis24:mayur2006@cluster0.goytfdl.mongodb.net/?appName=Cluster0
```

**Cluster**: Cluster0  
**Database**: findia_ai (auto-created)

---

### NewsAPI

**API Key**: `a171854e33a641cf9d57d3522a392cc6`  
**Dashboard**: https://newsapi.org/account

---

### Gmail SMTP

**Email**: mayurmdeekshithis24@gmail.com  
**App Password**: `dtlqhtxekxjlrdmf`

---

## 🚀 Quick Start Commands

```powershell
# 1. Create .env files (copy content from above)

# 2. Install backend dependencies
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# 3. Install frontend dependencies
cd ..\frontend
npm install

# 4. Start backend (Terminal 1)
cd backend
.\venv\Scripts\activate
python main.py

# 5. Start frontend (Terminal 2)
cd frontend
npm run dev

# 6. Open browser
# http://localhost:3000
```

---

## ✅ Checklist

- [ ] Created `backend/.env` with credentials above
- [ ] Created `frontend/.env` with credentials above
- [ ] Configured Google OAuth authorized origins
- [ ] Installed backend dependencies
- [ ] Installed frontend dependencies
- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] App accessible in browser

---

**All your credentials are ready to use!** 🎉

See `SETUP_WITH_YOUR_CREDENTIALS.md` for detailed step-by-step instructions.
