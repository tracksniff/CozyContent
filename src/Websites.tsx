import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { Globe, Search, ExternalLink, Trash2, UserPlus, Edit3 } from 'lucide-react';
import axios from 'axios';

const Websites: React.FC = () => {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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

  useEffect(() => {
    if (!authLoading) {
      fetchWebsites();
    }
  }, [token, authLoading]);

  const handleTransfer = async (siteId: number, _currentOwnerId: number) => {
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
      <main className="flex-grow lg:ml-64 p-4 md:p-8 lg:p-10 transition-all duration-500 mt-16 lg:mt-0">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-headline text-on-surface tracking-tight mb-1.5">Websites</h1>
              <p className="text-on-surface-variant font-medium text-[10px] sm:text-xs lg:text-sm">Manage hosted {user?.is_staff ? 'platform' : 'personal'} assets.</p>
            </div>
          </header>

          <div className="mb-6 md:mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" size={14} />
              <input
                type="text"
                placeholder="Search websites..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {filteredWebsites.map((site) => (
                <div key={site.id} className="bg-surface-container-low p-4 md:p-6 rounded-2xl md:rounded-3xl border border-outline-variant shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 right-0 p-3 md:p-4 translate-x-full group-hover:translate-x-0 transition-transform">
                     <button
                        onClick={() => handleDelete(site.id)}
                        className="p-1.5 md:p-2 text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={16} className="md:size-[18px]" />
                      </button>
                  </div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-surface rounded-xl border border-outline-variant flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Globe size={18} className="md:size-[22px]" />
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border ${site.hosting_type === 'PLATFORM' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface-variant text-on-surface-variant border-outline-variant'}`}>
                        {site.hosting_type}
                    </div>
                  </div>
                  
                  <h3 className="text-sm md:text-base font-black text-on-surface mb-0.5 group-hover:text-primary transition-colors truncate">{site.name}</h3>
                  <p className="text-[10px] md:text-xs font-medium text-on-surface-variant truncate mb-4">{site.url}</p>
                  
                  <div className="mb-4 p-3 bg-surface rounded-xl border border-outline-variant">
                      <div className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Current Owner</div>
                      <div className="font-bold text-[11px] md:text-xs truncate">{site.owner_email}</div>
                      {user?.is_staff && (
                          <button 
                            onClick={() => handleTransfer(site.id, site.owner_id)}
                            className="mt-3 w-full py-1.5 bg-on-surface text-surface rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:brightness-125 transition-all flex items-center justify-center gap-1.5"
                          >
                            <UserPlus size={12} /> Transfer
                          </button>
                      )}
                  </div>

                  <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-outline-variant/50">
                    <div className="flex items-center justify-between">
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary hover:gap-2 transition-all"
                      >
                        Visit Site <ExternalLink size={10} className="md:size-[12px]" />
                      </a>
                      <span className="text-[8px] md:text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">
                          {new Date(site.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {(user?.is_staff || user?.plan_type === 'monthly' || user?.plan_type === 'annual' || user?.plan_type === 'priority_monthly') && (
                      <button
                        onClick={() => navigate('/request-changes')}
                        className="w-full py-2 bg-surface border border-outline-variant rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-on-surface hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-1.5"
                      >
                        <Edit3 size={10} className="md:size-[12px]" /> Request Update
                      </button>
                    )}
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
