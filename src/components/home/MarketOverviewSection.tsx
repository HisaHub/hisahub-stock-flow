
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useFinancialData } from "../../contexts/FinancialDataContext";

const MarketOverviewSection: React.FC = () => {
  const { state } = useFinancialData();

  // Mock additional market data
  const indices = [
    { name: "NSE 20", value: 1847.32, change: 2.1 },
    { name: "NSE All Share", value: 156.45, change: -0.8 },
  ];

  const currencies = [
    { pair: "USD/KES", rate: 129.45, change: 0.3 },
    { pair: "EUR/KES", rate: 141.20, change: -0.5 },
  ];

  // Get top gainers and losers
  const topGainers = [...state.stocks]
    .filter(stock => stock.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 3);

  const topLosers = [...state.stocks]
    .filter(stock => stock.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 3);

  const renderStockCard = (stock: any, type: 'gainer' | 'loser') => (
    <div key={stock.symbol} className="glass-card min-w-[200px] flex-shrink-0">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-off-white text-sm">{stock.symbol}</h4>
          <p className="text-xs text-off-white/60">{stock.name}</p>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
          type === 'gainer' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {type === 'gainer' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{type === 'gainer' ? '+' : ''}{stock.change.toFixed(2)}%</span>
        </div>
      </div>
      <p className="font-mono font-bold text-off-white">KES {stock.price.toFixed(2)}</p>
      {/* Mini chart placeholder */}
      <div className="h-8 mt-2 bg-white/5 rounded flex items-end justify-center">
        <div className="text-xs text-off-white/40">📈</div>
      </div>
    </div>
  );

  const renderIndexCard = (index: any) => (
    <div key={index.name} className="glass-card min-w-[180px] flex-shrink-0">
      <h4 className="font-semibold text-off-white text-sm mb-1">{index.name}</h4>
      <p className="font-mono font-bold text-off-white">{index.value.toFixed(2)}</p>
      <div className={`flex items-center gap-1 mt-1 text-xs ${
        index.change >= 0 ? 'text-green-400' : 'text-red-400'
      }`}>
        {index.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        <span>{index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}%</span>
      </div>
    </div>
  );

  const renderCurrencyCard = (currency: any) => (
    <div key={currency.pair} className="glass-card min-w-[160px] flex-shrink-0">
      <h4 className="font-semibold text-off-white text-sm mb-1">{currency.pair}</h4>
      <p className="font-mono font-bold text-off-white">{currency.rate.toFixed(2)}</p>
      <div className={`flex items-center gap-1 mt-1 text-xs ${
        currency.change >= 0 ? 'text-green-400' : 'text-red-400'
      }`}>
        {currency.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        <span>{currency.change >= 0 ? '+' : ''}{currency.change.toFixed(2)}%</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Gainers */}
      {topGainers.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-off-white mb-3">Top Gainers</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {topGainers.map(stock => renderStockCard(stock, 'gainer'))}
          </div>
        </div>
      )}

      {/* Top Losers */}
      {topLosers.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-off-white mb-3">Top Losers</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {topLosers.map(stock => renderStockCard(stock, 'loser'))}
          </div>
        </div>
      )}

      {/* Indices */}
      <div>
        <h3 className="text-lg font-bold text-off-white mb-3">Market Indices</h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {indices.map(renderIndexCard)}
        </div>
      </div>

      {/* Currencies */}
      <div>
        <h3 className="text-lg font-bold text-off-white mb-3">Currencies</h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {currencies.map(renderCurrencyCard)}
        </div>
      </div>
    </div>
  );
};

export default MarketOverviewSection;
