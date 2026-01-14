import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, TrendingUp, TrendingDown, Minus, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Chatbot from "@/components/chatbot/Chatbot";

const initialWatchlist = [
  { name: "Tata Motors", ticker: "TATAMOTORS", sentiment: "bullish" as const, confidence: 74, change: 2.4, sector: "Automobile" },
  { name: "Infosys", ticker: "INFY", sentiment: "bearish" as const, confidence: 42, change: -1.8, sector: "Technology" },
  { name: "HDFC Bank", ticker: "HDFCBANK", sentiment: "neutral" as const, confidence: 61, change: 0.3, sector: "Banking" },
  { name: "Reliance Industries", ticker: "RELIANCE", sentiment: "bullish" as const, confidence: 68, change: 1.9, sector: "Conglomerate" },
];

const availableStocks = [
  { name: "Adani Enterprises", ticker: "ADANIENT", sentiment: "bearish" as const, confidence: 38, change: -3.2, sector: "Infrastructure" },
  { name: "Bharti Airtel", ticker: "BHARTIARTL", sentiment: "bullish" as const, confidence: 72, change: 2.1, sector: "Telecom" },
  { name: "ICICI Bank", ticker: "ICICIBANK", sentiment: "bullish" as const, confidence: 65, change: 1.2, sector: "Banking" },
  { name: "TCS", ticker: "TCS", sentiment: "neutral" as const, confidence: 55, change: -0.5, sector: "Technology" },
];

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState(initialWatchlist);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const removeFromWatchlist = (ticker: string) => {
    setWatchlist(watchlist.filter(stock => stock.ticker !== ticker));
  };

  const addToWatchlist = (stock: typeof availableStocks[0]) => {
    if (!watchlist.find(s => s.ticker === stock.ticker)) {
      setWatchlist([...watchlist, stock]);
    }
    setShowAddModal(false);
  };

  const sentimentConfig = {
    bullish: { color: "text-bullish", bg: "bg-bullish/10", icon: TrendingUp },
    bearish: { color: "text-destructive", bg: "bg-destructive/10", icon: TrendingDown },
    neutral: { color: "text-neutral", bg: "bg-neutral/10", icon: Minus },
  };

  const filteredAvailable = availableStocks.filter(
    stock => 
      !watchlist.find(s => s.ticker === stock.ticker) &&
      (stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <Star className="h-8 w-8 text-warning" />
                My Watchlist
              </h1>
              <p className="text-muted-foreground">Track sentiment for your favorite stocks</p>
            </div>
            <Button variant="hero" onClick={() => setShowAddModal(true)}>
              <Plus className="h-5 w-5" />
              Add Stock
            </Button>
          </motion.div>

          {/* Watchlist Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlist.map((stock, index) => {
              const config = sentimentConfig[stock.sentiment];
              const Icon = config.icon;
              return (
                <motion.div
                  key={stock.ticker}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-xl p-6 relative group"
                >
                  <button
                    onClick={() => removeFromWatchlist(stock.ticker)}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <Link to={`/stock/${stock.ticker}`}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-xl ${config.bg}`}>
                        <Icon className={`h-6 w-6 ${config.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                          {stock.name}
                        </h3>
                        <p className="text-muted-foreground font-mono text-sm">{stock.ticker}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Sentiment</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}>
                          {stock.sentiment.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                        <p className={`font-mono font-bold text-xl ${config.color}`}>
                          {stock.confidence}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{stock.sector}</span>
                      <span className={`font-mono font-semibold ${stock.change >= 0 ? "text-bullish" : "text-destructive"}`}>
                        {stock.change >= 0 ? "↑" : "↓"} {Math.abs(stock.change)}%
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}

            {/* Empty State */}
            {watchlist.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full glass-card rounded-xl p-12 text-center"
              >
                <Star className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Your watchlist is empty</h3>
                <p className="text-muted-foreground mb-6">Add stocks to track their sentiment</p>
                <Button variant="hero" onClick={() => setShowAddModal(true)}>
                  <Plus className="h-5 w-5" />
                  Add Your First Stock
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Add Stock Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card-elevated rounded-2xl w-full max-w-lg mx-4 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Add to Watchlist</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Input
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="glass"
              className="mb-4"
            />

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredAvailable.map((stock) => {
                const config = sentimentConfig[stock.sentiment];
                const Icon = config.icon;
                return (
                  <button
                    key={stock.ticker}
                    onClick={() => addToWatchlist(stock)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-colors text-left"
                  >
                    <div className={`p-2 rounded-lg ${config.bg}`}>
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{stock.name}</p>
                      <p className="text-sm text-muted-foreground font-mono">{stock.ticker}</p>
                    </div>
                    <span className={`font-mono font-bold ${config.color}`}>
                      {stock.confidence}%
                    </span>
                  </button>
                );
              })}
              {filteredAvailable.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No stocks found
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      <Chatbot />
    </div>
  );
};

export default Watchlist;
