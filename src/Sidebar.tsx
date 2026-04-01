import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Globe, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  User,
  Shield,
  Users as UsersIcon,
  Menu,
  X,
  Edit3,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

const SidebarItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  to?: string; 
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}> = ({ icon, label, to, active, collapsed, onClick }) => {
  const content = (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer
        ${active 
          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
        }
      `}
      onClick={onClick}
    >
      <div className={`${active ? 'text-white' : 'group-hover:text-primary'} transition-colors`}>
        {icon}
      </div>
      {!collapsed && (
        <span className="font-bold text-sm tracking-tight whitespace-nowrap overflow-hidden">
          {label}
        </span>
      )}
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }
  return content;
};

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [websites, setWebsites] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logout, user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token && showEditModal) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/websites/`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setWebsites(res.data));
    }
  }, [token, showEditModal]);

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

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  const handleEditRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const target = e.target as any;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/request-edit/`, {
        website_id: target.website.value,
        details: target.details.value
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Edit request sent! We will process it within 24 hours.');
      setShowEditModal(false);
    } catch (err) {
      alert('Failed to send request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface border-b border-outline-variant z-40 flex items-center justify-between px-6 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-black italic">C</span>
          </div>
          <span className="font-black text-lg tracking-tighter">Cosy Content</span>
        </div>
        <button 
          onClick={toggleMobile}
          className="p-2 text-on-surface-variant hover:text-primary transition-colors"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-all duration-500"
          onClick={toggleMobile}
        />
      )}

      <aside 
        className={`
          fixed left-0 top-0 h-screen bg-surface border-r border-outline-variant transition-all duration-500 z-50 flex flex-col
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between mb-8">
          <div className={`flex items-center gap-2 overflow-hidden transition-all duration-500 ${isCollapsed ? 'lg:opacity-0' : 'opacity-100'}`}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-black italic">C</span>
            </div>
            <span className="font-black text-lg tracking-tighter truncate">Cosy Content</span>
          </div>
          
          {isCollapsed && (
            <div className="absolute left-6 w-8 h-8 bg-primary rounded-lg hidden lg:flex items-center justify-center">
              <span className="text-white font-black italic">C</span>
            </div>
          )}

          <button 
            onClick={toggleMobile}
            className="lg:hidden p-1 text-on-surface-variant hover:text-primary"
          >
            <X size={20} />
          </button>
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
              onClick={() => setIsMobileOpen(false)}
            />
          ))}

          {/* Request Edit Option */}
          <SidebarItem
            icon={<Edit3 size={20} />}
            label="Request Edit"
            collapsed={isCollapsed}
            onClick={() => {
              setShowEditModal(true);
              setIsMobileOpen(false);
            }}
          />

          {user?.is_staff && (
             <a
              href={`${import.meta.env.VITE_API_URL}/admin/`}
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
            className="hidden lg:flex w-full items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-xl transition-all group"
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

      {/* Edit Request Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setShowEditModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-surface rounded-[2.5rem] border border-outline-variant shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight text-on-surface">Request an Edit</h2>
                    <p className="mt-2 text-on-surface-variant font-medium">What would you like us to change?</p>
                  </div>
                  <button 
                    onClick={() => setShowEditModal(false)}
                    className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form className="space-y-6" onSubmit={handleEditRequest}>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3 ml-1">Select Website</label>
                    <select
                      name="website"
                      required
                      className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all font-bold text-sm"
                    >
                      {websites.map(site => (
                        <option key={site.id} value={site.id}>{site.name}</option>
                      ))}
                      {websites.length === 0 && <option value="">No websites available</option>}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3 ml-1">Edit Details</label>
                    <textarea
                      name="details"
                      required
                      rows={4}
                      placeholder="Be as specific as possible. E.g., 'Change the header color to blue' or 'Update the contact number'..."
                      className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all font-medium text-sm resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      disabled={isSubmitting || websites.length === 0}
                      className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Submit Edit Request <CheckCircle size={18} /></>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
