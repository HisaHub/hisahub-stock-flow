import React, { useState } from "react";
import { Send, X } from "lucide-react";
import BottomNav from "../components/BottomNav";
import HisaAIButton from "../components/HisaAIButton";
import { useLocalAIChat } from "@/hooks/useLocalAIChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Chatbot: React.FC = () => {
  const [inputMessage, setInputMessage] = useState("");
  const { messages, loading, sendMessage, clearChat } = useLocalAIChat();

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary font-sans transition-colors pb-20">
      <HisaAIButton />
      <main className="flex-1 flex flex-col px-4 py-10 max-w-4xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-secondary mb-7 text-center" style={{ fontFamily: "'Poppins',sans-serif" }}>
          Chat with Invisa AI
        </h2>
        
        {/* Chat Messages Area */}
        <div className="flex-1 glass-card bg-white/10 mb-4 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-off-white/80 text-center py-8">
                Hello! I'm Invisa, your Kenyan financial assistant. How can I help you with NSE investing today?
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-secondary text-primary'
                      : 'bg-white/20 text-off-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/20 px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about NSE stocks, investment strategies, market analysis..."
                className="flex-1 bg-white/10 border-white/20 text-off-white placeholder:text-off-white/60"
                disabled={loading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || loading}
                className="bg-secondary hover:bg-secondary/80 text-primary px-6"
              >
                <Send size={16} />
              </Button>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-xs text-off-white/60 mt-2 hover:text-off-white/80"
              >
                Clear conversation
              </button>
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Chatbot;
