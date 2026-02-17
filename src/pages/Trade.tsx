import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import TradingChart from "../components/trading/TradingChart";
import StockSummary from "../components/trading/StockSummary";
import OrderPanel from "../components/trading/OrderPanel";
import PositionsOrders from "../components/trading/PositionsOrders";
import AlertsPanel from "../components/trading/AlertsPanel";
import NewsFeed from "../components/trading/NewsFeed";
import WatchlistPanel from "../components/trading/WatchlistPanel";
import ResearchPanel from "../components/trading/ResearchPanel";
import { useFinancialData, Stock } from "../contexts/FinancialDataContext";

const Trade: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useFinancialData();
  // Track selected symbol rather than a mocked Stock object
  const [selectedSymbol, setSelectedSymbol] = useState<string>(state.stocks?.[0]?.symbol || '');

  // Derive selected stock from live state
  const selectedStock = React.useMemo(() => {
    return state.stocks.find(s => s.symbol === selectedSymbol) || state.stocks?.[0] || null;
  }, [state.stocks, selectedSymbol]);

  const handleStockChange = (stockSymbol: string) => {
    setSelectedSymbol(stockSymbol);
  };

  const handleBrokerLogin = () => {
    navigate("/broker-integration");
  };

  // Update selected stock when prices change
  // Ensure selected symbol defaults to first available stock when data loads
  React.useEffect(() => {
    if ((!selectedSymbol || selectedSymbol === '') && state.stocks.length > 0) {
      setSelectedSymbol(state.stocks[0].symbol);
    }
  }, [state.stocks, selectedSymbol]);

  return (
    <div className="min-h-screen flex flex-col bg-primary font-sans transition-colors pb-20">
      
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col px-2 sm:px-4 py-4">
        {/* Stock Selector and Broker Login Row */}
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          {/* Stock Selector */}
          <div className="flex-1">
            <Select value={selectedSymbol} onValueChange={handleStockChange}>
              <SelectTrigger className="w-full bg-white/10 border-secondary/20 text-off-white">
                <SelectValue>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">{selectedStock?.symbol ?? '—'}</span>
                      <span className="text-xs text-off-white/60">{selectedStock?.name ?? ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">KES {selectedStock ? selectedStock.price.toFixed(2) : '--'}</span>
                      <span className={`text-xs ${selectedStock && selectedStock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedStock ? `${selectedStock.change >= 0 ? '+' : ''}${selectedStock.change.toFixed(2)}%` : ''}
                      </span>
                    </div>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-primary border-secondary/20">
                {state.stocks.map((stock) => (
                  <SelectItem key={stock.symbol} value={stock.symbol} className="text-off-white focus:bg-white/10">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">{stock.symbol}</span>
                        <span className="text-xs text-off-white/60">{stock.name}</span>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="font-mono text-sm">KES {stock.price.toFixed(2)}</span>
                        <span className={`text-xs ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Broker Login Button */}
          <div className="w-full sm:w-auto">
            <Button
              onClick={handleBrokerLogin}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-secondary/20 text-off-white px-4 py-2 h-full"
              variant="outline"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Broker Login
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 flex-1">
          {/* Left Column - Chart and Stock Info */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {selectedStock ? (
              <>
                <StockSummary stock={selectedStock} />
                <TradingChart symbol={selectedStock.symbol} />
              </>
            ) : (
              <div className="glass-card animate-fade-in p-6 text-center text-off-white/60">
                No stock selected or market data unavailable
              </div>
            )}
          </div>

          {/* Right Column - Trading Panel */}
          <div className="space-y-4 sm:space-y-6">
            {selectedStock ? (
              <OrderPanel stock={selectedStock} />
            ) : (
              <div className="glass-card animate-fade-in p-4 text-center text-off-white/60">
                Select a stock to place orders
              </div>
            )}
            
            {/* Mobile Tabs for additional content */}
            <div className="lg:hidden">
              <Tabs defaultValue="positions" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-white/10 text-xs">
                  <TabsTrigger value="positions" className="text-xs">Positions</TabsTrigger>
                  <TabsTrigger value="watchlist" className="text-xs">Watch</TabsTrigger>
                  <TabsTrigger value="research" className="text-xs">Research</TabsTrigger>
                  <TabsTrigger value="alerts" className="text-xs">Alerts</TabsTrigger>
                  <TabsTrigger value="news" className="text-xs">News</TabsTrigger>
                </TabsList>
                <TabsContent value="positions" className="mt-4">
                  <PositionsOrders />
                </TabsContent>
                <TabsContent value="watchlist" className="mt-4">
                  <WatchlistPanel />
                </TabsContent>
                <TabsContent value="research" className="mt-4">
                  {selectedStock ? <ResearchPanel stock={selectedStock} /> : <div className="text-sm text-off-white/60">No stock selected</div>}
                </TabsContent>
                <TabsContent value="alerts" className="mt-4">
                  {selectedStock ? <AlertsPanel stock={selectedStock} /> : <div className="text-sm text-off-white/60">No stock selected</div>}
                </TabsContent>
                <TabsContent value="news" className="mt-4">
                  {selectedStock ? <NewsFeed stock={selectedStock} /> : <div className="text-sm text-off-white/60">No stock selected</div>}
                </TabsContent>
              </Tabs>
            </div>

            {/* Desktop - Show all panels */}
              <div className="hidden lg:block space-y-6">
              <PositionsOrders />
              <WatchlistPanel />
              {selectedStock ? <ResearchPanel stock={selectedStock} /> : <div className="text-sm text-off-white/60">No stock selected</div>}
              {selectedStock ? <AlertsPanel stock={selectedStock} /> : <div className="text-sm text-off-white/60">No stock selected</div>}
              {selectedStock ? <NewsFeed stock={selectedStock} /> : <div className="text-sm text-off-white/60">No stock selected</div>}
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Trade;
