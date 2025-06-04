
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Filter } from "lucide-react";

const mockPositions = [
  {
    id: 1,
    symbol: "SCOM",
    name: "Safaricom PLC",
    quantity: 100,
    avgPrice: 21.50,
    currentPrice: 22.70,
    marketValue: 2270,
    unrealizedPnL: 120,
    unrealizedPnLPercent: 5.58
  },
  {
    id: 2,
    symbol: "EQTY",
    name: "Equity Group",
    quantity: 50,
    avgPrice: 46.20,
    currentPrice: 45.50,
    marketValue: 2275,
    unrealizedPnL: -35,
    unrealizedPnLPercent: -1.52
  }
];

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

const mockHistory = [
  {
    id: 1,
    symbol: "SCOM",
    type: "Buy",
    quantity: 100,
    price: 21.50,
    total: 2150,
    timestamp: "2024-01-10 14:20:00",
    status: "Completed"
  },
  {
    id: 2,
    symbol: "EQTY",
    type: "Buy", 
    quantity: 50,
    price: 46.20,
    total: 2310,
    timestamp: "2024-01-08 11:45:00",
    status: "Completed"
  }
];

const PositionsOrders: React.FC = () => {
  const [sortBy, setSortBy] = useState("symbol");
  const [filterStatus, setFilterStatus] = useState("all");

  const totalPortfolioValue = mockPositions.reduce((sum, pos) => sum + pos.marketValue, 0);
  const totalUnrealizedPnL = mockPositions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0);
  const totalUnrealizedPnLPercent = (totalUnrealizedPnL / (totalPortfolioValue - totalUnrealizedPnL)) * 100;

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
            {mockPositions.map((position) => (
              <div key={position.id} className="bg-white/5 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold text-off-white">{position.symbol}</span>
                    <p className="text-xs text-off-white/60">{position.name}</p>
                  </div>
                  <div className={`flex items-center gap-1 ${position.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {position.unrealizedPnL >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span className="text-sm font-semibold">
                      {position.unrealizedPnLPercent >= 0 ? '+' : ''}{position.unrealizedPnLPercent.toFixed(2)}%
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
                    <span className="text-off-white">KES {position.marketValue.toLocaleString()}</span>
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
          {mockHistory.map((trade) => (
            <div key={trade.id} className="bg-white/5 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold text-off-white">{trade.symbol}</span>
                  <Badge variant={trade.type === 'Buy' ? 'default' : 'destructive'} className="text-xs ml-2">
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
              
              <p className="text-xs text-off-white/60 mt-2">{trade.timestamp}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PositionsOrders;
