
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useFinancialData } from "../contexts/FinancialDataContext";

const MarketOverview: React.FC = () => {
  const { state } = useFinancialData();
  
  const displayStocks = state.stocks.slice(0, 3);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      {displayStocks.length === 0 ? (
        <div className="col-span-1 sm:col-span-3 glass-card p-6 text-center text-off-white/60">No market data available</div>
      ) : (
        displayStocks.map((stock: any) => {
          const price = typeof stock.price === 'number' ? stock.price : Number(stock.price || 0);
          const change = typeof stock.change === 'number' ? stock.change : Number(stock.change || stock.changePercent || 0);
          const pct = typeof stock.changePercent === 'string' ? Number(stock.changePercent) : (stock.changePercent || change);
          const isUp = (change || 0) >= 0;

          return (
            <div key={stock.symbol} className="glass-card flex flex-col items-start animate-fade-in">
              <div className="flex justify-between w-full items-center">
                <span className="font-mono text-lg font-semibold text-primary">{stock.symbol}</span>
                <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  <span>{isUp ? '+' : ''}{Number(pct).toFixed(2)}%</span>
                  {isUp ? (
                    <TrendingUp size={14} strokeWidth={2} className="text-green-700" />
                  ) : (
                    <TrendingDown size={14} strokeWidth={2} className="text-red-600" />
                  )}
                </span>
              </div>
              <div className="font-semibold text-charcoal text-xl market-mono mt-2 mb-1">
                KES {Number(price).toFixed(2)}
              </div>
              <div className="text-sm text-neutral">{stock.name}</div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MarketOverview;
