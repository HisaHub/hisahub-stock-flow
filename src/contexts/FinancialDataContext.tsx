import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useMarketData } from '../hooks/useMarketData';
import { useBackendData } from '../hooks/useBackendData';

// Define types for stocks, holdings, and market indices
export interface Stock {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  price: number;
  volume: number;
  high: number;
  low: number;
  change: number;
  changePercent: string;
}

// Enhanced Holding interface with computed properties
export interface Holding {
  id: string;
  portfolio_id: string;
  stock_id: string;
  quantity: number;
  average_price: number;
  current_price: number;
  market_value: number;
  unrealized_pnl: number;
  stocks?: {
    symbol: string;
    name: string;
  };
  // Computed properties for UI
  symbol: string;
  name: string;
  value: number;
  avgPrice: number;
  currentPrice: number;
  profitLoss: number;
  profitLossPercent: number;
}

export interface MarketIndex {
  id: string;
  symbol: string;
  name: string;
  value: number;
  change_value: number;
  change_percent: number;
  timestamp: string;
}

export interface Transaction {
  id: string;
  symbol: string;
  type: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
  status: string;
}

interface PortfolioData {
  totalValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  weeklyChangePercent: number;
  monthlyChangePercent: number;
}

interface FinancialDataState {
  accountData: {
    balance: number;
    totalValue: number;
    todaysPnL: number;
    totalPnL: number;
  };
  portfolioData: PortfolioData;
  stocks: Stock[];
  holdings: Holding[];
  marketIndices: MarketIndex[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  user: any;
  portfolio: any;
  lastUpdated: number | null;
}

interface FinancialDataContextType {
  state: FinancialDataState;
  dispatch: React.Dispatch<any>;
  placeOrder: (symbol: string, quantity: number, orderType?: string, side?: 'buy' | 'sell') => Promise<boolean>;
  updateMarketData: () => Promise<void>;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

const initialState: FinancialDataState = {
  accountData: {
    balance: 0,
    totalValue: 0,
    todaysPnL: 0,
    totalPnL: 0,
  },
  portfolioData: {
    totalValue: 0,
    dailyChange: 0,
    dailyChangePercent: 0,
    weeklyChangePercent: 0,
    monthlyChangePercent: 0,
  },
  stocks: [],
  holdings: [],
  marketIndices: [],
  transactions: [],
  isLoading: false,
  error: null,
  user: null,
  portfolio: null,
  lastUpdated: null,
};

function financialDataReducer(state: FinancialDataState, action: any): FinancialDataState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_USER_DATA':
      return { 
        ...state, 
        user: action.payload.user,
        portfolio: action.payload.portfolio,
        accountData: {
          ...state.accountData,
          balance: action.payload.portfolio?.cash_balance || 0
        },
        lastUpdated: Date.now()
      };
    case 'SET_MARKET_DATA':
      return { 
        ...state, 
        stocks: action.payload.stocks,
        marketIndices: action.payload.marketIndices,
        lastUpdated: Date.now()
      };
    case 'SET_HOLDINGS':
      // Transform holdings data to include computed properties
      const transformedHoldings = action.payload.map((holding: any) => {
        const avgPrice = holding.average_price || 0;
        const currentPrice = holding.current_price || 0;
        const quantity = holding.quantity || 0;
        const marketValue = quantity * currentPrice;
        const profitLoss = holding.unrealized_pnl || (marketValue - (quantity * avgPrice));
        const profitLossPercent = avgPrice > 0 ? ((currentPrice - avgPrice) / avgPrice) * 100 : 0;

        return {
          ...holding,
          symbol: holding.stocks?.symbol || holding.symbol || '',
          name: holding.stocks?.name || holding.name || '',
          value: marketValue,
          avgPrice,
          currentPrice,
          profitLoss,
          profitLossPercent
        };
      });
      return { ...state, holdings: transformedHoldings, lastUpdated: Date.now() };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'UPDATE_ACCOUNT_DATA':
      return { 
        ...state, 
        accountData: { ...state.accountData, ...action.payload },
        lastUpdated: Date.now()
      };
    case 'UPDATE_PORTFOLIO_DATA':
      return {
        ...state,
        portfolioData: { ...state.portfolioData, ...action.payload },
        lastUpdated: Date.now()
      };
    default:
      return state;
  }
}

