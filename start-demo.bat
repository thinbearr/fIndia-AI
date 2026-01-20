@echo off
echo ========================================
echo fIndia AI - Localhost Demo Setup
echo ========================================
echo.
echo This will:
echo 1. Start your backend on localhost:8000
echo 2. Start your frontend on localhost:3000  
echo 3. Expose backend to internet via ngrok
echo.
pause

echo.
echo [1/3] Starting Backend...
start cmd /k "cd backend && venv\Scripts\activate && python main.py"

timeout /t 5 /nobreak >nul

echo [2/3] Starting Frontend...
start cmd /k "cd frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo [3/3] Starting ngrok tunnel...
echo.
echo IMPORTANT: Copy the ngrok URL and update frontend .env:
echo VITE_API_URL=https://YOUR-NGROK-URL
echo.
start cmd /k "ngrok http 8000"

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Three windows opened:
echo 1. Backend (localhost:8000)
echo 2. Frontend (localhost:3000)
echo 3. Ngrok (public URL)
echo.
echo Copy the ngrok HTTPS URL from window 3
echo and update frontend\.env with it.
echo.
pause
