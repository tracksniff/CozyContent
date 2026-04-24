import React from 'react';
import { motion } from 'framer-motion';

interface PricingToggleProps {
  isAnnual: boolean;
  onChange: (val: boolean) => void;
  isPopular?: boolean;
}

const PricingToggle: React.FC<PricingToggleProps> = ({ isAnnual, onChange, isPopular }) => (
  <div 
    onClick={() => onChange(!isAnnual)}
    className="flex items-center gap-3 cursor-pointer group select-none mt-2 mb-8 group/toggle"
  >
    <div className={`relative w-12 h-6 rounded-full transition-all duration-300 group-hover/toggle:scale-105 ${
      isAnnual 
        ? (isPopular ? 'bg-white shadow-lg shadow-white/20' : 'bg-primary shadow-lg shadow-primary/20') 
        : (isPopular ? 'bg-white/20' : 'bg-surface-container-highest border border-outline-variant')
    }`}>
      <motion.div
        animate={{ x: isAnnual ? 26 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-1 w-4 h-4 rounded-full shadow-sm ${
          isPopular 
            ? (isAnnual ? 'bg-primary' : 'bg-white') 
            : (isAnnual ? 'bg-white' : 'bg-primary')
        }`}
      />
    </div>
    <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
      isPopular ? 'text-white' : 'text-on-surface-variant'
    }`}>
      Pay annually <span className={isPopular ? 'text-white/80' : 'text-primary'}>(Save 20%)</span>
    </span>
  </div>
);

export default PricingToggle;
