---
title: fIndia AI
emoji: 📈
colorFrom: green
colorTo: blue
sdk: docker
pinned: false
license: mit
---

# fIndia AI - Bloomberg-Style Indian Stock Market Sentiment Analysis

This Space runs a custom fine-tuned **FinBERT-India** model for real-time sentiment analysis of Indian stocks.

## Features
- 🧠 Custom FinBERT model trained on Indian financial news
- ⚡ Real-time sentiment scoring
- 📊 Technical + sentiment fusion
- 🔍 Smart stock search

## API Endpoints
- `GET /` - Health check
- `GET /api/sentiment?stock=RELIANCE` - Analyze sentiment
- `GET /api/search?q=TITAN` - Search stocks

## Frontend
The frontend is hosted separately on Vercel. Set `VITE_API_URL` to this Space's URL.
