
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAIChat = (userId: string | null) => {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  const sendMessage = async (message: string) => {
    if (!userId || !message.trim()) return;

    setLoading(true);
    
    // Add user message to UI immediately
    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await supabase.functions.invoke('ai-assistant', {
        body: {
          message,
          user_id: userId,
          session_id: sessionId
        }
      });

      if (response.error) throw response.error;

      const { response: aiResponse, session_id: newSessionId } = response.data;
      
      // Update session ID if it's new
      if (newSessionId && !sessionId) {
        setSessionId(newSessionId);
      }

      // Add AI response to UI
      const aiMessage = { role: 'assistant', content: aiResponse };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('AI Chat error:', error);
      toast({
        title: "Chat Error",
        description: "Failed to get AI response. Please try again.",
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
    setSessionId(null);
  };

  return {
    messages,
    loading,
    sendMessage,
    clearChat
  };
};
