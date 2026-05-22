import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Globe,
  Settings,
  LogOut,
  User,
  Shield,
  Users as UsersIcon,
  Menu,
  X,
  Edit3,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import logo from "./assets/PNG/Cosy Content Ltd -05.png";
import axios from "axios";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to?: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
  external?: boolean;
  href?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  to,
  active,
  collapsed,
  onClick,
  external,
  href,
}) => {
  const inner = (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group relative
        ${
          active
            ? "bg-primary text-white shadow-md shadow-primary/25"
            : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
        }
        ${collapsed ? "justify-center px-2" : ""}
      `}
    >
      <div
        className={`shrink-0 ${active ? "text-white" : "group-hover:text-primary transition-colors"}`}
      >
        {icon}
      </div>
      {!collapsed && (
        <span className="font-bold text-sm tracking-tight whitespace-nowrap">{label}</span>
      )}
      {/* Tooltip on collapse */}
      {collapsed && (
        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-on-surface text-surface text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 shadow-xl">
          {label}
        </div>
      )}
    </div>
  );

  if (href && external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  if (to) return <Link to={to}>{inner}</Link>;
  return inner;
};

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasMonthlySite, setHasMonthlySite] = useState(false);

  useEffect(() => {
    const checkMonthlySites = async () => {
      if (user?.is_staff) {
          setHasMonthlySite(true);
          return;
      }
      if (!user) return;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/websites/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const monthly = res.data.some((s: any) => ['monthly', 'annual', 'priority_monthly'].includes(s.plan_type));
        setHasMonthlySite(monthly);
      } catch (err) {
        console.error(err);
      }
    };
    checkMonthlySites();
  }, [user]);

  const isMonthlyUser = user?.is_staff || hasMonthlySite;

  const totalUpdates = hasMonthlySite 
    ? (user?.monthly_requests_remaining || 0) + (user?.purchased_requests_remaining || 0)
    : 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", to: "/dashboard" },
    { icon: <Globe size={18} />, label: "Websites", to: "/websites" },
    { icon: <User size={18} />, label: "Profile", to: "/profile" },
    ...(user?.is_staff ? [{ icon: <UsersIcon size={18} />, label: "Users", to: "/users" }] : []),
    { icon: <Settings size={18} />, label: "Settings", to: "/settings" },
    ...(isMonthlyUser
      ? [{ icon: <Edit3 size={18} />, label: "Request Changes", to: "/request-changes" }]
      : []),
  ];

  const close = () => setIsMobileOpen(false);

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/20 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
          <span className="font-black text-sm tracking-tighter text-on-surface">Cosy Content</span>
        </div>
        <div className="flex items-center gap-2">
          {user && !user.is_staff && (
            <Link
              to="/add-ons"
              className="flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 hover:bg-primary/20 transition-all"
            >
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">
                {totalUpdates} Updates
              </span>
              {user.priority_updates_active && (
                <Zap size={8} className="text-yellow-500 fill-yellow-500" />
              )}
            </Link>
          )}
          <button
            onClick={() => setIsMobileOpen((o) => !o)}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-on-surface-variant hover:text-primary transition-colors"
          >
            {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Backdrop ── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={close}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed left-0 top-0 h-screen h-[100dvh] bg-surface border-r border-outline-variant/20 z-50 flex flex-col transition-all duration-300
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-[72px]" : "lg:w-64"}
          w-64
        `}
      >
        {/* Logo */}
        <div
          className={`flex items-center h-16 border-b border-outline-variant/15 shrink-0 transition-all duration-300 ${isCollapsed ? "justify-center px-4" : "px-4 gap-2.5 sm:px-5 sm:gap-3"}`}
        >
          <img src={logo} alt="Cosy Content Logo" className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0" />
          {!isCollapsed && (
            <span className="font-black text-sm sm:text-base tracking-tighter text-on-surface truncate">
              Cosy Content
            </span>
          )}
          <button
            onClick={close}
            className="lg:hidden ml-auto p-1.5 text-on-surface-variant hover:text-primary active:scale-95 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-grow px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <SidebarItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={location.pathname === item.to}
              collapsed={isCollapsed}
              onClick={close}
            />
          ))}

          {user?.is_staff && (
            <>
              <div className={`pt-4 pb-1 ${isCollapsed ? "hidden" : ""}`}>
                <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40 px-3">
                  Admin
                </p>
              </div>
              <SidebarItem
                icon={<Shield size={18} />}
                label="Django Admin"
                href={`${import.meta.env.VITE_API_URL}/admin/`}
                external
                collapsed={isCollapsed}
                onClick={close}
              />
            </>
          )}

          {/* Updates widget (non-staff only) - moved inside nav for better mobile scrolling */}
          {user && !user.is_staff && (
            <div className={`pt-4 pb-2 ${isCollapsed ? "px-2" : ""}`}>
              {!isCollapsed ? (
                <div className="p-4 bg-surface-container-high rounded-2xl border border-outline-variant/30">
                  <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-2">
                    Available Updates
                  </p>
                  <div className="flex items-end justify-between">
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-black text-on-surface">{totalUpdates}</span>
                      {user.priority_updates_active && (
                        <span className="mb-1 px-2 py-0.5 bg-yellow-400 text-black text-[8px] font-black rounded-full uppercase flex items-center gap-1">
                          <Zap size={8} fill="black" /> Priority
                        </span>
                      )}
                    </div>
                    <Link
                      to="/add-ons"
                      onClick={close}
                      className="text-[10px] font-black text-primary uppercase tracking-widest hover:brightness-125 transition-all"
                    >
                      Get More +
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Link
                    to="/add-ons"
                    className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-sm border border-primary/20 hover:bg-primary hover:text-white transition-all"
                  >
                    {totalUpdates}
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Mobile Logout (redundant but helpful if footer is cut off) */}
          <div className="lg:hidden pt-4 border-t border-outline-variant/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all group"
            >
              <LogOut size={18} className="group-hover:rotate-12 transition-transform duration-300 shrink-0" />
              <span className="font-bold text-sm">Logout</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-3 pb-8 pt-3 border-t border-outline-variant/15 space-y-1 shrink-0">
          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setIsCollapsed((c) => !c)}
            className={`hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all group ${isCollapsed ? "justify-center" : ""}`}
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={18} />
                <span className="font-bold text-sm">Collapse</span>
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className={`hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:bg-red-500/10 hover:text-red-500 transition-all group ${isCollapsed ? "justify-center" : ""}`}
          >
            <LogOut
              size={18}
              className="group-hover:rotate-12 transition-transform duration-300 shrink-0"
            />
            {!isCollapsed && <span className="font-bold text-sm">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
