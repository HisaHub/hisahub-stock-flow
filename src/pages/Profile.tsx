
import React from "react";
import ChatFAB from "../components/ChatFAB";
import BottomNav from "../components/BottomNav";

const Profile: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-primary font-sans transition-colors">
    <main className="flex-1 flex flex-col items-center px-4 py-10">
      <h2 className="text-3xl font-bold text-secondary mb-7" style={{ fontFamily: "'Poppins',sans-serif" }}>
        My Profile
      </h2>
      <div className="w-full max-w-2xl">
        <div className="glass-card bg-white/10">
          <div>Name: <span className="font-semibold text-white">Jane Njeri</span></div>
          <div className="text-white/60 mt-2 mb-4">Account information and settings coming soon.</div>
        </div>
      </div>
      <ChatFAB />
    </main>
    <BottomNav />
  </div>
);
export default Profile;
