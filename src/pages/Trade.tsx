
import React, { useState } from "react";
import ChatFAB from "../components/ChatFAB";
import BottomNav from "../components/BottomNav";
import HisaAIButton from "../components/HisaAIButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TradingChart from "../components/trading/TradingChart";
import StockSummary from "../components/trading/StockSummary";
import OrderPanel from "../components/trading/OrderPanel";
import PositionsOrders from "../components/trading/PositionsOrders";
import AlertsPanel from "../components/trading/AlertsPanel";
import NewsFeed from "../components/trading/NewsFeed";
import AIAssistant from "../components/trading/AIAssistant";

const kenyanStocks = [
  { symbol: "SCOM", name: "Safaricom PLC", price: 22.70, change: 2.3 },
  { symbol: "EQTY", name: "Equity Group Holdings", price: 45.50, change: -1.2 },
  { symbol: "KCB", name: "KCB Group", price: 38.25, change: 0.8 },
  { symbol: "COOP", name: "Co-operative Bank", price: 12.85, change: 1.5 },
  { symbol: "ABSA", name: "Absa Bank Kenya", price: 8.90, change: -0.5 }
];

const Trade: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState(kenyanStocks[0]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-primary font-sans transition-colors">
      <HisaAIButton />
      
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col px-4 py-4">
        {/* Stock Selector */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {kenyanStocks.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => setSelectedStock(stock)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStock.symbol === stock.symbol
                  ? "bg-secondary text-primary"
                  : "bg-white/10 text-off-white hover:bg-white/20"
              }`}
            >
              {stock.symbol}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* Left Column - Chart and Stock Info */}
          <div className="lg:col-span-2 space-y-6">
            <StockSummary stock={selectedStock} />
            <TradingChart symbol={selectedStock.symbol} />
          </div>

          {/* Right Column - Trading Panel */}
          <div className="space-y-6">
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

        {/* AI Assistant Toggle */}
        <button
          onClick={() => setShowAIAssistant(!showAIAssistant)}
          className="fixed bottom-20 right-4 bg-secondary text-primary p-3 rounded-full shadow-lg hover:bg-secondary/90 transition-colors lg:bottom-4"
        >
          🤖
        </button>

        {/* AI Assistant Overlay */}
        {showAIAssistant && (
          <AIAssistant 
            stock={selectedStock} 
            onClose={() => setShowAIAssistant(false)} 
          />
        )}
      </main>

      <ChatFAB />
      <BottomNav />
    </div>
  );
};

export default Trade;
