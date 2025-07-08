
import React, { useState } from "react";
import { MessageSquare, Send, X } from "lucide-react";
import { useLocalAIChat } from "@/hooks/useLocalAIChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChatFAB: React.FC = () => {
  const [open, setOpen] = useState(false);
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
    <>
      <button
        className="fixed bottom-6 right-6 z-50 bg-secondary shadow-xl rounded-full w-16 h-16 flex items-center justify-center animate-fade-in hover:scale-110 transition transform"
        style={{ boxShadow: "0 2px 12px 0 rgba(0,0,0,0.12)" }}
        onClick={() => setOpen(true)}
        title="Chat with Invisa (AI)"
      >
        <MessageSquare color="#000080" size={32} />
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end md:items-center justify-end z-[99] animate-fade-in">
          <div className="bg-white rounded-t-3xl md:rounded-2xl w-full max-w-md shadow-2xl relative flex flex-col h-[500px] md:h-[600px] m-0 md:m-8">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <span className="inline-block bg-secondary text-primary px-3 py-1 rounded-full font-bold text-lg">I</span>
                <span className="font-semibold text-charcoal">Invisa AI Assistant</span>
              </div>
              <button
                className="text-secondary hover:text-primary transition p-1"
                onClick={() => setOpen(false)}
                aria-label="Close Chat"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-neutral text-center py-8">
                  Hello! I'm Invisa, your Kenyan financial assistant. How can I help you with NSE investing today?
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-secondary text-primary'
                        : 'bg-gray-100 text-charcoal'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about NSE stocks, investment advice..."
                  className="flex-1"
                  disabled={loading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || loading}
                  className="bg-secondary hover:bg-secondary/80 text-primary"
                >
                  <Send size={16} />
                </Button>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="text-xs text-gray-500 mt-2 hover:text-gray-700"
                >
                  Clear chat
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatFAB;
