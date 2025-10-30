# Backend Connection Setup

## Overview
Your HisaHub application now has a fully integrated Django backend API that connects to your React frontend.

## What's Been Connected

### 1. API Configuration (`src/lib/api.ts`)
- Created a centralized API client for making requests to the Django backend
- Configured endpoints for stocks, trading, payments, news, and authentication
- Implemented token-based authentication

### 2. Backend Data Hook (`src/hooks/useBackendData.tsx`)
- Custom React hook to fetch data from Django backend
- Handles stocks, portfolio, and orders
- Includes login/logout functionality

### 3. Updated Financial Context (`src/contexts/FinancialDataContext.tsx`)
- Integrated Django backend as primary data source
- Falls back to Supabase for real-time features
- Combines backend orders with portfolio data

### 4. Vite Proxy Configuration (`vite.config.ts`)
- Added proxy to forward `/api` requests to `http://localhost:8000`
- Enables seamless frontend-backend communication during development

### 5. Backend Updates
- Added `StockListView` for fetching all active stocks
- Added `test_connection` endpoint to verify connectivity
- Updated URL routes to include new endpoints

## How to Start Both Servers

### 1. Start the Django Backend

Open a terminal and run:

```bash
cd backend
python manage.py runserver
```

The backend will start on `http://localhost:8000`

### 2. Start the React Frontend

Open another terminal and run:

```bash
npm run dev
```

The frontend will start on `http://localhost:8080`

## Testing the Connection

### Test Backend is Running

Visit in your browser:
- Backend API root: `http://localhost:8000/`
- Test endpoint: `http://localhost:8000/api/stocks/test/`
- Stocks list: `http://localhost:8000/api/stocks/`
- API documentation: `http://localhost:8000/swagger/`

### Test Frontend-Backend Integration

1. Open the frontend at `http://localhost:8080`
2. Open browser DevTools (F12) → Console
3. Look for API requests to `/api/stocks/`
4. Check Network tab for successful API calls

## Available API Endpoints

### Authentication
- `POST /api/accounts/login/` - User login
- `POST /api/accounts/register/` - User registration
- `POST /api/accounts/logout/` - User logout
- `GET /api/accounts/profile/` - Get user profile

### Stocks
- `GET /api/stocks/` - List all active stocks
- `GET /api/stocks/test/` - Test connection
- `GET /api/stocks/trending/` - Get trending stocks
- `GET /api/stocks/<symbol>/` - Get stock details
- `POST /api/stocks/batch/` - Batch fetch stocks

### Trading
- `GET /api/trading/orders/` - List orders
- `POST /api/trading/orders/` - Place new order
- `GET /api/trading/portfolio/` - Get portfolio data
- `GET /api/trading/positions/` - Get positions

### Payments
- `POST /api/payments/mpesa/` - M-Pesa payment
- `POST /api/payments/paypal/` - PayPal payment
- `POST /api/payments/stripe/` - Stripe payment

### News
- `GET /api/news/` - List news articles
- `GET /api/news/<id>/` - Get news detail

## Environment Variables

The `.env` file contains:
```
VITE_API_BASE_URL=http://localhost:8000
```

For production, update this to your production API URL.

## Troubleshooting

### CORS Errors
If you see CORS errors, check that `backend/Backend/settings.py` has:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",  # Your Vite dev server
    "http://127.0.0.1:8080",
]
```

### Connection Refused
- Make sure the Django backend is running on port 8000
- Check that no other application is using port 8000
- Verify the proxy configuration in `vite.config.ts`

### Authentication Issues
- Ensure you're logged in through Supabase first (current setup)
- Backend token authentication will be added for direct Django auth

## Next Steps

1. **Database Setup**: Run migrations if not already done
   ```bash
   cd backend
   python manage.py migrate
   ```

2. **Create Superuser**: To access Django admin
   ```bash
   python manage.py createsuperuser
   ```

3. **Add Stock Data**: Use Django admin or create fixtures to add stock data

4. **Test Trading Features**: Try placing orders through the frontend

## Architecture

```
Frontend (React + Vite)
    ↓
API Client (src/lib/api.ts)
    ↓
Vite Proxy (/api → localhost:8000)
    ↓
Django REST API (Backend)
    ↓
PostgreSQL Database
```

The system also maintains Supabase integration for real-time features like chat and notifications.

## Support

For issues or questions:
1. Check the Django logs in the terminal running the backend
2. Check browser console for frontend errors
3. Use Django admin at `http://localhost:8000/admin/`
4. Review API documentation at `http://localhost:8000/swagger/`