export const FinancialDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(financialDataReducer, initialState);
  
  // Supabase data (fallback and real-time features)
  const { user, portfolio, loading: userLoading, placeOrder: supabasePlaceOrder, getPortfolioSummary } = useSupabaseData();
  const { stocks: supabaseStocks, marketIndices, loading: marketLoading, updateMarketData } = useMarketData();
  
  // Django backend data (primary source)
  const { 
    stocks: backendStocks, 
    portfolio: backendPortfolio, 
    orders: backendOrders,
    loading: backendLoading,
    error: backendError,
    placeOrder: backendPlaceOrder,
    refetch: refetchBackendData
  } = useBackendData();

  // Memoize stocks to prevent unnecessary re-renders
  const stocks = useMemo(() => {
    if (backendStocks.length > 0) {
      return backendStocks.map(stock => ({
        id: stock.id,
        symbol: stock.symbol,
        name: stock.name,
        sector: stock.sector,
        price: stock.current_price,
        volume: stock.volume,
        high: stock.high,
        low: stock.low,
        change: stock.change,
        changePercent: stock.change_percent.toFixed(2)
      }));
    }
    return supabaseStocks;
  }, [backendStocks, supabaseStocks]);

  // Memoize active portfolio
  const activePortfolio = useMemo(() => 
    backendPortfolio || portfolio, 
    [backendPortfolio, portfolio]
  );

  // Memoize loading state
  const isLoading = useMemo(() => 
    userLoading || marketLoading || backendLoading,
    [userLoading, marketLoading, backendLoading]
  );

  // Update user data when it changes
  useEffect(() => {
    if (user || activePortfolio) {
      dispatch({
        type: 'SET_USER_DATA',
        payload: { user, portfolio: activePortfolio }
      });
    }
  }, [user, activePortfolio]);

  // Update market data when it changes
  useEffect(() => {
    dispatch({
      type: 'SET_MARKET_DATA',
      payload: { stocks, marketIndices }
    });
  }, [stocks, marketIndices]);

  // Update loading state
  useEffect(() => {
    dispatch({
      type: 'SET_LOADING',
      payload: isLoading
    });
  }, [isLoading]);

  // Update error state
  useEffect(() => {
    if (backendError) {
      dispatch({
        type: 'SET_ERROR',
        payload: backendError
      });
    }
  }, [backendError]);

  // Load portfolio data - memoized with useCallback
  const loadPortfolioData = useCallback(async () => {
    if (!activePortfolio) return;

    try {
      let portfolioData;
      
      // Prioritize backend data
      if (backendPortfolio) {
        portfolioData = {
          holdings: backendPortfolio.holdings || [],
          total_value: backendPortfolio.total_value || 0,
          cash_balance: backendPortfolio.cash_balance || 0
        };
      } else {
        // Fallback to Supabase
        portfolioData = await getPortfolioSummary();
      }

      if (portfolioData) {
        dispatch({
          type: 'SET_HOLDINGS',
          payload: portfolioData.holdings
        });
        
        const totalValue = portfolioData.total_value || 0;
        const totalPnL = portfolioData.holdings?.reduce(
          (sum: number, h: any) => sum + (h.unrealized_pnl || 0), 
          0
        ) || 0;
        const dailyChangePercent = totalValue > 0 && totalValue > totalPnL
          ? (totalPnL / (totalValue - totalPnL)) * 100 
          : 0;
        
        dispatch({
          type: 'UPDATE_ACCOUNT_DATA',
          payload: {
            totalValue,
            totalPnL,
            balance: portfolioData.cash_balance || 0
          }
        });

        dispatch({
          type: 'UPDATE_PORTFOLIO_DATA',
          payload: {
            totalValue,
            dailyChange: totalPnL,
            dailyChangePercent,
            weeklyChangePercent: 2.5, // TODO: Calculate from historical data
            monthlyChangePercent: 8.2, // TODO: Calculate from historical data
          }
        });

        // Convert backend orders to transactions format
        if (backendOrders.length > 0) {
          const transactions = backendOrders.map(order => ({
            id: order.id,
            symbol: order.stock_symbol,
            type: order.side.toUpperCase(), 
            quantity: order.quantity,
            price: order.price,
            total: order.quantity * order.price,
            date: new Date(order.created_at).toLocaleDateString(),
            status: order.status
          }));

          dispatch({
            type: 'SET_TRANSACTIONS',
            payload: transactions
          });
        }
      }
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to load portfolio data'
      });
    }
  }, [activePortfolio, backendPortfolio, backendOrders, getPortfolioSummary]);

  // Load portfolio data when dependencies change
  useEffect(() => {
    loadPortfolioData();
  }, [loadPortfolioData]);

  // Clear error callback
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Refresh all data callback
  const refreshData = useCallback(async () => {
    try {
      await Promise.all([
        refetchBackendData(),
        updateMarketData(),
        loadPortfolioData()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to refresh data'
      });
    }
  }, [refetchBackendData, updateMarketData, loadPortfolioData]);

  // Optimized place order function
  const placeOrder = useCallback(async (
    symbol: string, 
    quantity: number, 
    orderType = 'market',
    side: 'buy' | 'sell' = 'buy'
  ) => {
    let success = false;
    
    try {
      // Try backend first
      success = await backendPlaceOrder(
        symbol, 
        quantity, 
        orderType as 'market' | 'limit',
        side
      );
    } catch (error) {
      console.warn('Backend order failed, trying Supabase:', error);
      try {
        // Fallback to Supabase with adjusted quantity for sell orders
        const adjustedQuantity = side === 'sell' ? -quantity : quantity;
        success = await supabasePlaceOrder(symbol, adjustedQuantity, orderType);
      } catch (supabaseError) {
        console.error('Supabase order also failed:', supabaseError);
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed to place order'
        });
      }
    }
    
    if (success) {
      // Refresh data after successful order
      await refreshData();
    }
    
    return success;
  }, [backendPlaceOrder, supabasePlaceOrder, refreshData]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue: FinancialDataContextType = useMemo(() => ({
    state,
    dispatch,
    placeOrder,
    updateMarketData,
    refreshData,
    clearError
  }), [state, placeOrder, updateMarketData, refreshData, clearError]);

  return (
    <FinancialDataContext.Provider value={contextValue}>
      {children}
    </FinancialDataContext.Provider>
  );
};

export const useFinancialData = () => {
  const context = useContext(FinancialDataContext);
  if (context === undefined) {
    throw new Error('useFinancialData must be used within a FinancialDataProvider');
  }
  return context;
};
