
import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HisaAIModal from './hisa/HisaAIModal';

const HisaAIButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 bg-gradient-to-r from-blue-600 to-gold hover:from-blue-700 hover:to-gold/80 text-white shadow-lg rounded-full w-12 h-12 p-0 flex items-center justify-center"
        title="Open Hisa AI"
      >
        <Bot size={20} />
      </Button>
      <HisaAIModal open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default HisaAIButton;
