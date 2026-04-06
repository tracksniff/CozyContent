import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import logoHorizontal from './assets/Logo JPG/Cosy_Content_Ltd_-_Horizontal_2-removebg-preview.png';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Determine which logo to show based on theme
  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  const ThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4" />;
    if (theme === 'dark') return <Moon className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const navItems = [
    { label: 'Services', href: '/#services' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Our Brands', href: '/our-brands' },
    { label: 'Contact', href: '/contact' }
  ];

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 md:px-6 py-3 rounded-2xl bg-surface/60 dark:bg-surface-container-high/40 backdrop-blur-xl border border-outline-variant/30 dark:border-primary/20 shadow-lg shadow-black/5 transition-all">
        <Link to="/" className="flex items-center" onClick={handleNavClick}>
          <div className="h-12 md:h-16 flex items-center justify-center">
            <img 
              src={logoHorizontal} 
              alt="Cosy Content Logo" 
              className={`h-full w-auto object-contain ${isDark ? 'dark:invert' : ''}`} 
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            item.href.startsWith('/#') ? (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.href}
                className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors relative group"
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all group-hover:w-full ${location.pathname === item.href ? 'w-full' : 'w-0'}`}></span>
              </Link>
            )
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-2 md:p-2.5 rounded-xl border border-outline-variant/20 bg-surface/50 dark:bg-white/5 hover:bg-surface-container-high transition-colors shadow-sm"
            >
              <ThemeIcon />
            </button>

            <AnimatePresence>
              {showThemeMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowThemeMenu(false)}
                  ></div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-2 w-36 rounded-2xl bg-surface border border-outline-variant/20 shadow-xl z-20 overflow-hidden backdrop-blur-md"
                  >
                    {[
                      { id: 'light', icon: Sun, label: 'Light' },
                      { id: 'dark', icon: Moon, label: 'Dark' },
                      { id: 'system', icon: Monitor, label: 'System' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id as any);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-surface-container-high ${theme === t.id ? 'text-primary bg-primary/5' : 'text-on-surface-variant'}`}
                      >
                        <t.icon className="w-4 h-4" />
                        {t.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="bg-on-surface text-surface px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg transition-all shadow-md active:scale-95">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-on-surface-variant px-4 py-2 text-sm font-bold hover:text-primary transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="bg-on-surface text-surface px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg transition-all shadow-md active:scale-95">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-outline-variant/20 bg-surface/50 hover:bg-surface-container-high transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-24 left-4 right-4 bg-surface rounded-[2rem] border border-outline-variant/20 shadow-2xl p-8 z-40 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={handleNavClick}
                  className="text-lg font-bold text-on-surface-variant hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-6 border-t border-outline-variant/10 flex flex-col gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" onClick={handleNavClick} className="w-full bg-primary text-white py-4 rounded-2xl text-center font-black">
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={handleNavClick} className="w-full py-4 rounded-2xl text-center font-bold text-on-surface-variant border border-outline-variant/20">
                      Login
                    </Link>
                    <Link to="/signup" onClick={handleNavClick} className="w-full bg-on-surface text-surface py-4 rounded-2xl text-center font-black">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
