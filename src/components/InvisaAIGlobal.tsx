import React, { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

const InvisaAIGlobal: React.FC = () => {
  useEffect(() => {
    // Add Botpress webchat scripts
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.botpress.cloud/webchat/v3.2/inject.js';
    script1.defer = true;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://files.bpcontent.cloud/2025/09/22/14/20250922141931-M4LB2MDV.js';
    script2.defer = true;
    document.head.appendChild(script2);

    return () => {
      // Cleanup scripts on unmount
      if (document.head.contains(script1)) {
        document.head.removeChild(script1);
      }
      if (document.head.contains(script2)) {
        document.head.removeChild(script2);
      }
    };
  }, []);

  const handleChatClick = () => {
    // Try multiple methods to open the Botpress webchat
    if ((window as any).botpressWebChat) {
      (window as any).botpressWebChat.open();
    } else if ((window as any).bp) {
      (window as any).bp('show');
    } else {
      // Fallback: dispatch a custom event that Botpress might listen to
      window.dispatchEvent(new CustomEvent('bp:webchat:open'));
    }
  };

  return (
    <button
      onClick={handleChatClick}
      className="fixed bottom-24 right-4 z-50 w-14 h-14 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
      aria-label="Open Invisa AI Chat"
    >
      <MessageCircle size={24} />
    </button>
  );
};

export default InvisaAIGlobal;