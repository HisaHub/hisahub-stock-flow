
import React from "react";
import Sidebar from "../components/Sidebar";
import ChatFAB from "../components/ChatFAB";
import MarketOverview from "../components/MarketOverview";

const MockStocks: React.FC = () => (
  <div className="min-h-screen flex bg-background">
    <Sidebar />
    <main className="flex-1 flex flex-col items-center px-4 py-10">
      <h2 className="text-3xl font-bold text-primary mb-7" style={{ fontFamily: "'Poppins',sans-serif" }}>
        Mock Trading Simulator
      </h2>
      <MarketOverview />
      <div className="glass-card mt-6">
        <div>Try trading NSE stocks with virtual cash (feature coming soon).</div>
      </div>
      <ChatFAB />
    </main>
  </div>
);
export default MockStocks;
