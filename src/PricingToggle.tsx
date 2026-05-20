import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PricingToggleProps {
  isAnnual: boolean;
  onChange: (val: boolean) => void;
}

const PricingToggle: React.FC<PricingToggleProps> = ({ isAnnual, onChange }) => (
  <div className="flex flex-col items-center gap-4">
    <div className="flex items-center gap-4 p-1.5 bg-surface-container-high rounded-full border border-outline-variant/30">
      <button
        onClick={() => onChange(false)}
        className={`px-6 py-2 rounded-full text-sm font-black transition-all duration-300 ${
          !isAnnual 
            ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => onChange(true)}
        className={`px-6 py-2 rounded-full text-sm font-black transition-all duration-300 relative ${
          isAnnual 
            ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        Annual
        <AnimatePresence>
          {isAnnual && (
            <motion.span 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-secondary text-white text-[9px] py-0.5 px-2 rounded-full whitespace-nowrap font-black uppercase tracking-tighter"
            >
              Save 20%
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
    <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">
      {isAnnual ? 'Billed annually' : 'Billed monthly'}
    </p>
  </div>
);

export default PricingToggle;
