
import React from "react";
import BottomNav from "../components/BottomNav";
import InvisaAI from "../components/InvisaAI";
import AccountSummaryCard from "../components/home/AccountSummaryCard";
import OpenPositionsCard from "../components/home/OpenPositionsCard";
import MarketOverviewSection from "../components/home/MarketOverviewSection";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check current auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleStartTrading = () => {
    if (user) {
      navigate('/trade');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-primary font-sans pb-20">
      <main className="flex-1 flex flex-col px-4 py-6 w-full max-w-6xl mx-auto">
        {/* Header */}
        <section className="w-full mb-6">
          <div className="glass-card flex flex-col items-center text-center animate-fade-in">
            <div className="rounded-lg border-4 border-secondary p-3 mb-4 flex justify-center items-center">
              <span className="font-extrabold text-secondary text-4xl" style={{ fontFamily: "'Poppins',sans-serif" }}>H</span>
            </div>
            <h1 className="text-2xl font-bold text-off-white mb-1">Welcome to HisaHub</h1>
            <div className="text-off-white/80 mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>
              Democratize access to the Nairobi Securities Exchange (NSE) for everyday Kenyans.
            </div>
            <button
              onClick={handleStartTrading}
              className="w-full max-w-xs bg-secondary text-primary font-bold px-8 py-3 rounded-xl shadow hover:scale-105 hover:shadow-lg transition text-lg"
            >
              Start Trading
            </button>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Account Summary */}
          <div className="lg:col-span-1">
            <AccountSummaryCard />
          </div>
          
          {/* Right Column - Open Positions */}
          <div className="lg:col-span-2">
            <OpenPositionsCard />
          </div>
        </div>

        {/* Market Overview Section */}
        <section className="w-full">
          <h2 className="text-xl font-bold text-off-white mb-4">Market Overview</h2>
          <MarketOverviewSection />
        </section>

        
        <InvisaAI />
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;
