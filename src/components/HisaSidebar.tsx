
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
}

const modules = [
  { key: "crm", name: "CRM", icon: UserCog },
  { key: "risk", name: "Risk", icon: Shield },
  { key: "finance", name: "Finance", icon: Calculator },
  { key: "trading", name: "Trading", icon: GraduationCap },
];

const HisaSidebar: React.FC<HisaSidebarProps> = ({ activeModule, onModuleChange }) => {
  return (
    <Sidebar collapsible="offcanvas" className="z-40 min-w-[320px] max-w-xs h-full border-r border-secondary/30 bg-background/90 backdrop-blur-sm flex flex-col">
      <SidebarContent className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4 mt-4 px-4">
          <Bot size={28} className="text-blue-700" />
          <span className="font-bold text-lg text-blue-800">Hisa AI</span>
        </div>
        {/* Chat interface (scrollable area, input fixed at bottom) */}
        <div className="flex-1 min-h-0 flex flex-col px-2 pb-2 overflow-y-auto">
          <ChatInterface
            isOpen={true}
            onClose={() => {}}
            activeModule={activeModule}
            onModuleChange={onModuleChange}
          />
        </div>
        {/* Module navigation docked at bottom */}
        <SidebarMenu className="bg-background/95 border-t border-secondary/20 py-2">
          {modules.map((mod) => (
            <SidebarMenuItem key={mod.key}>
              <SidebarMenuButton
                isActive={mod.key === activeModule}
                onClick={() => onModuleChange(mod.key)}
                size="lg"
                tooltip={mod.name}
                className="mb-2"
              >
                <mod.icon />
                <span>{mod.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default HisaSidebar;
