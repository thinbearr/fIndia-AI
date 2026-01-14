import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Building2, Globe, DollarSign, BarChart3, Brain, Sparkles } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import Navbar from "@/components/layout/Navbar";
import SentimentMeter from "@/components/stock/SentimentMeter";
import NewsCard from "@/components/stock/NewsCard";
import Chatbot from "@/components/chatbot/Chatbot";

// Mock data
const stockData = {
  TATAMOTORS: {
    name: "Tata Motors",
    ticker: "TATAMOTORS",
    sector: "Automobile",
    marketCap: "₹2.8L Cr",
    sentiment: "bullish" as const,
    confidence: 74,
    description: "Tata Motors Limited is an Indian multinational automotive manufacturer. Part of the Tata Group, it produces passenger cars, trucks, vans, coaches, and buses. Tata Motors is the largest automobile manufacturer in India and a leader in the electric vehicle space.",
    financials: {
      revenue: "₹3.46L Cr",
      netProfit: "₹31,807 Cr",
      eps: "₹86.52",
    },
  },
  INFY: {
    name: "Infosys",
    ticker: "INFY",
    sector: "Technology",
    marketCap: "₹6.2L Cr",
    sentiment: "bearish" as const,
    confidence: 42,
    description: "Infosys Limited is an Indian multinational IT services and consulting company. It is one of the largest IT companies in India and a global leader in next-generation digital services and consulting.",
    financials: {
      revenue: "₹1.53L Cr",
      netProfit: "₹24,108 Cr",
      eps: "₹58.26",
    },
  },
  HDFCBANK: {
    name: "HDFC Bank",
    ticker: "HDFCBANK",
    sector: "Banking",
    marketCap: "₹12.1L Cr",
    sentiment: "neutral" as const,
    confidence: 61,
    description: "HDFC Bank Limited is India's largest private sector bank by market capitalization. It offers a wide range of banking and financial services including retail banking, wholesale banking, and treasury operations.",
    financials: {
      revenue: "₹2.09L Cr",
      netProfit: "₹51,720 Cr",
      eps: "₹85.40",
    },
  },
};

const sentimentTrendData = [
  { date: "Jan 1", sentiment: 55, price: 620 },
  { date: "Jan 8", sentiment: 58, price: 635 },
  { date: "Jan 15", sentiment: 52, price: 610 },
  { date: "Jan 22", sentiment: 65, price: 680 },
  { date: "Jan 29", sentiment: 70, price: 720 },
  { date: "Feb 5", sentiment: 68, price: 710 },
  { date: "Feb 12", sentiment: 74, price: 780 },
];

const newsImpactData = [
  { category: "Earnings", positive: 85, negative: 15 },
  { category: "EV Sales", positive: 92, negative: 8 },
  { category: "Export", positive: 78, negative: 22 },
  { category: "Supply Chain", positive: 35, negative: 65 },
  { category: "Analyst Views", positive: 72, negative: 28 },
];

const newsData = [
  {
    headline: "Tata Motors reports 25% surge in EV sales for Q3",
    summary: "The company's electric vehicle segment continues to show strong growth momentum with record deliveries and expanding market share.",
    sentiment: "bullish" as const,
    score: 87,
    source: "Economic Times",
    url: "#",
    time: "2 hours ago",
  },
  {
    headline: "Tata Motors announces expansion of Nexon EV production capacity",
    summary: "New manufacturing line will increase EV production by 40%, addressing strong demand backlog and reducing wait times.",
    sentiment: "bullish" as const,
    score: 72,
    source: "Business Standard",
    url: "#",
    time: "5 hours ago",
  },
  {
    headline: "Global chip shortage continues to impact production schedules",
    summary: "Supply chain constraints may affect short-term delivery targets, though company maintains full-year guidance.",
    sentiment: "bearish" as const,
    score: -34,
    source: "Mint",
    url: "#",
    time: "8 hours ago",
  },
  {
    headline: "Tata Motors JLR posts best quarterly profit in 5 years",
    summary: "Jaguar Land Rover's turnaround strategy delivers results with improved margins and strong order book for luxury vehicles.",
    sentiment: "bullish" as const,
    score: 91,
    source: "Reuters",
    url: "#",
    time: "1 day ago",
  },
];

