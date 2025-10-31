# Vercel Deployment Setup Guide

## Required Environment Variables

Add these in your Vercel project settings (Settings → Environment Variables):

### ✅ Required Variables

```bash
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_PROJECT_ID=nkekijcefghncihokotz
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZWtpamNlZmdobmNpaG9rb3R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NTY3MzcsImV4cCI6MjA2NjMzMjczN30.ns851PoAO68O8j8TwF-vNkgFEGXS_nQgzx5bzNRp3QQ
VITE_SUPABASE_URL=https://nkekijcefghncihokotz.supabase.co
```

### 🔧 Optional Variables

```bash
# Only add if you have a production Django backend deployed
VITE_API_BASE_URL=https://your-production-api.com

# Only for local development with Ollama
# VITE_LOCAL_AI_URL=http://127.0.0.1:11434/api/generate
```

## Deployment Steps

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Fix production deployment"
   git push origin main
   ```

2. **Configure Vercel**
   - Go to https://vercel.com/dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add the required variables above
   - Click "Save"

3. **Redeploy**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - OR trigger new deployment with:
     ```bash
     git commit --allow-empty -m "Trigger Vercel redeploy"
     git push
     ```

## Troubleshooting

### Blank Screen Issues
- ✅ Check browser console for errors (F12)
- ✅ Verify all environment variables are set in Vercel
- ✅ Ensure Supabase database has stock price data
- ✅ Check Network tab for failed API requests

### Common Errors
- **"Failed to fetch"** → Missing VITE_API_BASE_URL or backend not accessible
- **"No stocks found"** → Database needs seeding (already done via migration)
- **"Unauthorized"** → Check Supabase RLS policies

## Build Configuration

Your `vercel.json` is already correctly configured:
- ✅ SPA routing enabled
- ✅ Correct cache headers
- ✅ Asset optimization

## What's Working Now

✅ **Backend API calls** - Skip gracefully when not configured  
✅ **Stock data** - Seeded in Supabase  
✅ **Localhost references** - Removed from production code  
✅ **Environment fallbacks** - Safe defaults for missing vars  

## Performance

Current setup achieves:
- Fast initial load (lazy loading)
- PWA support (offline capable)
- Optimized chunking (better caching)
- Real-time updates (Supabase subscriptions)
