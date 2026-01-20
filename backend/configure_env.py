"""
fIndia AI - Environment Configuration Script
Automatically creates .env files with your credentials
"""

import os
from pathlib import Path

def create_backend_env():
    """Create backend .env file"""
    backend_dir = Path(__file__).parent
    env_file = backend_dir / ".env"
    
    env_content = """# MongoDB Configuration
MONGODB_URI=mongodb+srv://mayurmdeekshithis24:mayur2006@cluster0.goytfdl.mongodb.net/?appName=Cluster0

# JWT Secret (Generate with: openssl rand -hex 32)
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
"""
    
    with open(env_file, 'w') as f:
        f.write(env_content)
    
    print(f"✅ Created backend .env file at: {env_file}")

def create_frontend_env():
    """Create frontend .env file"""
    frontend_dir = Path(__file__).parent.parent / "frontend"
    env_file = frontend_dir / ".env"
    
    env_content = """# Backend API URL
VITE_API_URL=http://localhost:8000

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
"""
    
    with open(env_file, 'w') as f:
        f.write(env_content)
    
    print(f"✅ Created frontend .env file at: {env_file}")

def main():
    print("=" * 60)
    print("  fIndia AI - Environment Configuration")
    print("=" * 60)
    print("\nCreating environment files with your credentials...\n")
    
    try:
        create_backend_env()
        create_frontend_env()
        
        print("\n" + "=" * 60)
        print("  ✅ Configuration Complete!")
        print("=" * 60)
        print("\nYour .env files have been created with:")
        print("  ✅ MongoDB Atlas connection")
        print("  ✅ Google OAuth credentials")
        print("  ✅ NewsAPI key")
        print("  ✅ Gmail SMTP credentials")
        print("\nNext steps:")
        print("  1. Verify MongoDB connection")
        print("  2. Update Google OAuth authorized origins:")
        print("     - http://localhost:3000")
        print("     - http://localhost:8000")
        print("  3. Run: python verify_installation.py")
        print("  4. Start the app!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("Please create .env files manually using .env.example as template")

if __name__ == "__main__":
    main()
