import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Link } from "react-router-dom";

interface StockCardProps {
  name: string;
  ticker: string;
  sentiment: "bullish" | "bearish" | "neutral";
  confidence: number;
  change: number;
  sector: string;
  index?: number;
}

const StockCard = ({
  name,
  ticker,
  sentiment,
  confidence,
  change,
  sector,
  index = 0,
}: StockCardProps) => {
  const sentimentConfig = {
    bullish: {
      color: "text-bullish",
      bg: "bg-bullish/10",
      gradientBg: "bg-gradient-bullish",
      icon: TrendingUp,
    },
    bearish: {
      color: "text-destructive",
      bg: "bg-destructive/10",
      gradientBg: "bg-gradient-bearish",
      icon: TrendingDown,
    },
    neutral: {
      color: "text-neutral",
      bg: "bg-neutral/10",
      gradientBg: "bg-neutral/5",
      icon: Minus,
    },
  };

  const config = sentimentConfig[sentiment];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group"
    >
      <Link to={`/stock/${ticker}`}>
        <div className={`glass-card rounded-xl p-5 border border-border/30 hover:border-primary/30 transition-all duration-300 ${config.gradientBg}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {name}
              </h3>
              <p className="font-mono text-sm text-muted-foreground">{ticker}</p>
            </div>
            <div className={`p-2 rounded-lg ${config.bg}`}>
              <Icon className={`h-5 w-5 ${config.color}`} />
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Sentiment</p>
              <p className={`font-mono font-bold text-xl ${config.color}`}>
                {confidence}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Change</p>
              <p className={`font-mono font-semibold ${change >= 0 ? "text-bullish" : "text-destructive"}`}>
                {change >= 0 ? "+" : ""}{change}%
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/30">
            <span className="text-xs text-muted-foreground">{sector}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default StockCard;
