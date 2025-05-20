
import React from "react";
import ChatFAB from "../components/ChatFAB";
import MarketOverview from "../components/MarketOverview";
import BottomNav from "../components/BottomNav";

const MockStocks: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-primary font-sans transition-colors">
    <main className="flex-1 flex flex-col items-center px-4 py-10">
      <h2 className="text-3xl font-bold text-secondary mb-7" style={{ fontFamily: "'Poppins',sans-serif" }}>
        Mock Trading Simulator
      </h2>
      <MarketOverview />
      <div className="glass-card mt-6 bg-white/10">
        <div className="text-white/80">Try trading NSE stocks with virtual cash (feature coming soon).</div>
      </div>
      <ChatFAB />
    </main>
    <BottomNav />
  </div>
);
export default MockStocks;
