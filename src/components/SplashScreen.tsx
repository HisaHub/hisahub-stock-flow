
import React, { useEffect, useState } from "react";
import Logo from "./Logo";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide chatbot during splash screen
    const hideChatbot = () => {
      const chatbotContainer = document.querySelector('div[id^="bp-web-widget"]');
      if (chatbotContainer) {
        (chatbotContainer as HTMLElement).style.display = 'none';
      }
    };

    // Show chatbot after splash screen
    const showChatbot = () => {
      const chatbotContainer = document.querySelector('div[id^="bp-web-widget"]');
      if (chatbotContainer) {
        (chatbotContainer as HTMLElement).style.display = 'block';
      }
    };

    hideChatbot();

    // Reduced splash duration from 2500ms to 600ms for better LCP performance
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
        showChatbot();
      }, 200); // Reduced fade out time
    }, 600); // Reduced from 2500ms to significantly improve LCP

    return () => {
      clearTimeout(timer);
      showChatbot();
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-primary transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-pulse">
          <Logo size={64} />
        </div>
        
        <div className="text-center space-y-1">
          <h1 
            className="text-3xl font-bold text-secondary"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            HisaHub
          </h1>
          <p className="text-off-white/80 text-base">
            Your Gateway to Smart Trading
          </p>
        </div>

        {/* Simplified loading animation */}
        <div className="flex space-x-2 mt-4">
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
