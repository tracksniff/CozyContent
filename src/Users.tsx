import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import Sidebar from './Sidebar';
import { User, Search, Shield, Plus, Mail } from 'lucide-react';
import axios from 'axios';

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { token } = useAuth();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface flex transition-colors duration-300">
      <Sidebar />
      <main className="flex-grow lg:ml-64 p-4 md:p-8 lg:p-12 transition-all duration-500 mt-16 lg:mt-0">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 md:mb-10 lg:mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-headline text-on-surface tracking-tight mb-2">User Management</h1>
              <p className="text-on-surface-variant font-medium text-xs sm:text-sm lg:text-base">Manage all users registered on the platform.</p>
            </div>
            <button className="w-full md:w-auto bg-primary text-white px-5 md:px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95 text-sm">
                <Plus size={18} className="md:size-[20px]" /> Add New User
            </button>
          </header>

          <div className="mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant md:size-[20px]" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-11 md:pl-12 pr-6 py-3 md:py-4 bg-surface-container-low border border-outline-variant rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-medium text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredUsers.map((u) => (
                <div key={u.id} className="bg-surface-container-low p-5 md:p-6 rounded-2xl md:rounded-[2rem] border border-outline-variant shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 text-primary rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                      <User size={20} className="md:size-[24px]" />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-on-surface truncate text-sm md:text-base">{u.first_name} {u.last_name}</h3>
                      <p className="text-[11px] md:text-xs text-on-surface-variant flex items-center gap-1 truncate">
                        <Mail size={10} className="md:size-[12px]" /> {u.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                    {u.is_staff && (
                      <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-primary/20 flex items-center gap-1">
                        <Shield size={10} /> Staff
                      </span>
                    )}
                    {u.is_premium ? (
                      <span className="px-2.5 py-1 bg-green-500/10 text-green-500 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-green-500/20 flex items-center gap-1">
                        {u.plan_type ? u.plan_type.replace('_', ' ') : 'Premium'}
                      </span>
                    ) : (
                        <span className="px-2.5 py-1 bg-surface border border-outline-variant rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                            Free Plan
                        </span>
                    )}
                  </div>

                  <div className="pt-4 border-t border-outline-variant/50 flex gap-2">
                    <button className="flex-grow py-2 rounded-xl border border-outline-variant text-[10px] md:text-xs font-bold hover:bg-surface-container-high transition-all">
                      Edit
                    </button>
                    <button className="flex-grow py-2 rounded-xl border border-outline-variant text-[10px] md:text-xs font-bold hover:bg-red-500/10 hover:text-red-500 transition-all">
                      Ban
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Users;
