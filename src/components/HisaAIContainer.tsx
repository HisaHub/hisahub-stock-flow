
import React, { useState } from "react";
import ChatInterface from "./ChatInterface";
import CRMModule from "./modules/CRMModule";
import RiskManagementModule from "./modules/RiskManagementModule";
import PersonalFinanceModule from "./modules/PersonalFinanceModule";
import TradingCoachModule from "./modules/TradingCoachModule";

const HisaAIContainer: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(true);
  const [activeModule, setActiveModule] = useState("crm");

  return (
    <div className="flex w-full min-h-screen">
      <ChatInterface
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        activeModule={activeModule}
        onModuleChange={(mod) => setActiveModule(mod)}
      />
      {/* Main content shows the selected module */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        {activeModule === "crm" && <CRMModule />}
        {activeModule === "risk" && <RiskManagementModule />}
        {activeModule === "finance" && <PersonalFinanceModule />}
        {activeModule === "trading" && <TradingCoachModule />}
      </div>
    </div>
  );
};

export default HisaAIContainer;
