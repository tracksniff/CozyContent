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
  Zap
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import logo from './assets/PNG/Cosy Content Ltd -05.png';

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
  const [siteRequests, setSiteRequests] = useState<any[]>([]);
  const { logout, user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchSiteRequests = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/site-requests/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSiteRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token && showEditModal) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/websites/`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setWebsites(res.data));
      fetchSiteRequests();
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
    if (!user) return;

    const totalRemaining = (user.monthly_requests_remaining || 0) + (user.purchased_requests_remaining || 0);
    if (totalRemaining <= 0) {
      alert('You have no remaining requests. Please purchase an update pack.');
      navigate('/pricing');
      setShowEditModal(false);
      return;
    }

    setIsSubmitting(true);
    const target = e.target as any;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/site-requests/`, {
        website: target.website.value,
        details: target.details.value
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Edit request sent! We will process it shortly.');
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
          <div className="w-8 h-8 flex items-center justify-center">
            <img src={logo} alt="Cosy Content Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-black text-lg tracking-tighter">Cosy Content</span>
        </div>
        
        <div className="flex items-center gap-4">
          {user && !user.is_staff && (
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                {(user.monthly_requests_remaining || 0) + (user.purchased_requests_remaining || 0)} Updates
              </span>
              {user.priority_updates_active && <Zap size={10} className="text-yellow-500 fill-yellow-500" />}
            </div>
          )}
          <button 
            onClick={toggleMobile}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
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
          fixed left-0 top-0 h-screen h-[100dvh] bg-surface border-r border-outline-variant transition-all duration-500 z-50 flex flex-col
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between mb-4 md:mb-8 shrink-0">
          <div className={`flex items-center gap-2 overflow-hidden transition-all duration-500 ${isCollapsed ? 'lg:opacity-0' : 'opacity-100'}`}>
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <img src={logo} alt="Cosy Content Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-black text-lg tracking-tighter truncate">Cosy Content</span>
          </div>
          
          {isCollapsed && (
            <div className="absolute left-6 w-8 h-8 hidden lg:flex items-center justify-center">
              <img src={logo} alt="Cosy Content Logo" className="w-full h-full object-contain" />
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
        <nav className="flex-grow px-4 space-y-2 overflow-y-auto">
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

          {/* Request Changes Option */}
          <SidebarItem
            icon={<Edit3 size={20} />}
            label="Request Changes"
            collapsed={isCollapsed}
            onClick={() => {
              setShowEditModal(true);
              setIsMobileOpen(false);
            }}
          />

          {user && !user.is_staff && (
            <div className={`mt-8 px-4 ${isCollapsed ? 'hidden lg:block' : ''}`}>
               <div className={`p-4 bg-surface-container-high rounded-2xl border border-outline-variant ${isCollapsed ? 'flex justify-center' : ''}`}>
                  {isCollapsed ? (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                        {(user.monthly_requests_remaining || 0) + (user.purchased_requests_remaining || 0)}
                    </div>
                  ) : (
                    <>
                      <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Available Updates</div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-black text-on-surface">{(user.monthly_requests_remaining || 0) + (user.purchased_requests_remaining || 0)}</span>
                        {user.priority_updates_active && (
                          <div className="mb-1.5 px-2 py-0.5 bg-yellow-400 text-black text-[8px] font-black rounded-full uppercase tracking-tighter flex items-center gap-1">
                            <Zap size={8} fill="black" /> Priority
                          </div>
                        )}
                      </div>
                      <Link to="/pricing" className="mt-3 block text-[10px] font-black text-primary uppercase tracking-widest hover:brightness-125">Get More +</Link>
                    </>
                  )}
               </div>
            </div>
          )}

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
        <div className="p-4 pb-8 md:pb-4 space-y-2 border-t border-outline-variant/50 shrink-0">
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
                    <h2 className="text-3xl font-black tracking-tight text-on-surface">Request Changes</h2>
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

                {/* Recent Requests List */}
                {siteRequests.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4 ml-1">Recent Requests</h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {siteRequests.map(req => (
                        <div key={req.id} className="p-4 bg-surface-container-low border border-outline-variant rounded-xl">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-black uppercase text-primary">{req.website_name}</span>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${
                              req.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                              req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                              'bg-surface-variant text-on-surface-variant'
                            }`}>
                              {req.status}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface line-clamp-2">{req.details}</p>
                          <div className="mt-2 text-[8px] font-bold text-on-surface-variant opacity-60">
                            {new Date(req.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
