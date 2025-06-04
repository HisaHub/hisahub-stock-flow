
import React, { useState, useEffect } from "react";
import { Star, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

interface StockSummaryProps {
  stock: Stock;
}

const StockSummary: React.FC<StockSummaryProps> = ({ stock }) => {
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [realTimePrice, setRealTimePrice] = useState(stock.price);
  const [priceChange, setPriceChange] = useState(stock.change);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 0.5;
      setRealTimePrice(prev => Number((prev + change).toFixed(2)));
      setPriceChange(prev => Number((prev + change * 0.1).toFixed(2)));
    }, 3000);

    return () => clearInterval(interval);
  }, [stock.symbol]);

  const isPositive = priceChange >= 0;
  const percentChange = ((priceChange / realTimePrice) * 100).toFixed(2);

  // Mock additional data
  const marketCap = "KES 1.2T";
  const peRatio = "15.4";
  const volume = "2.1M";
  const dayRange = `${(realTimePrice * 0.98).toFixed(2)} - ${(realTimePrice * 1.02).toFixed(2)}`;

  return (
    <div className="glass-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-off-white">{stock.name}</h2>
          <p className="text-off-white/60 text-sm">{stock.symbol}</p>
        </div>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsWatchlisted(!isWatchlisted)}
          className={`p-2 ${isWatchlisted ? 'text-yellow-400' : 'text-off-white/60'}`}
        >
          <Star className={`h-4 w-4 ${isWatchlisted ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Price Section */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-off-white font-mono">
            KES {realTimePrice.toFixed(2)}
          </span>
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${
            isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{isPositive ? '+' : ''}{priceChange.toFixed(2)}</span>
            <span>({isPositive ? '+' : ''}{percentChange}%)</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-off-white/60 text-xs">Market Cap</p>
          <p className="text-off-white font-semibold">{marketCap}</p>
        </div>
        <div className="text-center">
          <p className="text-off-white/60 text-xs">P/E Ratio</p>
          <p className="text-off-white font-semibold">{peRatio}</p>
        </div>
        <div className="text-center">
          <p className="text-off-white/60 text-xs">Volume</p>
          <p className="text-off-white font-semibold">{volume}</p>
        </div>
        <div className="text-center">
          <p className="text-off-white/60 text-xs">Day Range</p>
          <p className="text-off-white font-semibold text-xs">{dayRange}</p>
        </div>
      </div>

      {/* Live indicator */}
      <div className="flex items-center justify-center mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live Market Data</span>
        </div>
      </div>
    </div>
  );
};

export default StockSummary;
