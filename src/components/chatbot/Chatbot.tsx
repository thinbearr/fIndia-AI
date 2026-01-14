import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Mic, MicOff, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your fIndia AI assistant. Ask me about any Indian stock sentiment, market trends, or get personalized insights. Try asking: 'What is the sentiment for Tata Motors?'",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        tata: "Tata Motors is currently showing BULLISH sentiment at 74% confidence. Recent news about strong EV sales and export growth are driving positive market sentiment. The stock has seen a 12% increase in sentiment score over the past week.",
        infosys: "Infosys is showing BEARISH sentiment at 42% confidence. Concerns about IT sector slowdown and reduced client spending are impacting sentiment. However, their recent AI initiatives are showing early positive signals.",
        hdfc: "HDFC Bank maintains a NEUTRAL to slightly BULLISH sentiment at 61% confidence. Strong fundamentals and market leadership position continue to support the stock, despite broader banking sector concerns.",
        reliance: "Reliance Industries shows BULLISH sentiment at 68% confidence. Jio's market expansion and retail growth are key positive drivers. The stock is well-positioned for continued growth.",
      };

      const lowerInput = input.toLowerCase();
      let response = "I can provide sentiment analysis for any Indian stock. Try asking about specific companies like Tata Motors, Infosys, HDFC Bank, or Reliance Industries. You can also ask about market trends or set up alerts.";

      for (const [key, value] of Object.entries(responses)) {
        if (lowerInput.includes(key)) {
          response = value;
          break;
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 ${isOpen ? 'hidden' : ''}`}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] max-h-[80vh] glass-card-elevated rounded-2xl overflow-hidden flex flex-col border border-border/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30 bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">fIndia AI Assistant</h3>
                  <p className="text-xs text-primary flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      message.role === "user"
                        ? "bg-primary/10"
                        : "bg-secondary/10"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4 text-primary" />
                    ) : (
                      <Bot className="h-4 w-4 text-secondary" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-xl max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Bot className="h-4 w-4 text-secondary" />
                  </div>
                  <div className="bg-muted p-3 rounded-xl">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/30 bg-muted/30">
              <div className="flex gap-2">
                <button
                  onClick={toggleListening}
                  className={`p-3 rounded-xl transition-all ${
                    isListening
                      ? "bg-destructive text-destructive-foreground animate-pulse"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {isListening ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about any stock..."
                  variant="glass"
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  variant="hero"
                  size="icon"
                  className="shrink-0"
                  disabled={!input.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
