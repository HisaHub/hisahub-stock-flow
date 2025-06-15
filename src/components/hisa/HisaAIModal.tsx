
import React, { useState } from "react";
import { X } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import Dashboard from "@/pages/Dashboard";
import { useModuleContext } from "@/contexts/ModuleContext";
import HisaRibbon from "./HisaRibbon";
// This simulates loading the module dashboard, and can be upgraded to use actual per-module content in the future

interface HisaAIModalProps {
  open: boolean;
  onClose: () => void;
}
const HisaAIModal: React.FC<HisaAIModalProps> = ({ open, onClose }) => {
  // In future: useModuleContext to swap content based on selected module inside Drawer
  return (
    <Drawer open={open} onClose={onClose} shouldScaleBackground={false}>
      <DrawerContent className="fixed inset-0 z-[110] !rounded-t-none !border-none !shadow-none bg-primary/95 px-0 py-0 flex flex-col">
        <div className="flex items-center justify-between px-6 pt-5 pb-1 z-10">
          <div>
            <HisaRibbon />
          </div>
          <button
            className="rounded-full p-2 hover:bg-gold/10 transition-colors"
            onClick={onClose}
            aria-label="Close Hisa AI"
          >
            <X size={28} className="text-gold" />
          </button>
        </div>
        <div className="flex-1 flex flex-col w-full overflow-y-auto px-2 pb-2">
          {/* Show the dashboard inside the modal, can switch to other modules */}
          <Dashboard />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default HisaAIModal;
