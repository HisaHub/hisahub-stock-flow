import React, { useState, useEffect } from 'react';
import { Bot, Bell, X, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAIChat } from '@/hooks/useAIChat';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'dividend' | 'news' | 'order_update' | 'price_alert' | 'system';
  created_at: string;
  is_read: boolean;
}

const FloatingAIButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const { messages, loading, sendMessage } = useAIChat(userId);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        fetchNotifications(data.user.id);
      }
    });

    // Load saved position
    const savedPosition = localStorage.getItem('aiButtonPosition');
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }
  }, []);

  useEffect(() => {
    // Subscribe to new notifications
    if (!userId) return;

    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchNotifications = async (userId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!userId) return;

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isOpen) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = Math.max(0, Math.min(window.innerWidth - 60, e.clientX - dragOffset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - dragOffset.y));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      localStorage.setItem('aiButtonPosition', JSON.stringify(position));
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput('');
  };

  const quickActions = [
    "Analyze my portfolio",
    "What's trending?",
    "Market summary",
    "Recent trades"
  ];

  return (
    <>
      {/* Floating Button */}
      <div
        data-tour="ai-assistant"
        className={cn(
          "fixed z-50 w-14 h-14 rounded-full bg-accent shadow-lg cursor-move transition-all duration-200",
          isDragging && "scale-110 shadow-2xl",
          unreadCount > 0 && "animate-pulse"
        )}
        style={{ left: position.x, top: position.y }}
        onMouseDown={handleMouseDown}
        onClick={() => !isDragging && setIsOpen(!isOpen)}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-white text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </div>
      </div>

      {/* Slide-up Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full sm:w-[600px] h-[80vh] sm:h-[600px] bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Invisa AI</h3>
                  <p className="text-xs text-muted-foreground">Your HisaHub Assistant</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="ai" className="flex-1 flex flex-col h-[calc(100%-73px)]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ai">
                  <Bot className="w-4 h-4 mr-2" />
                  AI Assistant
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge className="ml-2 bg-destructive text-white">{unreadCount}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* AI Chat Tab */}
              <TabsContent value="ai" className="flex-1 flex flex-col mt-0 h-full overflow-hidden">
                <ScrollArea className="flex-1 p-4 h-[calc(100vh-280px)] sm:h-[400px]">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                        <Bot className="w-8 h-8 text-accent" />
                      </div>
                      <h4 className="font-semibold mb-2">Hey! I'm Invisa AI</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Your intelligent trading assistant for HisaHub
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {quickActions.map((action) => (
                          <Button
                            key={action}
                            variant="outline"
                            size="sm"
                            onClick={() => setInput(action)}
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "flex gap-3",
                            msg.role === 'user' ? "justify-end" : "justify-start"
                          )}
                        >
                          {msg.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                              <Bot className="w-4 h-4 text-accent" />
                            </div>
                          )}
                          <div
                            className={cn(
                              "max-w-[80%] p-3 rounded-2xl",
                              msg.role === 'user'
                                ? "bg-accent text-white"
                                : "bg-muted text-foreground"
                            )}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      {loading && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-accent animate-pulse" />
                          </div>
                          <div className="bg-muted p-3 rounded-2xl">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 rounded-full bg-accent/50 animate-bounce" />
                              <div className="w-2 h-2 rounded-full bg-accent/50 animate-bounce delay-100" />
                              <div className="w-2 h-2 rounded-full bg-accent/50 animate-bounce delay-200" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask me anything about trading..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={loading}
                    />
                    <Button onClick={handleSendMessage} disabled={loading || !input.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="flex-1 mt-0 h-full overflow-hidden">
                <ScrollArea className="h-[calc(100vh-200px)] sm:h-[480px]">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <Bell className="w-12 h-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={cn(
                            "p-4 hover:bg-muted/50 cursor-pointer transition-colors",
                            !notif.is_read && "bg-accent/5"
                          )}
                          onClick={() => markAsRead(notif.id)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-sm">{notif.title}</h4>
                            <Badge variant={
                              notif.type === 'price_alert' ? 'destructive' : 
                              notif.type === 'order_update' ? 'default' : 
                              'secondary'
                            }>
                              {notif.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(notif.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAIButton;
