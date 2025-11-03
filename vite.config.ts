import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: (chunkInfo) => {
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: (chunkInfo) => {
          return 'assets/[name]-[hash].js';
        },
        assetFileNames: 'assets/[name]-[hash].[ext]',
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
            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }
            if (id.includes('recharts')) {
              return 'charts-vendor';
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
          if (id.includes('/pages/News')) {
            return 'page-news';
          }
          if (id.includes('/pages/Settings')) {
            return 'page-settings';
          }
          // Component chunks
          if (id.includes('/components/trading/')) {
            return 'components-trading';
          }
          if (id.includes('/components/community/')) {
            return 'components-community';
          }
        }
      },
      // Enhanced tree-shaking
      treeshake: {
        moduleSideEffects: 'no-external',
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      }
    },
    cssCodeSplit: true,
    cssMinify: 'lightningcss',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: mode === 'production',
        pure_funcs: [],
        passes: 1,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Target modern browsers for smaller bundles
    target: 'es2020',
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
      registerType: 'autoUpdate',
      includeAssets: ['/lovable-uploads/d119c8de-4cb2-4d81-b0c7-5c63f121873d.png'],
      devOptions: {
        enabled: false
      },
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
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        skipWaiting: false,
        clientsClaim: false,
        navigateFallback: null,
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
