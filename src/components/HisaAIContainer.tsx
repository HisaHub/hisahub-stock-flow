
import React, { useState, useRef } from "react";
import HisaSidebar from "./HisaSidebar";
import CRMModule from "./modules/CRMModule";
import RiskManagementModule from "./modules/RiskManagementModule";
import PersonalFinanceModule from "./modules/PersonalFinanceModule";
import TradingCoachModule from "./modules/TradingCoachModule";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

// Layout: sidebar (with chat + nav), main content (selected module)
const HisaAIContainer: React.FC = () => {
  const [activeModule, setActiveModule] = useState("crm");
  const [riskData, setRiskData] = useState<any>(null);
  const [financeData, setFinanceData] = useState<any>(null);
  const [tradingData, setTradingData] = useState<any>(null);

  // Compose active module data
  const activeModuleData =
    activeModule === "risk"
      ? riskData
      : activeModule === "finance"
      ? financeData
      : activeModule === "trading"
      ? tradingData
      : null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-primary">
        {/* Sidebar with chat & navigation */}
        <HisaSidebar
          activeModule={activeModule}
          onModuleChange={setActiveModule}
          activeModuleData={activeModuleData}
        />
        {/* Hamburger trigger (top-left absolute for visibility on mobile) */}
        <SidebarTrigger className="fixed top-4 left-4 z-50 md:hidden bg-white rounded-full shadow p-2" />
        {/* Main content area */}
        <div className="flex-1 bg-gray-50 p-6 pl-0 md:pl-0 overflow-y-auto min-h-screen">
          {activeModule === "crm" && <CRMModule />}
          {activeModule === "risk" && (
            <RiskManagementModule onDataChange={setRiskData} />
          )}
          {activeModule === "finance" && (
            <PersonalFinanceModule onDataChange={setFinanceData} />
          )}
          {activeModule === "trading" && (
            <TradingCoachModule onDataChange={setTradingData} />
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HisaAIContainer;
