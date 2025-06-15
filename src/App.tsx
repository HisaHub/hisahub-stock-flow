import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FinancialDataProvider } from "./contexts/FinancialDataContext";
import { ThemeProvider } from "./components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Trade from "./pages/Trade";
import Portfolio from "./pages/Portfolio";
import Settings from "./pages/Settings";
import Chatbot from "./pages/Chatbot";
import News from "./pages/News";
import Community from "./pages/Community";
import Auth from "./pages/Auth";
import BrokerIntegration from "./pages/BrokerIntegration";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Auth onLogin={handleLogin} />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <FinancialDataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/trade" element={<Trade />} />
                <Route path="/portfolio" element={<Portfolio />} />
                {/* Remove Community Page Route */}
                {/* <Route path="/community" element={<Community />} /> */}
                <Route path="/news" element={<News />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/broker-integration" element={<BrokerIntegration />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </FinancialDataProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
