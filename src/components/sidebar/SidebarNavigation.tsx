
import React from "react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { UserCog, Shield, Calculator, GraduationCap } from "lucide-react";

interface SidebarNavigationProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const modules = [
  { key: "crm", name: "CRM", icon: UserCog },
  { key: "risk", name: "Risk", icon: Shield },
  { key: "finance", name: "Finance", icon: Calculator },
  { key: "trading", name: "Trading", icon: GraduationCap },
];

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ activeModule, onModuleChange }) => (
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
);

export default SidebarNavigation;
