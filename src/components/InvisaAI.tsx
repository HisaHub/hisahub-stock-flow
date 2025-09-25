import React, { useEffect } from 'react';

const InvisaAI: React.FC = () => {
  useEffect(() => {
    // Load Botpress scripts
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.botpress.cloud/webchat/v3.3/inject.js';
    script1.async = true;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://files.bpcontent.cloud/2025/09/22/14/20250922141931-M4LB2MDV.js';
    script2.defer = true;
    document.head.appendChild(script2);

    // Cleanup function
    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  const openChat = () => {
    // Trigger Botpress webchat open (this depends on how Botpress exposes the API)
    if ((window as any).botpressWebChat) {
      (window as any).botpressWebChat.sendEvent({ type: 'show' });
    }
  };

  return (
    <button
      onClick={openChat}
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-all duration-200 flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
        boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)',
      }}
      title="Chat with Invisa AI"
      aria-label="Open Invisa AI Chat"
    >
      <span className="text-2xl font-bold text-white">I</span>
    </button>
  );
};

export default InvisaAI;