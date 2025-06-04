
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Bot, User } from "lucide-react";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

interface AIAssistantProps {
  stock: Stock;
  onClose: () => void;
}

interface Message {
  id: number;
  type: "user" | "ai";
  content: string;
  timestamp: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ stock, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content: `Hello! I'm your AI trading assistant. I can help you analyze ${stock.symbol} and provide trading insights. What would you like to know?`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("price") || lowerMessage.includes("target")) {
      return `Based on current market analysis, ${stock.symbol} is trading at KES ${stock.price.toFixed(2)}. Technical indicators suggest support at KES ${(stock.price * 0.95).toFixed(2)} and resistance at KES ${(stock.price * 1.08).toFixed(2)}. Consider your risk tolerance when setting targets.`;
    }
    
    if (lowerMessage.includes("buy") || lowerMessage.includes("sell")) {
      return `For ${stock.symbol}, consider the following: Current momentum is ${stock.change >= 0 ? 'positive' : 'negative'} with ${stock.change.toFixed(2)}% change. I recommend using limit orders and proper position sizing. Always do your own research and consider market conditions.`;
    }
    
    if (lowerMessage.includes("analysis") || lowerMessage.includes("recommendation")) {
      return `${stock.symbol} Analysis Summary:\n• Current Price: KES ${stock.price.toFixed(2)}\n• Recent Performance: ${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}%\n• Market Sentiment: ${stock.change >= 0 ? 'Positive' : 'Cautious'}\n• Risk Level: Moderate\n\nRemember, this is not financial advice. Please consult with a licensed advisor.`;
    }
    
    if (lowerMessage.includes("risk") || lowerMessage.includes("management")) {
      return `Risk Management Tips:\n• Never invest more than you can afford to lose\n• Diversify your portfolio across sectors\n• Use stop-loss orders to limit downside\n• Keep position sizes reasonable (2-5% per trade)\n• Stay updated on company fundamentals`;
    }
    
    return `I understand you're asking about "${userMessage}". For ${stock.symbol}, I recommend checking recent news, analyzing technical indicators, and considering your investment timeline. Is there a specific aspect you'd like me to focus on?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        type: "ai",
        content: generateAIResponse(inputMessage),
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "What's your price target for " + stock.symbol + "?",
    "Should I buy or sell now?",
    "Risk management advice?",
    "Technical analysis summary"
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-primary border border-secondary/20 rounded-xl w-full max-w-md h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-secondary/20">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-secondary" />
            <h3 className="font-semibold text-off-white">AI Trading Assistant</h3>
          </div>
          <Button size="sm" variant="outline" onClick={onClose} className="p-2">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "ai" && (
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === "user"
                    ? "bg-secondary text-primary"
                    : "bg-white/10 text-off-white"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className="text-xs opacity-60 mt-1">{message.timestamp}</p>
              </div>

              {message.type === "user" && (
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-off-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="p-4 border-t border-secondary/20">
            <p className="text-xs text-off-white/60 mb-2">Quick questions:</p>
            <div className="space-y-1">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="w-full text-left text-xs p-2 bg-white/5 rounded hover:bg-white/10 transition-colors text-off-white/80"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-secondary/20">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about trading..."
              className="flex-1 bg-white/10 border-secondary/20 text-off-white placeholder:text-off-white/50"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-secondary hover:bg-secondary/80 text-primary p-2"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
