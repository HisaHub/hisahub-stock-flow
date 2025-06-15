
import React from "react";
import { Bot, UserCog, Shield, Calculator, GraduationCap, Menu } from "lucide-react";
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
    <Sidebar collapsible="offcanvas" className="z-40 min-w-[280px] max-w-xs border-r border-secondary/30 bg-background/90 backdrop-blur-sm">
      <SidebarContent>
        <div className="flex items-center gap-2 mb-4 mt-4 px-4">
          <Bot size={28} className="text-blue-700" />
          <span className="font-bold text-lg text-blue-800">Hisa AI</span>
        </div>
        {/* Chat interface lives in the sidebar */}
        <div className="mb-4 px-2">
          <ChatInterface
            isOpen={true}
            onClose={() => {}}
            activeModule={activeModule}
            onModuleChange={onModuleChange}
          />
        </div>
        {/* Module navigation */}
        <SidebarMenu>
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
