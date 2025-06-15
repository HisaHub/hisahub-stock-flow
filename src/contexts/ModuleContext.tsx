
import React, { createContext, useContext, useState } from "react";

export type ModuleKey = "budget" | "trading" | "goals" | "community" | "portfolio" | "askhisa";

const MODULE_NAMES: Record<ModuleKey, string> = {
  budget: "Budget Planner",
  trading: "Trading Insights",
  goals: "Wealth Goals",
  community: "Community",
  portfolio: "Portfolio Tracker",
  askhisa: "Ask Hisa (AI Central)",
};

interface ModuleContextType {
  module: ModuleKey;
  setModule: (module: ModuleKey) => void;
  moduleName: string;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const useModuleContext = () => {
  const ctx = useContext(ModuleContext);
  if (!ctx) throw new Error("useModuleContext must be used within ModuleProvider");
  return ctx;
};

export const ModuleProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [module, setModule] = useState<ModuleKey>("budget");
  const moduleName = MODULE_NAMES[module];
  return (
    <ModuleContext.Provider value={{ module, setModule, moduleName }}>
      {children}
    </ModuleContext.Provider>
  );
};

export { MODULE_NAMES };
