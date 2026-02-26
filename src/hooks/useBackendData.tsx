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
  currency?: string;
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

// Check if the Django backend is actually configured and reachable
const isBackendConfigured = (() => {
  const url = import.meta.env.VITE_API_BASE_URL || '';
  if (!url) return false;
  if (url.includes('localhost') || url.includes('127.0.0.1')) return false;
  return true;
})();

export const useBackendData = () => {
  const [stocks, setStocks] = useState<BackendStock[]>([]);
  const [portfolio, setPortfolio] = useState<BackendPortfolio | null>(null);
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch stocks from Django backend
  const fetchStocks = async () => {
    if (!isBackendConfigured) return;
    try {
      const data = await apiClient.get<BackendStock[]>(API_ENDPOINTS.stocks.list);
      setStocks(data);
    } catch (err) {
      console.debug('Backend stocks unavailable, using Supabase');
    }
  };

  // Fetch portfolio from Django backend
  const fetchPortfolio = async () => {
    if (!isBackendConfigured) return;
    try {
      const data = await apiClient.get<BackendPortfolio>(API_ENDPOINTS.trading.portfolio);
      setPortfolio(data);
    } catch (err) {
      console.debug('Backend portfolio unavailable, using Supabase');
    }
  };

  // Fetch orders from Django backend
  const fetchOrders = async () => {
    if (!isBackendConfigured) return;
    try {
      const data = await apiClient.get<BackendOrder[]>(API_ENDPOINTS.trading.orders);
      setOrders(data);
    } catch (err) {
      console.debug('Backend orders unavailable, using Supabase');
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
    if (!isBackendConfigured) return false;
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
    if (!isBackendConfigured) return null;
    try {
      const response = await apiClient.post<{ token: string, user: any }>(
        API_ENDPOINTS.auth.login,
        { username, password }
      );
      apiClient.setToken(response.token);
      toast.success('Logged in successfully!');
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
    if (!isBackendConfigured) return;
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout);
      apiClient.removeToken();
      setStocks([]);
      setPortfolio(null);
      setOrders([]);
    } catch (err) {
      apiClient.removeToken();
    }
  };

  // Fetch all data
  const fetchData = async () => {
    if (!isBackendConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchStocks(), fetchPortfolio(), fetchOrders()]);
    } catch (err) {
      console.debug('Backend data fetch skipped');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

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
