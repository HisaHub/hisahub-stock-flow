
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSupabaseData = () => {
  const [loading, setLoading] = useState(true);
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
        .select('id, first_name, last_name, role, account_status, phone_number, date_of_birth, national_id, biometric_enabled, risk_tolerance, has_completed_tour, created_at, updated_at')
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
          toast.error('Failed to create user profile');
          setLoading(false);
          return;
        }
        profile = newProfile;
      } else if (profileError) {
        throw profileError;
      }

      // Get existing portfolios for the user. Do NOT auto-create a demo
      // portfolio here; portfolio creation should be an explicit user action
      // (e.g., via broker integration or onboarding). If none exist, leave
      // the portfolio `null` so the UI can prompt the user to create one.
      let { data: portfolios } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', userId);

      if (portfolios && portfolios.length > 0) {
        setPortfolio(portfolios[0]);
      } else {
        setPortfolio(null);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
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

      toast.success(`Successfully ${quantity > 0 ? 'bought' : 'sold'} ${Math.abs(quantity)} shares of ${stockSymbol}`);
      return true;
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.message || 'Failed to place order');
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
