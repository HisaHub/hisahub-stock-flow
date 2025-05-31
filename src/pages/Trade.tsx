import React from "react";
import ChatFAB from "../components/ChatFAB";
import BottomNav from "../components/BottomNav";
import HisaAIButton from "../components/HisaAIButton";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockChart = [
  { time: "9:00", price: 20.1 },
  { time: "10:00", price: 21.3 },
  { time: "11:00", price: 20.5 },
  { time: "12:00", price: 22.2 },
  { time: "13:00", price: 21.9 },
  { time: "14:00", price: 22.7 },
];

const Trade: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-primary font-sans transition-colors">
    <HisaAIButton />
    <main className="flex-1 w-full max-w-lg mx-auto flex flex-col items-center px-4 py-7">
      <div className="w-full glass-card flex flex-col gap-3 mb-5 animate-fade-in">
        <div className="text-[1.1rem] font-bold text-off-white">SAFARICOM (SCOM)</div>
        <div className="font-mono text-2xl font-bold text-secondary">KES 22.70</div>
        <div className="h-36 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockChart}>
              <XAxis dataKey="time" axisLine={false} tickLine={false} style={{ fontSize: 10 }} />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#FFBF00" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="w-full flex gap-4 mt-2 mb-6">
        <Button className="flex-1 font-bold text-primary bg-secondary hover:bg-secondary/80 py-4 rounded-xl text-lg shadow" variant="secondary">
          Buy
        </Button>
        <Button className="flex-1 font-bold border border-secondary text-secondary bg-transparent hover:bg-secondary/20 py-4 rounded-xl text-lg shadow-none">
          Sell
        </Button>
      </div>
      <div className="glass-card w-full flex flex-col gap-2 animate-fade-in">
        <div className="text-off-white/80 text-sm mb-2">Order Book / Trade details (mockup)</div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs"><span>Bid</span> <span>21.55</span></div>
          <div className="flex justify-between text-xs"><span>Ask</span> <span>22.70</span></div>
        </div>
      </div>
      <ChatFAB />
    </main>
    <BottomNav />
  </div>
);
export default Trade;
