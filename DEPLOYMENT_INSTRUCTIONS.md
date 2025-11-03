# Deployment Instructions for Vercel

## Critical Steps After Deployment

### 1. Clear Browser Cache
After deploying, users MUST clear their browser cache and unregister service workers:

**Chrome/Edge:**
1. Press F12 to open DevTools
2. Go to Application tab → Service Workers
3. Click "Unregister" for all service workers
4. Go to Application tab → Clear storage
5. Check all boxes and click "Clear site data"
6. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

**Firefox:**
1. Press F12 → Application → Service Workers
2. Unregister all workers
3. Clear cache: Ctrl+Shift+Delete → Check "Cached Web Content"
4. Hard refresh

### 2. Verify Build Configuration

Ensure vercel.json has these settings:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3. Check Deployment Logs

In Vercel dashboard:
1. Go to Deployments → Latest deployment
2. Check build logs for errors
3. Verify all assets are in `/dist` directory
4. Confirm index.html is present

### 4. Test the Deployed App

1. Open the deployed URL in a new incognito window
2. Check browser console (F12) for errors
3. Verify network requests are successful (Network tab)
4. Confirm JavaScript bundles load (look for 200 status codes)

### 5. If Still Showing Blank Screen

Run these commands to completely rebuild:
```bash
# Clear local build cache
rm -rf dist/
rm -rf node_modules/.vite/

# Rebuild
npm run build

# Test locally first
npm run preview
```

Then redeploy to Vercel.

## Root Causes Fixed

1. ✅ Added explicit `base: '/'` to vite.config.ts
2. ✅ Disabled aggressive terser minification that was dropping critical code
3. ✅ Simplified service worker registration
4. ✅ Added proper Vercel build configuration
5. ✅ Fixed PWA config to not interfere with routing
6. ✅ Moved main script BEFORE service worker registration

## Troubleshooting

### Blank Screen After Deployment
- Old service worker is caching broken build → Clear as per Step 1
- Check Network tab: Is index-[hash].js returning 404?
- Check Console tab: Any runtime errors?

### Assets Not Loading
- Verify `dist/assets/` contains all JS/CSS files
- Check Vercel deployment logs for build errors
- Confirm rewrites in vercel.json are correct

### App Works Locally But Not on Domain
- This was the exact issue we fixed
- Aggressive minification was dropping critical code
- Service worker was caching broken builds
- Now fixed with simplified config
