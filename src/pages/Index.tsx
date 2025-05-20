
import React from "react";
import ChatFAB from "../components/ChatFAB";
import BottomNav from "../components/BottomNav";
import { Link } from "react-router-dom";

const activeBroker = {
  name: "ABC Capital",
  balance: "KES 100,200",
};

const stocksInTrade = [
  { symbol: "SCOM", name: "Safaricom PLC", value: "KES 20,420", change: "+2.4%" },
  { symbol: "KCB", name: "KCB Group", value: "KES 13,100", change: "-1.1%" },
];

const Index: React.FC = () => (
  <div className="min-h-screen flex flex-col justify-between bg-primary font-sans">
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
            <span className="market-mono text-lg text-secondary">{activeBroker.name}</span>
            <span className="market-mono text-md">{activeBroker.balance}</span>
          </div>
        </div>
        <div className="glass-card mb-5 p-4">
          <div className="font-bold text-off-white mb-2">Stocks in Trade</div>
          <div className="flex flex-col gap-2">
            {stocksInTrade.map((stock) => (
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

export default Index;
