
import React, { useState } from "react";
import ChatFAB from "../components/ChatFAB";
import BottomNav from "../components/BottomNav";
import HisaAIButton from "../components/HisaAIButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TradingChart from "../components/trading/TradingChart";
import StockSummary from "../components/trading/StockSummary";
import OrderPanel from "../components/trading/OrderPanel";
import PositionsOrders from "../components/trading/PositionsOrders";
import AlertsPanel from "../components/trading/AlertsPanel";
import NewsFeed from "../components/trading/NewsFeed";
import { useFinancialData } from "../contexts/FinancialDataContext";

const Trade: React.FC = () => {
  const { state } = useFinancialData();
  const [selectedStock, setSelectedStock] = useState(state.stocks[0]);

  const handleStockChange = (stockSymbol: string) => {
    const stock = state.stocks.find(s => s.symbol === stockSymbol);
    if (stock) {
      setSelectedStock(stock);
    }
  };

  // Update selected stock when prices change
  React.useEffect(() => {
    const updatedStock = state.stocks.find(s => s.symbol === selectedStock.symbol);
    if (updatedStock) {
      setSelectedStock(updatedStock);
    }
  }, [state.stocks, selectedStock.symbol]);

  return (
    <div className="min-h-screen flex flex-col bg-primary font-sans transition-colors">
      <HisaAIButton />
      
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col px-2 sm:px-4 py-4">
        {/* Stock Selector Dropdown */}
        <div className="mb-4">
          <Select value={selectedStock.symbol} onValueChange={handleStockChange}>
            <SelectTrigger className="w-full sm:w-80 bg-white/10 border-secondary/20 text-off-white">
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
                <TabsList className="grid w-full grid-cols-3 bg-white/10">
                  <TabsTrigger value="positions" className="text-xs">Positions</TabsTrigger>
                  <TabsTrigger value="alerts" className="text-xs">Alerts</TabsTrigger>
                  <TabsTrigger value="news" className="text-xs">News</TabsTrigger>
                </TabsList>
                <TabsContent value="positions" className="mt-4">
                  <PositionsOrders />
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
              <AlertsPanel stock={selectedStock} />
              <NewsFeed stock={selectedStock} />
            </div>
          </div>
        </div>
      </main>

      <ChatFAB />
      <BottomNav />
    </div>
  );
};

export default Trade;
