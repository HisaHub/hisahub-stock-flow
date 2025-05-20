
import React from "react";
import ChatFAB from "../components/ChatFAB";
import PortfolioWidget from "../components/PortfolioWidget";
import BottomNav from "../components/BottomNav";

const Portfolio: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-primary font-sans transition-colors">
    <main className="flex-1 flex flex-col items-center px-4 py-10 w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-secondary mb-7" style={{ fontFamily: "'Poppins',sans-serif" }}>
        Your Portfolio
      </h2>
      <PortfolioWidget />
      <div className="glass-card mt-4 bg-white/10">
        <div className="text-white/80 mb-2">Recent activity and holdings (mock, coming soon)...</div>
      </div>
      <ChatFAB />
    </main>
    <BottomNav />
  </div>
);
export default Portfolio;
