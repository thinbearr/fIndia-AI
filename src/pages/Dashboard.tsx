import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, TrendingUp, TrendingDown, Minus, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Chatbot from "@/components/chatbot/Chatbot";

const allStocks = [
  { name: "Tata Motors", ticker: "TATAMOTORS", sentiment: "bullish" as const, confidence: 74, change: 2.4, sector: "Automobile" },
  { name: "Infosys", ticker: "INFY", sentiment: "bearish" as const, confidence: 42, change: -1.8, sector: "Technology" },
  { name: "HDFC Bank", ticker: "HDFCBANK", sentiment: "neutral" as const, confidence: 61, change: 0.3, sector: "Banking" },
  { name: "Reliance Industries", ticker: "RELIANCE", sentiment: "bullish" as const, confidence: 68, change: 1.9, sector: "Conglomerate" },
  { name: "Adani Enterprises", ticker: "ADANIENT", sentiment: "bearish" as const, confidence: 38, change: -3.2, sector: "Infrastructure" },
  { name: "Bharti Airtel", ticker: "BHARTIARTL", sentiment: "bullish" as const, confidence: 72, change: 2.1, sector: "Telecom" },
  { name: "ICICI Bank", ticker: "ICICIBANK", sentiment: "bullish" as const, confidence: 65, change: 1.2, sector: "Banking" },
  { name: "TCS", ticker: "TCS", sentiment: "neutral" as const, confidence: 55, change: -0.5, sector: "Technology" },
  { name: "Kotak Mahindra", ticker: "KOTAKBANK", sentiment: "bullish" as const, confidence: 58, change: 0.8, sector: "Banking" },
  { name: "Wipro", ticker: "WIPRO", sentiment: "bearish" as const, confidence: 45, change: -2.1, sector: "Technology" },
  { name: "HCL Technologies", ticker: "HCLTECH", sentiment: "neutral" as const, confidence: 52, change: 0.4, sector: "Technology" },
  { name: "Axis Bank", ticker: "AXISBANK", sentiment: "bullish" as const, confidence: 63, change: 1.5, sector: "Banking" },
  { name: "Maruti Suzuki", ticker: "MARUTI", sentiment: "bullish" as const, confidence: 67, change: 1.7, sector: "Automobile" },
  { name: "Larsen & Toubro", ticker: "LT", sentiment: "bullish" as const, confidence: 71, change: 2.3, sector: "Infrastructure" },
  { name: "Sun Pharma", ticker: "SUNPHARMA", sentiment: "neutral" as const, confidence: 56, change: 0.2, sector: "Pharma" },
  { name: "Bajaj Finance", ticker: "BAJFINANCE", sentiment: "bearish" as const, confidence: 48, change: -1.4, sector: "Finance" },
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"sentiment" | "name" | "change">("sentiment");
  const [filterSentiment, setFilterSentiment] = useState<"all" | "bullish" | "bearish" | "neutral">("all");

  const filteredStocks = allStocks
    .filter((stock) => {
      const matchesSearch = stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.ticker.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSentiment = filterSentiment === "all" || stock.sentiment === filterSentiment;
      return matchesSearch && matchesSentiment;
    })
    .sort((a, b) => {
      if (sortBy === "sentiment") return b.confidence - a.confidence;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "change") return b.change - a.change;
      return 0;
    });

  const stats = {
    bullish: allStocks.filter(s => s.sentiment === "bullish").length,
    bearish: allStocks.filter(s => s.sentiment === "bearish").length,
    neutral: allStocks.filter(s => s.sentiment === "neutral").length,
  };

  const sentimentConfig = {
    bullish: { color: "text-bullish", bg: "bg-bullish/10", icon: TrendingUp },
    bearish: { color: "text-destructive", bg: "bg-destructive/10", icon: TrendingDown },
    neutral: { color: "text-neutral", bg: "bg-neutral/10", icon: Minus },
  };

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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Market Dashboard</h1>
            <p className="text-muted-foreground">Real-time sentiment analysis for Indian stocks</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="glass-card rounded-xl p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-bullish/10">
                <TrendingUp className="h-6 w-6 text-bullish" />
              </div>
              <div>
                <p className="text-3xl font-bold font-mono text-bullish">{stats.bullish}</p>
                <p className="text-muted-foreground text-sm">Bullish Stocks</p>
              </div>
            </div>
            <div className="glass-card rounded-xl p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/10">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-3xl font-bold font-mono text-destructive">{stats.bearish}</p>
                <p className="text-muted-foreground text-sm">Bearish Stocks</p>
              </div>
            </div>
            <div className="glass-card rounded-xl p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-neutral/10">
                <Minus className="h-6 w-6 text-neutral" />
              </div>
              <div>
                <p className="text-3xl font-bold font-mono text-neutral">{stats.neutral}</p>
                <p className="text-muted-foreground text-sm">Neutral Stocks</p>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="glass"
                className="pl-12"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterSentiment === "all" ? "default" : "glass"}
                onClick={() => setFilterSentiment("all")}
              >
                All
              </Button>
              <Button
                variant={filterSentiment === "bullish" ? "bullish" : "glass"}
                onClick={() => setFilterSentiment("bullish")}
              >
                Bullish
              </Button>
              <Button
                variant={filterSentiment === "bearish" ? "bearish" : "glass"}
                onClick={() => setFilterSentiment("bearish")}
              >
                Bearish
              </Button>
              <Button
                variant={filterSentiment === "neutral" ? "default" : "glass"}
                onClick={() => setFilterSentiment("neutral")}
              >
                Neutral
              </Button>
            </div>
          </motion.div>

          {/* Stocks Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30 bg-muted/30">
                    <th className="text-left py-4 px-6 font-semibold">
                      <button
                        onClick={() => setSortBy("name")}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        Stock
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </th>
                    <th className="text-left py-4 px-6 font-semibold">Sector</th>
                    <th className="text-left py-4 px-6 font-semibold">
                      <button
                        onClick={() => setSortBy("sentiment")}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        Sentiment
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </th>
                    <th className="text-left py-4 px-6 font-semibold">Confidence</th>
                    <th className="text-left py-4 px-6 font-semibold">
                      <button
                        onClick={() => setSortBy("change")}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        Trend
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStocks.map((stock, index) => {
                    const config = sentimentConfig[stock.sentiment];
                    const Icon = config.icon;
                    return (
                      <motion.tr
                        key={stock.ticker}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <Link
                            to={`/stock/${stock.ticker}`}
                            className="flex items-center gap-3 group"
                          >
                            <div className={`p-2 rounded-lg ${config.bg}`}>
                              <Icon className={`h-4 w-4 ${config.color}`} />
                            </div>
                            <div>
                              <p className="font-medium group-hover:text-primary transition-colors">
                                {stock.name}
                              </p>
                              <p className="text-sm text-muted-foreground font-mono">
                                {stock.ticker}
                              </p>
                            </div>
                          </Link>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">{stock.sector}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}>
                            {stock.sentiment.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`font-mono font-bold ${config.color}`}>
                            {stock.confidence}%
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`font-mono font-semibold ${stock.change >= 0 ? "text-bullish" : "text-destructive"}`}>
                            {stock.change >= 0 ? "↑" : "↓"} {Math.abs(stock.change)}%
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>

      <Chatbot />
    </div>
  );
};

export default Dashboard;
