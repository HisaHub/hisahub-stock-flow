
import React, { useState } from "react";
import { Menu, Bot, UserCog, Shield, Calculator, GraduationCap } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";

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
    <SidebarProvider>
      <Sidebar collapsible="offcanvas">
        <SidebarContent>
          <div className="flex items-center gap-2 mb-6 mt-2 px-4">
            <Bot size={28} className="text-blue-700" />
            <span className="font-bold text-lg text-blue-800">Hisa AI</span>
            <SidebarTrigger className="ml-auto" />
          </div>
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
    </SidebarProvider>
  );
};

export default HisaSidebar;
