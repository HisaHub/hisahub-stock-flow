
import React from "react";
import Sidebar from "../components/Sidebar";
import ChatFAB from "../components/ChatFAB";

const Chatbot: React.FC = () => (
  <div className="min-h-screen flex bg-background">
    <Sidebar />
    <main className="flex-1 flex flex-col items-center px-4 py-10">
      <h2 className="text-3xl font-bold text-primary mb-7" style={{ fontFamily: "'Poppins',sans-serif" }}>
        Ask Hisa (AI Assistant)
      </h2>
      <div className="glass-card w-full max-w-lg">
        <div>How can I help you with investing today?</div>
        <div className="mt-3 text-neutral">The AI assistant will answer your trading/investing questions here soon!</div>
      </div>
      <ChatFAB />
    </main>
  </div>
);
export default Chatbot;
