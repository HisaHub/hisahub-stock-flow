
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  marketCap?: string;
  peRatio?: string;
  volume?: string;
  dayRange?: string;
}

export interface Holding {
  id: number;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  profitLoss: number;
  profitLossPercent: number;
}

export interface Transaction {
  id: number;
  date: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND';
  symbol: string;
  quantity: number;
  price: number;
  total: number;
  status: string;
}

export interface PortfolioData {
  totalValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  weeklyChangePercent: number;
  monthlyChangePercent: number;
}

export interface AccountData {
  balance: number;
  brokerName: string;
}

interface FinancialState {
  stocks: Stock[];
  holdings: Holding[];
  transactions: Transaction[];
  portfolioData: PortfolioData;
  accountData: AccountData;
  lastUpdated: number;
}

type FinancialAction = 
  | { type: 'UPDATE_STOCK_PRICES'; payload: Stock[] }
  | { type: 'UPDATE_PORTFOLIO' }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'BUY_STOCK'; payload: { symbol: string; quantity: number; price: number } }
  | { type: 'SELL_STOCK'; payload: { symbol: string; quantity: number; price: number } }
  | { type: 'ADD_FUNDS'; payload: number };

// Initial state with consistent data
const initialStocks: Stock[] = [
  { 
    symbol: "SCOM", 
    name: "Safaricom PLC", 
    price: 22.70, 
    change: 2.3,
    marketCap: "KES 1.2T",
    peRatio: "15.4",
    volume: "2.1M"
  },
  { 
    symbol: "EQTY", 
    name: "Equity Group Holdings", 
    price: 45.50, 
    change: -1.2,
    marketCap: "KES 450B",
    peRatio: "8.2",
    volume: "1.8M"
  },
  { 
    symbol: "KCB", 
    name: "KCB Group", 
    price: 38.25, 
    change: 0.8,
    marketCap: "KES 380B",
    peRatio: "6.5",
    volume: "1.5M"
  },
  { 
    symbol: "COOP", 
    name: "Co-operative Bank", 
    price: 12.85, 
    change: 1.5,
    marketCap: "KES 180B",
    peRatio: "5.8",
    volume: "900K"
  },
  { 
    symbol: "ABSA", 
    name: "Absa Bank Kenya", 
    price: 8.90, 
    change: -0.5,
    marketCap: "KES 120B",
    peRatio: "7.2",
    volume: "600K"
  }
];

const calculateHoldings = (stocks: Stock[]): Holding[] => {
  return [
    {
      id: 1,
      symbol: "SCOM",
      name: "Safaricom PLC",
      quantity: 230,
      avgPrice: 20.50,
      currentPrice: stocks.find(s => s.symbol === "SCOM")?.price || 22.70,
      value: 0, // Will be calculated
      profitLoss: 0, // Will be calculated
      profitLossPercent: 0 // Will be calculated
    },
    {
      id: 2,
      symbol: "KCB",
      name: "KCB Group",
      quantity: 120,
      avgPrice: 38.00,
      currentPrice: stocks.find(s => s.symbol === "KCB")?.price || 38.25,
      value: 0,
      profitLoss: 0,
      profitLossPercent: 0
    },
    {
      id: 3,
      symbol: "EQTY",
      name: "Equity Group",
      quantity: 80,
      avgPrice: 46.20,
      currentPrice: stocks.find(s => s.symbol === "EQTY")?.price || 45.50,
      value: 0,
      profitLoss: 0,
      profitLossPercent: 0
    },
    {
      id: 4,
      symbol: "COOP",
      name: "Co-op Bank",
      quantity: 200,
      avgPrice: 18.50,
      currentPrice: stocks.find(s => s.symbol === "COOP")?.price || 12.85,
      value: 0,
      profitLoss: 0,
      profitLossPercent: 0
    }
  ].map(holding => {
    const value = holding.quantity * holding.currentPrice;
    const profitLoss = value - (holding.quantity * holding.avgPrice);
    const profitLossPercent = (profitLoss / (holding.quantity * holding.avgPrice)) * 100;
    
    return {
      ...holding,
      value,
      profitLoss,
      profitLossPercent
    };
  });
};

const initialHoldings = calculateHoldings(initialStocks);

const initialState: FinancialState = {
  stocks: initialStocks,
  holdings: initialHoldings,
  transactions: [
    {
      id: 1,
      date: "2025-05-20",
      type: "BUY",
      symbol: "SCOM",
      quantity: 50,
      price: 22.85,
      total: 1142.50,
      status: "Completed"
    },
    {
      id: 2,
      date: "2025-05-18",
      type: "SELL",
      symbol: "KCB",
      quantity: 30,
      price: 36.50,
      total: 1095.00,
      status: "Completed"
    }
  ],
  portfolioData: {
    totalValue: initialHoldings.reduce((sum, h) => sum + h.value, 0),
    dailyChange: 3250.20,
    dailyChangePercent: 2.6,
    weeklyChangePercent: 5.8,
    monthlyChangePercent: 12.4
  },
  accountData: {
    balance: 100200,
    brokerName: "ABC Capital"
  },
  lastUpdated: Date.now()
};

