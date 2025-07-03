import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from "@/components/ui/toaster"
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Portfolio from './pages/Portfolio';
import Trade from './pages/Trade';
import Chatbot from './pages/Chatbot';
import BrokerIntegration from './pages/BrokerIntegration';
import { FinancialDataProvider } from './contexts/FinancialDataContext';
import { GlobalUserProvider } from './contexts/GlobalUserContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="hisahub-theme">
        <FinancialDataProvider>
          <GlobalUserProvider>
            <Toaster />
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/trade" element={<Trade />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/broker-integration" element={<BrokerIntegration />} />
              </Routes>
            </Router>
          </GlobalUserProvider>
        </FinancialDataProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
