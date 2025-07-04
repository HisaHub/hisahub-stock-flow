
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useLocalAIChat = () => {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setLoading(true);
    
    // Add user message to UI immediately
    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemma',
          prompt: message,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Add AI response to UI
      const aiMessage = { role: 'assistant', content: data.response || 'No response received' };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Local AI Chat error:', error);
      toast({
        title: "Chat Error",
        description: "Failed to connect to local Gemma model. Please ensure it's running on localhost:11434",
        variant: "destructive"
      });
      
      // Remove the user message since it failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return {
    messages,
    loading,
    sendMessage,
    clearChat
  };
};
