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
      <main className="flex-grow lg:ml-64 p-4 md:p-8 lg:p-10 transition-all duration-500 mt-16 lg:mt-0">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-headline text-on-surface tracking-tight mb-1.5">User Management</h1>
              <p className="text-on-surface-variant font-medium text-[10px] sm:text-xs lg:text-sm">Manage all users registered on the platform.</p>
            </div>
            <button className="w-full md:w-auto bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95 text-xs md:text-sm">
                <Plus size={16} className="md:size-[18px]" /> Add New User
            </button>
          </header>

          <div className="mb-6 md:mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" size={14} />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-9 pr-6 py-2.5 md:py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-medium text-xs md:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredUsers.map((u) => (
                <div key={u.id} className="bg-surface-container-low p-4 md:p-6 rounded-2xl md:rounded-3xl border border-outline-variant shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                      <User size={18} className="md:size-[22px]" />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-on-surface truncate text-xs md:text-sm">{u.first_name} {u.last_name}</h3>
                      <p className="text-[10px] md:text-xs text-on-surface-variant flex items-center gap-1 truncate">
                        <Mail size={10} /> {u.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {u.is_staff && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-primary/20 flex items-center gap-1">
                        <Shield size={10} /> Staff
                      </span>
                    )}
                    {u.is_premium ? (
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-green-500/20 flex items-center gap-1">
                        {u.plan_type ? u.plan_type.replace('_', ' ') : 'Premium'}
                      </span>
                    ) : (
                        <span className="px-2 py-0.5 bg-surface border border-outline-variant rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest text-on-surface-variant">
                            Free Plan
                        </span>
                    )}
                  </div>

                  <div className="pt-4 border-t border-outline-variant/50 flex gap-2">
                    <button className="flex-grow py-1.5 rounded-lg border border-outline-variant text-[10px] font-bold hover:bg-surface-container-high transition-all">
                      Edit
                    </button>
                    <button className="flex-grow py-1.5 rounded-lg border border-outline-variant text-[10px] font-bold hover:bg-red-500/10 hover:text-red-500 transition-all">
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
