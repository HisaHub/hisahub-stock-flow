import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, MessageCircle, Link as LinkIcon, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SharePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  postContent: string;
}

const SharePostDialog: React.FC<SharePostDialogProps> = ({
  open,
  onOpenChange,
  postId,
  postContent
}) => {
  const { toast } = useToast();

  const trackShare = async (platform: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        await supabase
          .from('post_shares')
          .insert({
            post_id: postId,
            user_id: session.session.user.id,
            platform
          });
      }
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${postContent}\n\nShared from HisaHub`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    trackShare('whatsapp');
    onOpenChange(false);
  };

  const shareToTelegram = () => {
    const text = encodeURIComponent(`${postContent}\n\nShared from HisaHub`);
    window.open(`https://t.me/share/url?text=${text}`, '_blank');
    trackShare('telegram');
    onOpenChange(false);
  };

  const copyLink = async () => {
    const link = `${window.location.origin}/community?post=${postId}`;
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link copied",
        description: "Post link copied to clipboard"
      });
      trackShare('clipboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-primary border-secondary/30">
        <DialogHeader>
          <DialogTitle className="text-off-white">Share Post</DialogTitle>
          <DialogDescription className="text-off-white/70">
            Share this post with your network
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          <Button
            onClick={shareToWhatsApp}
            className="w-full bg-green-600 hover:bg-green-700 text-white justify-start"
          >
            <MessageCircle className="w-5 h-5 mr-3" />
            Share on WhatsApp
          </Button>

          <Button
            onClick={shareToTelegram}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white justify-start"
          >
            <Share2 className="w-5 h-5 mr-3" />
            Share on Telegram
          </Button>

          <Button
            onClick={copyLink}
            variant="outline"
            className="w-full border-secondary/30 text-off-white hover:bg-white/5 justify-start"
          >
            <LinkIcon className="w-5 h-5 mr-3" />
            Copy Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SharePostDialog;
