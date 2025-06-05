
import React from "react";
import ChatFAB from "../components/ChatFAB";
import BottomNav from "../components/BottomNav";
import HisaAIButton from "../components/HisaAIButton";
import { Link } from "react-router-dom";
import { useFinancialData } from "../contexts/FinancialDataContext";

const Index: React.FC = () => {
  const { state } = useFinancialData();
  
  // Get top 2 holdings for display
  const topHoldings = state.holdings
    .sort((a, b) => b.value - a.value)
    .slice(0, 2)
    .map(holding => ({
      symbol: holding.symbol,
      name: holding.name,
      value: `KES ${holding.value.toLocaleString()}`,
      change: `${holding.profitLossPercent >= 0 ? '+' : ''}${holding.profitLossPercent.toFixed(1)}%`
    }));

  return (
    <div className="min-h-screen flex flex-col justify-between bg-primary font-sans">
      <HisaAIButton />
      <main className="flex-1 flex flex-col items-center px-4 py-10 w-full max-w-lg mx-auto">
        <section className="w-full">
          <div className="glass-card flex flex-col items-center text-center mb-5 animate-fade-in">
            <div className="rounded-lg border-4 border-secondary p-3 mb-4 flex justify-center items-center">
              <span className="font-extrabold text-secondary text-4xl" style={{ fontFamily: "'Poppins',sans-serif" }}>H</span>
            </div>
            <h1 className="text-2xl font-bold text-off-white mb-1">Welcome to HisaHub</h1>
            <div className="text-off-white/80 mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>
              Democratize access to the Nairobi Securities Exchange (NSE) for everyday Kenyans.
            </div>
            <Link
              to="/trade"
              className="w-full block bg-secondary text-primary font-bold px-8 py-3 rounded-xl shadow hover:scale-105 hover:shadow-lg transition text-lg"
            >
              Get Started
            </Link>
          </div>
          
          <div className="glass-card mb-5 p-4">
            <div className="font-bold text-off-white mb-1">Your Broker</div>
            <div className="flex justify-between items-center">
              <span className="market-mono text-lg text-secondary">{state.accountData.brokerName}</span>
              <span className="market-mono text-md">KES {state.accountData.balance.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="glass-card mb-5 p-4">
            <div className="font-bold text-off-white mb-2">Stocks in Trade</div>
            <div className="flex flex-col gap-2">
              {topHoldings.map((stock) => (
                <div key={stock.symbol} className="flex justify-between items-center text-md">
                  <div>
                    <span className="font-semibold text-off-white">{stock.symbol}</span>
                    <span className="ml-2 text-xs text-neutral">{stock.name}</span>
                  </div>
                  <div>
                    <span className="font-mono font-bold text-secondary">{stock.value}</span>
                    <span className={`ml-2 font-semibold text-xs ${stock.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>{stock.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <footer className="mt-10 text-secondary text-xs opacity-80 text-center w-full">
            Inspired by Robinhood &amp; built for Kenya | Made with 💛
          </footer>
        </section>
        <ChatFAB />
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;
