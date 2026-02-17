
import React from "react";
import { PieChart } from "lucide-react";
import { useFinancialData } from '@/contexts/FinancialDataContext';

const PortfolioWidget: React.FC = () => {
  const { state } = useFinancialData();
  const total = state.accountData?.totalValue || 0;
  const dailyChange = state.portfolioData?.dailyChange || 0;

  return (
    <div className="glass-card flex flex-col gap-2 items-start w-full animate-fade-in">
      <div className="flex items-center gap-2">
        <PieChart size={23} className="text-secondary" />
        <span className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Portfolio Balance
        </span>
      </div>
      <div className="mt-1 text-2xl market-mono font-bold text-primary">KES {Number(total).toLocaleString()}</div>
      <div className={`text-xs text-neutral flex gap-2 items-end ${dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {dailyChange >= 0 ? '+' : ''}KES {Number(dailyChange).toFixed(2)} today
        <span className={`${dailyChange >= 0 ? 'text-green-700' : 'text-red-700'} font-semibold`}>{dailyChange >= 0 ? '▲' : '▼'}</span>
      </div>
    </div>
  );
};

export default PortfolioWidget;
