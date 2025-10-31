HisaHub – AI-Powered Stock Trading Platform

HisaHub is a next-generation, AI-powered stock trading platform built to democratize access to financial markets in Kenya and beyond. It integrates real-time market data, multi-broker trading, AI-driven insights, and mobile-first design to help retail investors trade smarter, faster, and more securely.

Overview

Core Stack:

Frontend: React + Vite (optimized with useMemo, useCallback, and smart caching)

Backend: Django REST Framework (atomic transactions, wallet, order, and holdings management)

Database: PostgreSQL (decimal-safe financial data)

Auth: Supabase (OAuth + JWT token system)

Payments: M-Pesa, PayPal, Stripe (sandbox-ready)

AI Layer: TensorFlow + Supabase Edge Functions

Caching & Background Tasks: Redis + Celery

Hosting: AWS Nairobi

Logging & Monitoring: Sentry integration

Key Features

Real-Time Market Data

Live price feeds (Polygon.io, IEX Cloud, or NSE API)

Adaptive charting and analytics

Multi-Broker Integration

Unified trading interface across supported brokers

Wallet and holdings sync in real-time

AI-Powered Assistant ("Hisa")

Personalized portfolio insights

Risk and sentiment analysis

Trade recommendations and alerts

Social & Community Trading

Investor discussions and sentiment aggregation

Community-driven watchlists

Localized Payments

M-Pesa STK, PayPal, and Stripe integration

Sandbox and live modes supported

Security

Supabase authentication

JWT-based API access

Enforced HTTPS and CORS rules

Environment-variable–based secrets

Environment Configuration

Create a .env file at the project root with the following keys:

# Environment
VITE_TESTING_MODE=true
VITE_API_BASE_URL=http://localhost:8000

# Supabase
SUPABASE_URL=<your_supabase_url>
SUPABASE_ANON_KEY=<your_anon_key>

# Django
DEBUG=False
SECRET_KEY=<your_django_secret>
DATABASE_URL=<your_postgres_connection>

# Payments
MPESA_KEY=<mpesa_test_key>
PAYPAL_CLIENT_ID=<paypal_client_id>
STRIPE_PK=<stripe_publishable_key>
STRIPE_SK=<stripe_secret_key>

# Market Data
MARKET_DATA_API_KEY=<polygon_or_iex_key>

Development Setup

Frontend (React/Vite)

cd frontend
npm install
npm run dev


Backend (Django)

cd backend
pip install -r requirements.txt
python manage.py runserver


Access the app at http://localhost:5173 (frontend) and http://localhost:8000 (backend).

Testing Modes
Sandbox Testing

Use .env file with test credentials

Disable real transactions (VITE_TESTING_MODE=true)

Use mock data for stock prices

Test:

Wallet balance updates

Buy/sell order flow

Payment gateway responses

Live Testing

Switch to production .env values

Enable real-time APIs (Polygon.io or IEX Cloud)

Deploy production database and payment credentials

Monitor logs through Sentry

Ensure DEBUG=False and CORS set to production domain

Pre-Deployment Security Checklist

 Remove all hardcoded API keys

 Disable DEBUG mode

 Enable HTTPS

 Validate .env values

 Verify rate limiting

 Confirm circuit breakers for external APIs

Contributing

Fork the repository

Create a new feature branch

Commit changes with clear messages

Submit a pull request for review

License

© 2025 HisaHub Technologies. All rights reserved.
Licensed for internal development and testing use only.
