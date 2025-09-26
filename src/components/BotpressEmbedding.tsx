import { useEffect } from 'react';

const BotpressEmbedding = () => {
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

  return null; // This component only loads scripts, no UI
};

export default BotpressEmbedding;