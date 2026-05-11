import React from 'react';
import { motion } from 'framer-motion';

interface PricingToggleProps {
  isAnnual: boolean;
  onChange: (val: boolean) => void;
}

const PricingToggle: React.FC<PricingToggleProps> = ({ isAnnual, onChange }) => (
  <div className="flex flex-col items-center gap-4 mb-16">
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
        {isAnnual && (
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-secondary text-white text-[10px] py-1 px-3 rounded-full whitespace-nowrap font-bold"
          >
            Save 20%
          </motion.span>
        )}
      </button>
    </div>
    <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">
      {isAnnual ? 'Billed annually' : 'Billed monthly'}
    </p>
  </div>
);

export default PricingToggle;
