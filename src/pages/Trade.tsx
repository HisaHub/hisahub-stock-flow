
import React from "react";
import ChatFAB from "../components/ChatFAB";
import BottomNav from "../components/BottomNav";

const Trade: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-primary font-sans transition-colors">
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-secondary mb-2" style={{ fontFamily: "'Poppins',sans-serif" }}>
        Trade NSE Stocks
      </h2>
      <div className="bg-white/10 glass-card py-8 mt-4 text-white">
        <div className="text-white/80 mb-3">Coming soon: TradingView integration, live prices, buy/sell interface.</div>
        <div className="mt-3 text-white/70">Robinhood-like multi-broker interface will appear here.</div>
      </div>
      <ChatFAB />
    </main>
    <BottomNav />
  </div>
);
export default Trade;
