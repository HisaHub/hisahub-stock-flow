import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            if (id.includes('@supabase')) {
              return 'supabase-vendor';
            }
            if (id.includes('@tanstack')) {
              return 'query-vendor';
            }
            return 'vendor';
          }
          // Page-based chunks
          if (id.includes('/pages/Trade')) {
            return 'page-trade';
          }
          if (id.includes('/pages/Portfolio')) {
            return 'page-portfolio';
          }
          if (id.includes('/pages/Community')) {
            return 'page-community';
          }
        }
      }
    },
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
  },
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['/lovable-uploads/d119c8de-4cb2-4d81-b0c7-5c63f121873d.png'],
      manifest: {
        name: 'HisaHub - AI-Powered NSE Trading Platform',
        short_name: 'HisaHub',
        description: 'Democratizing access to the Nairobi Securities Exchange with AI-powered trading tools and real-time market data',
        theme_color: '#22c55e',
        background_color: '#0f172a',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        categories: ['finance', 'productivity', 'business'],
        icons: [
          {
            src: '/lovable-uploads/d119c8de-4cb2-4d81-b0c7-5c63f121873d.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/lovable-uploads/d119c8de-4cb2-4d81-b0c7-5c63f121873d.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/nkekijcefghncihokotz\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              }
            }
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
