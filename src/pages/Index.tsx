
import React from "react";
import ChatFAB from "../components/ChatFAB";
import MarketOverview from "../components/MarketOverview";
import PortfolioWidget from "../components/PortfolioWidget";
import BottomNav from "../components/BottomNav";
import { Link } from "react-router-dom";

const Index: React.FC = () => (
  <div className="min-h-screen flex flex-col justify-between bg-primary font-sans transition-colors">
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-14 overflow-auto w-full max-w-4xl mx-auto">
      <section className="w-full">
        <div className="mb-6 flex flex-col items-center text-center gap-3 animate-fade-in">
          <div className="flex items-center gap-3 justify-center mb-3">
            <div className="rounded-full bg-secondary/90 px-5 py-2 text-primary font-extrabold text-2xl tracking-wide shadow">
              HisaHub
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-secondary mb-2" style={{ fontFamily: "'Poppins',sans-serif" }}>
            Your Gateway to the <span className="text-white">Nairobi Securities Exchange</span>
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>
            Trade, learn, and manage your NSE investments with AI guidance, real-time insights, and a modern, intuitive interface.
          </p>
          <Link
            to="/trade"
            className="inline-block bg-secondary font-semibold text-primary px-8 py-3 rounded-xl shadow hover:scale-105 hover:shadow-lg transition text-lg"
          >
            Get Started
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="col-span-1 md:col-span-2">
            <MarketOverview />
          </div>
          <PortfolioWidget />
        </div>
        <div className="mt-8 mb-6 animate-fade-in flex flex-col gap-4">
          <div className="bg-white/10 glass-card rounded-xl px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2 text-secondary font-bold market-mono">
              <svg width="18" height="18" fill="none"><circle cx="9" cy="9" r="9" fill="#000080"/><path stroke="#FFBF00" strokeWidth="2" d="M9 5v8M5 9h8"/></svg>
              Trending: Safaricom up 5.2% <span className="text-green-700">▲</span>
            </div>
            <div className="flex gap-4">
              <button className="text-xs bg-secondary rounded px-4 py-1 font-semibold text-primary hover:bg-primary hover:text-secondary transition market-mono">Buy</button>
              <button className="text-xs border border-secondary rounded px-4 py-1 font-semibold text-secondary hover:bg-secondary hover:text-primary transition market-mono">Sell</button>
            </div>
          </div>
        </div>
        <div className="flex flex-row flex-wrap gap-4 my-4 justify-center animate-fade-in">
          <Link to="/mock-stocks" className="glass-card px-6 py-3 font-semibold hover:shadow-xl transition">Try Mock Trading</Link>
          <Link to="/portfolio" className="glass-card px-6 py-3 font-semibold hover:shadow-xl transition">View Portfolio</Link>
          <Link to="/discover" className="glass-card px-6 py-3 font-semibold hover:shadow-xl transition">Discover Market</Link>
        </div>
        <footer className="mt-14 text-secondary text-sm opacity-80">
          Inspired by Robinhood &amp; built for Kenya | Made with 💛
        </footer>
      </section>
      <ChatFAB />
    </main>
    <BottomNav />
  </div>
);

export default Index;
