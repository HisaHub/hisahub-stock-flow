
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Filter } from "lucide-react";
import { useFinancialData } from "../../contexts/FinancialDataContext";

const PositionsOrders: React.FC = () => {
  const { state } = useFinancialData();
  const [sortBy, setSortBy] = useState("symbol");
  const [filterStatus, setFilterStatus] = useState("all");

  const totalPortfolioValue = state.portfolioData.totalValue;
  const totalUnrealizedPnL = state.holdings.reduce((sum, pos) => sum + pos.profitLoss, 0);
  const totalUnrealizedPnLPercent = state.portfolioData.dailyChangePercent;

  // Mock orders data - in real app this would come from context too
  const mockOrders = [
    {
      id: 1,
      symbol: "KCB",
      type: "Buy",
      orderType: "Limit",
      quantity: 75,
      price: 37.50,
      status: "Pending",
      timestamp: "2024-01-15 10:30:00"
    },
    {
      id: 2,
      symbol: "COOP",
      type: "Sell",
      orderType: "Market",
      quantity: 200,
      price: 12.85,
      status: "Filled",
      timestamp: "2024-01-15 09:15:00"
    }
  ];

  return (
    <div className="glass-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-off-white">Positions & Orders</h3>
        <Button size="sm" variant="outline" className="p-2">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="positions" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/10">
          <TabsTrigger value="positions" className="text-xs">Positions</TabsTrigger>
          <TabsTrigger value="orders" className="text-xs">Orders</TabsTrigger>
          <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="mt-4 space-y-4">
          {/* Portfolio Summary */}
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-off-white/60 text-sm">Total Value:</span>
              <span className="text-off-white font-semibold">KES {totalPortfolioValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-off-white/60 text-sm">Unrealized P&L:</span>
              <div className={`flex items-center gap-1 ${totalUnrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalUnrealizedPnL >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span className="font-semibold">
                  KES {totalUnrealizedPnL.toFixed(2)} ({totalUnrealizedPnLPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Positions List */}
          <div className="space-y-2">
            {state.holdings.map((position) => (
              <div key={position.id} className="bg-white/5 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold text-off-white">{position.symbol}</span>
                    <p className="text-xs text-off-white/60">{position.name}</p>
                  </div>
                  <div className={`flex items-center gap-1 ${position.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {position.profitLoss >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span className="text-sm font-semibold">
                      {position.profitLossPercent >= 0 ? '+' : ''}{position.profitLossPercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-off-white/60">Qty: </span>
                    <span className="text-off-white">{position.quantity}</span>
                  </div>
                  <div>
                    <span className="text-off-white/60">Avg: </span>
                    <span className="text-off-white">KES {position.avgPrice.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-off-white/60">Current: </span>
                    <span className="text-off-white">KES {position.currentPrice.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-off-white/60">Value: </span>
                    <span className="text-off-white">KES {position.value.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-4 space-y-2">
          {mockOrders.map((order) => (
            <div key={order.id} className="bg-white/5 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold text-off-white">{order.symbol}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={order.type === 'Buy' ? 'default' : 'destructive'} className="text-xs">
                      {order.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {order.orderType}
                    </Badge>
                  </div>
                </div>
                <Badge 
                  variant={order.status === 'Filled' ? 'default' : order.status === 'Pending' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {order.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-off-white/60">Qty: </span>
                  <span className="text-off-white">{order.quantity}</span>
                </div>
                <div>
                  <span className="text-off-white/60">Price: </span>
                  <span className="text-off-white">KES {order.price.toFixed(2)}</span>
                </div>
              </div>
              
              <p className="text-xs text-off-white/60 mt-2">{order.timestamp}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-2">
          {state.transactions.slice(0, 5).map((trade) => (
            <div key={trade.id} className="bg-white/5 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold text-off-white">{trade.symbol}</span>
                  <Badge variant={trade.type === 'BUY' ? 'default' : 'destructive'} className="text-xs ml-2">
                    {trade.type}
                  </Badge>
                </div>
                <span className="text-off-white font-semibold">KES {trade.total.toLocaleString()}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-off-white/60">Qty: </span>
                  <span className="text-off-white">{trade.quantity}</span>
                </div>
                <div>
                  <span className="text-off-white/60">Price: </span>
                  <span className="text-off-white">KES {trade.price.toFixed(2)}</span>
                </div>
              </div>
              
              <p className="text-xs text-off-white/60 mt-2">{trade.date}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PositionsOrders;
