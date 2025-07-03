
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useMarketData } from '../hooks/useMarketData';
import { supabase } from '@/integrations/supabase/client';

interface GlobalUserContextType {
  user: any;
  profile: any;
  portfolio: any;
  holdings: any[];
  transactions: any[];
  notifications: any[];
  stocks: any[];
  marketIndices: any[];
  loading: boolean;
  refreshUserData: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const GlobalUserContext = createContext<GlobalUserContextType | undefined>(undefined);

export const GlobalUserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Always call hooks at the top level
  const { user, portfolio, loading: userLoading, getPortfolioSummary } = useSupabaseData();
  const { stocks, marketIndices, loading: marketLoading } = useMarketData();

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchHoldings = async () => {
    if (!portfolio) return;
    
    try {
      const { data } = await supabase
        .from('holdings')
        .select(`
          *,
          stocks:stock_id (
            symbol,
            name,
            sector
          )
        `)
        .eq('portfolio_id', portfolio.id);
      
      setHoldings(data || []);
    } catch (error) {
      console.error('Error fetching holdings:', error);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('transactions')
        .select(`
          *,
          stocks:stock_id (
            symbol,
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const refreshUserData = async () => {
    await Promise.all([
      fetchProfile(),
      fetchHoldings(),
      fetchTransactions(),
    ]);
  };

  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  useEffect(() => {
    if (user) {
      refreshUserData();
      fetchNotifications();
    }
  }, [user, portfolio]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const holdingsChannel = supabase
      .channel('holdings-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'holdings' },
        () => fetchHoldings()
      )
      .subscribe();

    const transactionsChannel = supabase
      .channel('transactions-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => fetchTransactions()
      )
      .subscribe();

    const notificationsChannel = supabase
      .channel('notifications-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(holdingsChannel);
      supabase.removeChannel(transactionsChannel);
      supabase.removeChannel(notificationsChannel);
    };
  }, [user]);

  const contextValue: GlobalUserContextType = {
    user,
    profile,
    portfolio,
    holdings,
    transactions,
    notifications,
    stocks,
    marketIndices,
    loading: userLoading || marketLoading,
    refreshUserData,
    refreshNotifications
  };

  return (
    <GlobalUserContext.Provider value={contextValue}>
      {children}
    </GlobalUserContext.Provider>
  );
};

export const useGlobalUser = () => {
  const context = useContext(GlobalUserContext);
  if (context === undefined) {
    throw new Error('useGlobalUser must be used within a GlobalUserProvider');
  }
  return context;
};
