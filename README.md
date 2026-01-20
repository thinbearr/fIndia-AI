# fIndia AI 🚀

**Bloomberg-Style AI Intelligence Terminal for Indian Stock Markets**

A production-grade fintech application powered by a custom fine-tuned **FinBERT-India** model for sentiment analysis of Indian stocks.

![fIndia AI](https://img.shields.io/badge/Status-Production-green)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![React](https://img.shields.io/badge/React-18.2-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)

---

## 🎯 Overview

fIndia AI is a **real financial intelligence platform** that provides:

- ✅ **AI-Powered Sentiment Analysis** using custom FinBERT-India model
- ✅ **Real Indian Stock Data** from NSE/BSE via Yahoo Finance
- ✅ **Live Financial News** from Economic Times, Moneycontrol, Business Standard
- ✅ **Google OAuth Authentication**
- ✅ **Personalized Watchlists** with MongoDB storage
- ✅ **AI Chatbot** with context awareness
- ✅ **Production-Ready** deployment on Railway

---

## 🏗️ Architecture

```
fIndia-AI/
├── backend/                    # FastAPI Python Backend
│   ├── main.py                # Application entry point
│   ├── routers/               # API endpoints
│   │   ├── auth.py           # Google OAuth + JWT
│   │   ├── search.py         # Stock search
│   │   ├── sentiment.py      # FinBERT sentiment analysis
│   │   ├── watchlist.py      # User watchlists
│   │   └── chat.py           # AI chatbot
│   ├── services/              # Business logic
│   │   ├── database.py       # MongoDB connection
│   │   ├── finbert_service.py # FinBERT-India model
│   │   ├── news_service.py   # News fetching
│   │   ├── stock_validator.py # Stock validation
│   │   └── stock_data_service.py # Yahoo Finance
│   └── requirements.txt       # Python dependencies
│
├── models/
│   └── finbert-india/         # Custom fine-tuned model
│       ├── config.json
│       ├── model.safetensors
│       ├── tokenizer.json
│       └── vocab.txt
│
├── frontend/                   # React + TypeScript Frontend
│   ├── src/
│   │   ├── App.tsx           # Main application
│   │   ├── api.ts            # API service layer
│   │   ├── AuthContext.tsx   # Authentication context
│   │   ├── Chatbot.tsx       # AI chatbot component
│   │   ├── index.css         # Bloomberg-style design
│   │   └── main.tsx          # React entry point
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## 🚀 Features

### **Pre-Login (Public Access)**
- 🔍 Stock search with autocomplete
- 📊 Sentiment analysis for any Indian stock
- 📰 Real-time news with sentiment scores
- 📈 Price charts and stock statistics
- 💬 Generic AI chatbot

### **Post-Login (Authenticated)**
- 🔐 Google Sign-In
- ⭐ Personalized watchlists
- 📧 Gmail alerts for sentiment changes
- 📊 Advanced charting
- 🤖 Personalized AI chatbot with memory

---

## 🛠️ Tech Stack

### **Backend**
- **Framework**: FastAPI (Python 3.9+)
- **Database**: MongoDB
- **ML Model**: HuggingFace Transformers (FinBERT-India)
- **Stock Data**: Yahoo Finance (yfinance)
- **News**: NewsAPI, GNews API
- **Authentication**: Google OAuth 2.0 + JWT

### **Frontend**
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Styling**: Pure CSS (Glassmorphism, Bloomberg-style)
- **Font**: Playfair Display (Canela alternative)

### **Deployment**
- **Platform**: Railway
- **Database**: MongoDB Atlas
- **CI/CD**: Automatic deployment from Git

---

## 📦 Installation

### **Prerequisites**
- Python 3.9+
- Node.js 18+
- MongoDB (local or Atlas)
- Google Cloud Console account (for OAuth)

### **1. Clone Repository**
```bash
git clone <repository-url>
cd fIndia-AI-main
```

### **2. Backend Setup**

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your credentials
```

**Backend `.env` Configuration:**
```env
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET_KEY=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEWS_API_KEY=your-newsapi-key (optional)
GNEWS_API_KEY=your-gnews-key (optional)
PORT=8000
```

### **3. Frontend Setup**

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

**Frontend `.env` Configuration:**
```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### **4. Google OAuth Setup**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins:
   - `http://localhost:3000`
   - `https://yourdomain.com` (production)
6. Add authorized redirect URIs
7. Copy Client ID to `.env` files

---

## 🎮 Running Locally

### **Start Backend**
```bash
cd backend
python main.py
```
Backend runs on `http://localhost:8000`

### **Start Frontend**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

### **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

---

## 🧪 Testing the Application

1. **Open** `http://localhost:3000`
2. **Search** for an Indian stock (e.g., "RELIANCE", "INFY", "TCS")
3. **View** AI-powered sentiment analysis
4. **Sign in** with Google to access watchlist features
5. **Chat** with the AI assistant

---

## 🌐 Deployment (Railway)

### **Backend Deployment**

1. Create new project on [Railway](https://railway.app)
2. Connect GitHub repository
3. Add MongoDB plugin
4. Set environment variables:
   ```
   MONGODB_URI=<railway-mongodb-uri>
   JWT_SECRET_KEY=<generate-secure-key>
   GOOGLE_CLIENT_ID=<your-client-id>
   PORT=8000
   ```
5. Deploy from `backend/` directory
6. Note the deployment URL

### **Frontend Deployment**

1. Update `VITE_API_URL` in frontend `.env` to backend URL
2. Build frontend:
   ```bash
   cd frontend
   npm run build
   ```
3. Deploy `dist/` folder to:
   - Vercel
   - Netlify
   - Railway (static site)

---

## 📊 API Endpoints

### **Public Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?q={query}` | Search stocks |
| GET | `/api/sentiment?stock={ticker}` | Get sentiment analysis |
| POST | `/api/chat` | Chat with AI |

### **Authenticated Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/google` | Google OAuth login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/watchlist` | Get user watchlist |
| POST | `/api/watchlist` | Add to watchlist |
| DELETE | `/api/watchlist/{ticker}` | Remove from watchlist |

---

## 🤖 FinBERT-India Model

The application uses a **custom fine-tuned FinBERT model** specifically trained on Indian financial news.

**Model Location**: `models/finbert-india/`

**How it works**:
1. Fetches real-time news for the stock
2. Processes each headline through FinBERT-India
3. Classifies sentiment: POSITIVE, NEGATIVE, NEUTRAL
4. Aggregates scores to determine: BULLISH, BEARISH, NEUTRAL
5. Generates AI explanation

**No external APIs** - all sentiment analysis is done locally using the fine-tuned model.

---

## 🎨 Design Philosophy

- **Bloomberg-Inspired**: Professional financial terminal aesthetic
- **Glassmorphism**: Modern frosted glass effects
- **Dark Mode First**: Optimized for extended viewing
- **Futuristic**: Vibrant green/teal accents
- **Responsive**: Mobile-first design
- **Accessible**: WCAG 2.1 compliant

---

## 🔒 Security

- ✅ Google OAuth 2.0 authentication
- ✅ JWT token-based authorization
- ✅ HTTPS in production
- ✅ Environment variable protection
- ✅ Input validation and sanitization
- ✅ MongoDB injection prevention

---

## 📈 Stock Validation

**Only real Indian stocks are allowed**. The system validates against:

- 50+ major NSE/BSE stocks
- IT, Banking, Energy, Automotive, Pharma sectors
- Real-time validation before analysis

**Invalid tickers are rejected** with clear error messages.

---

## 🧩 Key Components

### **Backend Services**

1. **FinBERT Service**: Loads and runs the fine-tuned model
2. **News Service**: Fetches from NewsAPI, GNews, with fallback
3. **Stock Data Service**: Yahoo Finance integration
4. **Stock Validator**: Validates Indian stock tickers
5. **Database Service**: MongoDB async operations

### **Frontend Components**

1. **App.tsx**: Main application with sentiment display
2. **Chatbot.tsx**: Floating AI assistant
3. **AuthContext.tsx**: Authentication state management
4. **api.ts**: Centralized API calls
5. **index.css**: Complete design system

---

## 🐛 Troubleshooting

### **FinBERT Model Not Loading**
- Ensure `models/finbert-india/` exists in project root
- Check file permissions
- Verify all model files are present

### **MongoDB Connection Failed**
- Check MongoDB is running
- Verify `MONGODB_URI` in `.env`
- For Atlas, whitelist your IP

### **Google Sign-In Not Working**
- Verify `GOOGLE_CLIENT_ID` is correct
- Check authorized origins in Google Console
- Ensure HTTPS in production

### **Stock Data Not Loading**
- Yahoo Finance may rate-limit; wait and retry
- Check internet connection
- Verify ticker is valid Indian stock

---

## 📝 Environment Variables Summary

### **Backend**
```env
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET_KEY=<secure-random-key>
GOOGLE_CLIENT_ID=<google-oauth-client-id>
NEWS_API_KEY=<optional>
GNEWS_API_KEY=<optional>
PORT=8000
```

### **Frontend**
```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=<google-oauth-client-id>
```

---

## 🎓 Academic Use

This project is suitable for:
- Final year projects
- ML/AI demonstrations
- Full-stack portfolio
- Fintech research
- Startup MVP

**Key Highlights**:
- Custom ML model integration
- Production-grade architecture
- Real-world data sources
- Complete authentication flow
- Scalable deployment

---

## 🚀 Future Enhancements

- [ ] Email alerts for sentiment changes
- [ ] Portfolio tracking
- [ ] Technical indicators
- [ ] Comparison charts
- [ ] Export reports (PDF)
- [ ] Mobile app (React Native)
- [ ] More Indian stocks (500+)
- [ ] Historical sentiment trends

---

## 📄 License

This project is for educational and academic purposes.

---

## 👨‍💻 Developer

Built with ❤️ for Indian stock market enthusiasts.

**Tech Stack**: React, TypeScript, FastAPI, MongoDB, FinBERT, Railway

---

## 🙏 Acknowledgments

- **FinBERT**: ProsusAI/finbert
- **Yahoo Finance**: Stock data
- **HuggingFace**: Transformers library
- **Google**: OAuth authentication
- **MongoDB**: Database
- **Railway**: Deployment platform

---

## 📞 Support

For issues or questions:
1. Check this README
2. Review code comments
3. Check Railway logs
4. Verify environment variables

---

**fIndia AI** - Professional AI Intelligence for Indian Markets 🇮🇳
