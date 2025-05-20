
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatFAB from "../components/ChatFAB";

const Settings: React.FC = () => {
  const [dark, setDark] = useState(false);

  // Simple class swap for demo
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <h2 className="text-3xl font-bold text-primary mb-7" style={{ fontFamily: "'Poppins',sans-serif" }}>
          Settings
        </h2>
        <div className="glass-card w-full max-w-md mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-charcoal mb-1">Theme</div>
              <div className="text-neutral text-xs">Switch between Light &amp; Dark mode</div>
            </div>
            <button
              onClick={() => setDark((v) => !v)}
              className={`transition duration-200 px-4 py-1 rounded font-semibold border border-primary 
                ${dark ? "bg-primary text-secondary" : "bg-secondary text-charcoal"}
              `}
            >
              {dark ? "Dark" : "Light"}
            </button>
          </div>
          <div className="mt-6">
            <div className="font-semibold text-charcoal mb-1">Notifications</div>
            <div className="text-xs text-neutral">Notification settings coming soon.</div>
          </div>
        </div>
        <ChatFAB />
      </main>
    </div>
  );
};
export default Settings;
