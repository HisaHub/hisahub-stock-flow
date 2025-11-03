
import React from 'react';
import { Home, TrendingUp, PieChart, Users, Settings } from 'lucide-react';

// This is a basic sidebar component for navigation
const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <nav>
        <a href="/"><Home size={20} /></a>
        <a href="/trade"><TrendingUp size={20} /></a>
        <a href="/portfolio"><PieChart size={20} /></a>
        <a href="/community"><Users size={20} /></a>
        <a href="/settings"><Settings size={20} /></a>
      </nav>
    </div>
  );
};

export default Sidebar;
