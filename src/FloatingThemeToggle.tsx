import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import { useTheme } from './ThemeContext';

const FloatingThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const ThemeIcon = ({ t }: { t: 'light' | 'dark' | 'system' }) => {
    if (t === 'light') return <Sun className="w-5 h-5" />;
    if (t === 'dark') return <Moon className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />;
  };

  const themes: { id: 'light' | 'dark' | 'system'; label: string }[] = [
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' },
    { id: 'system', label: 'System' }
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 bg-surface border border-outline-variant shadow-2xl rounded-3xl overflow-hidden min-w-[160px] backdrop-blur-xl bg-surface/80"
          >
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-bold transition-all hover:bg-primary/10 ${
                  theme === t.id ? 'text-primary bg-primary/5' : 'text-on-surface-variant'
                }`}
              >
                <ThemeIcon t={t.id} />
                {t.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all border border-white/20"
      >
        <div className="relative">
             <Palette size={24} className={`${isOpen ? 'rotate-45' : ''} transition-transform duration-300`} />
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-primary"></div>
        </div>
      </motion.button>

      {/* Backdrop to close when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 -z-10 bg-transparent" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FloatingThemeToggle;
