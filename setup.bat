@echo off
echo ========================================
echo fIndia AI - Quick Setup Script
echo ========================================
echo.

echo [1/4] Setting up Backend...
cd backend

echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo [2/4] Creating backend .env file...
if not exist .env (
    copy .env.example .env
    echo Created .env file. Please edit it with your credentials.
) else (
    echo .env already exists.
)

cd ..

echo.
echo [3/4] Setting up Frontend...
cd frontend

echo Installing Node.js dependencies...
call npm install

echo.
echo [4/4] Creating frontend .env file...
if not exist .env (
    copy .env.example .env
    echo Created .env file. Please edit it with your credentials.
) else (
    echo .env already exists.
)

cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Edit backend/.env with your MongoDB URI and Google Client ID
echo 2. Edit frontend/.env with your API URL and Google Client ID
echo 3. Start MongoDB: mongod
echo 4. Start Backend: cd backend ^&^& python main.py
echo 5. Start Frontend: cd frontend ^&^& npm run dev
echo.
echo Visit http://localhost:3000 to see the app!
echo ========================================

pause
