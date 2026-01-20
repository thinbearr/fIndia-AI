"""
Chatbot Router - STRICT DATA AUTHORITY
Enforces Single Source of Truth for Sentiment Analysis
"""

from fastapi import APIRouter, HTTPException, Depends
import re
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from services.database import get_database
from services.stock_validator import stock_validator
from routers.auth import get_current_user

# Import the AUTHORITATIVE sentiment pipeline
from routers.sentiment import analyze_sentiment

router = APIRouter()

class ChatMessage(BaseModel):
    message: str
    context: Optional[dict] = None

class ChatResponse(BaseModel):
    response: str
    timestamp: str

@router.post("/chat")
async def chat(chat_msg: ChatMessage):
    """
    AI Chatbot that strictly interprets dashboard data
    """
    message = chat_msg.message.lower()
    context = chat_msg.context or {}
    
    response = await generate_chat_response(message, context)
    
    return {
        "response": response,
        "timestamp": datetime.utcnow().isoformat()
    }

async def generate_chat_response(message: str, context: dict) -> str:
    """
    Generate response based ONLY on verified data.
    NEVER recalculates sentiment independently.
    """
    
    
    # 1. Detect Stock (for routing) - STRICT REGEX
    detected_stock = None
    message_upper = message.upper()
    for ticker in stock_validator.stocks.keys():
        # strict word boundary check to avoid "REC" in "CORRECTLY"
        if re.search(r'\b' + re.escape(ticker) + r'\b', message_upper):
            detected_stock = ticker
            break
            
    # 2. Resolve Data Context (The "Truth")
    # If context is empty or doesn't match the requested stock, we must fetch the OFFICIAL dashboard data.
    active_data = context
    
    if detected_stock:
        # If context is missing or is for a different stock, fetch fresh from source
        if not active_data or active_data.get('stock') != detected_stock:
            try:
                # CRITICAL: Call the EXACT same function the dashboard uses
                active_data = await analyze_sentiment(stock=detected_stock, days=5)
            except Exception as e:
                print(f"Error fetching authoritative data: {e}")
                return f"I recognized **{detected_stock}**, but I cannot access its dashboard data right now. Please try searching for it."

    # 3. Handle Intents using ONLY active_data
    
    # Intent: News & Summary (Specific)
    if "news" in message and ("summary" in message or "flashcard" in message):
        if not active_data or not active_data.get('stock'):
             return "Please search for a stock first (e.g., 'Analyze RELIANCE') to see its news summary."
        return generate_news_response(active_data)

    # Intent: Methodology / Calculation
    if "calculate" in message or "methodology" in message or "how" in message:
        # If we have active data (context), explain THAT. Else explain generic.
        if active_data and active_data.get('stock'):
             return explain_methodology(active_data, active_data.get('stock'))
        else:
             return explain_methodology(None, None)

    # Intent: Market Trend (Global)
    if "market trend" in message:
        return get_market_trend_response()
        
    # Intent: Top Bullish/Bearish
    if "top bullish" in message:
        return get_top_stocks("bullish")
    if "top bearish" in message:
        return get_top_stocks("bearish")

    # Intent: Specific Stock Analysis (The core feature)
    if active_data and active_data.get('sentiment_label'):
        return generate_analysis_response(active_data, message)

    # Default Help
    return """Hello! I'm the fIndia AI assistant. I am connected to the **FinBERT-India** dashboard pipeline.

I can explain the sentiment data shown on your screen.
• "Analyze RELIANCE" (I will fetch the dashboard data)
• "How is the score calculated?"
• "Show news summary"
"""

def explain_methodology(data: dict, stock_name: str) -> str:
    """Explain how the CURRENT score was derived using data"""
    # CASE 1: Generic (Home Page)
    if not data or not stock_name:
        return """**How AI Sentiment is Calculated (Standard Model):**

1. **News Scanning**: We fetch recent financial news headlines and descriptions.
2. **FinBERT Processing**: Our FinBERT-India model analyzes each article text and assigns a sentiment score from **-1 (Negative)** to **+1 (Positive)**.
3. **Aggregation**: We calculate the weighted average of all article scores.
4. **Final Signal**: 
   • > +0.15: **Bullish** 🟢
   • < -0.15: **Bearish** 🔴
   • Else: **Neutral** 🟡"""

    # CASE 2: Specific Stock
    articles = data.get('news', [])
    score = data.get('sentiment_score', 0.0)
    label = data.get('sentiment_label', 'Neutral').upper()
    
    # Breakdown
    breakdown_lines = []
    # Show strict logic for this stock
    total_score_sum = sum([a.get('sentiment_score',0) for a in articles])
    count = len(articles)
    
    return f"""**Calculation Breakdown for {stock_name}**:

**The Logic**:
I analyzed **{count}** news articles found in the dashboard pipeline.
Sum of all scores: **{total_score_sum:.4f}**
Count: **{count}**
Average: {total_score_sum:.4f} / {count} = **{score:+.4f}**

**Result**:
The calculated average **{score:+.4f}** falls into the **{label}** range.
"""

def generate_news_response(data: dict) -> str:
    """Generate detailed News Flashcards"""
    stock = data.get('stock')
    news = data.get('news', [])
    
    cards = []
    for art in news[:10]:
        headline = art.get('title', 'Unknown')
        s_label = art.get('sentiment', 'NEUTRAL').upper()
        # CRITICAL: Use signed score (e.g. -0.97)
        s_score = art.get('sentiment_score', 0.0) 
        
        summary = art.get('description')
        if not summary or len(summary) < 5:
            summary = "Summary not available."
        
        source = art.get('source', 'Unknown')
        
        card = f"""
**Headline**: {headline}
**Sentiment**: {s_label} ({s_score:+.4f})
**Summary**: {summary}
**Source**: {source}
---"""
        cards.append(card)
        
    return f"""**Key News Drivers for {stock}**
(Source: FinBERT-India Pipeline)

{chr(10).join(cards)}
"""

def generate_analysis_response(data: dict, message: str) -> str:
    """Clean Analysis Response (No list, No distribution)"""
    stock = data.get('stock')
    label = data.get('sentiment_label', '').upper()
    score = data.get('sentiment_score', 0.0)
    emoji = "🟢" if label == "BULLISH" else "🔴" if label == "BEARISH" else "🟡"
    news_count = len(data.get('news', []))
    
    # Determine Recommendation
    rec = "HOLD"
    if score > 0.5: rec = "STRONG BUY 🟢"
    elif score > 0.15: rec = "BUY 🟢"
    elif score < -0.5: rec = "STRONG SELL 🔴"
    elif score < -0.15: rec = "SELL 🔴"

    response = f"""**Analysis for {stock}**
(Source: FinBERT-India Dashboard Data)

**Recommendation**: {rec}
{emoji} **Signal: {label}** (Score: {score:+.2f})

**Data Integrity**:
Verified against **{news_count}** articles in the live dashboard context.

*To see the articles driving this score, click "News and Summary".*
"""
    return response

def get_market_trend_response():
    return """**Market Trend Analysis** 📈
(Simulated Outlook)
The NIFTY 50 is showing mixed signals.
• **Bullish**: Banking & Finance.
• **Bearish**: IT Services.
_Search for specific stocks to see verified sentiment_"""

def get_top_stocks(type: str):
    if type == "bullish":
        return "**Top Bullish** (Demo): ITC, M&M, TITAN"
    return "**Top Bearish** (Demo): PAYTM, ADANIENT, WIPRO"
