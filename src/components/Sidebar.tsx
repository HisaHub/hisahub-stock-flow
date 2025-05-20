
import React from "react";
import Logo from "./Logo";
import { Home, PieChart, LineChart, User, Settings, BookOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Home", to: "/", icon: <Home size={22} /> },
  { name: "Trade", to: "/trade", icon: <LineChart size={22} /> },
  { name: "Portfolio", to: "/portfolio", icon: <PieChart size={22} /> },
  { name: "Mock-Stocks", to: "/mock-stocks", icon: <BookOpen size={22} /> },
  { name: "Profile", to: "/profile", icon: <User size={22} /> },
  { name: "Settings", to: "/settings", icon: <Settings size={22} /> },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  return (
    <aside className="bg-primary pt-8 px-4 pb-8 flex flex-col h-screen w-56 min-w-[172px] shadow-lg">
      <div className="flex flex-col items-center mb-9 gap-1">
        <Logo size={48} />
        <div className="text-secondary font-extrabold text-lg tracking-wide mt-1" style={{ fontFamily: "'Poppins',sans-serif" }}>
          HisaHub
        </div>
      </div>
      <nav className="flex-1">
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium hover:bg-secondary/20 transition
                  ${location.pathname === item.to ? "bg-secondary/40 text-secondary" : "text-white"}
                `}
                style={{
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <button
          className="w-full flex items-center gap-2 justify-center rounded-lg bg-secondary text-charcoal font-semibold py-2 mt-8 hover:shadow-xl transition duration-200"
          title="Quick Deposit (Coming Soon)"
        >
          <svg width="18" height="18" fill="none"><circle cx="9" cy="9" r="9" fill="#fff"/><path stroke="#FFBF00" strokeWidth="2" d="M9 5v8M5 9h8"/></svg>
          Quick Deposit
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
