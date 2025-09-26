
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Trade from "./pages/Trade";
import Portfolio from "./pages/Portfolio";
import News from "./pages/News";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import BrokerIntegration from "./pages/BrokerIntegration";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/ThemeProvider";
import { FinancialDataProvider } from "./contexts/FinancialDataContext";
import SplashScreen from "./components/SplashScreen";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import InvisaAIGlobal from "./components/InvisaAIGlobal";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleLogin = () => {
    // Auth state changes will be handled by the listener
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="text-off-white">Loading...</div>
    </div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            {showSplash ? (
              <SplashScreen onComplete={handleSplashComplete} />
            ) : (
              <FinancialDataProvider>
                <Routes>
                  {/* Public routes - accessible to everyone */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
                  
                  {/* Protected routes - only accessible to authenticated users */}
                  {user ? (
                    <>
                      <Route path="/trade" element={<Trade />} />
                      <Route path="/portfolio" element={<Portfolio />} />
                      <Route path="/news" element={<News />} />
                      <Route path="/community" element={<Community />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/broker-integration" element={<BrokerIntegration />} />
                      <Route path="/chatbot" element={<Chatbot />} />
                      <Route path="*" element={<NotFound />} />
                    </>
                  ) : (
                    // Redirect protected routes to auth if not authenticated
                    <>
                      <Route path="/trade" element={<Navigate to="/auth" replace />} />
                      <Route path="/portfolio" element={<Navigate to="/auth" replace />} />
                      <Route path="/news" element={<Navigate to="/auth" replace />} />
                      <Route path="/community" element={<Navigate to="/auth" replace />} />
                      <Route path="/settings" element={<Navigate to="/auth" replace />} />
                      <Route path="/broker-integration" element={<Navigate to="/auth" replace />} />
                      <Route path="/chatbot" element={<Navigate to="/auth" replace />} />
                      <Route path="*" element={<NotFound />} />
                    </>
                  )}
                </Routes>
                {/* Show PWA install prompt only when user is authenticated */}
                {user && <PWAInstallPrompt />}
                {/* Global Invisa AI chatbot available on all pages */}
                <InvisaAIGlobal />
              </FinancialDataProvider>
            )}
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
