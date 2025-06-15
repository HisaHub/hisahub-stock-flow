
import React, { useEffect, useRef } from "react";
import { X, Bot } from "lucide-react";
import ChatInterface from "../ChatInterface"; // Reusing the improved chat interface
import { Drawer, DrawerContent } from "@/components/ui/drawer";

interface HisaDrawerChatProps {
  open: boolean;
  onClose: () => void;
  module: string;
  moduleName: string;
}

const HisaDrawerChat: React.FC<HisaDrawerChatProps> = ({
  open,
  onClose,
  module,
  moduleName,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on ESC key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent className="max-w-full md:max-w-lg bg-white/95 rounded-t-3xl shadow-2xl border-t border-gold">
        <div
          className="px-4 pt-3 pb-2 flex items-center justify-between"
          ref={drawerRef}
        >
          <div className="flex items-center gap-2">
            <Bot size={22} className="text-gold" />
            <span className="font-bold text-blue-900">
              Hisa AI — {moduleName}
            </span>
            <span className="ml-2 px-2 py-0.5 bg-gold/20 text-gold rounded text-xs font-semibold">
              Active
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-blue-900 hover:text-gold transition rounded-full p-1"
            aria-label="Close Hisa Chat"
          >
            <X size={24} />
          </button>
        </div>
        <div className="py-0 px-3 flex flex-col h-[54vh] md:h-[64vh] max-h-[64vh]">
          <ChatInterface
            isOpen={open}
            onClose={onClose}
            activeModule={module}
            onModuleChange={() => {}}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default HisaDrawerChat;
