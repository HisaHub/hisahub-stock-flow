
import React from "react";
import { Home, PieChart, LineChart, Settings, MessageSquare, Newspaper } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Home", to: "/", icon: <Home size={24} strokeWidth={2.3} /> },
  { name: "Trade", to: "/trade", icon: <LineChart size={24} strokeWidth={2.3} /> },
  { name: "Portfolio", to: "/portfolio", icon: <PieChart size={24} strokeWidth={2.3} /> },
  { name: "News", to: "/news", icon: <Newspaper size={24} strokeWidth={2.3} /> },
  { name: "Settings", to: "/settings", icon: <Settings size={24} strokeWidth={2.3} /> },
];

const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-primary border-t border-secondary/50 shadow-lg
      flex justify-evenly items-center h-16 md:h-18 px-2 md:px-16
      md:max-w-2xl md:left-1/2 md:-translate-x-1/2 rounded-t-xl md:rounded-xl"
      style={{ fontFamily: "'Poppins', sans-serif" }}
      role="navigation"
      aria-label="Bottom navigation"
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.name}
            to={item.to}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 pt-2 pb-1 rounded-lg transition
              ${isActive ? "bg-secondary/90 text-primary font-bold shadow" : "text-secondary hover:bg-secondary/10"}
              focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2`}
            tabIndex={0}
            aria-current={isActive ? "page" : undefined}
            style={{ minWidth: 50 }}
          >
            <span className="w-6 h-6 flex items-center justify-center">{item.icon}</span>
            <span className="text-[11px] leading-3 mt-0.5">{item.name.split('-')[0]}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
