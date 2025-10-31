
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
      console.log('Sending request to local AI:', {
        url: 'http://127.0.0.1:11434/api/generate',
        model: 'finance-chat',
        prompt: `You are Invisa, a helpful and knowledgeable Kenyan financial assistant. ${message}`
      });

      const response = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'finance-chat',
          prompt: `You are Invisa, a helpful and knowledgeable Kenyan financial assistant. ${message}`,
          stream: false
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('AI Response data:', data);
      
      // Add AI response to UI
      const aiMessage = { role: 'assistant', content: data.response || 'No response received' };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Local AI Chat error details:', {
        error: error,
        message: error.message,
        stack: error.stack
      });
      
      let errorMessage = "Failed to connect to local Invisa model.";
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage += " This is likely a CORS issue. Try running the app locally or configure CORS on your AI server.";
      } else if (error.message.includes('404')) {
        errorMessage += " The model 'finance-chat' was not found. Check if the model is loaded.";
      } else {
        errorMessage += ` Error: ${error.message}`;
      }
      
      toast({
        title: "Chat Error",
        description: errorMessage,
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
