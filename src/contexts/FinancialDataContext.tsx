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

interface FinancialDataState {
  accountData: {
    balance: number;
    totalValue: number;
    todaysPnL: number;
    totalPnL: number;
  };
  stocks: Stock[];
  holdings: Holding[];
  marketIndices: MarketIndex[];
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
  stocks: [],
  holdings: [],
  marketIndices: [],
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
      return { ...state, holdings: action.payload };
    case 'UPDATE_ACCOUNT_DATA':
      return { 
        ...state, 
        accountData: { ...state.accountData, ...action.payload } 
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
      dispatch({
        type: 'UPDATE_ACCOUNT_DATA',
        payload: {
          totalValue: portfolioData.total_value,
          totalPnL: portfolioData.holdings.reduce((sum: number, h: any) => sum + h.unrealized_pnl, 0)
        }
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
