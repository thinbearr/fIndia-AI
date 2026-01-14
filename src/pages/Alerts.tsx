import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Plus, X, Check, Clock, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Chatbot from "@/components/chatbot/Chatbot";

interface Alert {
  id: string;
  stock: string;
  ticker: string;
  condition: "bullish" | "bearish" | "strongly_bullish" | "strongly_bearish";
  active: boolean;
  createdAt: string;
}

interface AlertHistory {
  id: string;
  stock: string;
  ticker: string;
  condition: string;
  triggeredAt: string;
  message: string;
}

const initialAlerts: Alert[] = [
  { id: "1", stock: "Tata Motors", ticker: "TATAMOTORS", condition: "bearish", active: true, createdAt: "2024-01-15" },
  { id: "2", stock: "Infosys", ticker: "INFY", condition: "strongly_bullish", active: true, createdAt: "2024-01-14" },
  { id: "3", stock: "HDFC Bank", ticker: "HDFCBANK", condition: "bearish", active: false, createdAt: "2024-01-12" },
];

const alertHistory: AlertHistory[] = [
  { id: "h1", stock: "Reliance Industries", ticker: "RELIANCE", condition: "Became Bullish", triggeredAt: "2 hours ago", message: "Sentiment shifted to bullish with 68% confidence" },
  { id: "h2", stock: "Adani Enterprises", ticker: "ADANIENT", condition: "Became Strongly Bearish", triggeredAt: "1 day ago", message: "Sentiment dropped significantly to 38%" },
  { id: "h3", stock: "Bharti Airtel", ticker: "BHARTIARTL", condition: "Became Bullish", triggeredAt: "2 days ago", message: "Positive news flow increased sentiment to 72%" },
];

const Alerts = () => {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAlert, setNewAlert] = useState({ stock: "", condition: "bearish" as Alert["condition"] });

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, active: !alert.active } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const createAlert = () => {
    if (newAlert.stock.trim()) {
      setAlerts([...alerts, {
        id: Date.now().toString(),
        stock: newAlert.stock,
        ticker: newAlert.stock.toUpperCase().replace(/\s+/g, ""),
        condition: newAlert.condition,
        active: true,
        createdAt: new Date().toISOString().split("T")[0],
      }]);
      setNewAlert({ stock: "", condition: "bearish" });
      setShowCreateModal(false);
    }
  };

  const conditionLabels = {
    bullish: { label: "Becomes Bullish", icon: TrendingUp, color: "text-bullish" },
    bearish: { label: "Becomes Bearish", icon: TrendingDown, color: "text-destructive" },
    strongly_bullish: { label: "Strongly Bullish (>70%)", icon: TrendingUp, color: "text-bullish" },
    strongly_bearish: { label: "Strongly Bearish (<40%)", icon: TrendingDown, color: "text-destructive" },
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
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <Bell className="h-8 w-8 text-primary" />
                Sentiment Alerts
              </h1>
              <p className="text-muted-foreground">Get notified when market mood changes</p>
            </div>
            <Button variant="hero" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-5 w-5" />
              Create Alert
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Active Alerts ({alerts.filter(a => a.active).length})
              </h2>
              <div className="space-y-3">
                {alerts.map((alert, index) => {
                  const config = conditionLabels[alert.condition];
                  const Icon = config.icon;
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`glass-card rounded-xl p-5 ${!alert.active ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${alert.active ? "bg-primary/10" : "bg-muted"}`}>
                            <Icon className={`h-5 w-5 ${alert.active ? config.color : "text-muted-foreground"}`} />
                          </div>
                          <div>
                            <p className="font-semibold">{alert.stock}</p>
                            <p className="text-sm text-muted-foreground font-mono">{alert.ticker}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleAlert(alert.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              alert.active
                                ? "bg-primary/10 text-primary hover:bg-primary/20"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteAlert(alert.id)}
                            className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <span className={`${config.color} font-medium`}>{config.label}</span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Created {alert.createdAt}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}

                {alerts.length === 0 && (
                  <div className="glass-card rounded-xl p-12 text-center">
                    <Bell className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No alerts set</h3>
                    <p className="text-muted-foreground mb-6">Create alerts to get notified about sentiment changes</p>
                    <Button variant="hero" onClick={() => setShowCreateModal(true)}>
                      <Plus className="h-5 w-5" />
                      Create Your First Alert
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Alert History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-secondary" />
                Trigger History
              </h2>
              <div className="space-y-3">
                {alertHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card rounded-xl p-5"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{item.stock}</p>
                        <p className="text-sm text-muted-foreground font-mono">{item.ticker}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.triggeredAt}</span>
                    </div>
                    <p className="text-sm text-primary font-medium mb-1">{item.condition}</p>
                    <p className="text-sm text-muted-foreground">{item.message}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Create Alert Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card-elevated rounded-2xl w-full max-w-md mx-4 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Create Alert</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Stock Name</label>
                <Input
                  placeholder="e.g., Tata Motors"
                  value={newAlert.stock}
                  onChange={(e) => setNewAlert({ ...newAlert, stock: e.target.value })}
                  variant="glass"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Alert Condition</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(conditionLabels).map(([key, value]) => {
                    const Icon = value.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setNewAlert({ ...newAlert, condition: key as Alert["condition"] })}
                        className={`p-3 rounded-xl text-left transition-all ${
                          newAlert.condition === key
                            ? "bg-primary/10 border-2 border-primary"
                            : "glass-card hover:bg-muted"
                        }`}
                      >
                        <Icon className={`h-5 w-5 mb-1 ${value.color}`} />
                        <p className="text-sm font-medium">{value.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="glass" className="flex-1" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button variant="hero" className="flex-1" onClick={createAlert}>
                  Create Alert
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Chatbot />
    </div>
  );
};

export default Alerts;
