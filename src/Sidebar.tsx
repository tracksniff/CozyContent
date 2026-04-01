import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Globe, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  User,
  Shield,
  Users as UsersIcon
} from 'lucide-react';
import { useAuth } from './AuthContext';

const SidebarItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  to: string; 
  active?: boolean;
  collapsed?: boolean;
}> = ({ icon, label, to, active, collapsed }) => {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
        ${active 
          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
        }
      `}
    >
      <div className={`${active ? 'text-white' : 'group-hover:text-primary'} transition-colors`}>
        {icon}
      </div>
      {!collapsed && (
        <span className="font-bold text-sm tracking-tight whitespace-nowrap overflow-hidden">
          {label}
        </span>
      )}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', to: '/dashboard' },
    { icon: <Globe size={20} />, label: 'Websites', to: '/websites' },
    { icon: <User size={20} />, label: 'Profile', to: '/profile' },
  ];

  if (user?.is_staff) {
      navItems.push({ icon: <UsersIcon size={20} />, label: 'Users', to: '/users' });
  }

  navItems.push({ icon: <Settings size={20} />, label: 'Settings', to: '/settings' });

  return (
    <aside 
      className={`
        fixed left-0 top-0 h-screen bg-surface border-r border-outline-variant transition-all duration-500 z-50 flex flex-col
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Sidebar Header */}
      <div className="p-6 flex items-center justify-between mb-8">
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-black italic">C</span>
            </div>
            <span className="font-black text-lg tracking-tighter truncate">Cosy Content</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-black italic">C</span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-grow px-4 space-y-2">
        {navItems.map((item) => (
          <SidebarItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            active={location.pathname === item.to}
            collapsed={isCollapsed}
          />
        ))}

        {user?.is_staff && (
           <a
            href="http://localhost:8000/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
              text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface mt-8
            `}
          >
            <div className="group-hover:text-primary transition-colors">
              <Shield size={20} />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-sm tracking-tight whitespace-nowrap overflow-hidden">
                Django Admin
              </span>
            )}
          </a>
        )}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 space-y-2 border-t border-outline-variant/50">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-xl transition-all group"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!isCollapsed && <span className="font-bold text-sm tracking-tight">Collapse</span>}
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all group"
        >
          <LogOut size={20} className="group-hover:rotate-180 transition-transform duration-500" />
          {!isCollapsed && <span className="font-bold text-sm tracking-tight">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
