
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseData = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchUserData(session.user.id);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchUserData(session.user.id);
          } else {
            setPortfolio(null);
            setLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Get or create user profile
      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!profile) {
        const { data: newProfile, error } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            role: 'standard',
            account_status: 'pending_verification'
          })
          .select()
          .single();

        if (error) throw error;
        profile = newProfile;
      }

      // Get or create default demo portfolio with KES 10,000
      let { data: portfolios } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', userId);

      if (!portfolios || portfolios.length === 0) {
        const { data: newPortfolio, error } = await supabase
          .from('portfolios')
          .insert({
            user_id: userId,
            name: 'Demo Portfolio',
            is_default: true,
            cash_balance: 10000, // KES 10,000 demo balance
          })
          .select()
          .single();

        if (error) throw error;
        setPortfolio(newPortfolio);
        
        if (toast) {
          toast({
            title: "Welcome to HisaHub!",
            description: "Your demo portfolio has been created with KES 10,000 to start trading.",
          });
        }
      } else {
        setPortfolio(portfolios[0]);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      if (toast) {
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (stockSymbol: string, quantity: number, orderType = 'market') => {
    if (!user || !portfolio) return false;

    try {
      const response = await supabase.functions.invoke('portfolio-management', {
        body: {
          action: 'place_order',
          user_id: user.id,
          portfolio_id: portfolio.id,
          stock_symbol: stockSymbol,
          quantity,
          order_type: orderType
        }
      });

      if (response.error) throw response.error;

      if (toast) {
        toast({
          title: "Order Placed",
          description: `Successfully ${quantity > 0 ? 'bought' : 'sold'} ${Math.abs(quantity)} shares of ${stockSymbol}`,
        });
      }

      return true;
    } catch (error) {
      console.error('Error placing order:', error);
      if (toast) {
        toast({
          title: "Order Failed",
          description: error.message || "Failed to place order",
          variant: "destructive"
        });
      }
      return false;
    }
  };

  const getPortfolioSummary = async () => {
    if (!portfolio) return null;

    try {
      const response = await supabase.functions.invoke('portfolio-management', {
        body: {
          action: 'get_portfolio_summary',
          portfolio_id: portfolio.id
        }
      });

      if (response.error) throw response.error;
      return response.data;
    } catch (error) {
      console.error('Error getting portfolio summary:', error);
      return null;
    }
  };

  return {
    user,
    portfolio,
    loading,
    placeOrder,
    getPortfolioSummary,
    fetchUserData
  };
};
