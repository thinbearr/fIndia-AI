import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NewsCardProps {
  headline: string;
  summary: string;
  sentiment: "bullish" | "bearish" | "neutral";
  score: number;
  source: string;
  url: string;
  time: string;
  index?: number;
}

const NewsCard = ({
  headline,
  summary,
  sentiment,
  score,
  source,
  url,
  time,
  index = 0,
}: NewsCardProps) => {
  const sentimentConfig = {
    bullish: {
      color: "text-bullish",
      bg: "bg-bullish/10",
      border: "border-bullish/30",
      icon: TrendingUp,
      label: "Bullish",
    },
    bearish: {
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/30",
      icon: TrendingDown,
      label: "Bearish",
    },
    neutral: {
      color: "text-neutral",
      bg: "bg-neutral/10",
      border: "border-neutral/30",
      icon: Minus,
      label: "Neutral",
    },
  };

  const config = sentimentConfig[sentiment];
  const Icon = config.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`glass-card rounded-xl p-5 border ${config.border} hover:border-opacity-50 transition-all duration-300 group`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-semibold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {headline}
        </h3>
        <Badge
          className={`${config.bg} ${config.color} border-0 font-mono text-xs flex items-center gap-1 shrink-0`}
        >
          <Icon className="h-3 w-3" />
          {score > 0 ? "+" : ""}
          {score}%
        </Badge>
      </div>

      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
        {summary}
      </p>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">{source}</span>
          <span className="text-muted-foreground/50">•</span>
          <span className="text-muted-foreground">{time}</span>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Read full article
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </motion.article>
  );
};

export default NewsCard;