// Reducer
function financialReducer(state: FinancialState, action: FinancialAction): FinancialState {
  switch (action.type) {
    case 'UPDATE_STOCK_PRICES': {
      const updatedStocks = action.payload;
      const updatedHoldings = calculateHoldings(updatedStocks);
      const totalValue = updatedHoldings.reduce((sum, h) => sum + h.value, 0);
      const previousValue = state.portfolioData.totalValue;
      const dailyChange = totalValue - previousValue;
      const dailyChangePercent = (dailyChange / previousValue) * 100;

      return {
        ...state,
        stocks: updatedStocks,
        holdings: updatedHoldings,
        portfolioData: {
          ...state.portfolioData,
          totalValue,
          dailyChange,
          dailyChangePercent
        },
        lastUpdated: Date.now()
      };
    }

    case 'BUY_STOCK': {
      const { symbol, quantity, price } = action.payload;
      const total = quantity * price;
      
      if (state.accountData.balance < total) {
        return state; // Insufficient funds
      }

      const newTransaction: Transaction = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        type: 'BUY',
        symbol,
        quantity,
        price,
        total,
        status: 'Completed'
      };

      // Update holdings
      const existingHoldingIndex = state.holdings.findIndex(h => h.symbol === symbol);
      let updatedHoldings = [...state.holdings];

      if (existingHoldingIndex >= 0) {
        const existing = state.holdings[existingHoldingIndex];
        const newQuantity = existing.quantity + quantity;
        const newAvgPrice = ((existing.quantity * existing.avgPrice) + (quantity * price)) / newQuantity;
        
        updatedHoldings[existingHoldingIndex] = {
          ...existing,
          quantity: newQuantity,
          avgPrice: newAvgPrice,
          value: newQuantity * existing.currentPrice,
          profitLoss: (newQuantity * existing.currentPrice) - (newQuantity * newAvgPrice),
          profitLossPercent: ((existing.currentPrice - newAvgPrice) / newAvgPrice) * 100
        };
      } else {
        const stock = state.stocks.find(s => s.symbol === symbol);
        if (stock) {
          updatedHoldings.push({
            id: Date.now(),
            symbol,
            name: stock.name,
            quantity,
            avgPrice: price,
            currentPrice: stock.price,
            value: quantity * stock.price,
            profitLoss: quantity * (stock.price - price),
            profitLossPercent: ((stock.price - price) / price) * 100
          });
        }
      }

      return {
        ...state,
        holdings: updatedHoldings,
        transactions: [newTransaction, ...state.transactions],
        accountData: {
          ...state.accountData,
          balance: state.accountData.balance - total
        },
        portfolioData: {
          ...state.portfolioData,
          totalValue: updatedHoldings.reduce((sum, h) => sum + h.value, 0)
        }
      };
    }

    case 'SELL_STOCK': {
      const { symbol, quantity, price } = action.payload;
      const total = quantity * price;
      
      const existingHoldingIndex = state.holdings.findIndex(h => h.symbol === symbol);
      if (existingHoldingIndex < 0 || state.holdings[existingHoldingIndex].quantity < quantity) {
        return state; // Insufficient shares
      }

      const newTransaction: Transaction = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        type: 'SELL',
        symbol,
        quantity,
        price,
        total,
        status: 'Completed'
      };

      let updatedHoldings = [...state.holdings];
      const existing = state.holdings[existingHoldingIndex];
      const newQuantity = existing.quantity - quantity;

      if (newQuantity === 0) {
        updatedHoldings.splice(existingHoldingIndex, 1);
      } else {
        updatedHoldings[existingHoldingIndex] = {
          ...existing,
          quantity: newQuantity,
          value: newQuantity * existing.currentPrice,
          profitLoss: (newQuantity * existing.currentPrice) - (newQuantity * existing.avgPrice),
          profitLossPercent: ((existing.currentPrice - existing.avgPrice) / existing.avgPrice) * 100
        };
      }

      return {
        ...state,
        holdings: updatedHoldings,
        transactions: [newTransaction, ...state.transactions],
        accountData: {
          ...state.accountData,
          balance: state.accountData.balance + total
        },
        portfolioData: {
          ...state.portfolioData,
          totalValue: updatedHoldings.reduce((sum, h) => sum + h.value, 0)
        }
      };
    }

    case 'ADD_FUNDS': {
      return {
        ...state,
        accountData: {
          ...state.accountData,
          balance: state.accountData.balance + action.payload
        }
      };
    }

    default:
      return state;
  }
}

// Context
const FinancialDataContext = createContext<{
  state: FinancialState;
  dispatch: React.Dispatch<FinancialAction>;
} | null>(null);

// Provider component
export const FinancialDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(financialReducer, initialState);

  // Simulate real-time market updates
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedStocks = state.stocks.map(stock => {
        const change = (Math.random() - 0.5) * 0.5;
        const newPrice = Math.max(0.1, stock.price + change);
        const priceChange = ((newPrice - stock.price) / stock.price) * 100;
        
        return {
          ...stock,
          price: Number(newPrice.toFixed(2)),
          change: Number(priceChange.toFixed(2)),
          dayRange: `${(newPrice * 0.98).toFixed(2)} - ${(newPrice * 1.02).toFixed(2)}`
        };
      });

      dispatch({ type: 'UPDATE_STOCK_PRICES', payload: updatedStocks });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [state.stocks]);

  return (
    <FinancialDataContext.Provider value={{ state, dispatch }}>
      {children}
    </FinancialDataContext.Provider>
  );
};

// Custom hook
export const useFinancialData = () => {
  const context = useContext(FinancialDataContext);
  if (!context) {
    throw new Error('useFinancialData must be used within a FinancialDataProvider');
  }
  return context;
};
