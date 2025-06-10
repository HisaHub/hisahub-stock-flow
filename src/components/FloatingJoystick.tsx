
import React, { useState, useEffect } from 'react';
import { User, CreditCard, TrendingUp, Shield, Bell, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingJoystickProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'personal', icon: User, label: 'Personal', color: 'text-blue-400' },
  { id: 'banking', icon: CreditCard, label: 'Banking', color: 'text-green-400' },
  { id: 'trading', icon: TrendingUp, label: 'Trading', color: 'text-yellow-400' },
  { id: 'security', icon: Shield, label: 'Security', color: 'text-red-400' },
  { id: 'notifications', icon: Bell, label: 'Alerts', color: 'text-purple-400' },
  { id: 'ai', icon: Bot, label: 'AI', color: 'text-cyan-400' }
];

const FloatingJoystick: React.FC<FloatingJoystickProps> = ({ activeTab, onTabChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    setShowHint(false);
  };

  const handleTabSelect = (tabId: string) => {
    onTabChange(tabId);
    setIsExpanded(false);
  };

  const getItemPosition = (index: number) => {
    const angle = (index * 60) - 90; // 60 degrees apart, starting from top
    const radius = 80;
    const radian = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius
    };
  };

  const activeItem = menuItems.find(item => item.id === activeTab);

  return (
    <>
      {/* Onboarding Hint */}
      {showHint && (
        <div className="fixed top-1/2 right-28 z-40 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white text-sm animate-fade-in transform -translate-y-1/2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            Tap to navigate sections
          </div>
        </div>
      )}

      {/* Floating Joystick Container */}
      <div className="fixed top-1/2 right-6 z-30 transform -translate-y-1/2">
        <div className="relative">
          {/* Menu Items */}
          {isExpanded && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              {menuItems.map((item, index) => {
                const position = getItemPosition(index);
                const Icon = item.icon;
                const isActive = item.id === activeTab;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabSelect(item.id)}
                    className={cn(
                      "absolute w-12 h-12 rounded-full border-2 border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 group",
                      isActive 
                        ? "bg-white/20 border-white/40 shadow-lg" 
                        : "bg-white/10 hover:bg-white/20"
                    )}
                    style={{
                      transform: `translate(${position.x}px, ${position.y}px)`,
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <Icon 
                      className={cn(
                        "w-5 h-5 mx-auto transition-colors",
                        isActive ? "text-white" : item.color
                      )} 
                    />
                    
                    {/* Label tooltip */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.label}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Central Joystick Button */}
          <button
            onClick={toggleExpanded}
            className={cn(
              "w-16 h-16 rounded-full border-2 backdrop-blur-md transition-all duration-300 shadow-lg hover:scale-105",
              isExpanded
                ? "bg-white/20 border-white/40 rotate-45"
                : "bg-white/10 border-white/30"
            )}
          >
            {activeItem && (
              <div className="flex flex-col items-center justify-center">
                <activeItem.icon 
                  className={cn(
                    "w-6 h-6 transition-colors",
                    isExpanded ? "text-white" : activeItem.color
                  )} 
                />
                {!isExpanded && (
                  <div className="text-xs text-white/80 mt-1 font-medium">
                    {activeItem.label}
                  </div>
                )}
              </div>
            )}
            
            {/* Plus/Close indicator */}
            <div className={cn(
              "absolute top-1 right-1 w-3 h-3 rounded-full border border-white/40 transition-all duration-300",
              isExpanded ? "bg-red-400" : "bg-green-400"
            )}>
              <div className={cn(
                "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold",
                isExpanded ? "rotate-45" : ""
              )}>
                {isExpanded ? "×" : "+"}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
};

export default FloatingJoystick;
