import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, KeyRound, Lock, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CRMModule from './modules/CRMModule';
import RiskManagementModule from './modules/RiskManagementModule';
import PersonalFinanceModule from './modules/PersonalFinanceModule';
import TradingCoachModule from './modules/TradingCoachModule';
// REMOVE this import
// import HisaSidebar from "./HisaSidebar";

interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const OPENAI_KEY_STORAGE = 'hisa_openai_api_key';

function getStoredKey() {
  return localStorage.getItem(OPENAI_KEY_STORAGE) || '';
}

function setStoredKey(key: string) {
  localStorage.setItem(OPENAI_KEY_STORAGE, key);
}

function removeStoredKey() {
  localStorage.removeItem(OPENAI_KEY_STORAGE);
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isOpen,
  onClose,
  activeModule,
  onModuleChange,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      content: "Welcome to Hisa AI! I'm your intelligent financial assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState<string>(getStoredKey());
  const [tempKey, setTempKey] = useState('');
  const [apiKeyError, setApiKeyError] = useState('');
  const [apiError, setApiError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    setApiKey(getStoredKey());
  }, []);

  const getModulePrompt = () => {
    switch (activeModule) {
      case 'crm':
        return `You are Hisa, a helpful CRM assistant for finance professionals. Answer as an expert in customer relationship management.`;
      case 'risk':
        return `You are Hisa, a financial AI advising on risk management, portfolio diversification, and volatility, focused on the NSE and global best practices.`;
      case 'finance':
        return `You are Hisa, a personal finance and investing AI coach. Give budgeting, planning, and savings advice tailored for users in emerging markets like Kenya.`;
      case 'trading':
        return `You are Hisa, an educational AI trading coach for beginners. Explain trading strategies, stock concepts, and motivate with clear, concise answers.`;
      default:
        return `You are Hisa, a helpful financial assistant.`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping || !apiKey) return;
    setApiError('');

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Call OpenAI with current module context and conversation
    try {
      const inputMessages = [
        {
          role: 'system',
          content: getModulePrompt()
        },
        ...messages.concat(userMessage).map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.content
        }))
      ];

      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: inputMessages,
          temperature: 0.8,
          max_tokens: 300,
        }),
      });
      if (resp.status === 401 || resp.status === 403) {
        setApiError('Invalid API Key. Please re-enter your OpenAI API key.');
        setIsTyping(false);
        return;
      }
      if (!resp.ok) {
        setApiError('Error communicating with OpenAI. Please try again.');
        setIsTyping(false);
        return;
      }
      const data = await resp.json();
      const completions = data.choices?.[0]?.message?.content;
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        content: completions || "Sorry, I couldn't generate a response.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setApiError('Network or server error. Please check your connection and API key.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleModuleChange = (module: string) => {
    onModuleChange(module);
    const welcomeMessages = {
      crm: 'Switched to CRM module. I can help with customer management, lead tracking, and sales analytics.',
      risk: "Switched to Risk Management. Let's assess your portfolio risk and market exposure.",
      finance: 'Switched to Personal Finance. I\'ll help with budgeting, planning, and financial goals.',
      trading: 'Switched to Trading Coach. Ready to enhance your trading knowledge and strategies.'
    };
    const botMessage: Message = {
      id: Date.now().toString(),
      sender: 'bot',
      content: welcomeMessages[module as keyof typeof welcomeMessages],
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
  };

  // --- API Key Modal ---
  const openApiKeyModal = () => {
    setTempKey('');
    setApiKeyError('');
    setShowApiKeyModal(true);
  };

  const saveApiKey = () => {
    if (!tempKey.trim().startsWith('sk-')) {
      setApiKeyError('Please enter a valid OpenAI API key (starts with "sk-").');
      return;
    }
    setStoredKey(tempKey.trim());
    setApiKey(tempKey.trim());
    setShowApiKeyModal(false);
    setApiKeyError('');
  };

  const handleRemoveKey = () => {
    removeStoredKey();
    setApiKey('');
    setShowApiKeyModal(false);
  };

  if (!isOpen) return null;

  // - Remove <HisaSidebar /> usage and its wrapper! Only show the chat panel/modal.
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* Chat panel */}
      <div className="flex-1 max-w-[420px] bg-white shadow-2xl h-full flex flex-col border-r border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Bot size={22} className="text-white" />
            <span className="font-bold text-lg">Hisa AI</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center"
            title="Close Chat"
          >
            <Menu size={18} />
          </button>
        </div>
        
        {/* API Key Modal */}
        {showApiKeyModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-2">
            <div className="bg-white rounded-lg p-6 max-w-xs w-full shadow-lg relative">
              <button className="absolute right-3 top-3 text-secondary" onClick={() => setShowApiKeyModal(false)}><X size={18} /></button>
              <div className="flex items-center gap-2 mb-3">
                <KeyRound size={20} className="text-blue-600" />
                <span className="font-bold text-secondary text-lg">Enter OpenAI API Key</span>
              </div>
              <Input
                value={tempKey}
                onChange={e => setTempKey(e.target.value)}
                placeholder="sk-..."
                className="mb-2"
                type="password"
              />
              {apiKeyError && <div className="text-red-600 text-xs mb-1">{apiKeyError}</div>}
              <div className="flex gap-2">
                <Button onClick={saveApiKey} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Save Key</Button>
                <Button onClick={handleRemoveKey} variant="outline" className="flex-1 text-red-600 border-red-200">Remove</Button>
              </div>
              <div className="text-xs text-neutral mt-3">
                Your key is stored locally in your browser and never shared.
              </div>
            </div>
          </div>
        )}

        {/* API Key Button */}
        <div className="flex justify-end px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          {!apiKey ? (
            <Button size="sm" className="bg-yellow-400 text-black hover:bg-yellow-500 rounded" onClick={openApiKeyModal}>
              <Lock className="h-4 w-4 mr-1.5" /> Enter OpenAI API Key
            </Button>
          ) : (
            <Button size="sm" className="bg-secondary text-primary hover:bg-primary/30 rounded" onClick={openApiKeyModal}>
              <KeyRound className="h-4 w-4 mr-1.5" /> Change API Key
            </Button>
          )}
        </div>

        {/* Chat/main area */}
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 md:px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-xs md:text-sm break-words">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-3 md:px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
            {apiError && (
              <div className="mt-2 text-xs text-red-500">{apiError}</div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t p-3 md:p-6 shrink-0">
            <div className="flex gap-2 md:gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={!apiKey ? "Enter your OpenAI API key above to chat..." : (
                  activeModule === 'crm'
                    ? "Ask about customer management, leads, or sales analytics..."
                    : activeModule === 'risk'
                      ? "Ask about portfolio risk, market volatility, or risk assessment..."
                      : activeModule === 'finance'
                        ? "Ask about budgeting, financial planning, or investment advice..."
                        : activeModule === 'trading'
                          ? "Ask about trading strategies, market analysis, or educational content..."
                          : "How can I help you today?"
                )}
                disabled={!apiKey || isTyping}
                className="flex-1 text-xs md:text-sm"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-3 md:px-4"
                disabled={!inputValue.trim() || !apiKey || isTyping}
              >
                <Send size={16} className="md:hidden" />
                <Send size={18} className="hidden md:block" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Main module content (outside of ChatInterface) will be rendered outside */}
    </div>
  );
};

export default ChatInterface;
