
import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import HisaDrawerChat from "./HisaDrawerChat";
import { useModuleContext } from "@/contexts/ModuleContext";

const HisaFAB: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { module, moduleName } = useModuleContext();

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-900 to-gold shadow-xl rounded-full w-16 h-16 flex items-center justify-center animate-fade-in hover:scale-110 transition"
        style={{ boxShadow: "0 2px 12px 0 rgba(0,0,0,0.12)" }}
        onClick={() => setOpen(true)}
        title="Ask Hisa AI"
        aria-label="Open Hisa AI chat"
      >
        <MessageSquare color="#FFD700" size={36} />
        <span className="sr-only">Open Hisa AI Assistant</span>
      </button>

      {/* Drawer Chat */}
      {open && (
        <HisaDrawerChat open={open} onClose={() => setOpen(false)} module={module} moduleName={moduleName} />
      )}
    </>
  );
};
export default HisaFAB;
