
import React from "react";
import { useModuleContext, MODULE_NAMES, ModuleKey } from "@/contexts/ModuleContext";
import { Bot, TrendingUp, Target, Users, BarChart2, MessageCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HisaRibbon from '@/components/hisa/HisaRibbon';

const MODULES: {
  key: ModuleKey;
  name: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}[] = [
  {
    key: "budget",
    name: "Budget Planner",
    description: "Track income & expenses, get AI savings insights.",
    icon: <FileText className="text-blue-700" size={32} />,
    route: "/budget"
  },
  {
    key: "trading",
    name: "Trading Insights",
    description: "View NSE market data, ask AI for stock breakdowns.",
    icon: <TrendingUp className="text-green-600" size={32} />,
    route: "/trading"
  },
  {
    key: "goals",
    name: "Wealth Goals",
    description: "Set savings/investing goals. Let Hisa AI keep you on track!",
    icon: <Target className="text-purple-600" size={32} />,
    route: "/goals"
  },
  {
    key: "community",
    name: "Community",
    description: "Chat & learn with Kenyan investors. AI moderates.",
    icon: <Users className="text-yellow-600" size={32} />,
    route: "/community"
  },
  {
    key: "portfolio",
    name: "Portfolio Tracker",
    description: "Track your investments' performance.",
    icon: <BarChart2 className="text-red-600" size={32} />,
    route: "/portfolio"
  },
  {
    key: "askhisa",
    name: "Ask Hisa (AI Central)",
    description: "Full-screen smart AI assistant for all questions.",
    icon: <Bot className="text-gold" size={32} />,
    route: "/ask-hisa"
  }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { setModule } = useModuleContext();

  return (
    <div className="min-h-screen bg-primary pt-16 pb-8 px-3 sm:px-6 flex flex-col">
      <HisaRibbon />
      <h1 className="mt-8 text-2xl font-bold text-gold mb-4 text-center">Hisa AI Hub</h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {MODULES.map((mod) => (
          <div
            key={mod.key}
            className="glass-card flex flex-col items-start justify-between p-6 rounded-xl shadow-lg hover:scale-105 transition cursor-pointer relative"
            onClick={() => {
              setModule(mod.key);
              navigate(mod.route);
            }}
          >
            <div className="flex items-center gap-3 mb-4">{mod.icon}<span className="text-lg font-semibold text-secondary">{mod.name}</span></div>
            <div className="text-neutral/80 mb-4 text-sm flex-1">{mod.description}</div>
            <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-blue-50 border border-gold flex items-center gap-1 text-xs text-gold font-bold shadow-sm">
              <Bot size={12} className="text-gold" /> AI Active
            </div>
          </div>
        ))}
      </div>
      <footer className="text-xs text-gold text-center mt-10 opacity-80">Hisa AI — Built for Kenyan investors.</footer>
    </div>
  );
};

export default Dashboard;
