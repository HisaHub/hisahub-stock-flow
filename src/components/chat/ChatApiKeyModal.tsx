
import React from "react";
import { X, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatApiKeyModalProps {
  show: boolean;
  onClose: () => void;
  tempKey: string;
  setTempKey: (v: string) => void;
  onSave: () => void;
  onRemove: () => void;
  apiKeyError: string;
}
const ChatApiKeyModal: React.FC<ChatApiKeyModalProps> = ({
  show, onClose, tempKey, setTempKey, onSave, onRemove, apiKeyError
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-2 animate-fade-in">
      <div className="bg-white rounded-lg p-6 max-w-xs w-full shadow-lg relative">
        <button className="absolute right-3 top-3 text-secondary" onClick={onClose}><X size={18} /></button>
        <div className="flex items-center gap-2 mb-3">
          <KeyRound size={20} className="text-blue-600" />
          <span className="font-bold text-secondary text-lg">Enter OpenAI API Key</span>
        </div>
        <Input
          value={tempKey}
          onChange={e => setTempKey(e.target.value)}
          placeholder="sk-..."
          className="mb-2"
          type="password"
        />
        {apiKeyError && <div className="text-red-600 text-xs mb-1">{apiKeyError}</div>}
        <div className="flex gap-2">
          <Button onClick={onSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Save Key</Button>
          <Button onClick={onRemove} variant="outline" className="flex-1 text-red-600 border-red-200">Remove</Button>
        </div>
        <div className="text-xs text-neutral mt-3">
          Your key is stored locally in your browser and never shared.
        </div>
      </div>
    </div>
  );
};
export default React.memo(ChatApiKeyModal);
