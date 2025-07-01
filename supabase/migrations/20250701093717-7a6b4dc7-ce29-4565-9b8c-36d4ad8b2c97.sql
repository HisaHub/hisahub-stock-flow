
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE public.user_role AS ENUM ('admin', 'premium', 'standard');
CREATE TYPE public.account_status AS ENUM ('active', 'suspended', 'pending_verification', 'closed');
CREATE TYPE public.order_type AS ENUM ('market', 'limit', 'stop_loss', 'stop_limit');
CREATE TYPE public.order_status AS ENUM ('pending', 'partial', 'filled', 'cancelled', 'rejected');
CREATE TYPE public.order_side AS ENUM ('buy', 'sell');
CREATE TYPE public.broker_name AS ENUM ('genghis_capital', 'abc_capital', 'sterling_capital', 'dyer_blair');
CREATE TYPE public.kyc_status AS ENUM ('pending', 'approved', 'rejected', 'expired');
CREATE TYPE public.notification_type AS ENUM ('price_alert', 'order_update', 'dividend', 'news', 'system');

-- User profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT,
  date_of_birth DATE,
  national_id TEXT UNIQUE,
  role user_role DEFAULT 'standard',
  account_status account_status DEFAULT 'pending_verification',
  risk_tolerance INTEGER CHECK (risk_tolerance BETWEEN 1 AND 10),
  trading_pin_hash TEXT,
  biometric_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- KYC documents table
CREATE TABLE public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_url TEXT NOT NULL,
  status kyc_status DEFAULT 'pending',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewer_notes TEXT
);

-- Broker accounts table
CREATE TABLE public.broker_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  broker_name broker_name NOT NULL,
  account_number TEXT NOT NULL,
  cds_account TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  api_credentials JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, broker_name)
);

-- Stocks table
CREATE TABLE public.stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  sector TEXT,
  market_cap DECIMAL,
  shares_outstanding BIGINT,
  currency TEXT DEFAULT 'KES',
  is_active BOOLEAN DEFAULT TRUE,
  listed_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stock prices table (for historical and real-time data)
CREATE TABLE public.stock_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id UUID REFERENCES public.stocks(id) ON DELETE CASCADE,
  price DECIMAL NOT NULL,
  volume BIGINT DEFAULT 0,
  high DECIMAL,
  low DECIMAL,
  open DECIMAL,
  close DECIMAL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolios table
CREATE TABLE public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Main Portfolio',
  total_value DECIMAL DEFAULT 0,
  cash_balance DECIMAL DEFAULT 0,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Holdings table
CREATE TABLE public.holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  stock_id UUID REFERENCES public.stocks(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  average_price DECIMAL NOT NULL DEFAULT 0,
  current_price DECIMAL DEFAULT 0,
  unrealized_pnl DECIMAL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(portfolio_id, stock_id)
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  stock_id UUID REFERENCES public.stocks(id) ON DELETE CASCADE,
  broker_account_id UUID REFERENCES public.broker_accounts(id),
  order_type order_type NOT NULL,
  side order_side NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL,
  stop_price DECIMAL,
  filled_quantity INTEGER DEFAULT 0,
  average_fill_price DECIMAL DEFAULT 0,
  status order_status DEFAULT 'pending',
  broker_order_id TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id),
  stock_id UUID REFERENCES public.stocks(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'buy', 'sell', 'dividend', 'fee'
  quantity INTEGER,
  price DECIMAL,
  amount DECIMAL NOT NULL,
  fees DECIMAL DEFAULT 0,
  tax DECIMAL DEFAULT 0,
  settlement_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Watchlists table
CREATE TABLE public.watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Watchlist items table
CREATE TABLE public.watchlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id UUID REFERENCES public.watchlists(id) ON DELETE CASCADE,
  stock_id UUID REFERENCES public.stocks(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(watchlist_id, stock_id)
);

-- Price alerts table
CREATE TABLE public.price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  stock_id UUID REFERENCES public.stocks(id) ON DELETE CASCADE,
  condition TEXT NOT NULL, -- 'above', 'below'
  target_price DECIMAL NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI chat sessions table
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI chat messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user', 'assistant'
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market data table (for indices, market summary)
CREATE TABLE public.market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  value DECIMAL NOT NULL,
  change_value DECIMAL DEFAULT 0,
  change_percent DECIMAL DEFAULT 0,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broker_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Portfolio policies
CREATE POLICY "Users can manage own portfolios" ON public.portfolios FOR ALL USING (auth.uid() = user_id);

-- Holdings policies  
CREATE POLICY "Users can view own holdings" ON public.holdings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.portfolios WHERE portfolios.id = holdings.portfolio_id AND portfolios.user_id = auth.uid())
);

-- Orders policies
CREATE POLICY "Users can manage own orders" ON public.orders FOR ALL USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);

-- Watchlists policies
CREATE POLICY "Users can manage own watchlists" ON public.watchlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own watchlist items" ON public.watchlist_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.watchlists WHERE watchlists.id = watchlist_items.watchlist_id AND watchlists.user_id = auth.uid())
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Chat policies
CREATE POLICY "Users can manage own chat sessions" ON public.chat_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own chat messages" ON public.chat_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.chat_sessions WHERE chat_sessions.id = chat_messages.session_id AND chat_sessions.user_id = auth.uid())
);

-- Public read access for stocks and market data
CREATE POLICY "Anyone can read stocks" ON public.stocks FOR SELECT USING (true);
CREATE POLICY "Anyone can read stock prices" ON public.stock_prices FOR SELECT USING (true);
CREATE POLICY "Anyone can read market data" ON public.market_data FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX idx_stock_prices_stock_timestamp ON public.stock_prices(stock_id, timestamp DESC);
CREATE INDEX idx_orders_user_status ON public.orders(user_id, status);
CREATE INDEX idx_transactions_user_created ON public.transactions(user_id, created_at DESC);
CREATE INDEX idx_notifications_user_read ON public.notifications(user_id, is_read);
CREATE INDEX idx_chat_messages_session ON public.chat_messages(session_id, created_at);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON public.portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_holdings_updated_at BEFORE UPDATE ON public.holdings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for development
INSERT INTO public.stocks (symbol, name, sector, currency) VALUES 
('SCOM', 'Safaricom PLC', 'Technology', 'KES'),
('EQTY', 'Equity Group Holdings', 'Banking', 'KES'),
('KCB', 'KCB Group', 'Banking', 'KES'),
('COOP', 'Co-operative Bank', 'Banking', 'KES'),
('BAT', 'British American Tobacco', 'Consumer Goods', 'KES'),
('EABL', 'East African Breweries', 'Consumer Goods', 'KES'),
('ABSA', 'Absa Bank Kenya', 'Banking', 'KES'),
('DTBK', 'Diamond Trust Bank', 'Banking', 'KES'),
('SCBK', 'Standard Chartered Bank Kenya', 'Banking', 'KES'),
('NBK', 'National Bank of Kenya', 'Banking', 'KES');

INSERT INTO public.market_data (symbol, name, value) VALUES 
('NSE20', 'NSE 20 Share Index', 1850.50),
('NASI', 'NSE All Share Index', 125.75),
('NSE25', 'NSE 25 Share Index', 3420.80);
