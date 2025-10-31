
import React from 'react';
import { Home, TrendingUp, PieChart, Users, Settings } from 'lucide-react';

// This is a basic sidebar component for navigation
const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <nav>
        <a href="/" data-tour="dashboard"><Home size={20} /></a>
        <a href="/trade" data-tour="trading"><TrendingUp size={20} /></a>
        <a href="/portfolio" data-tour="portfolio"><PieChart size={20} /></a>
        <a href="/community" data-tour="community"><Users size={20} /></a>
        <a href="/settings" data-tour="settings"><Settings size={20} /></a>
      </nav>
    </div>
  );
};

export default Sidebar;
