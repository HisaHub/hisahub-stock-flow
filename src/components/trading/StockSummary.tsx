
import React, { useState } from "react";
import { Star, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stock } from "../../contexts/FinancialDataContext";

interface StockSummaryProps {
  stock: Stock;
}

const StockSummary: React.FC<StockSummaryProps> = ({ stock }) => {
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  const isPositive = stock.change >= 0;
  const percentChange = stock.changePercent;

  // Format volume for display
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  return (
    <div className="glass-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-off-white">{stock.name}</h2>
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
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
        <span className="text-2xl sm:text-3xl font-bold text-off-white font-mono">
          KES {stock.price.toFixed(2)}
        </span>
        <div className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${
          isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>({isPositive ? '+' : ''}{percentChange}%)</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-off-white/60 text-xs">Market Cap</p>
          <p className="text-off-white font-semibold text-sm">N/A</p>
        </div>
        <div className="text-center">
          <p className="text-off-white/60 text-xs">P/E Ratio</p>
          <p className="text-off-white font-semibold text-sm">N/A</p>
        </div>
        <div className="text-center">
          <p className="text-off-white/60 text-xs">Volume</p>
          <p className="text-off-white font-semibold text-sm">{formatVolume(stock.volume)}</p>
        </div>
        <div className="text-center">
          <p className="text-off-white/60 text-xs">Day Range</p>
          <p className="text-off-white font-semibold text-xs">{stock.low.toFixed(2)} - {stock.high.toFixed(2)}</p>
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
