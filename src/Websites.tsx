import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import Sidebar from './Sidebar';
import { Globe, Plus, Search, ExternalLink, Trash2, UserPlus, Server, Monitor } from 'lucide-react';
import axios from 'axios';

const Websites: React.FC = () => {
  const [websites, setWebsites] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWebsite, setNewWebsite] = useState({ 
    name: '', 
    url: '', 
    owner_id: '', 
    hosting_type: 'PLATFORM' 
  });
  const { token, user, loading: authLoading } = useAuth();

  const fetchWebsites = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/websites/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWebsites(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!token || !user?.is_staff) return;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchWebsites();
      if (user?.is_staff) fetchUsers();
    }
  }, [token, authLoading]);

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { 
        name: newWebsite.name, 
        url: newWebsite.url,
        hosting_type: newWebsite.hosting_type
      };
      if (user?.is_staff && newWebsite.owner_id) {
          payload.owner_id = parseInt(newWebsite.owner_id);
      }
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/websites/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewWebsite({ name: '', url: '', owner_id: '', hosting_type: 'PLATFORM' });
      setShowAddForm(false);
      fetchWebsites();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransfer = async (siteId: number, currentOwnerId: number) => {
      if (!user?.is_staff) return;
      const newOwnerId = prompt("Enter the New Owner ID:");
      if (!newOwnerId) return;
      
      try {
          await axios.patch(`${import.meta.env.VITE_API_URL}/api/websites/${siteId}/`, {
              owner_id: parseInt(newOwnerId)
          }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          fetchWebsites();
      } catch (err) {
          console.error(err);
          alert("Failed to transfer ownership.");
      }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this website?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/websites/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWebsites();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredWebsites = websites.filter(site => 
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (site.owner_email && site.owner_email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-surface flex transition-colors duration-300">
      <Sidebar />
      <main className="flex-grow ml-20 lg:ml-64 p-8 lg:p-12 transition-all duration-500">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight mb-2">Websites</h1>
              <p className="text-on-surface-variant font-medium">Manage hosted {user?.is_staff ? 'platform' : 'personal'} assets.</p>
            </div>
            <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
            >
                <Plus size={20} /> {showAddForm ? 'Cancel' : 'Register Website'}
            </button>
          </header>

          {showAddForm && (
              <div className="mb-12 bg-surface-container-low p-8 rounded-[2.5rem] border border-primary/20 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                  <h2 className="text-xl font-black mb-6">New Website Registration</h2>
                  <form onSubmit={handleAddWebsite} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1 mb-2 block">Name</label>
                            <input 
                                required
                                className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all"
                                value={newWebsite.name}
                                onChange={e => setNewWebsite({...newWebsite, name: e.target.value})}
                                placeholder="e.g. London Plumbers"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1 mb-2 block">URL</label>
                            <input 
                                required
                                type="url"
                                className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all"
                                value={newWebsite.url}
                                onChange={e => setNewWebsite({...newWebsite, url: e.target.value})}
                                placeholder="https://..."
                            />
                          </div>
                      </div>
                      <div className="space-y-4">
                          {user?.is_staff && (
                              <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1 mb-2 block">Assign Owner</label>
                                <select 
                                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all"
                                    value={newWebsite.owner_id}
                                    onChange={e => setNewWebsite({...newWebsite, owner_id: e.target.value})}
                                >
                                    <option value="">Myself (Admin)</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.email} ({u.first_name})</option>
                                    ))}
                                </select>
                              </div>
                          )}
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1 mb-2 block">Hosting Configuration</label>
                            <div className="flex gap-2">
                                <button 
                                    type="button"
                                    onClick={() => setNewWebsite({...newWebsite, hosting_type: 'PLATFORM'})}
                                    className={`flex-grow py-3 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${newWebsite.hosting_type === 'PLATFORM' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant'}`}
                                >
                                    <Server size={18} /> Platform
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setNewWebsite({...newWebsite, hosting_type: 'SELF'})}
                                    className={`flex-grow py-3 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${newWebsite.hosting_type === 'SELF' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant'}`}
                                >
                                    <Monitor size={18} /> Self-Hosted
                                </button>
                            </div>
                          </div>
                          <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-xl hover:brightness-110 shadow-lg shadow-primary/20 transition-all">
                              Register Asset
                          </button>
                      </div>
                  </form>
              </div>
          )}

          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
              <input
                type="text"
                placeholder="Search websites, URLs or owners..."
                className="w-full pl-12 pr-6 py-4 bg-surface-container-low border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredWebsites.map((site) => (
                <div key={site.id} className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 translate-x-full group-hover:translate-x-0 transition-transform">
                     <button
                        onClick={() => handleDelete(site.id)}
                        className="p-3 text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                  </div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-surface rounded-2xl border border-outline-variant flex items-center justify-center text-primary">
                        <Globe size={24} />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${site.hosting_type === 'PLATFORM' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface-variant text-on-surface-variant border-outline-variant'}`}>
                        {site.hosting_type}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-black text-on-surface mb-2 group-hover:text-primary transition-colors">{site.name}</h3>
                  <p className="text-sm font-medium text-on-surface-variant truncate mb-6">{site.url}</p>
                  
                  <div className="mb-6 p-4 bg-surface rounded-2xl border border-outline-variant">
                      <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Current Owner</div>
                      <div className="font-bold text-sm truncate">{site.owner_email}</div>
                      {user?.is_staff && (
                          <button 
                            onClick={() => handleTransfer(site.id, site.owner_id)}
                            className="mt-3 w-full py-2 bg-on-surface text-surface rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-125 transition-all flex items-center justify-center gap-2"
                          >
                            <UserPlus size={14} /> Transfer Ownership
                          </button>
                      )}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-outline-variant/50">
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-4 transition-all"
                    >
                      Visit Site <ExternalLink size={14} />
                    </a>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                        {new Date(site.created_at).toLocaleDateString()}
                    </span>
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

export default Websites;