const StockPage = () => {
  const { ticker } = useParams<{ ticker: string }>();
  const stock = stockData[ticker?.toUpperCase() as keyof typeof stockData] || stockData.TATAMOTORS;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">{stock.name}</h1>
                  <span className="font-mono text-lg text-muted-foreground">
                    NSE: {stock.ticker}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {stock.sector}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Market Cap: {stock.marketCap}
                  </span>
                </div>
              </div>

              <SentimentMeter
                sentiment={stock.sentiment}
                confidence={stock.confidence}
                size="lg"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* AI Explanation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card-elevated rounded-xl p-6 border border-primary/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">AI Sentiment Analysis</h2>
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  This stock is currently <span className="text-bullish font-semibold">bullish</span> because 
                  of strong earnings growth, positive analyst outlook, and increasing EV sales. The Jaguar Land Rover 
                  segment has shown remarkable recovery with best-in-class margins. Despite some supply-chain concerns 
                  affecting short-term production, the long-term outlook remains positive with expanding domestic and 
                  export markets. AI confidence is high due to consistent positive news flow and improving financial metrics.
                </p>
              </motion.div>

              {/* Sentiment Over Time Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-xl p-6"
              >
                <h2 className="text-lg font-semibold mb-6">Sentiment Over Time</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sentimentTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="date"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis
                        yAxisId="sentiment"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        domain={[0, 100]}
                      />
                      <YAxis
                        yAxisId="price"
                        orientation="right"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        yAxisId="sentiment"
                        type="monotone"
                        dataKey="sentiment"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                        name="Sentiment %"
                      />
                      <Line
                        yAxisId="price"
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(var(--secondary))"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Price ₹"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* News Impact Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-xl p-6"
              >
                <h2 className="text-lg font-semibold mb-6">News Impact Analysis</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={newsImpactData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis dataKey="category" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="positive" fill="hsl(var(--bullish))" name="Positive %" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* News Feed */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-lg font-semibold mb-6">Latest News & Analysis</h2>
                <div className="space-y-4">
                  {newsData.map((news, index) => (
                    <NewsCard key={index} {...news} index={index} />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Overview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-xl p-6"
              >
                <h2 className="text-lg font-semibold mb-4">Company Overview</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {stock.description}
                </p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border/30">
                    <span className="text-muted-foreground text-sm">Sector</span>
                    <span className="font-medium">{stock.sector}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/30">
                    <span className="text-muted-foreground text-sm">Market Cap</span>
                    <span className="font-mono font-medium">{stock.marketCap}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/30">
                    <span className="text-muted-foreground text-sm">Revenue (TTM)</span>
                    <span className="font-mono font-medium">{stock.financials.revenue}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/30">
                    <span className="text-muted-foreground text-sm">Net Profit (TTM)</span>
                    <span className="font-mono font-medium">{stock.financials.netProfit}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-muted-foreground text-sm">EPS</span>
                    <span className="font-mono font-medium">{stock.financials.eps}</span>
                  </div>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-xl p-6"
              >
                <h2 className="text-lg font-semibold mb-4">Sentiment Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-bullish/10">
                    <TrendingUp className="h-6 w-6 text-bullish mx-auto mb-2" />
                    <p className="font-mono font-bold text-2xl text-bullish">12</p>
                    <p className="text-xs text-muted-foreground">Bullish News</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-destructive/10">
                    <TrendingDown className="h-6 w-6 text-destructive mx-auto mb-2" />
                    <p className="font-mono font-bold text-2xl text-destructive">3</p>
                    <p className="text-xs text-muted-foreground">Bearish News</p>
                  </div>
                </div>
                <div className="mt-4 p-4 rounded-lg bg-muted/30">
                  <p className="text-center text-sm text-muted-foreground">
                    Sentiment trend:
                    <span className="ml-2 font-semibold text-bullish">↑ +8%</span>
                    <span className="ml-1 text-xs">(7 days)</span>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Chatbot />
    </div>
  );
};

export default StockPage;
