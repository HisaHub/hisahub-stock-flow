
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, TrendingUp, Shield, DollarSign, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CRMModule from './modules/CRMModule';
import RiskManagementModule from './modules/RiskManagementModule';
import PersonalFinanceModule from './modules/PersonalFinanceModule';
import TradingCoachModule from './modules/TradingCoachModule';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onClose }) => {
  const [activeModule, setActiveModule] = useState('crm');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      content: 'Welcome to Hisa AI! I\'m your intelligent financial assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getModulePlaceholder = () => {
    switch (activeModule) {
      case 'crm': return 'Ask about customer management, leads, or sales analytics...';
      case 'risk': return 'Ask about portfolio risk, market volatility, or risk assessment...';
      case 'finance': return 'Ask about budgeting, financial planning, or investment advice...';
      case 'trading': return 'Ask about trading strategies, market analysis, or educational content...';
      default: return 'How can I help you today?';
    }
  };

  const getModuleResponse = () => {
    const responses = {
      crm: [
        'Based on your CRM data, I recommend focusing on your top 20% leads for maximum conversion.',
        'Your customer satisfaction rate of 94.2% is excellent! Consider implementing loyalty programs.',
        'I notice your response time is 2.3 hours. Automating initial responses could improve this.',
      ],
      risk: [
        'Your portfolio shows moderate risk levels. Consider diversifying across different sectors.',
        'Current market volatility suggests implementing stop-loss orders for protection.',
        'Your Sharpe ratio of 1.8 indicates good risk-adjusted returns.',
      ],
      finance: [
        'Following the 50/30/20 rule could optimize your budget allocation.',
        'Building an emergency fund should be your priority before aggressive investing.',
        'Your savings rate indicates you could increase investments by 15%.',
      ],
      trading: [
        'Technical analysis suggests a bullish trend in the NSE index.',
        'Consider learning about support and resistance levels for better entry points.',
        'Risk management is crucial - never risk more than 2% per trade.',
      ]
    };
    return responses[activeModule as keyof typeof responses][Math.floor(Math.random() * 3)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        content: getModuleResponse(),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleModuleChange = (module: string) => {
    setActiveModule(module);
    const welcomeMessages = {
      crm: 'Switched to CRM module. I can help with customer management, lead tracking, and sales analytics.',
      risk: 'Switched to Risk Management. Let\'s assess your portfolio risk and market exposure.',
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex overflow-hidden">
        {/* Header */}
        <div className="flex flex-col w-full">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Hisa AI</h1>
                <p className="text-blue-100">AI-Driven Financial Brain</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X size={24} />
            </Button>
          </div>

          {/* Module Tabs */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <Tabs value={activeModule} onValueChange={handleModuleChange} className="w-full">
              <TabsList className="w-full justify-start bg-transparent p-6 space-x-2">
                <TabsTrigger 
                  value="crm" 
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <TrendingUp size={18} />
                  CRM
                </TabsTrigger>
                <TabsTrigger 
                  value="risk" 
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Shield size={18} />
                  Risk
                </TabsTrigger>
                <TabsTrigger 
                  value="finance" 
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <DollarSign size={18} />
                  Finance
                </TabsTrigger>
                <TabsTrigger 
                  value="trading" 
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <GraduationCap size={18} />
                  Trading
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t p-6">
                <div className="flex gap-3">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={getModulePlaceholder()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Module Sidebar */}
            <div className="w-80 border-l bg-gray-50 overflow-y-auto">
              <Tabs value={activeModule} className="w-full h-full">
                <TabsContent value="crm" className="h-full m-0">
                  <CRMModule />
                </TabsContent>
                <TabsContent value="risk" className="h-full m-0">
                  <RiskManagementModule />
                </TabsContent>
                <TabsContent value="finance" className="h-full m-0">
                  <PersonalFinanceModule />
                </TabsContent>
                <TabsContent value="trading" className="h-full m-0">
                  <TradingCoachModule />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
