
import React from "react";
import { useModuleContext, MODULE_NAMES, ModuleKey } from "@/contexts/ModuleContext";
import { Bot } from "lucide-react";

const modules: { key: ModuleKey, label: string }[] = Object.entries(MODULE_NAMES).map(
  ([key, label]) => ({ key: key as ModuleKey, label })
);

const HisaRibbon: React.FC = () => {
  const { module, setModule, moduleName } = useModuleContext();

  return (
    <div className="fixed top-0 left-0 w-full z-30 flex items-center justify-between bg-blue-900/90 text-gold px-3 py-2 shadow backdrop-blur-md gap-2 animate-fade-in">
      <div className="flex items-center gap-2 font-medium text-sm">
        <Bot size={18} className="text-gold" />
        <span className="hidden sm:inline">Hisa AI is now helping you inside:</span>
        <span className="font-bold text-gold">{moduleName}</span>
      </div>
      <div className="flex items-center gap-1">
        <select
          className="rounded bg-blue-700 text-gold px-2 py-1 border border-gold text-xs"
          value={module}
          onChange={e => setModule(e.target.value as ModuleKey)}
        >
          {modules.map(m => (
            <option key={m.key} value={m.key}>{m.label}</option>
          ))}
        </select>
        {/* Later: language/AI mode controls */}
      </div>
    </div>
  );
};

export default HisaRibbon;
