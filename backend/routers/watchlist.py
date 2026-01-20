"""
Watchlist Router
User watchlist management (requires authentication)
"""

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import List
from datetime import datetime
from services.database import get_database
from services.stock_validator import stock_validator

from bson import ObjectId

router = APIRouter()

class WatchlistItem(BaseModel):
    ticker: str

class WatchlistResponse(BaseModel):
    ticker: str
    company_name: str
    added_at: str

@router.post("/watchlist")
async def add_to_watchlist(
    item: WatchlistItem
):
    """Add stock to user's watchlist"""
    current_user = {"_id": "public_user_id"}
    """Add stock to user's watchlist"""
    
    # Validate ticker
    ticker = item.ticker.upper()
    if not stock_validator.validate_ticker(ticker):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid stock ticker: {ticker}"
        )
    
    company_name = stock_validator.get_company_name(ticker)
    user_id = str(current_user['_id'])
    
    db = get_database()
    
    # Check if already in watchlist
    existing = await db.watchlists.find_one({
        "user_id": user_id,
        "ticker": ticker
    })
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"{ticker} is already in your watchlist"
        )
    
    # Add to watchlist
    watchlist_doc = {
        "user_id": user_id,
        "ticker": ticker,
        "company_name": company_name,
        "added_at": datetime.utcnow()
    }
    
    await db.watchlists.insert_one(watchlist_doc)
    
    return {
        "message": f"Added {ticker} to watchlist",
        "ticker": ticker,
        "company_name": company_name
    }

@router.get("/watchlist")
async def get_watchlist():
    """Get user's watchlist"""
    current_user = {"_id": "public_user_id"}
    
    user_id = str(current_user['_id'])
    db = get_database()
    
    cursor = db.watchlists.find({"user_id": user_id}).sort("added_at", -1)
    watchlist = await cursor.to_list(length=100)
    
    return {
        "watchlist": [
            {
                "ticker": item['ticker'],
                "company_name": item['company_name'],
                "added_at": item['added_at'].isoformat()
            }
            for item in watchlist
        ],
        "count": len(watchlist)
    }

@router.delete("/watchlist/{ticker}")
async def remove_from_watchlist(
    ticker: str
):
    current_user = {"_id": "public_user_id"}
    """Remove stock from watchlist"""
    
    user_id = str(current_user['_id'])
    ticker = ticker.upper()
    
    db = get_database()
    result = await db.watchlists.delete_one({
        "user_id": user_id,
        "ticker": ticker
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail=f"{ticker} not found in watchlist"
        )
    
    return {
        "message": f"Removed {ticker} from watchlist",
        "ticker": ticker
    }
