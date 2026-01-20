/**
 * API Service
 * Handles all backend communication
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface Stock {
  ticker: string;
  company_name: string;
}

export interface SentimentTrendPoint {
  date: string;
  price: number;
  sentiment_score: number;
  news_count: number;
}

export interface SentimentData {
  stock: string;
  company_name: string;
  sentiment_label: 'bullish' | 'bearish' | 'neutral';
  sentiment_score: number;
  average_score: number;
  positive_count: number;
  negative_count: number;
  neutral_count: number;
  explanation: string;
  news: NewsArticle[];
  stock_data: StockData;
  historical_data: any[];
  sentiment_trend: SentimentTrendPoint[];
  analysis_period_days: number;
  analyzed_at: string;
  predictive_accuracy: number;
  sector_sentiment_score: number;
  sector_name: string;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  published_at: string;
  sentiment: string;
  sentiment_score: number;
  confidence: number;
}

export interface StockData {
  ticker: string;
  company_name: string;
  current_price: number;
  previous_close: number;
  market_cap: number;
  pe_ratio: number;
  volume: number;
  week_52_high: number;
  week_52_low: number;
  sector: string;
  industry: string;
}

export interface HistoricalData {
  date: string;
  close: number;
  volume: number;
}

export interface WatchlistItem {
  ticker: string;
  company_name: string;
  added_at: string;
}

export interface ChatMessage {
  message: string;
  context?: any;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
  authenticated: boolean;
}

// API Functions

export const searchStocks = async (query: string): Promise<Stock[]> => {
  const response = await api.get(`/api/search?q=${encodeURIComponent(query)}`);
  return response.data.results;
};

export const getSentiment = async (stock: string): Promise<SentimentData> => {
  const response = await api.get(`/api/sentiment?stock=${encodeURIComponent(stock)}`);
  return response.data;
};

export const getWatchlist = async (): Promise<WatchlistItem[]> => {
  const response = await api.get('/api/watchlist');
  return response.data.watchlist;
};

export const addToWatchlist = async (ticker: string): Promise<void> => {
  await api.post('/api/watchlist', { ticker });
};

export const removeFromWatchlist = async (ticker: string): Promise<void> => {
  await api.delete(`/api/watchlist/${ticker}`);
};

export const sendChatMessage = async (message: string, context?: any): Promise<ChatResponse> => {
  const response = await api.post('/api/chat', { message, context });
  return response.data;
};

export const googleAuth = async (token: string): Promise<any> => {
  const response = await api.post('/api/auth/google', { token });
  return response.data;
};

export const emailLogin = async (email: string, password: string): Promise<any> => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

export const emailSignup = async (name: string, email: string, password: string): Promise<any> => {
  const response = await api.post('/api/auth/signup', { name, email, password });
  return response.data;
};

export const getCurrentUser = async (): Promise<any> => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

export default api;
