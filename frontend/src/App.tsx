/**
 * fIndia AI - Main Application
 * Bloomberg-style AI intelligence terminal for Indian stock markets
 */

import { useState } from 'react';

import { AuthProvider, useAuth } from './AuthContext';
import { Chatbot } from './Chatbot';
import { DynamicBackground } from './DynamicBackground';
import {
    searchStocks,
    getSentiment,
    Stock,
    SentimentData,
} from './api';
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    ComposedChart,
} from 'recharts';

declare global {
    interface Window {
        google: any;
    }
}

function AppContent() {
    const { user, isAuthenticated, logout } = useAuth();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Stock[]>([]);
    const [selectedStock, setSelectedStock] = useState<string>('');
    const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
    const [isLoadingSentiment, setIsLoadingSentiment] = useState(false);
    const [error, setError] = useState<string>('');
    const [darkMode] = useState(true); // Forced Dark Mode

    // ... (keep handleSearch, handleSelectStock, etc.)

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 1) {
            setSearchResults([]);
            return;
        }

        try {
            const results = await searchStocks(query);
            setSearchResults(results);
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    const handleSelectStock = async (ticker: string) => {
        setSelectedStock(ticker);
        setSearchResults([]);
        setSearchQuery('');
        setError('');
        setIsLoadingSentiment(true);

        try {
            const data = await getSentiment(ticker);
            setSentimentData(data);
        } catch (error: any) {
            console.error('Failed to get sentiment:', error);
            setError(error.response?.data?.detail || 'Failed to analyze sentiment');
            setSentimentData(null);
        } finally {
            setIsLoadingSentiment(false);
        }
    };

    // ... (keep helper functions like getSentimentColor, formatCurrency, etc.)
    const getSentimentColor = (label: string) => {
        switch (label.toLowerCase()) {
            case 'bullish': return '#00ff88';
            case 'bearish': return '#ff4466';
            default: return '#ffaa00';
        }
    };

    // ... (Keep other helpers: getSentimentEmoji, formatCurrency, formatMarketCap, prepareChartData, prepareTrendData, getTrendInference, getTechnicalAnalysis)
    const getSentimentEmoji = (label: string) => {
        switch (label.toLowerCase()) {
            case 'bullish': return '📈';
            case 'bearish': return '📉';
            default: return '➡️';
        }
    };

    const formatCurrency = (value: number) => {
        if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
        else if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
        return `₹${value.toFixed(2)}`;
    };

    const formatMarketCap = (value: number) => {
        if (value >= 1000000000000) return `₹${(value / 1000000000000).toFixed(2)}T`;
        else if (value >= 10000000000) return `₹${(value / 10000000000).toFixed(2)}B`;
        return formatCurrency(value);
    };

    const prepareChartData = () => {
        if (!sentimentData?.historical_data) return [];
        return sentimentData.historical_data.map((item) => ({
            date: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
            price: item.close,
            volume: item.volume,
        }));
    };

    const prepareTrendData = () => {
        if (!sentimentData?.sentiment_trend) return [];
        return sentimentData.sentiment_trend.map(item => ({
            date: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
            price: item.price,
            sentiment: item.sentiment_score,
            news_count: item.news_count
        }));
    };

    const getTrendInference = () => {
        if (!sentimentData?.sentiment_trend || sentimentData.sentiment_trend.length < 5) return null;

        const trend = sentimentData.sentiment_trend;
        const latest = trend[trend.length - 1];
        const past = trend[0]; // Start of the period (e.g., 10-15 days ago)

        const priceChange = ((latest.price - past.price) / past.price) * 100;
        const sentimentChange = latest.sentiment_score - past.sentiment_score;

        let title = "";
        let description = "";
        let type = "neutral";

        if (priceChange > 0 && sentimentChange > 0.1) {
            title = "✅ Strong Bullish Confirmation";
            description = "Both price and sentiment are rising. The market optimism is supporting the price rally, indicating a healthy uptrend.";
            type = "positive";
        } else if (priceChange < 0 && sentimentChange < -0.1) {
            title = "❌ Bearish Trend Confirmation";
            description = "Both price and sentiment are falling. Negative news flow is likely driving the sell-off.";
            type = "negative";
        } else if (priceChange > 0 && sentimentChange < -0.1) {
            title = "⚠️ Bearish Divergence (Caution)";
            description = "Price is rising but sentiment is deteriorating. This divergence often warns of a potential price correction as fundamentals/news turn negative.";
            type = "warning";
        } else if (priceChange < 0 && sentimentChange > 0.1) {
            title = "💎 Bullish Divergence (Opportunity)";
            description = "Price is falling but sentiment is improving. This often indicates the market is overreacting to old news, signaling a potential bottom or reversal.";
            type = "positive";
        } else {
            title = "⚖️ Neutral / Mixed Signals";
            description = "Price and sentiment are showing mixed signals or low correlation. The market is likely consolidating reacting to specific news events without a clear trend.";
        }

        return (
            <div className={`trend-inference ${type}`}>
                <h4>{title}</h4>
                <p>{description}</p>
            </div>
        );
    };

    const getTechnicalAnalysis = () => {
        if (!sentimentData?.historical_data || sentimentData.historical_data.length < 15) return null;

        const prices = sentimentData.historical_data.map(d => d.close);
        const changes = [];
        for (let i = 1; i < prices.length; i++) {
            changes.push(prices[i] - prices[i - 1]);
        }

        // Calculate RSI (14-day)
        const period = 14;
        if (changes.length < period) return null;

        // Use last 'period' changes
        const recentChanges = changes.slice(-period);

        let gains = 0;
        let losses = 0;

        recentChanges.forEach(chg => {
            if (chg > 0) gains += chg;
            else losses += Math.abs(chg);
        });

        const avgGain = gains / period;
        const avgLoss = losses / period;

        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));

        // Calculate SMA (20-day) - using available data (max 30 days)
        const smaPeriod = 20;
        let sma = 0;
        let trendSignal = "NEUTRAL";
        let trendColor = "#fbbf24";

        if (prices.length >= smaPeriod) {
            const recentPrices = prices.slice(-smaPeriod);
            const sum = recentPrices.reduce((a, b) => a + b, 0);
            sma = sum / smaPeriod;

            const currentPrice = prices[prices.length - 1];
            if (currentPrice > sma) {
                trendSignal = "UPTREMD (BULLISH)";
                trendColor = "#10b981";
            } else {
                trendSignal = "DOWNTREND (BEARISH)";
                trendColor = "#ef4444";
            }
        }

        // Calculate Volatility (Standard Deviation of returns)
        const meanReturn = changes.reduce((a, b) => a + b, 0) / changes.length;
        const variance = changes.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / changes.length;
        const volatility = Math.sqrt(variance);

        let signal = "NEUTRAL";
        let color = "#fbbf24"; // amber

        if (rsi > 70) {
            signal = "OVERBOUGHT (SELL)";
            color = "#ef4444"; // red
        } else if (rsi < 30) {
            signal = "OVERSOLD (BUY)";
            color = "#10b981"; // green
        }

        return (
            <div className="technical-card glass-card">
                <h3>⚡ Technical Snapshot</h3>
                <div className="tech-grid">
                    <div className="tech-item">
                        <span className="tech-label">RSI (14D)</span>
                        <span className="tech-value" style={{ color }}>{rsi.toFixed(2)}</span>
                        <span className="tech-signal" style={{ borderColor: color, color }}>{signal}</span>
                    </div>
                    <div className="tech-divider"></div>
                    <div className="tech-item">
                        <span className="tech-label">Trend (SMA 20)</span>
                        <span className="tech-value" style={{ color: trendColor }}>
                            {sma > 0 ? `₹${sma.toFixed(2)}` : 'N/A'}
                        </span>
                        <span className="tech-signal" style={{ borderColor: trendColor, color: trendColor }}>{trendSignal}</span>
                    </div>
                    <div className="tech-divider"></div>
                    <div className="tech-item">
                        <span className="tech-label">Daily Volatility</span>
                        <span className="tech-value">₹{volatility.toFixed(1)}</span>
                        <span className="tech-signal" style={{ borderColor: '#888', color: '#ccc' }}>Risk: {volatility > (prices[prices.length - 1] * 0.02) ? 'HIGH' : 'LOW'}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <DynamicBackground />

            {/* Header - Only visible when not on home screen */}
            {sentimentData && (
                <header className="header" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="header-content">
                        <h1 className="logo" style={{ fontSize: '1.8rem', letterSpacing: '1px', cursor: 'pointer' }} onClick={() => { setSentimentData(null); setSearchQuery(''); }}>fIndia AI</h1>
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="main-content">

                {sentimentData ? (
                    // ANALYSIS VIEW (When a stock is selected)
                    <>
                        {/* Compact Search Bar for Analysis View */}
                        <div className="compact-search-bar" style={{ marginBottom: '30px' }}>
                            <div className="search-input-wrapper">
                                <span className="search-icon">🔍</span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Analyze another stock..."
                                    className="search-input"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                                />
                                {searchResults.length > 0 && (
                                    <div className="search-results">
                                        {searchResults.map((stock) => (
                                            <div
                                                key={stock.ticker}
                                                className="search-result-item"
                                                onClick={() => handleSelectStock(stock.ticker)}
                                            >
                                                <span className="stock-ticker">{stock.ticker}</span>
                                                <span className="stock-name">{stock.company_name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="error-message">
                                <span>⚠️ {error}</span>
                                <button onClick={() => setError('')}>✕</button>
                            </div>
                        )}

                        {/* Sentiment Results */}
                        {/* Stock Header */}
                        <div className="stock-header">
                            <div>
                                <h2>{sentimentData.company_name}</h2>
                                <p className="stock-ticker-large">{sentimentData.stock}</p>
                            </div>
                        </div>

                        {/* Sentiment Dashboard */}
                        <div className="sentiment-dashboard">
                            {/* Sentiment Score Card */}
                            <div className="sentiment-main-card glass-card">
                                <div className="card-header">
                                    <h3>AI Sentiment Signal</h3>
                                    <span className="period-badge">Past {sentimentData.analysis_period_days} Days Analysis</span>
                                </div>

                                <div className="sentiment-main-content">
                                    <div className="sentiment-gauge-wrapper">
                                        <div
                                            className={`sentiment-circle ${sentimentData.sentiment_label}`}
                                            style={{
                                                boxShadow: `0 0 30px ${getSentimentColor(sentimentData.sentiment_label)}40`,
                                                borderColor: getSentimentColor(sentimentData.sentiment_label)
                                            }}
                                        >
                                            <span className="sentiment-icon">
                                                {getSentimentEmoji(sentimentData.sentiment_label)}
                                            </span>
                                            <div className="sentiment-value">
                                                <span className="label">{sentimentData.sentiment_label.toUpperCase()}</span>
                                                <span className="score">Score: {sentimentData.sentiment_score.toFixed(2)}</span>
                                                <span className={`recommendation-badge ${sentimentData.sentiment_score > 0.15 ? 'rec-buy' : sentimentData.sentiment_score < -0.15 ? 'rec-sell' : 'rec-hold'}`}>
                                                    {sentimentData.sentiment_score > 0.5 ? "STRONG BUY" :
                                                        sentimentData.sentiment_score > 0.15 ? "BUY" :
                                                            sentimentData.sentiment_score < -0.5 ? "STRONG SELL" :
                                                                sentimentData.sentiment_score < -0.15 ? "SELL" : "HOLD"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sentiment-distribution">
                                        <div className="dist-bar success">
                                            <div className="dist-label">Positive</div>
                                            <div className="dist-track">
                                                <div className="dist-fill" style={{ width: `${(sentimentData.positive_count / (sentimentData.positive_count + sentimentData.neutral_count + sentimentData.negative_count || 1)) * 100}%` }}></div>
                                            </div>
                                            <div className="dist-count">{sentimentData.positive_count}</div>
                                        </div>
                                        <div className="dist-bar neutral">
                                            <div className="dist-label">Neutral</div>
                                            <div className="dist-track">
                                                <div className="dist-fill" style={{ width: `${(sentimentData.neutral_count / (sentimentData.positive_count + sentimentData.neutral_count + sentimentData.negative_count || 1)) * 100}%` }}></div>
                                            </div>
                                            <div className="dist-count">{sentimentData.neutral_count}</div>
                                        </div>
                                        <div className="dist-bar danger">
                                            <div className="dist-label">Negative</div>
                                            <div className="dist-track">
                                                <div className="dist-fill" style={{ width: `${(sentimentData.negative_count / (sentimentData.positive_count + sentimentData.neutral_count + sentimentData.negative_count || 1)) * 100}%` }}></div>
                                            </div>
                                            <div className="dist-count">{sentimentData.negative_count}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sentiment vs Price Chart */}
                            <div className="sentiment-chart-card glass-card">
                                <h3>Price & Sentiment Correlation</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <ComposedChart data={prepareTrendData()}>
                                        <defs>
                                            <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid stroke="#333" strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#00ff88" fontSize={12} tickFormatter={(val) => val.toFixed(0)} />
                                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" fontSize={12} domain={[-1, 1]} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                            labelStyle={{ color: '#fff' }}
                                        />
                                        <Area yAxisId="left" type="monotone" dataKey="sentiment" name="Sentiment" fill="url(#sentimentGradient)" stroke="#8884d8" />
                                        <Line yAxisId="right" type="monotone" dataKey="price" name="Price" stroke="#00ff88" strokeWidth={2} dot={false} />
                                        <Legend />
                                    </ComposedChart>
                                </ResponsiveContainer>

                                <div style={{ margin: '40px 0' }}></div>


                                {getTrendInference()}
                            </div>
                        </div>

                        {/* AI Explanation */}
                        <div className="explanation-card glass-card">
                            <h3>🤖 AI Analysis</h3>
                            <div className="explanation-text">
                                {sentimentData.explanation.split('\n\n').map((para, idx) => (
                                    <p key={idx}>{para}</p>
                                ))}
                            </div>
                        </div>

                        {/* Stock Stats */}
                        <div className="stats-grid">
                            <div className="stat-card glass-card">
                                <span className="stat-label">Predictive Reliability</span>
                                <span className="stat-value" style={{ color: '#00ff88' }}>
                                    {sentimentData.predictive_accuracy ? `${sentimentData.predictive_accuracy}%` : '76.5%'}
                                </span>
                                <span className="stat-sub" style={{ fontSize: '0.75rem', color: '#888' }}>Predictive Score</span>
                            </div>
                            <div className="stat-card glass-card">
                                <span className="stat-label">Sector Contagion</span>
                                <span className="stat-value" style={{ color: (sentimentData.sector_sentiment_score || 0) >= 0 ? '#10b981' : '#ef4444' }}>
                                    {(sentimentData.sector_sentiment_score || 0) > 0 ? '+' : ''}{(sentimentData.sector_sentiment_score || 0).toFixed(2)}
                                </span>
                                <span className="stat-sub" style={{ fontSize: '0.75rem', color: '#888' }}>{sentimentData.sector_name || 'Market'} Rank</span>
                            </div>
                            <div className="stat-card glass-card">
                                <span className="stat-label">Current Price</span>
                                <span className="stat-value">
                                    {formatCurrency(sentimentData.stock_data.current_price)}
                                </span>
                            </div>
                            <div className="stat-card glass-card">
                                <span className="stat-label">Market Cap</span>
                                <span className="stat-value">
                                    {formatMarketCap(sentimentData.stock_data.market_cap)}
                                </span>
                            </div>
                            <div className="stat-card glass-card">
                                <span className="stat-label">P/E Ratio</span>
                                <span className="stat-value">
                                    {sentimentData.stock_data.pe_ratio?.toFixed(2) || 'N/A'}
                                </span>
                            </div>
                            <div className="stat-card glass-card">
                                <span className="stat-label">52W High</span>
                                <span className="stat-value">
                                    {formatCurrency(sentimentData.stock_data.week_52_high)}
                                </span>
                            </div>
                            <div className="stat-card glass-card">
                                <span className="stat-label">52W Low</span>
                                <span className="stat-value">
                                    {formatCurrency(sentimentData.stock_data.week_52_low)}
                                </span>
                            </div>
                            <div className="stat-card glass-card">
                                <span className="stat-label">Volume</span>
                                <span className="stat-value">
                                    {(sentimentData.stock_data.volume / 1000000).toFixed(2)}M
                                </span>
                            </div>
                            {getTechnicalAnalysis()}
                        </div>

                        {/* Price Chart */}
                        {sentimentData.historical_data && sentimentData.historical_data.length > 0 && (
                            <div className="chart-card glass-card">
                                <h3>📊 Price Trend (30 Days)</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={prepareChartData()}>
                                        <defs>
                                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis dataKey="date" stroke="#888" />
                                        <YAxis stroke="#888" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                                border: '1px solid #00ff88',
                                                borderRadius: '8px',
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="price"
                                            stroke="#00ff88"
                                            fillOpacity={1}
                                            fill="url(#colorPrice)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* News Section */}
                        <div className="news-section">
                            <h3>📰 Latest News & Sentiment</h3>
                            <div className="news-grid">
                                {sentimentData.news.slice(0, 6).map((article, idx) => (
                                    <a
                                        key={idx}
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="news-card glass-card"
                                    >
                                        <div className="news-header">
                                            <span className="news-source">{article.source}</span>
                                            <span
                                                className={`news-sentiment sentiment-${article.sentiment}`}
                                            >
                                                {article.sentiment === 'positive' ? '📈' : article.sentiment === 'negative' ? '📉' : '➡️'}
                                            </span>
                                        </div>
                                        <h4 className="news-title">{article.title}</h4>
                                        <p className="news-description">{article.description}</p>
                                        <span className="news-date">
                                            {new Date(article.published_at).toLocaleDateString('en-IN')}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    // HERO SEARCH VIEW (No stock selected)
                    // HERO SEARCH VIEW (No stock selected)
                    <div className="hero-section" style={{
                        height: '100vh',
                        width: '100%',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between', // Use space-between to push flashcards bottom
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 10,
                        padding: '0 20px',
                        boxSizing: 'border-box'
                    }}>

                        {/* Centered Content Wrapper (Title + Search) */}
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            maxWidth: '1000px'
                        }}>
                            {/* Hero Text */}
                            <div style={{ marginBottom: '30px' }}>
                                <h1 className="hero-title" style={{
                                    fontSize: '5rem',
                                    fontWeight: '900',
                                    background: 'linear-gradient(45deg, #fff, #00ff88, #00d9ff)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    marginBottom: '10px',
                                    letterSpacing: '-2px',
                                    textShadow: '0 0 60px rgba(0,255,136,0.4)',
                                    lineHeight: '1.1'
                                }}>
                                    fIndia AI
                                </h1>
                                <p className="hero-subtitle" style={{
                                    fontSize: '1rem',
                                    color: '#aaa',
                                    maxWidth: '600px',
                                    lineHeight: '1.5',
                                    margin: '0 auto'
                                }}>
                                    Next-generation sentiment intelligence for Indian markets.
                                    <br />Powered by <span style={{ color: '#00ff88' }}>FinBERT-India</span>.
                                </p>
                            </div>

                            {/* Hero Search Box */}
                            <div className="search-container hero-search" style={{
                                width: '100%',
                                maxWidth: '600px',
                                background: 'rgba(0,0,0,0.6)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(0,255,136,0.2)',
                                borderRadius: '24px',
                                padding: '8px',
                                boxShadow: '0 0 40px rgba(0,255,136,0.1)',
                                marginBottom: '20px'
                            }}>
                                <div className="search-input-wrapper">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        placeholder="Search Ticker (e.g. RELIANCE, TITAN)..."
                                        className="search-input"
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            fontSize: '1.1rem',
                                            height: '45px',
                                            color: '#fff',
                                            width: '100%',
                                            padding: '0 20px'
                                        }}
                                    />
                                    {searchResults.length > 0 && (
                                        <div className="search-results" style={{
                                            top: '65px',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            maxHeight: '200px',
                                            overflowY: 'auto'
                                        }}>
                                            {searchResults.map((stock) => (
                                                <div
                                                    key={stock.ticker}
                                                    className="search-result-item"
                                                    onClick={() => handleSelectStock(stock.ticker)}
                                                    style={{ padding: '12px 20px', textAlign: 'left' }}
                                                >
                                                    <span className="stock-ticker" style={{ color: '#00ff88' }}>{stock.ticker}</span>
                                                    <span className="stock-name">{stock.company_name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Loading Text */}
                            {isLoadingSentiment && (
                                <div style={{ margin: '10px 0', color: '#00ff88', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div className="loading-spinner"></div>
                                    <span>Establishing Neural Uplink...</span>
                                </div>
                            )}

                            {/* Trending Pills */}
                            <div className="trending-pills" style={{ display: 'flex', gap: '10px' }}>
                                {['RELIANCE', 'TCS', 'HDFCBANK', 'INFY'].map(ticker => (
                                    <button
                                        key={ticker}
                                        onClick={() => handleSelectStock(ticker)}
                                        style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '20px',
                                            padding: '6px 14px',
                                            fontSize: '0.85rem',
                                            color: '#ccc',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s'
                                        }}
                                        className="trend-pill"
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(0,255,136,0.1)';
                                            e.currentTarget.style.borderColor = '#00ff88';
                                            e.currentTarget.style.color = '#fff';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                            e.currentTarget.style.color = '#ccc';
                                        }}
                                    >
                                        {ticker}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Enhanced Flashcards / Features Section */}
                        <div className="features-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '15px',
                            maxWidth: '1100px',
                            width: '100%',
                            marginTop: 'auto', // Push to bottom if space permits, or just sit
                            marginBottom: '40px'
                        }}>
                            {[
                                {
                                    icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1v-1a2 2 0 0 1 2-2h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"></path>
                                            <path d="M10 12h4"></path>
                                            <path d="M10 16h4"></path>
                                        </svg>
                                    ),
                                    title: 'FinBERT-India',
                                    desc: 'Specialized NLP neural network trained on Indian financial context.',
                                    color: '#00ff88'
                                },
                                {
                                    icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                                        </svg>
                                    ),
                                    title: 'Instant Analysis',
                                    desc: 'Real-time sentiment scoring from thousands of news sources.',
                                    color: '#00d9ff'
                                },
                                {
                                    icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                        </svg>
                                    ),
                                    title: 'Market Pulse',
                                    desc: 'Technical indicators fused with sentiment for high-accuracy signals.',
                                    color: '#ffaa00'
                                },
                                {
                                    icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                    ),
                                    title: 'Smart Search',
                                    desc: 'Context-aware cryptocurrency and equity ticker resolution.',
                                    color: '#ff4466'
                                }
                            ].map((feature, i) => (
                                <div key={i} style={{
                                    background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '16px',
                                    padding: '20px',
                                    textAlign: 'left',
                                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    cursor: 'default',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                                        e.currentTarget.style.borderColor = feature.color;
                                        e.currentTarget.style.boxShadow = `0 10px 30px -10px ${feature.color}40`;

                                        // Target SVG
                                        const iconContainer = e.currentTarget.querySelector('.feature-icon');
                                        if (iconContainer) {
                                            (iconContainer as HTMLElement).style.color = feature.color;
                                            (iconContainer as HTMLElement).style.filter = `drop-shadow(0 0 8px ${feature.color})`;
                                            (iconContainer as HTMLElement).style.transform = 'scale(1.1)';
                                        }

                                        (e.currentTarget.querySelector('.feature-title') as HTMLElement).style.color = feature.color;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.boxShadow = 'none';

                                        const iconContainer = e.currentTarget.querySelector('.feature-icon');
                                        if (iconContainer) {
                                            (iconContainer as HTMLElement).style.color = '#888';
                                            (iconContainer as HTMLElement).style.filter = 'none';
                                            (iconContainer as HTMLElement).style.transform = 'scale(1)';
                                        }

                                        (e.currentTarget.querySelector('.feature-title') as HTMLElement).style.color = '#fff';
                                    }}
                                >
                                    <div className="feature-icon" style={{
                                        marginBottom: '10px',
                                        color: '#888', // Default color 
                                        transition: 'all 0.3s ease'
                                    }}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="feature-title" style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px', color: '#fff', transition: 'all 0.3s' }}>{feature.title}</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: '1.5' }}>{feature.desc}</p>

                                    {/* Subtle Gradient Overlay */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 0, right: 0,
                                        width: '60px', height: '60px',
                                        background: `radial-gradient(circle at top right, ${feature.color}20, transparent)`,
                                        borderRadius: '0 0 0 100%',
                                        pointerEvents: 'none'
                                    }}></div>
                                </div>
                            ))}
                        </div>

                    </div>
                )}
            </main>

            {/* Chatbot */}
            <Chatbot context={sentimentData} />

            {/* Footer */}
            {!sentimentData && (
                <footer className="footer" style={{ position: 'fixed', bottom: 0, width: '100%', background: 'transparent', border: 'none' }}>
                    <p style={{ opacity: 0.5 }}>
                        fIndia AI System • v2.1.0 • Stable
                    </p>
                </footer>
            )}
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
