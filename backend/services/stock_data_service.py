"""
Stock Data Service
Fetches real-time stock data from Yahoo Finance
"""

import yfinance as yf
from typing import Dict, Optional, List
from datetime import datetime, timedelta

class StockDataService:
    
    def get_stock_info(self, ticker: str) -> Dict:
        """
        Get comprehensive stock information
        """
        try:
            # Add .NS for NSE stocks (National Stock Exchange of India)
            stock_symbol = f"{ticker}.NS"
            stock = yf.Ticker(stock_symbol)
            info = stock.info
            
            # Extract key metrics
            return {
                'ticker': ticker,
                'company_name': info.get('longName', info.get('shortName', ticker)),
                'current_price': info.get('currentPrice', info.get('regularMarketPrice', 0)),
                'previous_close': info.get('previousClose', 0),
                'open': info.get('open', 0),
                'day_high': info.get('dayHigh', 0),
                'day_low': info.get('dayLow', 0),
                'volume': info.get('volume', 0),
                'market_cap': info.get('marketCap', 0),
                'pe_ratio': info.get('trailingPE', 0),
                'eps': info.get('trailingEps', 0),
                'week_52_high': info.get('fiftyTwoWeekHigh', 0),
                'week_52_low': info.get('fiftyTwoWeekLow', 0),
                'dividend_yield': info.get('dividendYield', 0),
                'beta': info.get('beta', 0),
                'sector': info.get('sector', 'N/A'),
                'industry': info.get('industry', 'N/A'),
                'currency': info.get('currency', 'INR')
            }
            
        except Exception as e:
            print(f"Error fetching stock data for {ticker}: {e}")
            return {
                'ticker': ticker,
                'error': str(e),
                'current_price': 0,
                'market_cap': 0,
                'pe_ratio': 0
            }
    
    def get_historical_data(self, ticker: str, period: str = "1mo") -> List[Dict]:
        """
        Get historical stock data
        period: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
        """
        try:
            stock_symbol = f"{ticker}.NS"
            stock = yf.Ticker(stock_symbol)
            hist = stock.history(period=period)
            
            # Convert to list of dicts
            data = []
            for date, row in hist.iterrows():
                data.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'open': round(row['Open'], 2),
                    'high': round(row['High'], 2),
                    'low': round(row['Low'], 2),
                    'close': round(row['Close'], 2),
                    'volume': int(row['Volume'])
                })
            
            return data
            
        except Exception as e:
            print(f"Error fetching historical data for {ticker}: {e}")
            return []
    
    def get_price_change(self, ticker: str) -> Dict:
        """Get price change information"""
        try:
            info = self.get_stock_info(ticker)
            current = info.get('current_price', 0)
            previous = info.get('previous_close', 0)
            
            if previous > 0:
                change = current - previous
                change_percent = (change / previous) * 100
            else:
                change = 0
                change_percent = 0
            
            return {
                'current_price': current,
                'previous_close': previous,
                'change': round(change, 2),
                'change_percent': round(change_percent, 2)
            }
            
        except Exception as e:
            print(f"Error calculating price change: {e}")
            return {
                'current_price': 0,
                'previous_close': 0,
                'change': 0,
                'change_percent': 0
            }

# Singleton instance
stock_data_service = StockDataService()
