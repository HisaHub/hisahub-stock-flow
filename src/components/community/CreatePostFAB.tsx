import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, PenTool, Camera, BarChart3, MessageSquare, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface CreatePostFABProps {
  onCreatePost: (content: string) => Promise<boolean>;
}

const CreatePostFAB: React.FC<CreatePostFABProps> = ({ onCreatePost }) => {
  const [isMainOpen, setIsMainOpen] = useState(false);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onCreatePost(postContent.trim());
    setIsSubmitting(false);

    if (success) {
      setPostContent('');
      setIsPostDialogOpen(false);
      setIsMainOpen(false);
      toast.success('Post shared successfully!');
    }
  };

  const fabActions = [
    {
      icon: PenTool,
      label: 'Share Idea',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => {
        setIsPostDialogOpen(true);
        setIsMainOpen(false);
      }
    },
    {
      icon: BarChart3,
      label: 'Share Trade',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => {
        toast.info('Trade sharing coming soon!');
        setIsMainOpen(false);
      }
    },
    {
      icon: Brain,
      label: 'Ask AI',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => {
        toast.info('AI assistant coming soon!');
        setIsMainOpen(false);
      }
    },
    {
      icon: Camera,
      label: 'Share Chart',
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => {
        toast.info('Chart sharing coming soon!');
        setIsMainOpen(false);
      }
    }
  ];

  return (
    <>
      {/* Main FAB */}
      <div className="fixed bottom-5 right-5 z-50">
        <div className="relative">
          {/* Action buttons */}
          {isMainOpen && (
            <div className="absolute bottom-16 right-0 space-y-3 animate-fade-in">
              {fabActions.map((action, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="bg-primary text-off-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg">
                    {action.label}
                  </span>
                  <Button
                    onClick={action.action}
                    className={`h-12 w-12 rounded-full shadow-lg ${action.color} text-white hover:scale-110 transition-all duration-200`}
                  >
                    <action.icon className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {/* Main FAB button */}
          <Button
            onClick={() => setIsMainOpen(!isMainOpen)}
            className={`h-14 w-14 rounded-full bg-secondary text-primary shadow-lg hover:bg-secondary/90 hover:scale-110 transition-all duration-200 ${
              isMainOpen ? 'rotate-45' : 'rotate-0'
            }`}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Backdrop */}
      {isMainOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 animate-fade-in"
          onClick={() => setIsMainOpen(false)}
        />
      )}

      {/* Post Creation Dialog */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="bg-primary border-secondary/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-off-white">Share Your Trading Idea</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitPost} className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="What's happening in the markets? Share your thoughts, analysis, or questions...

Use $TICKER to mention stocks (e.g., $KCB, $EABL)
Use #hashtags for topics (e.g., #Forex, #Equities, #TechnicalAnalysis)"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="min-h-[150px] bg-primary border-secondary/20 text-off-white resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center text-sm">
                <span className="text-off-white/60">
                  {postContent.length}/500 characters
                </span>
                <div className="flex gap-2 text-off-white/60">
                  <span>💡 Tip: Use $TICKER and #hashtags</span>
                </div>
              </div>
            </div>
            
            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-2">
              {['$KCB', '$EABL', '$SCOM', '#TechnicalAnalysis', '#Forex', '#MarketUpdate'].map((suggestion) => (
                <Button
                  key={suggestion}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPostContent(postContent + ' ' + suggestion)}
                  className="border-secondary/30 text-off-white hover:bg-secondary/10"
                >
                  {suggestion}
                </Button>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPostDialogOpen(false)}
                className="border-secondary/20 text-off-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!postContent.trim() || isSubmitting}
                className="bg-secondary text-primary hover:bg-secondary/90"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Posting...
                  </div>
                ) : (
                  'Share Post'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePostFAB;