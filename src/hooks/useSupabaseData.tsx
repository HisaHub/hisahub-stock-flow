
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseData = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          // Use setTimeout to avoid potential recursion issues
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setPortfolio(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // First check if user profile exists
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // If profile doesn't exist, it should have been created by the auth trigger
      // If not, we'll create it here as a fallback
      if (profileError && profileError.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            role: 'standard',
            account_status: 'pending_verification'
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          toast({ title: "Error", description: "Failed to create user profile", variant: "destructive" });
          setLoading(false);
          return;
        }
        profile = newProfile;
      } else if (profileError) {
        throw profileError;
      }

      // Get or create default demo portfolio
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
            total_value: 10000
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating portfolio:', error);
          toast({ title: "Error", description: "Failed to create portfolio", variant: "destructive" });
        } else {
          setPortfolio(newPortfolio);
          toast({ title: "Success", description: "Welcome to HisaHub! Your demo portfolio has been created with KES 10,000." });
        }
      } else {
        setPortfolio(portfolios[0]);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({ title: "Error", description: "Failed to load user data", variant: "destructive" });
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

      toast({ title: "Success", description: `Successfully ${quantity > 0 ? 'bought' : 'sold'} ${Math.abs(quantity)} shares of ${stockSymbol}` });
      return true;
    } catch (error) {
      console.error('Error placing order:', error);
      toast({ title: "Error", description: error.message || "Failed to place order", variant: "destructive" });
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
