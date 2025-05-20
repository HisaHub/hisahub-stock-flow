
import React from "react";
import Sidebar from "../components/Sidebar";
import ChatFAB from "../components/ChatFAB";

const Trade: React.FC = () => (
  <div className="min-h-screen flex bg-background">
    <Sidebar />
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-primary mb-2" style={{ fontFamily: "'Poppins',sans-serif" }}>
          Trade NSE Stocks
        </h2>
        <div className="bg-card glass-card py-8 mt-4 text-charcoal">
          <div className="text-neutral mb-3">Coming soon: TradingView integration, live prices, buy/sell interface.</div>
          <div className="mt-3">Robinhood-like multi-broker interface will appear here.</div>
        </div>
      </div>
      <ChatFAB />
    </main>
  </div>
);
export default Trade;
