import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type TradingSignal = Database['public']['Tables']['trading_signals']['Row'] & {
  profiles: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  is_following?: boolean;
};

export const useTradingSignals = () => {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [followedSignals, setFollowedSignals] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchSignals();
    fetchFollowedSignals();

    // Set up realtime subscription
    const channel = supabase
      .channel('trading_signals_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trading_signals'
        },
        () => {
          fetchSignals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSignals = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('trading_signals')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Fetch profiles separately
      const userIds = [...new Set((data || []).map(s => s.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      const profilesMap = new Map(
        (profiles || []).map(p => [p.id, { first_name: p.first_name, last_name: p.last_name }])
      );

      setSignals((data || []).map(signal => ({
        ...signal,
        profiles: profilesMap.get(signal.user_id) || null,
        is_following: followedSignals.has(signal.id)
      })) as TradingSignal[]);
    } catch (error) {
      console.error('Error fetching signals:', error);
      toast({
        title: "Error",
        description: "Failed to load trading signals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowedSignals = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return;

      const { data, error } = await supabase
        .from('signal_followers')
        .select('signal_id')
        .eq('user_id', session.session.user.id);

      if (error) throw error;

      setFollowedSignals(new Set(data?.map(f => f.signal_id) || []));
    } catch (error) {
      console.error('Error fetching followed signals:', error);
    }
  };

  const createSignal = async (signalData: {
    ticker: string;
    signal_type: 'buy' | 'sell' | 'hold';
    entry_price: number;
    target_price?: number;
    stop_loss?: number;
    confidence_score?: number;
    timeframe?: 'day' | 'swing' | 'long';
    reasoning?: string;
    post_id?: string;
  }) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create signals",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('trading_signals')
        .insert({
          user_id: session.session.user.id,
          ...signalData
        });

      if (error) throw error;

      toast({
        title: "Signal Created",
        description: "Your trading signal has been posted"
      });

      await fetchSignals();
      return true;
    } catch (error) {
      console.error('Error creating signal:', error);
      toast({
        title: "Error",
        description: "Failed to create signal",
        variant: "destructive"
      });
      return false;
    }
  };

  const followSignal = async (signalId: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to follow signals",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('signal_followers')
        .insert({
          signal_id: signalId,
          user_id: session.session.user.id
        });

      if (error) throw error;

      setFollowedSignals(prev => new Set([...prev, signalId]));
      
      toast({
        title: "Following Signal",
        description: "You'll receive updates on this signal"
      });

      await fetchSignals();
    } catch (error) {
      console.error('Error following signal:', error);
      toast({
        title: "Error",
        description: "Failed to follow signal",
        variant: "destructive"
      });
    }
  };

  const unfollowSignal = async (signalId: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return;

      const { error } = await supabase
        .from('signal_followers')
        .delete()
        .eq('signal_id', signalId)
        .eq('user_id', session.session.user.id);

      if (error) throw error;

      setFollowedSignals(prev => {
        const next = new Set(prev);
        next.delete(signalId);
        return next;
      });

      toast({
        title: "Unfollowed Signal",
        description: "No longer following this signal"
      });

      await fetchSignals();
    } catch (error) {
      console.error('Error unfollowing signal:', error);
    }
  };

  return {
    signals,
    loading,
    followedSignals,
    createSignal,
    followSignal,
    unfollowSignal,
    refetch: fetchSignals
  };
};
