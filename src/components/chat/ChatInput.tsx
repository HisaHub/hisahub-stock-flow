
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  inputValue: string;
  setInputValue: (text: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  apiKey: string;
  isTyping: boolean;
  activeModule: string;
}

const getPlaceholder = (apiKey: string, activeModule: string) => {
  if (!apiKey) return "Enter your OpenAI API key above to chat...";
  switch (activeModule) {
    case "crm": return "Ask about customer management, leads, or sales analytics...";
    case "risk": return "Ask about portfolio risk, market volatility, or risk assessment...";
    case "finance": return "Ask about budgeting, financial planning, or investment advice...";
    case "trading": return "Ask about trading strategies, market analysis, or educational content...";
    default: return "How can I help you today?";
  }
};

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue, setInputValue, onSend, onKeyPress, apiKey, isTyping, activeModule
}) => (
  <div className="border-t p-3 md:p-6 shrink-0 bg-white rounded-b-xl">
    <div className="flex gap-2 md:gap-3">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder={getPlaceholder(apiKey, activeModule)}
        disabled={!apiKey || isTyping}
        className="flex-1 text-xs md:text-sm"
      />
      <Button
        onClick={onSend}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-3 md:px-4"
        disabled={!inputValue.trim() || !apiKey || isTyping}
      >
        <Send size={16} className="md:hidden" />
        <Send size={18} className="hidden md:block" />
      </Button>
    </div>
  </div>
);

export default ChatInput;
