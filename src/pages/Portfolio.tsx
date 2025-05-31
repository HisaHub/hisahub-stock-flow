import React, { useState } from "react";
import ChatFAB from "../components/ChatFAB";
import BottomNav from "../components/BottomNav";
import HisaAIButton from "../components/HisaAIButton";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip
} from "recharts";

const stocks = [
  { symbol: "SCOM", name: "Safaricom PLC", quantity: 230, value: 5250, change: "+3.2%" },
  { symbol: "KCB", name: "KCB Group", quantity: 120, value: 4320, change: "-1.1%" },
  { symbol: "EABL", name: "E.A. Breweries", quantity: 45, value: 6570, change: "+1.9%" },
  { symbol: "COOP", name: "Co-op Bank", quantity: 200, value: 3850, change: "+0.7%" },
  { symbol: "EQTY", name: "Equity Group", quantity: 80, value: 8960, change: "-2.0%" },
];

const roiData = [
  { date: "Mon", roi: 20000 },
  { date: "Tue", roi: 22000 },
  { date: "Wed", roi: 26500 },
  { date: "Thu", roi: 33000 },
  { date: "Fri", roi: 35000 },
];

const Portfolio: React.FC = () => {
  const [portfolioName, setPortfolioName] = useState("My NSE Portfolio");
  const [editing, setEditing] = useState(false);
  const [inputName, setInputName] = useState(portfolioName);

  return (
    <div className="min-h-screen flex flex-col bg-primary font-sans transition-colors">
      <HisaAIButton />
      <main className="flex-1 flex flex-col items-center px-4 py-7 w-full max-w-2xl mx-auto">
        <div className="w-full glass-card flex items-center justify-between mb-4 animate-fade-in">
          {!editing ? (
            <>
              <span className="font-bold text-lg market-mono">{portfolioName}</span>
              <button
                className="text-secondary text-xs hover:underline"
                onClick={() => { setInputName(portfolioName); setEditing(true); }}
              >
                Edit
              </button>
            </>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setPortfolioName(inputName); setEditing(false); }}
              className="flex gap-2 items-center w-full"
            >
              <input
                className="market-mono bg-primary border border-secondary rounded px-2 py-1 text-off-white flex-1"
                value={inputName}
                onChange={e => setInputName(e.target.value)}
                autoFocus
                maxLength={18}
              />
              <button type="submit" className="text-secondary text-xs font-bold">Save</button>
            </form>
          )}
        </div>
        <div className="w-full glass-card flex-col gap-3 mb-5 p-5">
          <div className="mb-2 font-semibold text-off-white">ROI Performance</div>
          <div className="h-28 w-full mb-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roiData}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} style={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="roi" stroke="#FFBF00" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="w-full">
          <div className="mb-2 font-semibold text-off-white">Your Holdings</div>
          <div className="flex flex-col gap-2">
            {stocks.map((stock) => (
              <div key={stock.symbol} className="glass-card flex flex-row justify-between items-center px-4 py-2 gap-3">
                <div>
                  <div className="font-semibold text-off-white">{stock.symbol}</div>
                  <div className="text-xs text-neutral">{stock.name}</div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="market-mono font-bold text-lg">KES {stock.value.toLocaleString()}</span>
                  <span className={`text-xs mt-1 font-semibold ${stock.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>{stock.change}</span>
                </div>
                <div className="text-xs text-neutral ml-2">Qty: {stock.quantity}</div>
              </div>
            ))}
          </div>
        </div>
        <ChatFAB />
      </main>
      <BottomNav />
    </div>
  );
};

export default Portfolio;
