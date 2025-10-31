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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LogIn, Search } from "lucide-react";
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
  const [selectedStock, setSelectedStock] = useState<Stock>(state.stocks[0] || {
    id: '',
    symbol: 'SCOM',
    name: 'Safaricom PLC',
    sector: 'Technology',
    price: 28.50,
    volume: 1000000,
    high: 29.00,
    low: 28.00,
    change: 0.50,
    changePercent: '1.79'
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredStocks = state.stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStockChange = (stockSymbol: string) => {
    const stock = state.stocks.find(s => s.symbol === stockSymbol);
    if (stock) {
      setSelectedStock(stock);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleBrokerLogin = () => {
    navigate("/broker-integration");
  };

  // Update selected stock when prices change
  React.useEffect(() => {
    if (state.stocks.length > 0 && selectedStock) {
      const updatedStock = state.stocks.find(s => s.symbol === selectedStock.symbol);
      if (updatedStock) {
        setSelectedStock(updatedStock);
      }
    }
  }, [state.stocks, selectedStock]);

  return (
    <div className="min-h-screen flex flex-col bg-primary font-sans transition-colors pb-20">
      
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col px-2 sm:px-4 py-4">
        {/* Stock Selector and Action Buttons Row */}
        <div className="mb-4 flex gap-2">
          {/* Stock Selector - Compact */}
          <div className="flex-1 min-w-0" data-tour="stock-selector">
            <Select value={selectedStock.symbol} onValueChange={handleStockChange}>
              <SelectTrigger className="h-12 bg-card border-secondary/20 text-foreground hover:bg-accent/50 transition-colors">
                <SelectValue>
                  <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex flex-col items-start min-w-0">
                      <span className="font-semibold text-sm truncate">{selectedStock.symbol}</span>
                      <span className="text-[10px] text-muted-foreground truncate">{selectedStock.name}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="font-mono text-xs">KES {selectedStock.price.toFixed(2)}</span>
                      <span className={`text-[10px] ${selectedStock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-card border-secondary/20 max-h-[300px] z-[100]">
                {state.stocks.slice(0, 5).map((stock) => (
                  <SelectItem key={stock.symbol} value={stock.symbol} className="focus:bg-accent cursor-pointer">
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className="flex flex-col items-start min-w-0">
                        <span className="font-semibold text-sm">{stock.symbol}</span>
                        <span className="text-xs text-muted-foreground truncate">{stock.name}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="font-mono text-xs">KES {stock.price.toFixed(2)}</span>
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

          {/* Search Button */}
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <Button
                className="h-12 w-12 shrink-0 bg-card hover:bg-accent/50 border border-secondary/20 text-foreground p-0"
                variant="outline"
                aria-label="Search stocks"
              >
                <Search className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-secondary/20">
              <DialogHeader>
                <DialogTitle>Search Stocks</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Search by symbol or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-background border-secondary/20"
                  autoFocus
                />
                <div className="max-h-[400px] overflow-y-auto space-y-2">
                  {filteredStocks.length > 0 ? (
                    filteredStocks.map((stock) => (
                      <button
                        key={stock.symbol}
                        onClick={() => handleStockChange(stock.symbol)}
                        className="w-full p-3 text-left hover:bg-accent rounded-lg transition-colors border border-secondary/10"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="font-semibold">{stock.symbol}</span>
                            <span className="text-sm text-muted-foreground">{stock.name}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-mono text-sm">KES {stock.price.toFixed(2)}</span>
                            <span className={`text-xs ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No stocks found</p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Broker Login Button */}
          <Button
            onClick={handleBrokerLogin}
            className="h-12 shrink-0 bg-card hover:bg-accent/50 border border-secondary/20 text-foreground px-3 sm:px-4"
            variant="outline"
          >
            <LogIn className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Broker Login</span>
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 flex-1">
          {/* Left Column - Chart and Stock Info */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <StockSummary stock={selectedStock} />
            <div data-tour="stock-chart">
              <TradingChart symbol={selectedStock.symbol} />
            </div>
          </div>

          {/* Right Column - Trading Panel */}
          <div className="space-y-4 sm:space-y-6">
            <OrderPanel stock={selectedStock} />
            
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
                  <div data-tour="watchlist">
                    <WatchlistPanel />
                  </div>
                </TabsContent>
                <TabsContent value="research" className="mt-4">
                  <div data-tour="research">
                    <ResearchPanel stock={selectedStock} />
                  </div>
                </TabsContent>
                <TabsContent value="alerts" className="mt-4">
                  <AlertsPanel stock={selectedStock} />
                </TabsContent>
                <TabsContent value="news" className="mt-4">
                  <NewsFeed stock={selectedStock} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Desktop - Show all panels */}
            <div className="hidden lg:block space-y-6">
              <div data-tour="positions">
                <PositionsOrders />
              </div>
              <div data-tour="watchlist">
                <WatchlistPanel />
              </div>
              <div data-tour="research">
                <ResearchPanel stock={selectedStock} />
              </div>
              <AlertsPanel stock={selectedStock} />
              <NewsFeed stock={selectedStock} />
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Trade;
