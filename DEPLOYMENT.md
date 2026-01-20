# fIndia AI - Deployment Guide

## 🚀 Railway Deployment (Recommended)

### Prerequisites
- Railway account ([railway.app](https://railway.app))
- MongoDB Atlas account ([mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas))
- Google Cloud Console project with OAuth credentials
- GitHub repository

---

## Step 1: MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Free" tier (M0)
   - Select region closest to your Railway deployment
   - Name: `findia-ai-cluster`

3. **Create Database User**
   - Database Access → Add New Database User
   - Username: `findia_admin`
   - Password: Generate secure password
   - Database User Privileges: Read and write to any database

4. **Whitelist IP Addresses**
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, restrict to Railway IPs

5. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy connection string:
     ```
     mongodb+srv://findia_admin:<password>@findia-ai-cluster.xxxxx.mongodb.net/findia_ai?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password

---

## Step 2: Google OAuth Setup

1. **Go to Google Cloud Console**
   - Visit [console.cloud.google.com](https://console.cloud.google.com)

2. **Create New Project**
   - Project name: `fIndia-AI`

3. **Enable APIs**
   - APIs & Services → Library
   - Search and enable: "Google+ API"

4. **Create OAuth Credentials**
   - APIs & Services → Credentials
   - Create Credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Name: `fIndia AI Web Client`

5. **Configure OAuth Consent Screen**
   - User Type: External
   - App name: `fIndia AI`
   - User support email: your email
   - Developer contact: your email

6. **Add Authorized Origins**
   ```
   http://localhost:3000
   https://your-frontend-domain.vercel.app
   ```

7. **Add Authorized Redirect URIs**
   ```
   http://localhost:3000
   https://your-frontend-domain.vercel.app
   ```

8. **Copy Client ID**
   - Save the Client ID for environment variables

---

## Step 3: Backend Deployment (Railway)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Dashboard → New Project
   - Deploy from GitHub repo
   - Select your `fIndia-AI` repository

3. **Configure Build Settings**
   - Root Directory: `/backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python main.py`

4. **Add Environment Variables**
   - Settings → Variables
   - Add the following:

   ```env
   MONGODB_URI=mongodb+srv://findia_admin:<password>@findia-ai-cluster.xxxxx.mongodb.net/findia_ai
   JWT_SECRET_KEY=<generate-with-openssl-rand-hex-32>
   GOOGLE_CLIENT_ID=<your-google-client-id>.apps.googleusercontent.com
   PORT=8000
   ENVIRONMENT=production
   ```

   **Generate JWT Secret:**
   ```bash
   openssl rand -hex 32
   ```

5. **Deploy**
   - Railway will automatically deploy
   - Wait for deployment to complete
   - Copy the deployment URL: `https://your-app.railway.app`

6. **Verify Deployment**
   - Visit: `https://your-app.railway.app/health`
   - Should return: `{"status": "healthy"}`

---

## Step 4: Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Update Frontend .env**
   ```env
   VITE_API_URL=https://your-app.railway.app
   VITE_GOOGLE_CLIENT_ID=<your-google-client-id>.apps.googleusercontent.com
   ```

3. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

4. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

   Or use Vercel Dashboard:
   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Add environment variables

5. **Configure Environment Variables on Vercel**
   - Settings → Environment Variables
   - Add:
     - `VITE_API_URL`: Your Railway backend URL
     - `VITE_GOOGLE_CLIENT_ID`: Your Google Client ID

6. **Update Google OAuth**
   - Add Vercel URL to authorized origins in Google Console

---

## Step 5: Testing Production Deployment

1. **Test Backend**
   ```bash
   curl https://your-app.railway.app/health
   ```

2. **Test Frontend**
   - Visit your Vercel URL
   - Search for a stock (e.g., "RELIANCE")
   - Verify sentiment analysis works
   - Test Google Sign-In
   - Add stock to watchlist

3. **Check Logs**
   - Railway: Dashboard → Deployments → Logs
   - Vercel: Dashboard → Deployments → Function Logs

---

## Alternative: Deploy Frontend to Railway

If you prefer to deploy both on Railway:

1. **Create New Railway Service**
   - Add service → GitHub Repo
   - Root Directory: `frontend`

2. **Configure**
   - Build Command: `npm run build`
   - Start Command: `npm run preview`

3. **Add Environment Variables**
   ```env
   VITE_API_URL=https://backend-service.railway.app
   VITE_GOOGLE_CLIENT_ID=<client-id>
   ```

---

## Step 6: Custom Domain (Optional)

### Railway
1. Settings → Domains
2. Add custom domain
3. Update DNS records as instructed

### Vercel
1. Settings → Domains
2. Add domain
3. Configure DNS

---

## Environment Variables Summary

### Backend (Railway)
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET_KEY=<32-char-hex>
GOOGLE_CLIENT_ID=<client-id>.apps.googleusercontent.com
NEWS_API_KEY=<optional>
GNEWS_API_KEY=<optional>
PORT=8000
ENVIRONMENT=production
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.railway.app
VITE_GOOGLE_CLIENT_ID=<client-id>.apps.googleusercontent.com
```

---

## Troubleshooting

### Backend Issues

**FinBERT Model Not Loading**
- Ensure `models/finbert-india/` is in repository
- Check Railway build logs
- Model files must be committed to Git

**MongoDB Connection Failed**
- Verify connection string
- Check IP whitelist (0.0.0.0/0)
- Ensure database user has correct permissions

**CORS Errors**
- Update `allow_origins` in `main.py` to include frontend URL
- Restart Railway service

### Frontend Issues

**API Calls Failing**
- Verify `VITE_API_URL` is correct
- Check Railway backend is running
- Inspect browser console for errors

**Google Sign-In Not Working**
- Verify Client ID matches
- Check authorized origins in Google Console
- Ensure HTTPS in production

---

## Monitoring

### Railway
- Dashboard → Metrics
- CPU, Memory, Network usage
- Deployment logs

### MongoDB Atlas
- Clusters → Metrics
- Database operations
- Connection count

---

## Scaling

### Railway
- Settings → Resources
- Upgrade plan for more resources
- Enable autoscaling

### MongoDB Atlas
- Upgrade cluster tier
- Enable sharding for large datasets

---

## Security Checklist

- ✅ HTTPS enabled (automatic on Railway/Vercel)
- ✅ Environment variables secured
- ✅ MongoDB IP whitelist configured
- ✅ JWT secret is strong and random
- ✅ Google OAuth properly configured
- ✅ CORS restricted to frontend domain
- ✅ No sensitive data in Git

---

## Cost Estimate

### Free Tier
- **Railway**: $5 credit/month (enough for hobby projects)
- **MongoDB Atlas**: Free M0 cluster (512MB)
- **Vercel**: Unlimited for personal projects
- **Total**: $0/month for small usage

### Production
- **Railway**: ~$20-50/month
- **MongoDB Atlas**: ~$10-30/month
- **Vercel**: Free or $20/month for team
- **Total**: ~$30-100/month

---

## Backup Strategy

### MongoDB
1. Atlas → Clusters → Backup
2. Enable continuous backup
3. Configure snapshot schedule

### Code
- Git repository (GitHub)
- Regular commits
- Tagged releases

---

## CI/CD

Railway and Vercel automatically deploy on Git push:

1. Push to `main` branch
2. Automatic build and deploy
3. Zero-downtime deployment

---

## Support

- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB**: [docs.mongodb.com](https://docs.mongodb.com)

---

**Deployment Complete!** 🎉

Your fIndia AI application is now live and production-ready.
