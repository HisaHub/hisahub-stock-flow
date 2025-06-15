import React from "react";
import { Bot, UserCog, Shield, Calculator, GraduationCap } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import ChatInterface from "./ChatInterface";

interface HisaSidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  activeModuleData: any;
}
import SidebarNavigation from "./sidebar/SidebarNavigation";

const HisaSidebar: React.FC<HisaSidebarProps> = ({ activeModule, onModuleChange, activeModuleData }) => {
  return (
    <Sidebar collapsible="offcanvas" className="z-40 min-w-[320px] max-w-xs h-full border-r border-secondary/30 bg-background/90 backdrop-blur-sm flex flex-col">
      <SidebarContent className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4 mt-4 px-4">
          <Bot size={28} className="text-blue-700" />
          <span className="font-bold text-lg text-blue-800">Hisa AI</span>
        </div>
        <div className="flex-1 min-h-0 flex flex-col px-2 pb-2 overflow-y-auto">
          <ChatInterface
            isOpen={true}
            onClose={() => {}}
            activeModule={activeModule}
            onModuleChange={onModuleChange}
            moduleData={activeModuleData}
          />
        </div>
        {/* Use new SidebarNavigation for module selection UI */}
        <SidebarNavigation
          activeModule={activeModule}
          onModuleChange={onModuleChange}
        />
      </SidebarContent>
    </Sidebar>
  );
};

export default HisaSidebar;
