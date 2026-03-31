import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash2, ExternalLink, Globe, Search } from 'lucide-react';
import Sidebar from './Sidebar';

const Dashboard: React.FC = () => {
  const [websites, setWebsites] = useState<any[]>([]);
  const [fetchingWebsites, setFetchingWebsites] = useState(true);
  const [newWebsite, setNewWebsite] = useState({ name: '', url: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const { token, user, loading: authLoading } = useAuth();

  const fetchWebsites = async () => {
    if (!token) return;
    try {
      const response = await axios.get('http://localhost:8000/api/websites/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWebsites(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingWebsites(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchWebsites();
    }
  }, [token, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/websites/', newWebsite, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewWebsite({ name: '', url: '' });
      fetchWebsites();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/websites/${id}/`, {
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
          {/* Header Section */}
          <header className="mb-12 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight mb-2">
                {user?.is_staff ? 'Admin Dashboard' : `Welcome Back, ${user?.first_name || 'User'}`}
              </h1>
              <p className="text-on-surface-variant font-medium">
                {user?.is_staff ? 'Manage all websites across the platform.' : 'Manage and monitor your digital ecosystem.'}
              </p>
            </div>
            {user?.is_staff && (
              <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">
                Staff Access
              </div>
            )}
          </header>

          {/* Stats/Overview Cards (Simple) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant shadow-sm">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                <Globe size={20} />
              </div>
              <div className="text-3xl font-black text-on-surface mb-1">{websites.length}</div>
              <div className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">
                {user?.is_staff ? 'Total Websites (All Users)' : 'Your Websites'}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content: Website List */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black text-on-surface tracking-tight">
                   {user?.is_staff ? 'All Websites' : 'Your Portfolio'}
                </h2>
                <div className="relative flex-grow max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                  <input
                    type="text"
                    placeholder="Search sites or owners..."
                    className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none text-sm transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {fetchingWebsites ? (
                <div className="flex justify-center py-20">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredWebsites.length === 0 ? (
                <div className="bg-surface-container-low border-2 border-dashed border-outline-variant rounded-[2.5rem] py-20 text-center">
                  <Globe className="mx-auto text-on-surface-variant/20 mb-4" size={48} />
                  <p className="text-on-surface-variant font-bold">No websites found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredWebsites.map((site) => (
                    <div key={site.id} className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="w-10 h-10 bg-surface rounded-xl border border-outline-variant flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Globe size={18} />
                        </div>
                        <button
                          onClick={() => handleDelete(site.id)}
                          className="p-2 text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="relative z-10">
                        <h3 className="text-lg font-black text-on-surface mb-1 group-hover:text-primary transition-colors">{site.name}</h3>
                        <p className="text-sm font-medium text-on-surface-variant truncate mb-2">{site.url}</p>
                        
                        {user?.is_staff && site.owner_email && (
                          <div className="mb-4 inline-block px-3 py-1 bg-surface border border-outline-variant rounded-full text-[10px] font-bold text-on-surface-variant">
                            Owner: {site.owner_email}
                          </div>
                        )}
                        
                        <div className="mt-4">
                          <a
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-3 transition-all"
                          >
                            Launch Site <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Content: Add New Website */}
            <div className="lg:col-span-1">
              <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant shadow-sm sticky top-12">
                <h2 className="text-xl font-black text-on-surface mb-6 tracking-tight">Add Website</h2>
                <form onSubmit={handleAddWebsite} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 ml-1">Friendly Name</label>
                    <input
                      type="text"
                      placeholder="My Store"
                      required
                      className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all text-sm font-medium"
                      value={newWebsite.name}
                      onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 ml-1">URL Endpoint</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      required
                      className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all text-sm font-medium"
                      value={newWebsite.url}
                      onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-primary text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4"
                  >
                    <Plus size={18} /> Confirm Add
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
