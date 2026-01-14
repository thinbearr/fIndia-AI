import { motion } from "framer-motion";

interface SentimentMeterProps {
  sentiment: "bullish" | "bearish" | "neutral";
  confidence: number;
  size?: "sm" | "md" | "lg";
}

const SentimentMeter = ({ sentiment, confidence, size = "md" }: SentimentMeterProps) => {
  const sizes = {
    sm: { width: 120, height: 60, strokeWidth: 8 },
    md: { width: 200, height: 100, strokeWidth: 12 },
    lg: { width: 280, height: 140, strokeWidth: 16 },
  };

  const { width, height, strokeWidth } = sizes[size];
  const radius = height - strokeWidth;
  const circumference = Math.PI * radius;

  const sentimentColors = {
    bullish: "hsl(var(--bullish))",
    bearish: "hsl(var(--destructive))",
    neutral: "hsl(var(--neutral))",
  };

  const sentimentLabels = {
    bullish: "BULLISH",
    bearish: "BEARISH",
    neutral: "NEUTRAL",
  };

  const sentimentGradients = {
    bullish: ["#00ff88", "#00cc6a"],
    bearish: ["#ff4757", "#cc3945"],
    neutral: ["#00d4ff", "#00a8cc"],
  };

  // Calculate the angle based on sentiment
  // Bearish = left (0%), Neutral = center (50%), Bullish = right (100%)
  const getAngleFromSentiment = () => {
    if (sentiment === "bearish") return -90 + (confidence / 100) * 45;
    if (sentiment === "bullish") return 45 + (confidence / 100) * 45;
    return -22.5 + (confidence / 100) * 45;
  };

  const needleAngle = getAngleFromSentiment();

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width, height: height + 20 }}>
        <svg width={width} height={height + 20} viewBox={`0 0 ${width} ${height + 20}`}>
          <defs>
            <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff4757" />
              <stop offset="50%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#00ff88" />
            </linearGradient>
            <linearGradient id={`activeGradient-${sentiment}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={sentimentGradients[sentiment][0]} />
              <stop offset="100%" stopColor={sentimentGradients[sentiment][1]} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background arc */}
          <path
            d={`M ${strokeWidth} ${height} A ${radius} ${radius} 0 0 1 ${width - strokeWidth} ${height}`}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active arc */}
          <motion.path
            d={`M ${strokeWidth} ${height} A ${radius} ${radius} 0 0 1 ${width - strokeWidth} ${height}`}
            fill="none"
            stroke="url(#meterGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            filter="url(#glow)"
          />

          {/* Needle */}
          <motion.g
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: needleAngle, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 60 }}
            style={{ transformOrigin: `${width / 2}px ${height}px` }}
          >
            <line
              x1={width / 2}
              y1={height}
              x2={width / 2}
              y2={strokeWidth + 10}
              stroke={sentimentColors[sentiment]}
              strokeWidth={3}
              strokeLinecap="round"
              filter="url(#glow)"
            />
            <circle
              cx={width / 2}
              cy={height}
              r={8}
              fill={sentimentColors[sentiment]}
              filter="url(#glow)"
            />
          </motion.g>
        </svg>

        {/* Center label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center"
        >
          <div
            className="font-mono font-bold"
            style={{
              fontSize: size === "lg" ? "2rem" : size === "md" ? "1.5rem" : "1rem",
              color: sentimentColors[sentiment],
            }}
          >
            {confidence}%
          </div>
        </motion.div>
      </div>

      {/* Sentiment label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-2 px-4 py-1 rounded-full font-mono font-semibold tracking-wider"
        style={{
          backgroundColor: `${sentimentColors[sentiment]}20`,
          color: sentimentColors[sentiment],
          fontSize: size === "lg" ? "1rem" : size === "md" ? "0.875rem" : "0.75rem",
        }}
      >
        {sentimentLabels[sentiment]}
      </motion.div>
    </div>
  );
};

export default SentimentMeter;
