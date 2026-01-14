import { useState } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, BarChart3, Shield, Zap, ArrowRight, Play } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import StockCard from "@/components/stock/StockCard";
import Chatbot from "@/components/chatbot/Chatbot";

const popularStocks = [
  { name: "Tata Motors", ticker: "TATAMOTORS", sentiment: "bullish" as const, confidence: 74, change: 2.4, sector: "Automobile" },
  { name: "Infosys", ticker: "INFY", sentiment: "bearish" as const, confidence: 42, change: -1.8, sector: "Technology" },
  { name: "HDFC Bank", ticker: "HDFCBANK", sentiment: "neutral" as const, confidence: 61, change: 0.3, sector: "Banking" },
  { name: "Reliance Industries", ticker: "RELIANCE", sentiment: "bullish" as const, confidence: 68, change: 1.9, sector: "Conglomerate" },
  { name: "Adani Enterprises", ticker: "ADANIENT", sentiment: "bearish" as const, confidence: 38, change: -3.2, sector: "Infrastructure" },
  { name: "Bharti Airtel", ticker: "BHARTIARTL", sentiment: "bullish" as const, confidence: 72, change: 2.1, sector: "Telecom" },
];

const features = [
  {
    icon: TrendingUp,
    title: "Real-Time Sentiment",
    description: "Track market mood for any Indian stock with AI-powered analysis of financial news and social signals.",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description: "Intuitive charts showing sentiment trends, news impact, and correlation with price movements.",
  },
  {
    icon: Shield,
    title: "Personalized Alerts",
    description: "Get notified when sentiment shifts. Never miss a crucial market mood change.",
  },
  {
    icon: Zap,
    title: "AI Assistant",
    description: "Ask questions in natural language. Get instant insights about any stock or market trend.",
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/stock/${searchQuery.toUpperCase().replace(/\s+/g, "")}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-hero-glow opacity-50" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        {/* Animated orbs */}
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-60 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
            >
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">
                Powered by Artificial Intelligence
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
            >
              <span className="text-foreground">f</span>
              <span className="text-gradient-primary">India</span>
              <span className="text-foreground"> AI</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground mb-4"
            >
              Indian Market Sentiment, Powered by Artificial Intelligence
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-muted-foreground/80 mb-10 max-w-2xl mx-auto"
            >
              Track how the market feels about any Indian stock using real-time financial news and AI. 
              Make smarter decisions with sentiment intelligence.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onSubmit={handleSearch}
              className="relative max-w-2xl mx-auto mb-8"
            >
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search any Indian stock... (e.g., Tata Motors, Infosys, HDFC Bank)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="search"
                  className="pl-14 pr-36"
                />
                <Button
                  type="submit"
                  variant="hero"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  Analyze
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.form>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/dashboard">
                <Button variant="heroOutline" size="lg">
                  <Play className="h-5 w-5" />
                  Explore Market
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="glass" size="lg">
                  Sign In for Watchlists & Alerts
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trending Stocks Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trending <span className="text-gradient-primary">Stocks</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real-time sentiment analysis for the most-watched Indian stocks
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularStocks.map((stock, index) => (
              <StockCard key={stock.ticker} {...stock} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/dashboard">
              <Button variant="heroOutline" size="lg">
                View All Stocks
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why <span className="text-gradient-primary">fIndia AI</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional-grade sentiment intelligence for informed investment decisions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl p-6 text-center group hover:border-primary/30 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card-elevated rounded-2xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-hero-glow opacity-30" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to decode the <span className="text-gradient-primary">market mood</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Start analyzing Indian stocks with AI-powered sentiment intelligence. Free to explore, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup">
                  <Button variant="hero" size="xl">
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="glass" size="xl">
                    Explore Without Account
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">
                <span className="text-foreground">f</span>
                <span className="text-primary">India</span>
                <span className="text-foreground"> AI</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 fIndia AI. Market sentiment intelligence platform.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                API
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Index;
