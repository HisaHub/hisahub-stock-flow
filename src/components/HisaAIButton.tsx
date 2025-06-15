
import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatInterface from './ChatInterface';

const HisaAIButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('crm');

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg rounded-full w-12 h-12 p-0 flex items-center justify-center"
        title="Open Hisa AI"
      >
        <Bot size={20} />
      </Button>
      
      <ChatInterface
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
      />
    </>
  );
};

export default HisaAIButton;

