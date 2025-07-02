
import React from "react";
import ChatFAB from "../components/ChatFAB";
import BottomNav from "../components/BottomNav";
import HisaAIButton from "../components/HisaAIButton";

const Chatbot: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-background text-foreground font-sans transition-colors">
    <HisaAIButton />
    <main className="flex-1 flex flex-col items-center px-4 py-10">
      <h2 className="text-3xl font-bold text-secondary mb-7" style={{ fontFamily: "'Poppins',sans-serif" }}>
        Ask Hisa (AI Assistant)
      </h2>
      <div className="glass-card w-full max-w-lg">
        <div className="text-foreground/90">How can I help you with investing today?</div>
        <div className="mt-3 text-muted-foreground">The AI assistant will answer your trading/investing questions here soon!</div>
      </div>
      <ChatFAB />
    </main>
    <BottomNav />
  </div>
);
export default Chatbot;
