
import React from "react";
import Sidebar from "../components/Sidebar";
import ChatFAB from "../components/ChatFAB";
import PortfolioWidget from "../components/PortfolioWidget";

const Portfolio: React.FC = () => (
  <div className="min-h-screen flex bg-background">
    <Sidebar />
    <main className="flex-1 flex flex-col items-center px-4 py-10">
      <h2 className="text-3xl font-bold text-primary mb-7" style={{ fontFamily: "'Poppins',sans-serif" }}>
        Your Portfolio
      </h2>
      <div className="w-full max-w-2xl">
        <PortfolioWidget />
        <div className="glass-card mt-4">
          <div className="text-neutral mb-2">Recent activity and holdings (mock, coming soon)...</div>
        </div>
      </div>
      <ChatFAB />
    </main>
  </div>
);
export default Portfolio;
