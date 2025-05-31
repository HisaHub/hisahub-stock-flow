
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
        'Your conversion rate can be improved by segmenting customers based on behavior patterns.',
        'Consider scheduling follow-ups with high-value prospects to increase closing rates.',
      ],
      risk: [
        'Your portfolio shows moderate risk levels. Consider diversifying across different sectors.',
        'Current market volatility suggests implementing stop-loss orders for protection.',
        'Your Sharpe ratio of 1.8 indicates good risk-adjusted returns.',
        'Market beta of 1.2 means your portfolio is slightly more volatile than the market.',
        'VIX at 23.5 suggests elevated market uncertainty - consider hedging strategies.',
      ],
      finance: [
        'Following the 50/30/20 rule could optimize your budget allocation.',
        'Building an emergency fund should be your priority before aggressive investing.',
        'Your savings rate indicates you could increase investments by 15%.',
        'Consider tax-advantaged accounts like retirement funds for long-term goals.',
        'Debt consolidation might reduce your monthly payments and interest burden.',
      ],
      trading: [
        'Technical analysis suggests a bullish trend in the NSE index.',
        'Consider learning about support and resistance levels for better entry points.',
        'Risk management is crucial - never risk more than 2% per trade.',
        'Moving averages indicate a potential trend reversal - monitor closely.',
        'Your trading course progress shows good fundamentals - practice with paper trading.',
      ]
    };
    return responses[activeModule as keyof typeof responses][Math.floor(Math.random() * 5)];
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-7xl h-[95vh] md:h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 md:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center">
              <Bot size={16} className="md:hidden text-white" />
              <Bot size={24} className="hidden md:block text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold">Hisa AI</h1>
              <p className="text-xs md:text-sm text-blue-100">AI-Driven Financial Brain</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full w-8 h-8 md:w-10 md:h-10"
          >
            <X size={18} className="md:hidden" />
            <X size={24} className="hidden md:block" />
          </Button>
        </div>

        {/* Module Tabs */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b shrink-0">
          <Tabs value={activeModule} onValueChange={handleModuleChange} className="w-full">
            <TabsList className="w-full justify-start bg-transparent p-2 md:p-6 gap-1 md:gap-2 overflow-x-auto">
              <TabsTrigger 
                value="crm" 
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white whitespace-nowrap"
              >
                <TrendingUp size={14} className="md:hidden" />
                <TrendingUp size={18} className="hidden md:block" />
                <span className="hidden sm:inline">CRM</span>
              </TabsTrigger>
              <TabsTrigger 
                value="risk" 
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white whitespace-nowrap"
              >
                <Shield size={14} className="md:hidden" />
                <Shield size={18} className="hidden md:block" />
                <span className="hidden sm:inline">Risk</span>
              </TabsTrigger>
              <TabsTrigger 
                value="finance" 
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white whitespace-nowrap"
              >
                <DollarSign size={14} className="md:hidden" />
                <DollarSign size={18} className="hidden md:block" />
                <span className="hidden sm:inline">Finance</span>
              </TabsTrigger>
              <TabsTrigger 
                value="trading" 
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white whitespace-nowrap"
              >
                <GraduationCap size={14} className="md:hidden" />
                <GraduationCap size={18} className="hidden md:block" />
                <span className="hidden sm:inline">Trading</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-h-0">
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
            </div>

            {/* Input Area */}
            <div className="border-t p-3 md:p-6 shrink-0">
              <div className="flex gap-2 md:gap-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={getModulePlaceholder()}
                  className="flex-1 text-xs md:text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-3 md:px-4"
                >
                  <Send size={16} className="md:hidden" />
                  <Send size={18} className="hidden md:block" />
                </Button>
              </div>
            </div>
          </div>

          {/* Module Sidebar */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l bg-gray-50 overflow-y-auto">
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
  );
};

export default ChatInterface;
