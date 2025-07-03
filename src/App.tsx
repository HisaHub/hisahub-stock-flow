
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from "@/components/ui/toaster"
import Portfolio from './pages/Portfolio';
import Trade from './pages/Trade';
import Chatbot from './pages/Chatbot';
import BrokerIntegration from './pages/BrokerIntegration';
import Auth from './pages/Auth';
import { FinancialDataProvider } from './contexts/FinancialDataContext';
import { GlobalUserProvider } from './contexts/GlobalUserContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="hisahub-theme">
        <FinancialDataProvider>
          <GlobalUserProvider>
            <Toaster />
            <Router>
              <Routes>
                <Route path="/" element={<Auth onLogin={() => {}} />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/trade" element={<Trade />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/broker-integration" element={<BrokerIntegration />} />
              </Routes>
            </Router>
            <ReactQueryDevtools initialIsOpen={false} />
          </GlobalUserProvider>
        </FinancialDataProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
