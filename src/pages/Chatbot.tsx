
import React from "react";
import HisaAIContainer from "../components/HisaAIContainer";
import BottomNav from "../components/BottomNav";

const Chatbot: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-primary font-sans transition-colors">
    <main className="flex-1 flex flex-col items-stretch">
      <HisaAIContainer />
    </main>
    <BottomNav />
  </div>
);

export default Chatbot;
