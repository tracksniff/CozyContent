import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Monitor, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import { useAuth } from "./AuthContext";
import logoLight from "./assets/Logo JPG/Cosy_Content_Ltd_-_Horizontal_2-removebg-preview.png";
import logoDark from "./assets/Logo JPG/Cosy_Content_Ltd_-_Horizontal-removebg-preview.png";

const ThemeIcon = ({ theme }: { theme: string }) => {
  if (theme === "light") return <Sun className="w-4 h-4" />;
  if (theme === "dark") return <Moon className="w-4 h-4" />;
  return <Monitor className="w-4 h-4" />;
};

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showServicesMenu, setShowServicesMenu] = useState(false);
  const [showMobileServices, setShowMobileServices] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  );
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Determine which logo to show based on theme
  const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark");
  const currentLogo = isDark ? logoDark : logoLight;

  const serviceItems = [
    { label: "Websites for Plumbers", href: "/plumber-web-design" },
    { label: "Websites for Electricians", href: "/electrician-web-design" },
    { label: "Websites for Roofers", href: "/roofer-web-design" },
    { label: "Websites for Locksmiths", href: "/locksmith-web-design" },
    { label: "Websites for Cleaners", href: "/cleaning-company-web-design" },
    { label: "Websites for Removal Companies", href: "/removals-web-design" },
  ];

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
    setShowServicesMenu(false);
    setShowMobileServices(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 md:px-8 py-2.5 rounded-2xl bg-surface/60 dark:bg-surface-container-high/40 backdrop-blur-xl border border-outline-variant/30 dark:border-primary/20 shadow-lg shadow-black/5 transition-all">
        <Link to="/" className="flex items-center" onClick={handleNavClick}>
          <div className="h-10 md:h-12 flex items-center justify-center">
            <img
              src={currentLogo}
              alt="Cosy Content Logo"
              className="h-full w-auto object-contain"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/" ? "text-primary" : "text-on-surface-variant"}`}
          >
            Home
          </Link>

          {/* Services Dropdown */}
          <div
            className="relative py-2"
            onMouseEnter={() => setShowServicesMenu(true)}
            onMouseLeave={() => setShowServicesMenu(false)}
          >
            <button
              onClick={() => setShowServicesMenu(!showServicesMenu)}
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${location.pathname.startsWith("/services/") && !location.pathname.includes("/services/plumbing/") ? "text-primary" : "text-on-surface-variant"}`}
            >
              Services
            </button>

            <AnimatePresence>
              {showServicesMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute left-0 mt-2 w-64 rounded-2xl bg-surface border border-outline-variant/20 shadow-xl z-20 overflow-hidden backdrop-blur-md"
                >
                  {serviceItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={handleNavClick}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors hover:bg-surface-container-high ${location.pathname === item.href ? "text-primary bg-primary/5" : "text-on-surface-variant"}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/pricing"
            className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/pricing" ? "text-primary" : "text-on-surface-variant"}`}
          >
            Pricing
          </Link>

          <Link
            to="/our-brands"
            className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/our-brands" ? "text-primary" : "text-on-surface-variant"}`}
          >
            About
          </Link>

          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/contact" ? "text-primary" : "text-on-surface-variant"}`}
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-2 md:p-2.5 rounded-xl border border-outline-variant/20 bg-surface/50 dark:bg-white/5 hover:bg-surface-container-high transition-colors shadow-sm"
            >
              <ThemeIcon theme={theme} />
            </button>

            <AnimatePresence>
              {showThemeMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowThemeMenu(false)}></div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-2 w-36 rounded-2xl bg-surface border border-outline-variant/20 shadow-xl z-20 overflow-hidden backdrop-blur-md"
                  >
                    {[
                      { id: "light", icon: Sun, label: "Light" },
                      { id: "dark", icon: Moon, label: "Dark" },
                      { id: "system", icon: Monitor, label: "System" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id as any);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-surface-container-high ${theme === t.id ? "text-primary bg-primary/5" : "text-on-surface-variant"}`}
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
              <Link
                to="/dashboard"
                className="bg-on-surface text-surface px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg transition-all shadow-md active:scale-95"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-on-surface-variant hover:text-primary px-4 py-2.5 text-sm font-bold transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-on-surface text-surface px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg transition-all shadow-md active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-outline-variant/20 bg-surface/50 hover:bg-surface-container-high transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
            className="md:hidden absolute top-20 left-2 right-2 bg-surface rounded-[1.5rem] border border-outline-variant/20 shadow-2xl p-6 z-40 backdrop-blur-xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-2 md:gap-4">
              <Link
                to="/"
                onClick={handleNavClick}
                className="text-base font-bold text-on-surface-variant py-2"
              >
                Home
              </Link>

              {/* Mobile Services */}
              <div className="flex flex-col border-t border-outline-variant/5 pt-1">
                <button
                  onClick={() => setShowMobileServices(!showMobileServices)}
                  className="flex items-center justify-between text-base font-bold text-on-surface-variant py-2"
                >
                  Services
                </button>
                <AnimatePresence>
                  {showMobileServices && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-surface-container-low rounded-xl"
                    >
                      <div className="flex flex-col p-1.5">
                        {serviceItems.map((item) => (
                          <Link
                            key={item.label}
                            to={item.href}
                            onClick={handleNavClick}
                            className="text-sm font-bold text-on-surface-variant p-2.5 hover:bg-surface-container rounded-lg"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/pricing"
                onClick={handleNavClick}
                className="text-base font-bold text-on-surface-variant py-2 border-t border-outline-variant/5 pt-1"
              >
                Pricing
              </Link>

              <Link
                to="/our-brands"
                onClick={handleNavClick}
                className="text-base font-bold text-on-surface-variant py-2 border-t border-outline-variant/5 pt-1"
              >
                About
              </Link>

              <Link
                to="/contact"
                onClick={handleNavClick}
                className="text-base font-bold text-on-surface-variant py-2 border-t border-outline-variant/5 pt-1"
              >
                Contact
              </Link>

              <div className="pt-4 border-t border-outline-variant/10 flex flex-col gap-3">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    onClick={handleNavClick}
                    className="w-full bg-primary text-white py-3.5 rounded-xl text-center font-black text-sm"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      onClick={handleNavClick}
                      className="w-full border border-outline-variant text-on-surface py-3.5 rounded-xl text-center font-black text-sm"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      onClick={handleNavClick}
                      className="w-full bg-on-surface text-surface py-3.5 rounded-xl text-center font-black text-sm"
                    >
                      Get Started
                    </Link>
                  </div>
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
