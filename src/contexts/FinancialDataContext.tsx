
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useMarketData } from '../hooks/useMarketData';

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
  user: any;
  portfolio: any;
}

interface FinancialDataContextType {
  state: FinancialDataState;
  dispatch: React.Dispatch<any>;
  placeOrder: (symbol: string, quantity: number, orderType?: string) => Promise<boolean>;
  updateMarketData: () => Promise<void>;
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
  isLoading: true,
  user: null,
  portfolio: null,
};

function financialDataReducer(state: FinancialDataState, action: any): FinancialDataState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER_DATA':
      return { 
        ...state, 
        user: action.payload.user,
        portfolio: action.payload.portfolio,
        accountData: {
          ...state.accountData,
          balance: action.payload.portfolio?.cash_balance || 0
        }
      };
    case 'SET_MARKET_DATA':
      return { 
        ...state, 
        stocks: action.payload.stocks,
        marketIndices: action.payload.marketIndices 
      };
    case 'SET_HOLDINGS':
      // Transform holdings data to include computed properties
      const transformedHoldings = action.payload.map((holding: any) => ({
        ...holding,
        symbol: holding.stocks?.symbol || '',
        name: holding.stocks?.name || '',
        value: holding.market_value || holding.quantity * holding.current_price,
        avgPrice: holding.average_price,
        currentPrice: holding.current_price,
        profitLoss: holding.unrealized_pnl || 0,
        profitLossPercent: holding.average_price > 0 
          ? ((holding.current_price - holding.average_price) / holding.average_price) * 100 
          : 0
      }));
      return { ...state, holdings: transformedHoldings };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'UPDATE_ACCOUNT_DATA':
      return { 
        ...state, 
        accountData: { ...state.accountData, ...action.payload } 
      };
    case 'UPDATE_PORTFOLIO_DATA':
      return {
        ...state,
        portfolioData: { ...state.portfolioData, ...action.payload }
      };
    default:
      return state;
  }
}

export const FinancialDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(financialDataReducer, initialState);
  const { user, portfolio, loading: userLoading, placeOrder, getPortfolioSummary } = useSupabaseData();
  const { stocks, marketIndices, loading: marketLoading, updateMarketData } = useMarketData();

  useEffect(() => {
    dispatch({
      type: 'SET_USER_DATA',
      payload: { user, portfolio }
    });
  }, [user, portfolio]);

  useEffect(() => {
    dispatch({
      type: 'SET_MARKET_DATA',
      payload: { stocks, marketIndices }
    });
  }, [stocks, marketIndices]);

  useEffect(() => {
    dispatch({
      type: 'SET_LOADING',
      payload: userLoading || marketLoading
    });
  }, [userLoading, marketLoading]);

  useEffect(() => {
    if (portfolio) {
      loadPortfolioData();
    }
  }, [portfolio]);

  const loadPortfolioData = async () => {
    const portfolioData = await getPortfolioSummary();
    if (portfolioData) {
      dispatch({
        type: 'SET_HOLDINGS',
        payload: portfolioData.holdings
      });
      
      const totalValue = portfolioData.total_value || 0;
      const totalPnL = portfolioData.holdings.reduce((sum: number, h: any) => sum + (h.unrealized_pnl || 0), 0);
      const dailyChangePercent = totalValue > 0 ? (totalPnL / (totalValue - totalPnL)) * 100 : 0;
      
      dispatch({
        type: 'UPDATE_ACCOUNT_DATA',
        payload: {
          totalValue,
          totalPnL
        }
      });

      dispatch({
        type: 'UPDATE_PORTFOLIO_DATA',
        payload: {
          totalValue,
          dailyChange: totalPnL,
          dailyChangePercent,
          weeklyChangePercent: 2.5, // Mock data
          monthlyChangePercent: 8.2, // Mock data
        }
      });

      // Mock transactions data - in a real app this would come from the API
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          symbol: 'EQTY',
          type: 'BUY',
          quantity: 100,
          price: 45.50,
          total: 4550,
          date: '2024-01-15',
          status: 'Completed'
        },
        {
          id: '2',
          symbol: 'KCB',
          type: 'BUY',
          quantity: 200,
          price: 38.25,
          total: 7650,
          date: '2024-01-14',
          status: 'Completed'
        }
      ];

      dispatch({
        type: 'SET_TRANSACTIONS',
        payload: mockTransactions
      });
    }
  };

  const contextValue: FinancialDataContextType = {
    state,
    dispatch,
    placeOrder: async (symbol: string, quantity: number, orderType = 'market') => {
      const success = await placeOrder(symbol, quantity, orderType);
      if (success) {
        await loadPortfolioData(); // Refresh portfolio data
      }
      return success;
    },
    updateMarketData
  };

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
