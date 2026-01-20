/**
 * Chatbot Component
 * AI-powered financial assistant
 */

import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage, ChatResponse } from './api';
import { useAuth } from './AuthContext';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface ChatbotProps {
    context?: any;
}

export const Chatbot: React.FC<ChatbotProps> = ({ context }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm the fIndia AI assistant. I can help you analyze Indian stocks, understand market sentiment, and answer your financial questions. What would you like to know?",
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [activeStock, setActiveStock] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        if (context?.stock) {
            setActiveStock(context.stock);
        }
    }, [context]);

    const handleSend = async (messageText: string = input) => {
        if (!messageText.trim() || isLoading) return;

        // Try to detect stock name in message logic (simple heuristic) to keep quick actions context-aware
        // Matches: "Analyze RELIANCE", "RELIANCE news", "Score for RELIANCE"
        const stockMatch = messageText.match(/\b([A-Z]{3,})\b/);
        // We only update if it looks like a ticker (uppercase, >2 chars) and isn't a common keyword
        const commonKeywords = ["THE", "FOR", "AND", "WHO", "WHY", "HOW", "WHAT", "WHEN", "WHERE", "BUY", "SELL", "NEWS", "STOCK", "MARKET", "TREND", "CALCULATED", "METHODOLOGY", "SCORE", "ANALYSIS"];
        if (stockMatch) {
            const potentialStock = stockMatch[1];
            if (!commonKeywords.includes(potentialStock)) {
                setActiveStock(potentialStock);
            }
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            text: messageText,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Pass the activeStock as context if available, otherwise use props context
            const requestContext = activeStock ? { ...context, stock: activeStock } : context;
            const response = await sendChatMessage(messageText, requestContext);

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response.response,
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Sorry, I encountered an error. Please try again.',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatMessage = (text: string) => {
        // Handle bold (**text**) and bullet points
        return text.split('\n').map((line, i) => {
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <div key={i} style={{ minHeight: '1.2em' }}>
                    {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j}>{part.slice(2, -2)}</strong>;
                        }
                        return <span key={j}>{part}</span>;
                    })}
                </div>
            );
        });
    };

    // Quick Actions
    const stockName = activeStock || context?.stock || context?.company_name;
    const quickActions = stockName
        ? [
            `Analyze ${stockName}`,
            `How is this calculated?`,
            `News and Summary for ${stockName}`
        ]
        : [
            "Market Trend",
            "Top Bullish Stocks",
            "Top Bearish Stocks"
        ];

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="chat-fab"
                aria-label="Open chat"
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="chat-header-content">
                            <h3>fIndia AI Assistant</h3>
                            <p className="chat-subtitle">
                                {isAuthenticated ? 'Personalized Assistant' : 'Financial Intelligence'}
                            </p>
                        </div>
                    </div>

                    <div className="chat-messages">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`chat-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                            >
                                <div className="message-content">
                                    {formatMessage(message.text)}
                                    <span className="message-time">
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chat-message bot-message">
                                <div className="message-content">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions ScrollView */}
                    <div className="chat-quick-actions">
                        {quickActions.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(action)}
                                className="quick-action-btn"
                                disabled={isLoading}
                            >
                                {action}
                            </button>
                        ))}
                    </div>

                    <div className="chat-input-container">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask about stocks..."
                            className="chat-input"
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isLoading}
                            className="chat-send-button"
                            aria-label="Send message"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
