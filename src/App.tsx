
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
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

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

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
                  <Route path="/" element={<Index />} />
                  <Route path="/trade" element={<Trade />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/broker-integration" element={<BrokerIntegration />} />
                  <Route path="/chatbot" element={<Chatbot />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </FinancialDataProvider>
            )}
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
