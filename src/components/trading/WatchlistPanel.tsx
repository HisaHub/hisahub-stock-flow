
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Star, StarOff, Plus, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { useFinancialData } from '../../contexts/FinancialDataContext';
import { toast } from 'sonner';

const WatchlistPanel: React.FC = () => {
  const { state } = useFinancialData();
  const [watchlist, setWatchlist] = useState<string[]>(['SCOM', 'KCB']);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddStock, setShowAddStock] = useState(false);

  const watchedStocks = state.stocks.filter(stock => watchlist.includes(stock.symbol));
  const availableStocks = state.stocks.filter(stock => 
    !watchlist.includes(stock.symbol) && 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
      toast.success(`${symbol} added to watchlist`);
      setSearchTerm('');
      setShowAddStock(false);
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(s => s !== symbol));
    toast.success(`${symbol} removed from watchlist`);
  };

  return (
    <div className="glass-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-secondary" />
          <h3 className="text-lg font-bold text-off-white">Watchlist</h3>
        </div>
        <Button
          size="sm"
          onClick={() => setShowAddStock(!showAddStock)}
          className="bg-secondary hover:bg-secondary/80"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Add Stock Form */}
      {showAddStock && (
        <div className="bg-white/5 rounded-lg p-3 mb-4">
          <div className="flex gap-2 mb-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-off-white/60" />
              <Input
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-white/10 border-secondary/20 text-off-white text-sm"
              />
            </div>
          </div>
          {searchTerm && (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {availableStocks.map(stock => (
                <div 
                  key={stock.symbol}
                  onClick={() => addToWatchlist(stock.symbol)}
                  className="flex items-center justify-between p-2 hover:bg-white/10 rounded cursor-pointer"
                >
                  <div>
                    <span className="font-semibold text-off-white text-sm">{stock.symbol}</span>
                    <p className="text-xs text-off-white/60">{stock.name}</p>
                  </div>
                  <span className="text-xs text-off-white">KES {stock.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Watchlist Items */}
      <div className="space-y-2">
        {watchedStocks.length === 0 ? (
          <div className="text-center py-6 text-off-white/60">
            <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No stocks in watchlist</p>
          </div>
        ) : (
          watchedStocks.map(stock => {
            const isPositive = stock.change >= 0;
            return (
              <div key={stock.symbol} className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-off-white">{stock.symbol}</span>
                      <Badge variant={isPositive ? "default" : "destructive"} className="text-xs">
                        {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {isPositive ? '+' : ''}{stock.change.toFixed(2)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-off-white/60">{stock.name}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-mono font-semibold text-off-white text-sm">
                      KES {stock.price.toFixed(2)}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromWatchlist(stock.symbol)}
                      className="p-1 h-auto"
                    >
                      <StarOff className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WatchlistPanel;
