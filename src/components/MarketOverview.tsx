
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const mockData = [
  {
    symbol: "SCOM",
    name: "Safaricom PLC",
    price: 17.65,
    change: "+5.2%",
    changeDir: "up",
  },
  {
    symbol: "KCB",
    name: "KCB Group",
    price: 36.10,
    change: "-1.3%",
    changeDir: "down",
  },
  {
    symbol: "EABL",
    name: "E.A. Breweries",
    price: 146.00,
    change: "+2.1%",
    changeDir: "up",
  },
];

const MarketOverview: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
    {mockData.map((stock) => (
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
                +{stock.change}
                <TrendingUp size={14} strokeWidth={2} className="text-green-700" />
              </>
            ) : (
              <>
                -{stock.change}
                <TrendingDown size={14} strokeWidth={2} className="text-red-600" />
              </>
            )}
          </span>
        </div>
        <div className="font-semibold text-charcoal text-xl market-mono mt-2 mb-1">{stock.price.toFixed(2)}</div>
        <div className="text-sm text-neutral">{stock.name}</div>
      </div>
    ))}
  </div>
);

export default MarketOverview;
