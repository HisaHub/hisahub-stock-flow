
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useFinancialData } from "../contexts/FinancialDataContext";

const MarketOverview: React.FC = () => {
  const { state } = useFinancialData();
  
  // Use the first 3 stocks from our real data, or fallback to mock data
  const displayStocks = state.stocks.slice(0, 3).length > 0 
    ? state.stocks.slice(0, 3).map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: `${stock.changePercent}`,
        changeDir: stock.change >= 0 ? "up" : "down"
      }))
    : [
        {
          symbol: "SCOM",
          name: "Safaricom PLC",
          price: 28.50,
          change: "+1.79%",
          changeDir: "up",
        },
        {
          symbol: "KCB",
          name: "KCB Group",
          price: 38.25,
          change: "-0.85%",
          changeDir: "down",
        },
        {
          symbol: "EQTY",
          name: "Equity Group",
          price: 45.75,
          change: "+2.15%",
          changeDir: "up",
        },
      ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      {displayStocks.map((stock) => (
        <div key={stock.symbol} className="glass-card flex flex-col items-start animate-fade-in">
          <div className="flex justify-between w-full items-center">
            <span className="font-mono text-lg font-semibold text-primary">{stock.symbol}</span>
            <span
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${
                stock.changeDir === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
              }`}
            >
              {stock.changeDir === "up" ? (
                <>
                  {stock.change}
                  <TrendingUp size={14} strokeWidth={2} className="text-green-700" />
                </>
              ) : (
                <>
                  {stock.change}
                  <TrendingDown size={14} strokeWidth={2} className="text-red-600" />
                </>
              )}
            </span>
          </div>
          <div className="font-semibold text-charcoal text-xl market-mono mt-2 mb-1">
            KES {stock.price.toFixed(2)}
          </div>
          <div className="text-sm text-neutral">{stock.name}</div>
        </div>
      ))}
    </div>
  );
};

export default MarketOverview;
