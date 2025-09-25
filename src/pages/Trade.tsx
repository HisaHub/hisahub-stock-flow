import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import InvisaAI from "../components/InvisaAI";
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

  const handleStockChange = (stockSymbol: string) => {
    const stock = state.stocks.find(s => s.symbol === stockSymbol);
    if (stock) {
      setSelectedStock(stock);
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
        {/* Stock Selector and Broker Login Row */}
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          {/* Stock Selector */}
          <div className="flex-1">
            <Select value={selectedStock.symbol} onValueChange={handleStockChange}>
              <SelectTrigger className="w-full bg-white/10 border-secondary/20 text-off-white">
                <SelectValue>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">{selectedStock.symbol}</span>
                      <span className="text-xs text-off-white/60">{selectedStock.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">KES {selectedStock.price.toFixed(2)}</span>
                      <span className={`text-xs ${selectedStock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)}%
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
            <StockSummary stock={selectedStock} />
            <TradingChart symbol={selectedStock.symbol} />
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
                  <WatchlistPanel />
                </TabsContent>
                <TabsContent value="research" className="mt-4">
                  <ResearchPanel stock={selectedStock} />
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
              <PositionsOrders />
              <WatchlistPanel />
              <ResearchPanel stock={selectedStock} />
              <AlertsPanel stock={selectedStock} />
              <NewsFeed stock={selectedStock} />
            </div>
          </div>
        </div>
      </main>

      <InvisaAI />
      <BottomNav />
    </div>
  );
};

export default Trade;
