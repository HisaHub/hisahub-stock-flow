import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface OrderBookLevel {
  price: number;
  quantity: number;
  total: number;
}

interface OrderBookProps {
  symbol: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  lastPrice?: number;
  spread?: number;
  maxDepth?: number;
}

const OrderBook: React.FC<OrderBookProps> = ({ 
  symbol, 
  bids, 
  asks, 
  lastPrice = 0,
  spread = 0,
  maxDepth = 10 
}) => {
  // Calculate max volume for depth visualization
  const maxBidVolume = useMemo(() => 
    Math.max(...bids.map(b => b.total), 1), 
    [bids]
  );
  const maxAskVolume = useMemo(() => 
    Math.max(...asks.map(a => a.total), 1), 
    [asks]
  );

  // Limit depth
  const displayBids = useMemo(() => bids.slice(0, maxDepth), [bids, maxDepth]);
  const displayAsks = useMemo(() => asks.slice(0, maxDepth).reverse(), [asks, maxDepth]);

  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    });
  };

  const getDepthWidth = (total: number, maxVolume: number) => {
    return `${(total / maxVolume) * 100}%`;
  };

  return (
    <Card className="bg-primary/50 border-secondary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-off-white text-lg">Order Book - {symbol}</CardTitle>
          <div className="text-xs text-off-white/60">
            Spread: <span className="text-secondary">{formatNumber(spread, 4)}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Header */}
        <div className="grid grid-cols-3 gap-2 px-4 py-2 text-xs font-medium text-off-white/60 border-b border-secondary/20">
          <div className="text-left">Price (KES)</div>
          <div className="text-right">Quantity</div>
          <div className="text-right">Total</div>
        </div>

        {/* Asks (Sell Orders) */}
        <div className="space-y-0.5 py-2">
          {displayAsks.map((ask, idx) => (
            <div
              key={`ask-${idx}`}
              className="relative px-4 py-1 hover:bg-red-500/10 transition-colors cursor-pointer group"
            >
              {/* Depth visualization */}
              <div
                className="absolute right-0 top-0 h-full bg-red-500/10 transition-all duration-300"
                style={{ width: getDepthWidth(ask.total, maxAskVolume) }}
              />
              
              {/* Data */}
              <div className="relative grid grid-cols-3 gap-2 text-sm">
                <div className="text-red-400 font-medium">{formatNumber(ask.price)}</div>
                <div className="text-off-white text-right">{formatNumber(ask.quantity, 4)}</div>
                <div className="text-off-white/60 text-right text-xs">{formatNumber(ask.total, 4)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Last Price / Spread Indicator */}
        <div className="px-4 py-3 bg-secondary/10 border-y border-secondary/20">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-off-white">
              {formatNumber(lastPrice)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              {lastPrice > 0 && (
                <>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Last</span>
                </>
              )}
            </div>
          </div>
          {spread > 0 && (
            <div className="text-xs text-off-white/60 mt-1">
              Spread: {formatNumber(spread, 4)} ({((spread / lastPrice) * 100).toFixed(2)}%)
            </div>
          )}
        </div>

        {/* Bids (Buy Orders) */}
        <div className="space-y-0.5 py-2">
          {displayBids.map((bid, idx) => (
            <div
              key={`bid-${idx}`}
              className="relative px-4 py-1 hover:bg-green-500/10 transition-colors cursor-pointer group"
            >
              {/* Depth visualization */}
              <div
                className="absolute right-0 top-0 h-full bg-green-500/10 transition-all duration-300"
                style={{ width: getDepthWidth(bid.total, maxBidVolume) }}
              />
              
              {/* Data */}
              <div className="relative grid grid-cols-3 gap-2 text-sm">
                <div className="text-green-400 font-medium">{formatNumber(bid.price)}</div>
                <div className="text-off-white text-right">{formatNumber(bid.quantity, 4)}</div>
                <div className="text-off-white/60 text-right text-xs">{formatNumber(bid.total, 4)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="px-4 py-2 border-t border-secondary/20 text-xs text-off-white/60">
          <div className="flex justify-between">
            <span>Bid Volume: {formatNumber(bids.reduce((sum, b) => sum + b.total, 0))}</span>
            <span>Ask Volume: {formatNumber(asks.reduce((sum, a) => sum + a.total, 0))}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderBook;
