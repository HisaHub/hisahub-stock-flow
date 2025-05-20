
import React from "react";
import Sidebar from "../components/Sidebar";
import ChatFAB from "../components/ChatFAB";

const Profile: React.FC = () => (
  <div className="min-h-screen flex bg-background">
    <Sidebar />
    <main className="flex-1 flex flex-col items-center px-4 py-10">
      <h2 className="text-3xl font-bold text-primary mb-7" style={{ fontFamily: "'Poppins',sans-serif" }}>
        My Profile
      </h2>
      <div className="w-full max-w-2xl">
        <div className="glass-card">
          <div>Name: <span className="font-semibold">Jane Njeri</span></div>
          <div className="text-neutral mt-2 mb-4">Account information and settings coming soon.</div>
        </div>
      </div>
      <ChatFAB />
    </main>
  </div>
);
export default Profile;
