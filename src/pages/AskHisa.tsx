
import React from "react";
import HisaRibbon from "@/components/hisa/HisaRibbon";
const AskHisa: React.FC = () => (
  <div className="min-h-screen pt-10 pb-8 px-3 sm:px-6 bg-primary">
    <HisaRibbon />
    <h2 className="mt-8 text-xl font-bold text-gold text-center">Ask Hisa (AI Central)</h2>
    <div className="mt-4 text-center text-secondary">
      This will be a full-screen smart AI chat (rich responses, suggestions, module history, goals) coming soon!
    </div>
  </div>
);
export default AskHisa;
