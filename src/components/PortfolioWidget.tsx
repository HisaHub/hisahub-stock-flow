
import React from "react";
import { PieChart } from "lucide-react"; // Use PieChart as portfolio icon

const PortfolioWidget: React.FC = () => {
  // Mock data. Later, plug real portfolio
  return (
    <div className="glass-card flex flex-col gap-2 items-start w-full animate-fade-in">
      <div className="flex items-center gap-2">
        <PieChart size={23} className="text-secondary" />
        <span className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Portfolio Balance
        </span>
      </div>
      <div className="mt-1 text-2xl market-mono font-bold text-primary">KSh 124,250.34</div>
      <div className="text-xs text-neutral flex gap-2 items-end">
        +2.6% today
        <span className="text-green-700 font-semibold">▲</span>
      </div>
    </div>
  );
};

export default PortfolioWidget;
