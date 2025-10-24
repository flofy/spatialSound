import React, { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ 
  title, 
  icon, 
  children, 
  defaultOpen = false,
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white/5 rounded-xl overflow-hidden backdrop-blur-sm">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-3 flex items-center justify-between text-left transition-all ${
          disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-white/10 cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <h3 className="text-white font-medium text-lg">{title}</h3>
        </div>
        {!disabled && (
          <span className="text-white/70">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </span>
        )}
      </button>
      
      {isOpen && !disabled && (
        <div className="px-4 pb-4 pt-2 border-t border-white/10 accordion-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;