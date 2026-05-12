import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, 
  Trash2, 
  ExternalLink, 
  Globe, 
  Search, 
  Sparkles, 
  Cpu, 
  Palette, 
  Zap, 
  Star, 
  Clock, 
  CheckCircle2, 
  Upload, 
  MessageSquare, 
  Send, 
  Edit3 
} from 'lucide-react';
import Sidebar from './Sidebar';
import toast from 'react-hot-toast';

const funMessages = [
  "Consulting our system...",
  "Polishing the Pixels...",
  "Brewing Digital Coffee...",
  "Assembling the React Components...",
  "Optimizing for maximum Cozyness...",
  "Building your custom brand...",
  "Constructing the Virtual Foundation...",
  "Sprinkling some CSS Magic...",
  "Synchronizing with the Matrix...",
  "Fine-tuning the User Experience..."
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [fetchingWebsites, setFetchingWebsites] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [newWebsite, setNewWebsite] = useState({ name: '', url: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isRedeploying, setIsRedeploying] = useState<{ [key: number]: boolean }>({});
  const [feedback, setFeedback] = useState<{ [key: number]: string }>({});
  const [githubUsernames, setGithubUsernames] = useState<{ [key: number]: string }>({});
  
  const { token, user, loading: authLoading } = useAuth();
  const location = useLocation();

  const handleRedeployVercel = async (websiteId: number) => {
    if (!token) return;
    setIsRedeploying({ ...isRedeploying, [websiteId]: true });
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/websites/${websiteId}/redeploy_vercel/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Vercel redeployment triggered!');
      if (res.data.url) {
        window.open(res.data.url, '_blank');
      }
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error('Vercel redeployment failed.');
    } finally {
      setIsRedeploying({ ...isRedeploying, [websiteId]: false });
    }
  };

  const handleSubmitGithub = async (applicationId: number) => {
    if (!githubUsernames[applicationId] || !token) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/applications/${applicationId}/submit_github_username/`, {
        github_username: githubUsernames[applicationId]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('GitHub username submitted!');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit GitHub username.');
    }
  };

  const handleFileUpload = async (applicationId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/applications/${applicationId}/add_attachment/`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('File uploaded successfully!');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitFeedback = async (applicationId: number) => {
    if (!feedback[applicationId] || !token) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/applications/${applicationId}/add_feedback/`, {
        section_name: 'General / 80% Review',
        comment: feedback[applicationId]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Feedback submitted!');
      setFeedback({ ...feedback, [applicationId]: '' });
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit feedback.');
    }
  };

  const fetchData = async () => {
    if (!token) return;
    try {
      const [sitesRes, appsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/websites/`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/applications/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setWebsites(sitesRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingWebsites(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchData();
      const interval = setInterval(() => {
        fetchData(); // Poll for updates
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [token, authLoading]);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % funMessages.length);
    }, 3000);
    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success') === 'true' && !params.get('new_user')) {
      toast.success('Payment successful! Your subscription has been updated.', {
        duration: 5000,
        icon: '💳',
      });
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const processingApps = applications.filter(app => app.status === 'processing');

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/websites/`, newWebsite, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewWebsite({ name: '', url: '' });
      fetchData();
      toast.success('Website added successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add website.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this website?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/websites/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      toast.success('Website deleted.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete website.');
    }
  };

  const filteredWebsites = websites.filter(site => 
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (site.owner_email && site.owner_email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const displayName = user?.first_name || (user?.email ? user.email.split('@')[0] : 'User');

  return (
    <div className="min-h-screen bg-surface flex transition-colors duration-300">
      <Sidebar />
      
      <main className="flex-grow lg:ml-64 p-4 md:p-8 lg:p-12 transition-all duration-500 mt-16 lg:mt-0">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <header className="mb-12 flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-on-surface tracking-tighter mb-2">
                {user?.is_staff ? (
                  <>Admin <span className="text-primary italic">Dashboard.</span></>
                ) : (
                  <>Welcome back, <span className="text-primary italic">{displayName}.</span></>
                )}
              </h1>
              <p className="text-on-surface-variant font-medium text-sm md:text-lg">
                {user?.is_staff ? 'Manage all websites across the platform.' : 'Manage and monitor your digital ecosystem.'}
              </p>
            </div>
            {user?.is_staff && (
              <div className="bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                Staff Access
              </div>
            )}
          </header>

          {/* System Generation Progress Spinner */}
          {processingApps.length > 0 && (
            <div className="mb-12 relative overflow-hidden bg-surface-container-low rounded-[2.5rem] border border-primary/20 p-8 md:p-16 animate-in fade-in zoom-in-95 duration-700 shadow-2xl shadow-primary/5">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Sparkles size={120} className="animate-pulse" />
               </div>
               
               <div className="relative z-10 flex flex-col items-center text-center">
                 <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
                    <div className="relative w-20 h-20 md:w-28 md:h-28 bg-white dark:bg-surface rounded-full flex items-center justify-center border-4 border-primary/20 shadow-2xl overflow-hidden">
                       <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                       <Sparkles size={32} className="text-primary animate-bounce" />
                    </div>
                 </div>

                 <h2 className="text-2xl md:text-4xl font-black text-on-surface mb-4 tracking-tighter">
                    Your website is <span className="text-primary italic">coming to life!</span>
                 </h2>
                 
                 <div className="bg-white dark:bg-surface/50 backdrop-blur-sm px-8 py-4 rounded-2xl border border-outline-variant/30 inline-flex items-center gap-4 transition-all duration-500 hover:scale-105 shadow-xl shadow-black/5">
                    <div className="flex gap-2 text-primary shrink-0">
                        <Cpu size={20} className="animate-pulse" />
                        <Palette size={20} className="animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <Zap size={20} className="animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <p className="text-on-surface font-black uppercase tracking-widest text-[11px]">
                        {funMessages[currentMessageIndex]}
                    </p>
                 </div>
                 
                 <p className="mt-8 text-on-surface-variant text-sm font-medium max-w-md">
                   Our system is currently building your custom code, setting up your GitHub repo, and launching your brand. It should take about a minute!
                 </p>
               </div>
            </div>
          )}

          {/* Project Progress & Reviews (Customer Only) */}
          {!user?.is_staff && applications.map(app => (
            <div key={app.id} className="mb-16 md:mb-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-1.5 bg-primary rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight uppercase">{app.company_name}</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Progress Timeline */}
                <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/30 shadow-xl shadow-black/5">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-on-surface flex items-center gap-2">
                      <Clock size={20} className="text-primary" /> Timeline
                    </h3>
                    <div className="px-3 py-1 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                      {app.progress}% Complete
                    </div>
                  </div>

                  <div className="space-y-6 relative">
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-outline-variant/20"></div>
                    
                    {[
                      { label: 'Project Confirmed', target: 0, desc: 'We’ve received your details and started your build.' },
                      { label: 'Design & Build Underway', target: 20, desc: 'Your new website is currently being created.' },
                      { label: 'Quality Check', target: 60, desc: 'We’re testing speed, mobile performance and user experience.' },
                      { 
                        label: 'Final Review Stage', 
                        target: 80, 
                        desc: 'Your website is ready for approval and final tweaks.' 
                      },
                      { 
                        label: 'Launch Complete', 
                        target: 100, 
                        desc: 'Your website is now live and ready for customers.' 
                      }
                    ].map((step, idx) => {
                      const isDone = app.progress >= step.target;
                      const isCurrent = app.progress >= step.target && (idx === 4 || app.progress < [0, 20, 60, 80, 100][idx+1]);
                      
                      return (
                        <div key={idx} className={`relative pl-10 flex gap-4 transition-all duration-500 ${isDone ? 'opacity-100' : 'opacity-30'}`}>
                          <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-4 ${isDone ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-surface border-outline-variant text-on-surface-variant'}`}>
                            {isDone ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-current"></div>}
                          </div>
                          <div>
                            <h4 className={`text-sm font-black ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>{step.label}</h4>
                            <p className="text-[11px] font-bold text-on-surface-variant leading-tight">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review & Feedback Section */}
                <div className="space-y-8">
                  {/* GitHub Transfer Box */}
                  {app.plan_type === 'one_time' && app.progress >= 80 && !app.github_username_for_transfer && (
                    <div className="bg-on-surface dark:bg-surface-container-high p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                       <h3 className="text-xl font-black mb-2 text-surface dark:text-on-surface">Code Ready for Transfer</h3>
                       <p className="text-surface/70 dark:text-on-surface-variant text-sm mb-6 font-medium">Please enter your GitHub details to initiate transfer.</p>
                       <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                          <input
                            className="flex-grow bg-surface border border-outline-variant rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-sm text-on-surface"
                            placeholder="GitHub Username"
                            value={githubUsernames[app.id] || ''}
                            onChange={e => setGithubUsernames({...githubUsernames, [app.id]: e.target.value})}
                          />
                          <button
                            onClick={() => handleSubmitGithub(app.id)}
                            className="bg-primary text-white px-8 py-3 rounded-xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-primary/20"
                          >
                            Submit
                          </button>
                       </div>
                    </div>
                  )}

                  {/* GMB Review Box */}
                  {app.progress >= 80 && (
                    <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/20 shadow-xl relative overflow-hidden group">
                      <h3 className="text-xl font-black text-on-surface mb-2 tracking-tight">Enjoying the <span className="text-primary italic">Experience?</span></h3>
                      <p className="text-sm font-medium text-on-surface-variant mb-6 leading-relaxed">Your feedback means the world to us. Please leave a review on our Google profile!</p>
                      <a 
                        href="https://g.page/r/CcL50VdU9y65EAE/review" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-primary/20"
                      >
                        <Star size={18} fill="currentColor" /> Leave a Review
                      </a>
                    </div>
                  )}

                  {/* Feedback & Uploads */}
                  <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/30 shadow-xl shadow-black/5">
                    <h3 className="text-lg font-black text-on-surface mb-6 flex items-center gap-2">
                      <MessageSquare size={18} className="text-primary" /> Requests & Feedback
                    </h3>
                    <div className="space-y-6">
                      <div className="relative">
                        <textarea 
                          className="w-full p-4 bg-white dark:bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none text-sm min-h-[120px] font-medium transition-all shadow-sm"
                          placeholder="Tell us what you'd like changed..."
                          value={feedback[app.id] || ''}
                          onChange={e => setFeedback({...feedback, [app.id]: e.target.value})}
                        ></textarea>
                        <button 
                          onClick={() => handleSubmitFeedback(app.id)}
                          disabled={!feedback[app.id]}
                          className="absolute bottom-4 right-4 p-2.5 bg-primary text-white rounded-xl disabled:opacity-50 hover:scale-105 transition-all shadow-lg"
                        >
                          <Send size={18} />
                        </button>
                      </div>

                      <div className="pt-6 border-t border-outline-variant/20">
                        <label className="flex-grow cursor-pointer group block">
                          <div className="w-full py-4 px-4 bg-white dark:bg-surface border-2 border-dashed border-outline-variant rounded-2xl group-hover:border-primary transition-all flex items-center justify-center gap-3 text-sm font-black text-on-surface-variant group-hover:text-primary shadow-sm">
                            {isUploading ? <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div> : <Upload size={20} />}
                            Upload Assets
                          </div>
                          <input type="file" className="hidden" onChange={e => handleFileUpload(app.id, e)} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Website List Section */}
          <div className="mt-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">
                 {user?.is_staff ? 'All Websites' : 'Your Portfolio'}
              </h2>
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                <input
                  type="text"
                  placeholder="Search sites..."
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary outline-none text-sm transition-all shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {fetchingWebsites ? (
              <div className="flex justify-center py-24">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredWebsites.length === 0 ? (
              <div className="bg-surface-container-low border-2 border-dashed border-outline-variant/30 rounded-[2rem] py-24 text-center">
                <Globe className="mx-auto text-on-surface-variant/20 mb-4" size={48} />
                <p className="text-sm font-bold text-on-surface-variant">No websites found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWebsites.map((site) => (
                  <div key={site.id} className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/30 shadow-xl shadow-black/5 hover:shadow-2xl hover:-translate-y-1 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-white dark:bg-surface rounded-2xl border border-outline-variant/30 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm">
                        <Globe size={20} />
                      </div>
                      <button
                        onClick={() => handleDelete(site.id)}
                        className="p-2 text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <h3 className="text-lg font-black text-on-surface mb-1 group-hover:text-primary transition-colors truncate">{site.name}</h3>
                    <p className="text-xs font-bold text-on-surface-variant truncate mb-6">{site.url}</p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-outline-variant/20">
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:gap-3 transition-all"
                      >
                        View Live <ExternalLink size={12} />
                      </a>
                      
                      {user?.is_staff && (
                        <button
                          onClick={() => handleRedeployVercel(site.id)}
                          disabled={isRedeploying[site.id]}
                          className="p-2 bg-secondary/10 text-secondary hover:bg-secondary hover:text-white rounded-xl transition-all disabled:opacity-50"
                        >
                          <Zap size={14} className={isRedeploying[site.id] ? 'animate-pulse' : ''} />
                        </button>
                      )}
                    </div>

                    {(user?.is_staff || user?.plan_type?.includes('monthly')) && (
                      <button
                        onClick={() => navigate('/request-changes')}
                        className="mt-6 w-full py-3 bg-on-surface text-surface rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                      >
                        <Edit3 size={14} /> Request Update
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Website Section (Admin or if allowed) */}
          {(user?.is_staff || websites.length === 0) && (
            <div className="mt-12 bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/30 shadow-xl shadow-black/5 max-w-2xl">
              <h2 className="text-xl font-black text-on-surface mb-6 tracking-tight">Add New Website</h2>
              <form onSubmit={handleAddWebsite} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Friendly Name"
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-surface border border-outline-variant/30 rounded-xl focus:border-primary outline-none transition-all text-sm font-medium"
                    value={newWebsite.name}
                    onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
                  />
                  <input
                    type="url"
                    placeholder="https://..."
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-surface border border-outline-variant/30 rounded-xl focus:border-primary outline-none transition-all text-sm font-medium"
                    value={newWebsite.url}
                    onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-white font-black rounded-xl hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
                >
                  <Plus size={18} /> Add Website
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
