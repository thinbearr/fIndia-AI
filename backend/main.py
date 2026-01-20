"""
fIndia AI - Production Backend (Reloaded)
FastAPI server for Indian stock market sentiment analysis
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers
from routers import sentiment, watchlist, chat, auth, search

app = FastAPI(
    title="fIndia AI API",
    description="Bloomberg-style AI intelligence terminal for Indian stock markets",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/")
async def root():
    return {
        "app": "fIndia AI",
        "status": "operational",
        "version": "1.0.0",
        "description": "Bloomberg-style AI intelligence terminal for Indian stock markets"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(search.router, prefix="/api", tags=["Search"])
app.include_router(sentiment.router, prefix="/api", tags=["Sentiment"])
app.include_router(watchlist.router, prefix="/api", tags=["Watchlist"])
app.include_router(chat.router, prefix="/api", tags=["Chatbot"])

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
