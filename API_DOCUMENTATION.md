# fIndia AI - API Documentation

## Base URL
- **Development**: `http://localhost:8000`
- **Production**: `https://your-app.railway.app`

---

## Authentication

Most endpoints are public. Authenticated endpoints require JWT token in header:

```
Authorization: Bearer <jwt_token>
```

---

## Endpoints

### 🔍 Search & Validation

#### Search Stocks
```http
GET /api/search?q={query}
```

**Parameters:**
- `q` (required): Search query (min 1 character)

**Response:**
```json
{
  "query": "ta",
  "results": [
    {
      "ticker": "TATAMOTORS",
      "company_name": "Tata Motors"
    },
    {
      "ticker": "TATASTEEL",
      "company_name": "Tata Steel"
    }
  ],
  "count": 2
}
```

#### Validate Ticker
```http
GET /api/validate/{ticker}
```

**Response:**
```json
{
  "valid": true,
  "ticker": "RELIANCE",
  "company_name": "Reliance Industries"
}
```

---

### 📊 Sentiment Analysis

#### Get Sentiment
```http
GET /api/sentiment?stock={ticker}&days={days}
```

**Parameters:**
- `stock` (required): Stock ticker (e.g., "RELIANCE")
- `days` (optional): Number of days to analyze (default: 7, max: 30)

**Response:**
```json
{
  "stock": "RELIANCE",
  "company_name": "Reliance Industries",
  "sentiment_label": "bullish",
  "sentiment_score": 3.45,
  "average_score": 0.23,
  "positive_count": 12,
  "negative_count": 3,
  "neutral_count": 5,
  "explanation": "AI-generated explanation...",
  "news": [
    {
      "title": "Reliance reports strong earnings",
      "description": "...",
      "url": "https://...",
      "source": "Economic Times",
      "published_at": "2024-01-20T10:00:00Z",
      "sentiment": "positive",
      "sentiment_score": 0.89,
      "confidence": 0.95
    }
  ],
  "stock_data": {
    "ticker": "RELIANCE",
    "current_price": 2450.50,
    "market_cap": 16500000000000,
    "pe_ratio": 28.5,
    "volume": 12500000,
    "week_52_high": 2750.00,
    "week_52_low": 2100.00,
    "sector": "Energy",
    "industry": "Oil & Gas"
  },
  "historical_data": [
    {
      "date": "2024-01-20",
      "close": 2450.50,
      "volume": 12500000
    }
  ],
  "analyzed_at": "2024-01-20T10:30:00Z"
}
```

**Sentiment Labels:**
- `bullish`: Aggregate score > 1.0
- `bearish`: Aggregate score < -1.0
- `neutral`: Aggregate score between -1.0 and 1.0

---

### 🔐 Authentication

#### Google OAuth Login
```http
POST /api/auth/google
```

**Request Body:**
```json
{
  "token": "google_oauth_token"
}
```

**Response:**
```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://..."
  }
}
```

#### Get Current User
```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "picture": "https://..."
}
```

---

### ⭐ Watchlist (Authenticated)

#### Get Watchlist
```http
GET /api/watchlist
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "watchlist": [
    {
      "ticker": "RELIANCE",
      "company_name": "Reliance Industries",
      "added_at": "2024-01-20T10:00:00Z"
    }
  ],
  "count": 1
}
```

#### Add to Watchlist
```http
POST /api/watchlist
```

**Request Body:**
```json
{
  "ticker": "INFY"
}
```

**Response:**
```json
{
  "message": "Added INFY to watchlist",
  "ticker": "INFY",
  "company_name": "Infosys Limited"
}
```

#### Remove from Watchlist
```http
DELETE /api/watchlist/{ticker}
```

**Response:**
```json
{
  "message": "Removed INFY from watchlist",
  "ticker": "INFY"
}
```

---

### 💬 Chatbot

#### Send Message
```http
POST /api/chat
```

**Request Body:**
```json
{
  "message": "What's the sentiment for RELIANCE?",
  "context": {
    "stock": "RELIANCE",
    "sentiment_label": "bullish",
    "sentiment_score": 3.45
  }
}
```

**Response:**
```json
{
  "response": "Based on our FinBERT-India AI analysis, RELIANCE shows bullish sentiment...",
  "timestamp": "2024-01-20T10:30:00Z",
  "authenticated": false
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "detail": "Error message here"
}
```

**HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (missing/invalid token)
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limiting

Currently no rate limiting. For production, consider:
- 100 requests/minute per IP
- 1000 requests/hour per user

---

## Data Sources

### Stock Data
- **Provider**: Yahoo Finance
- **Update Frequency**: Real-time (15-minute delay)
- **Coverage**: NSE/BSE stocks

### News
- **Primary**: NewsAPI, GNews API
- **Fallback**: Simulated news for demo
- **Update Frequency**: Real-time

### Sentiment
- **Model**: FinBERT-India (custom fine-tuned)
- **Processing**: Local (no external API)
- **Accuracy**: ~85% on Indian financial news

---

## WebSocket Support (Future)

Planned for real-time updates:

```javascript
const ws = new WebSocket('wss://api.findia.ai/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle real-time sentiment updates
};
```

---

## SDK Examples

### JavaScript/TypeScript
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-app.railway.app',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Get sentiment
const sentiment = await api.get('/api/sentiment?stock=RELIANCE');

// Add to watchlist
await api.post('/api/watchlist', { ticker: 'INFY' });
```

### Python
```python
import requests

headers = {'Authorization': f'Bearer {token}'}

# Get sentiment
response = requests.get(
    'https://your-app.railway.app/api/sentiment',
    params={'stock': 'RELIANCE'},
    headers=headers
)
sentiment = response.json()

# Add to watchlist
requests.post(
    'https://your-app.railway.app/api/watchlist',
    json={'ticker': 'INFY'},
    headers=headers
)
```

### cURL
```bash
# Get sentiment
curl "https://your-app.railway.app/api/sentiment?stock=RELIANCE"

# Add to watchlist (authenticated)
curl -X POST "https://your-app.railway.app/api/watchlist" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ticker": "INFY"}'
```

---

## Testing

### Postman Collection

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "fIndia AI API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Search Stocks",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/search?q=ta"
      }
    },
    {
      "name": "Get Sentiment",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/sentiment?stock=RELIANCE"
      }
    }
  ]
}
```

---

## Performance

**Average Response Times:**
- Search: ~50ms
- Sentiment Analysis: ~2-5s (depends on news fetching)
- Watchlist: ~100ms
- Chat: ~500ms

**Optimization Tips:**
- Cache sentiment results (5-minute TTL)
- Use CDN for static assets
- Enable gzip compression
- Implement request batching

---

## Changelog

### v1.0.0 (2024-01-20)
- Initial release
- FinBERT-India sentiment analysis
- Google OAuth authentication
- Watchlist management
- AI chatbot
- Real-time stock data

---

## Support

For API issues:
1. Check this documentation
2. Review error messages
3. Check Railway logs
4. Verify environment variables

---

**API Version**: 1.0.0  
**Last Updated**: January 2024
