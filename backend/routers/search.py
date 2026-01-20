"""
Search Router
Stock search and autocomplete
"""

from fastapi import APIRouter, Query
from typing import List
from services.stock_validator import stock_validator

router = APIRouter()

@router.get("/search")
async def search_stocks(q: str = Query(..., min_length=1, description="Search query")):
    """
    Search for Indian stocks by ticker or company name
    Returns autocomplete suggestions
    """
    results = stock_validator.search_stocks(q, limit=10)
    
    return {
        "query": q,
        "results": results,
        "count": len(results)
    }

@router.get("/stocks")
async def get_all_stocks():
    """Get all available Indian stocks"""
    stocks = stock_validator.get_all_stocks()
    
    return {
        "stocks": stocks,
        "count": len(stocks)
    }

@router.get("/validate/{ticker}")
async def validate_ticker(ticker: str):
    """Validate if ticker is a real Indian stock"""
    is_valid = stock_validator.validate_ticker(ticker)
    company_name = stock_validator.get_company_name(ticker)
    
    if not is_valid:
        return {
            "valid": False,
            "ticker": ticker.upper(),
            "message": "Invalid ticker. Please use a valid Indian stock ticker."
        }
    
    return {
        "valid": True,
        "ticker": ticker.upper(),
        "company_name": company_name
    }
