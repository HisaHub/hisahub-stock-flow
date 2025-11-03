
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

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
        showChatbot(); // Show chatbot after splash completes
      }, 300); // Wait for fade out animation
    }, 2500);

    return () => {
      clearTimeout(timer);
      showChatbot(); // Ensure chatbot shows if component unmounts
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-primary transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center space-y-6">
        <div className="animate-pulse">
          <Logo size={80} />
        </div>
        
        <div className="text-center space-y-2">
          <h1 
            className="text-4xl font-bold text-secondary"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            HisaHub
          </h1>
          <p className="text-off-white/80 text-lg">
            Your Gateway to Smart Trading
          </p>
        </div>

        {/* Loading animation */}
        <div className="flex space-x-2 mt-8">
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
