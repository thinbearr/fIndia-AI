@echo off
echo ========================================
echo fIndia AI - Environment Configuration
echo ========================================
echo.
echo Creating backend .env file...

(
echo # MongoDB Configuration
echo MONGODB_URI=mongodb+srv://mayurmdeekshithis24:mayur2006@cluster0.goytfdl.mongodb.net/?appName=Cluster0
echo.
echo # JWT Secret
echo JWT_SECRET_KEY=findia-ai-production-secret-key-2024-secure-random-hex-string
echo.
echo # Google OAuth
echo GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
echo GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
echo.
echo # News APIs
echo NEWS_API_KEY=YOUR_NEWS_API_KEY
echo GNEWS_API_KEY=
echo.
echo # Gmail SMTP
echo GMAIL_USER=your-email@gmail.com
echo GMAIL_APP_PASSWORD=YOUR_APP_PASSWORD
echo.
echo # Server Configuration
echo PORT=8000
echo ENVIRONMENT=development
) > .env

echo Created backend\.env

echo.
echo Creating frontend .env file...

(
echo # Backend API URL
echo VITE_API_URL=http://localhost:8000
echo.
echo # Google OAuth Client ID
echo VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
) > ..\frontend\.env

echo Created frontend\.env

echo.
echo ========================================
echo Configuration Complete!
echo ========================================
echo.
echo Your .env files have been created with:
echo   - MongoDB Atlas connection
echo   - Google OAuth credentials
echo   - NewsAPI key
echo   - Gmail SMTP credentials
echo.
echo IMPORTANT: Update Google OAuth Settings
echo.
echo Go to: https://console.cloud.google.com
echo Navigate to: APIs ^& Services ^> Credentials
echo Edit your OAuth 2.0 Client ID
echo.
echo Add these Authorized JavaScript origins:
echo   - http://localhost:3000
echo   - http://localhost:8000
echo.
echo Add these Authorized redirect URIs:
echo   - http://localhost:3000
echo   - http://localhost:3000/
echo.
echo ========================================
echo.
pause
