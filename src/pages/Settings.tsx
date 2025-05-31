import React, { useState } from "react";
import ChatFAB from "../components/ChatFAB";
import BottomNav from "../components/BottomNav";
import HisaAIButton from "../components/HisaAIButton";

const Settings: React.FC = () => {
  const [dark, setDark] = useState(false);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen flex flex-col bg-primary font-sans transition-colors">
      <HisaAIButton />
      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <h2 className="text-3xl font-bold text-secondary mb-7" style={{ fontFamily: "'Poppins',sans-serif" }}>
          Settings
        </h2>
        <div className="glass-card w-full max-w-md mx-auto bg-white/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-white mb-1">Theme</div>
              <div className="text-white/60 text-xs">Switch between Light &amp; Dark mode</div>
            </div>
            <button
              onClick={() => setDark((v) => !v)}
              className={`transition duration-200 px-4 py-1 rounded font-semibold border border-secondary 
                ${dark ? "bg-secondary text-primary" : "bg-white/10 text-secondary" }
              `}
            >
              {dark ? "Dark" : "Light"}
            </button>
          </div>
          <div className="mt-6">
            <div className="font-semibold text-white mb-1">Notifications</div>
            <div className="text-xs text-white/60">Notification settings coming soon.</div>
          </div>
        </div>
        <ChatFAB />
      </main>
      <BottomNav />
    </div>
  );
};
export default Settings;
