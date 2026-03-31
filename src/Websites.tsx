import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import Sidebar from './Sidebar';
import { Globe, Plus, Search, ExternalLink, Trash2 } from 'lucide-react';
import axios from 'axios';

const Websites: React.FC = () => {
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchWebsites();
    }
  }, [token, authLoading]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this website?')) return;
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
          <header className="mb-12 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight mb-2">Websites</h1>
              <p className="text-on-surface-variant font-medium">Manage your {user?.is_staff ? 'entire platform' : 'personal'} portfolio.</p>
            </div>
            {!user?.is_staff && (
                <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95">
                    <Plus size={20} /> Build New Site
                </button>
            )}
          </header>

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
          ) : filteredWebsites.length === 0 ? (
            <div className="bg-surface-container-low border-2 border-dashed border-outline-variant rounded-[3rem] py-32 text-center">
              <Globe className="mx-auto text-on-surface-variant/20 mb-6" size={64} />
              <p className="text-xl font-bold text-on-surface-variant">No websites found in your ecosystem.</p>
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
                  
                  <div className="w-14 h-14 bg-surface rounded-2xl border border-outline-variant flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-6">
                    <Globe size={24} />
                  </div>
                  
                  <h3 className="text-xl font-black text-on-surface mb-2 group-hover:text-primary transition-colors">{site.name}</h3>
                  <p className="text-sm font-medium text-on-surface-variant truncate mb-6">{site.url}</p>
                  
                  {user?.is_staff && (
                    <div className="mb-6 block px-4 py-2 bg-surface border border-outline-variant rounded-xl text-xs font-bold text-on-surface-variant">
                      Owner: {site.owner_email}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-outline-variant/50">
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-4 transition-all"
                    >
                      Live Preview <ExternalLink size={14} />
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
