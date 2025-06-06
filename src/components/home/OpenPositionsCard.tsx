
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useFinancialData } from "../../contexts/FinancialDataContext";

const OpenPositionsCard: React.FC = () => {
  const { state } = useFinancialData();
  
  // Show top 3 holdings
  const topHoldings = state.holdings
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  if (topHoldings.length === 0) {
    return (
      <div className="glass-card animate-fade-in">
        <h2 className="text-lg font-bold text-off-white mb-4">Open Positions</h2>
        <div className="text-center py-8">
          <p className="text-off-white/60 mb-4">No open positions yet</p>
          <Link 
            to="/trade" 
            className="inline-block bg-secondary text-primary font-semibold px-4 py-2 rounded-lg hover:bg-secondary/90 transition"
          >
            Start Trading
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-off-white">Open Positions</h2>
        <Link 
          to="/portfolio" 
          className="text-secondary text-sm hover:text-secondary/80 transition"
        >
          View All
        </Link>
      </div>
      
      <div className="space-y-3">
        {topHoldings.map((holding) => {
          const isPositive = holding.profitLossPercent >= 0;
          return (
            <div key={holding.id} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-off-white">{holding.symbol}</span>
                  <span className="text-xs text-off-white/60">{holding.quantity} shares</span>
                </div>
                <p className="text-xs text-off-white/60">{holding.name}</p>
              </div>
              
              <div className="text-right">
                <p className="font-mono font-semibold text-off-white">
                  KES {holding.value.toLocaleString()}
                </p>
                <div className={`flex items-center gap-1 justify-end text-xs ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{isPositive ? '+' : ''}{holding.profitLossPercent.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OpenPositionsCard;
