import { useState, useEffect } from 'react';
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import { toast } from 'sonner';

// Types for backend data
export interface BackendStock {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  current_price: number;
  volume: number;
  high: number;
  low: number;
  change: number;
  change_percent: number;
  is_active: boolean;
}

export interface BackendOrder {
  id: string;
  stock_symbol: string;
  quantity: number;
  price: number;
  order_type: 'market' | 'limit';
  side: 'buy' | 'sell';
  status: string;
  created_at: string;
}

export interface BackendPortfolio {
  id: string;
  name: string;
  cash_balance: number;
  total_value: number;
  holdings: any[];
}

export const useBackendData = () => {
  const [stocks, setStocks] = useState<BackendStock[]>([]);
  const [portfolio, setPortfolio] = useState<BackendPortfolio | null>(null);
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if backend is configured (not localhost in production)
  const isBackendConfigured = import.meta.env.VITE_API_BASE_URL && 
    !import.meta.env.VITE_API_BASE_URL.includes('localhost');

  // Fetch stocks from Django backend
  const fetchStocks = async () => {
    if (!isBackendConfigured) return;
    
    try {
      const data = await apiClient.get<BackendStock[]>(API_ENDPOINTS.stocks.list);
      setStocks(data);
    } catch (err) {
      console.error('Error fetching stocks:', err);
      setError('Failed to fetch stocks from backend');
    }
  };

  // Fetch portfolio from Django backend
  const fetchPortfolio = async () => {
    if (!isBackendConfigured) return;
    
    try {
      const data = await apiClient.get<BackendPortfolio>(API_ENDPOINTS.trading.portfolio);
      setPortfolio(data);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError('Failed to fetch portfolio from backend');
    }
  };

  // Fetch orders from Django backend
  const fetchOrders = async () => {
    if (!isBackendConfigured) return;
    
    try {
      const data = await apiClient.get<BackendOrder[]>(API_ENDPOINTS.trading.orders);
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders from backend');
    }
  };

  // Place order through Django backend
  const placeOrder = async (
    stockSymbol: string, 
    quantity: number, 
    orderType: 'market' | 'limit' = 'market',
    side: 'buy' | 'sell' = 'buy',
    price?: number
  ) => {
    try {
      const orderData = {
        stock_symbol: stockSymbol,
        quantity,
        order_type: orderType,
        side,
        ...(price && { price })
      };

      const newOrder = await apiClient.post<BackendOrder>(
        API_ENDPOINTS.trading.orders, 
        orderData
      );

      setOrders(prev => [newOrder, ...prev]);
      toast.success(`${side.toUpperCase()} order placed successfully!`);
      
      // Refresh portfolio after order
      await fetchPortfolio();
      
      return true;
    } catch (err) {
      console.error('Error placing order:', err);
      toast.error('Failed to place order');
      return false;
    }
  };

  // Login with Django backend
  const login = async (username: string, password: string) => {
    try {
      const response = await apiClient.post<{ token: string, user: any }>(
        API_ENDPOINTS.auth.login,
        { username, password }
      );
      
      apiClient.setToken(response.token);
      toast.success('Logged in successfully!');
      
      // Fetch user data after login
      await fetchData();
      
      return response.user;
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Login failed');
      return null;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout);
      apiClient.removeToken();
      setStocks([]);
      setPortfolio(null);
      setOrders([]);
      toast.success('Logged out successfully!');
    } catch (err) {
      console.error('Logout error:', err);
      apiClient.removeToken(); // Remove token anyway
    }
  };

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchStocks(),
        fetchPortfolio(),
        fetchOrders()
      ]);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch - only if backend is configured
  useEffect(() => {
    if (isBackendConfigured) {
      fetchData();
    }
  }, [isBackendConfigured]);

  return {
    stocks,
    portfolio,
    orders,
    loading,
    error,
    placeOrder,
    login,
    logout,
    refetch: fetchData,
    fetchStocks,
    fetchPortfolio,
    fetchOrders
  };
};