
import React from "react";
import HisaRibbon from "@/components/hisa/HisaRibbon";
const BudgetPlanner: React.FC = () => (
  <div className="min-h-screen pt-10 pb-8 px-3 sm:px-6 bg-primary">
    <HisaRibbon />
    <h2 className="mt-8 text-xl font-bold text-gold text-center">Budget Planner Module (Coming Soon)</h2>
    <div className="mt-4 text-center text-secondary">
      Monthly income/expense tracker, savings tips, and Hisa AI insights will be available here.
    </div>
  </div>
);
export default BudgetPlanner;
