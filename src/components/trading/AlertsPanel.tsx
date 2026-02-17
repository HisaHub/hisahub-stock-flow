
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

interface AlertsPanelProps {
  stock: Stock;
}

interface Alert {
  id: number;
  symbol: string;
  type: "above" | "below";
  price: number;
  isActive: boolean;
  method: "push" | "sms" | "email";
  createdAt: string;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ stock }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const [newAlertPrice, setNewAlertPrice] = useState("");
  const [newAlertType, setNewAlertType] = useState<"above" | "below">("above");
  const [newAlertMethod, setNewAlertMethod] = useState<"push" | "sms" | "email">("push");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const { data, error } = await supabase.from('alerts').select('*').eq('symbol', stock.symbol);
        if (error) throw error;
        setAlerts((data || []) as Alert[]);
      } catch (err) {
        // If alerts table doesn't exist or fetch fails, keep empty list
        console.debug('Could not load alerts:', err);
      }
    };

    if (stock && stock.symbol) loadAlerts();
  }, [stock]);

  const addAlert = () => {
    if (!newAlertPrice || parseFloat(newAlertPrice) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const price = parseFloat(newAlertPrice);
    const currentPrice = stock.price;

    if (
      (newAlertType === "above" && price <= currentPrice) ||
      (newAlertType === "below" && price >= currentPrice)
    ) {
      toast.error(`Price must be ${newAlertType} current price of KES ${currentPrice.toFixed(2)}`);
      return;
    }

    const newAlert: Alert = {
      id: Date.now(),
      symbol: stock.symbol,
      type: newAlertType,
      price: price,
      isActive: true,
      method: newAlertMethod,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Try to persist to Supabase, but fall back to local state if table missing
    (async () => {
      try {
        const { data, error } = await supabase.from('alerts').insert([{ ...newAlert }]).select();
        if (error) throw error;
        setAlerts(prev => [...prev, ...(data || [newAlert])]);
      } catch (err) {
        setAlerts(prev => [...prev, newAlert]);
        console.debug('Persisting alert failed, using local state', err);
      }
    })();
    setNewAlertPrice("");
    setShowAddForm(false);
    toast.success(`Alert set for ${stock.symbol} ${newAlertType} KES ${price.toFixed(2)}`);
  };

  const toggleAlert = (id: number) => {
    const updated = alerts.map(alert => alert.id === id ? { ...alert, isActive: !alert.isActive } : alert);
    setAlerts(updated);
    (async () => {
      try {
        const alert = updated.find(a => a.id === id);
        if (!alert) return;
        await supabase.from('alerts').update({ isActive: alert.isActive }).eq('id', id);
      } catch (err) {
        console.debug('Failed to update alert active state', err);
      }
    })();
  };

  const deleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    (async () => {
      try {
        await supabase.from('alerts').delete().eq('id', id);
      } catch (err) {
        console.debug('Failed to delete alert from DB', err);
      }
    })();
    toast.success("Alert deleted");
  };

  const stockAlerts = alerts.filter(alert => alert.symbol === stock.symbol);

  return (
    <div className="glass-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-secondary" />
          <h3 className="text-lg font-bold text-off-white">Price Alerts</h3>
        </div>
        <Button
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-secondary hover:bg-secondary/80"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Add Alert Form */}
      {showAddForm && (
        <div className="bg-white/5 rounded-lg p-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-off-white text-xs">Alert Type</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  size="sm"
                  variant={newAlertType === "above" ? "secondary" : "outline"}
                  onClick={() => setNewAlertType("above")}
                  className="flex-1 text-xs"
                >
                  Above
                </Button>
                <Button
                  size="sm"
                  variant={newAlertType === "below" ? "secondary" : "outline"}
                  onClick={() => setNewAlertType("below")}
                  className="flex-1 text-xs"
                >
                  Below
                </Button>
              </div>
            </div>
            
            <div>
              <Label className="text-off-white text-xs">Price (KES)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder={`Current: ${stock.price.toFixed(2)}`}
                value={newAlertPrice}
                onChange={(e) => setNewAlertPrice(e.target.value)}
                className="bg-white/10 border-secondary/20 text-off-white text-xs mt-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-off-white text-xs">Notification Method</Label>
            <div className="flex gap-2 mt-1">
              <Button
                size="sm"
                variant={newAlertMethod === "push" ? "secondary" : "outline"}
                onClick={() => setNewAlertMethod("push")}
                className="flex-1 text-xs"
              >
                Push
              </Button>
              <Button
                size="sm"
                variant={newAlertMethod === "sms" ? "secondary" : "outline"}
                onClick={() => setNewAlertMethod("sms")}
                className="flex-1 text-xs"
              >
                SMS
              </Button>
              <Button
                size="sm"
                variant={newAlertMethod === "email" ? "secondary" : "outline"}
                onClick={() => setNewAlertMethod("email")}
                className="flex-1 text-xs"
              >
                Email
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={addAlert} className="flex-1 bg-green-600 hover:bg-green-700">
              Add Alert
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Current Alerts */}
      <div className="space-y-2">
        {stockAlerts.length === 0 ? (
          <div className="text-center py-6 text-off-white/60">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No alerts set for {stock.symbol}</p>
            <p className="text-xs">Create your first price alert above</p>
          </div>
        ) : (
          stockAlerts.map((alert) => (
            <div key={alert.id} className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={alert.type === "above" ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {alert.type === "above" ? "↗" : "↘"} {alert.type}
                  </Badge>
                  <span className="text-off-white font-semibold">KES {alert.price.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={alert.isActive}
                    onCheckedChange={() => toggleAlert(alert.id)}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteAlert(alert.id)}
                    className="p-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs text-off-white/60">
                <span>via {alert.method.toUpperCase()}</span>
                <span>Created: {alert.createdAt}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alert Settings */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-off-white/60 mb-2">Notification Settings</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-off-white">Push Notifications</span>
            <Switch defaultChecked />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-off-white">SMS Alerts</span>
            <Switch />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-off-white">Email Alerts</span>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;
