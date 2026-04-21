import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash2, ExternalLink, Globe, Search, Sparkles, Cpu, Palette, Zap, Star, Clock, CheckCircle2, Upload, MessageSquare, Send, RefreshCcw } from 'lucide-react';
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
  const [websites, setWebsites] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [fetchingWebsites, setFetchingWebsites] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [newWebsite, setNewWebsite] = useState({ name: '', url: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isRetrying, setIsRetrying] = useState<{ [key: number]: boolean }>({});
  const [isRegenerating, setIsRegenerating] = useState<{ [key: number]: boolean }>({});
  const [feedback, setFeedback] = useState<{ [key: number]: string }>({});

  const handleRegenerate = async (applicationId: number) => {
    if (!token) return;
    setIsRegenerating({ ...isRegenerating, [applicationId]: true });
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/applications/${applicationId}/regenerate_code/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Regeneration started!');
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to start regeneration.');
    } finally {
      setIsRegenerating({ ...isRegenerating, [applicationId]: false });
    }
  };
  const [githubUsernames, setGithubUsernames] = useState<{ [key: number]: string }>({});
  const { token, user, loading: authLoading } = useAuth();

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
  const location = useLocation();

  const handleRetryPush = async (applicationId: number) => {
    if (!token) return;
    setIsRetrying({ ...isRetrying, [applicationId]: true });
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/applications/${applicationId}/repush_to_github/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Successfully pushed to GitHub!');
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || 'GitHub push failed again.');
    } finally {
      setIsRetrying({ ...isRetrying, [applicationId]: false });
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success') === 'true' && !params.get('new_user')) {
      toast.success('Payment successful! Your subscription has been updated.', {
        duration: 5000,
        icon: '💳',
      });
      // Clear the URL parameters without reloading the page
      window.history.replaceState({}, '', location.pathname);
    }

    if (params.get('action') === 'transfer') {
      if (applications.some(app => app.plan_type === 'one_time' && app.progress >= 80 && !app.github_username_for_transfer)) {
        toast('Ready for transfer! Please enter your GitHub details below.', {
          icon: '🚀',
          duration: 6000,
        });
        setTimeout(() => {
          const element = document.querySelector('[id^="transfer-"]');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 1000);
      }
    }
  }, [location, applications]);

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
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/websites/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
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
      
      <main className="flex-grow lg:ml-64 p-6 md:p-8 lg:p-12 transition-all duration-500 mt-16 lg:mt-0">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <header className="mb-10 lg:mb-12 flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black font-headline text-on-surface tracking-tight mb-2">
                {user?.is_staff ? 'Admin Dashboard' : `Welcome Back, ${user?.first_name || 'User'}`}
              </h1>
              <p className="text-on-surface-variant font-medium text-sm lg:text-base">
                {user?.is_staff ? 'Manage all websites across the platform.' : 'Manage and monitor your digital ecosystem.'}
              </p>
            </div>
            {user?.is_staff && (
              <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">
                Staff Access
              </div>
            )}
          </header>

          {/* System Generation Progress Spinner */}
          {processingApps.length > 0 && (
            <div className="mb-12 relative overflow-hidden bg-primary/5 rounded-[3rem] border border-primary/10 p-8 md:p-12 animate-in fade-in zoom-in-95 duration-700 shadow-xl shadow-primary/5">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Sparkles size={120} className="animate-pulse" />
               </div>
               
               <div className="relative z-10 flex flex-col items-center text-center">
                 <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
                    <div className="relative w-24 h-24 bg-surface rounded-full flex items-center justify-center border-4 border-primary/20 shadow-xl overflow-hidden">
                       <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                       <Sparkles size={32} className="text-primary animate-bounce" />
                    </div>
                 </div>

                 <h2 className="text-2xl font-black text-on-surface mb-4 tracking-tight">
                    Your Website is coming to life!
                 </h2>
                 
                 <div className="bg-surface/50 backdrop-blur-sm px-8 py-4 rounded-2xl border border-primary/10 inline-flex items-center gap-4 min-w-[320px] transition-all duration-500 hover:scale-105 shadow-sm">
                    <div className="flex gap-2 text-primary">
                        <Cpu size={20} className="animate-pulse" />
                        <Palette size={20} className="animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <Zap size={20} className="animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <p className="text-primary font-black uppercase tracking-widest text-[11px] min-w-[240px]">
                        {funMessages[currentMessageIndex]}
                    </p>
                 </div>
                 
                 <p className="mt-8 text-on-surface-variant text-xs font-medium max-w-sm">
                   Our system is currently building your custom code, setting up your GitHub repo, and launching your brand. It should take about a minute!
                 </p>
               </div>
            </div>
          )}

          {/* Project Progress & Reviews (Customer Only) */}
          {!user?.is_staff && applications.map(app => (
            <div key={app.id} className="mb-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-1.5 bg-primary rounded-full"></div>
                <h2 className="text-2xl font-black text-on-surface tracking-tight uppercase">{app.company_name}</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Progress Timeline */}
              <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-on-surface flex items-center gap-2">
                    <Clock size={20} className="text-primary" /> Project Timeline
                  </h3>
                  <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                    {app.progress}% Complete
                  </div>
                </div>

                <div className="space-y-6 relative">
                  <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-outline-variant/30"></div>
                  
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
                      <div key={idx} className={`relative pl-10 flex gap-4 transition-all ${isDone ? 'opacity-100' : 'opacity-40'}`}>
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-4 ${isDone ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-surface border-outline-variant text-on-surface-variant'}`}>
                          {isDone ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-current"></div>}
                        </div>
                        <div>
                          <h4 className={`text-sm font-black ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>{step.label}</h4>
                          <p className="text-[10px] font-medium text-on-surface-variant">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review & Feedback Section */}
              <div className="space-y-8">
                {/* GitHub Transfer Box (One-Time Only) */}
                {app.plan_type === 'one_time' && app.progress >= 80 && !app.github_username_for_transfer && (
                  <div id={`transfer-${app.id}`} className="bg-primary p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
                     <h3 className="text-xl font-black mb-2">Code Ready for Transfer</h3>
                     <p className="text-white/80 text-sm mb-6 font-medium">Please enter your GitHub username or email to initiate the code transfer.</p>
                     <div className="flex gap-2">
                        <input 
                          className="flex-grow bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none focus:bg-white/20 transition-all text-sm placeholder:text-white/40"
                          placeholder="GitHub Username"
                          value={githubUsernames[app.id] || ''}
                          onChange={e => setGithubUsernames({...githubUsernames, [app.id]: e.target.value})}
                        />
                        <button 
                          onClick={() => handleSubmitGithub(app.id)}
                          className="bg-white text-primary px-6 py-3 rounded-xl font-black text-sm hover:brightness-110 active:scale-95 transition-all"
                        >
                          Submit
                        </button>
                     </div>
                  </div>
                )}
                
                {app.plan_type === 'one_time' && app.github_username_for_transfer && app.progress < 100 && (
                  <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant shadow-sm">
                    <h3 className="text-lg font-black text-on-surface mb-2">Transfer in Progress</h3>
                    <p className="text-sm font-medium text-on-surface-variant">Our team is transferring the repository to <strong>{app.github_username_for_transfer}</strong>. You'll receive an email from GitHub shortly.</p>
                  </div>
                )}
                {/* GMB Review Box */}
                {app.progress >= 80 && (
                  <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/20 shadow-xl relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Star size={120} />
                    </div>
                    <h3 className="text-xl font-black text-on-surface mb-2 tracking-tight">Enjoying the experience?</h3>
                    <p className="text-sm font-medium text-on-surface-variant mb-6">Your feedback means the world to us. Please leave a review on our Google profile!</p>
                    <a 
                      href="https://g.page/r/CcL50VdU9y65EAE/review" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                    >
                      <Star size={18} fill="currentColor" /> Leave a Review
                    </a>
                  </div>
                )}

                {/* Feedback & Uploads */}
                <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant shadow-sm">
                  <h3 className="text-lg font-black text-on-surface mb-6 flex items-center gap-2">
                    <MessageSquare size={18} className="text-primary" /> Requests & Feedback
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1 mb-2 block">Leave Feedback (80% Stage)</label>
                      <div className="relative">
                        <textarea 
                          className="w-full p-4 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none text-sm min-h-[100px] font-medium transition-all"
                          placeholder="Tell us what you'd like changed..."
                          value={feedback[app.id] || ''}
                          onChange={e => setFeedback({...feedback, [app.id]: e.target.value})}
                        ></textarea>
                        <button 
                          onClick={() => handleSubmitFeedback(app.id)}
                          disabled={!feedback[app.id]}
                          className="absolute bottom-4 right-4 p-2 bg-primary text-white rounded-xl disabled:opacity-50 hover:brightness-110 transition-all shadow-md"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-outline-variant/30">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1 mb-2 block">Attachments & Assets</label>
                      <div className="flex items-center gap-4">
                        <label className="flex-grow cursor-pointer group">
                          <div className="w-full py-3 px-4 bg-surface border-2 border-dashed border-outline-variant rounded-xl group-hover:border-primary transition-all flex items-center justify-center gap-2 text-sm font-bold text-on-surface-variant group-hover:text-primary">
                            {isUploading ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div> : <Upload size={18} />}
                            Upload Image or File
                          </div>
                          <input type="file" className="hidden" onChange={e => handleFileUpload(app.id, e)} />
                        </label>
                      </div>
                      
                      {app.attachments?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {app.attachments.map((file: any) => (
                            <div key={file.id} className="px-3 py-1 bg-surface border border-outline-variant rounded-lg text-[10px] font-bold flex items-center gap-2">
                              {file.filename}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Admin Feedback Management */}
          {user?.is_staff && applications.some(app => app.feedbacks?.length > 0 || app.attachments?.length > 0 || app.status === 'failed') && (
            <div className="mb-12">
              <h2 className="text-2xl font-black text-on-surface tracking-tight mb-6">Customer Requests & Failed Builds</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applications.filter(app => app.feedbacks?.length > 0 || app.attachments?.length > 0 || app.status === 'failed').map(app => (
                  <div key={app.id} className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <h3 className="font-bold text-on-surface">{app.company_name}</h3>
                        <span className={`text-[9px] font-black uppercase tracking-widest mt-1 ${app.status === 'failed' ? 'text-red-500' : 'text-primary'}`}>
                          Status: {app.status}
                        </span>
                      </div>
                      <div className="px-2 py-0.5 bg-surface border border-outline-variant rounded text-[10px] font-bold">
                        App ID: {app.id}
                      </div>
                    </div>

                    {app.status === 'failed' && (
                      <div className="mb-6 grid grid-cols-2 gap-4">
                        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
                          <p className="text-[10px] font-bold text-red-600 mb-3 uppercase tracking-wider">GitHub Push Failed</p>
                          <button 
                            onClick={() => handleRetryPush(app.id)}
                            disabled={isRetrying[app.id]}
                            className="w-full py-3 bg-on-surface text-surface rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-125 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                          >
                            {isRetrying[app.id] ? <RefreshCcw size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
                            Retry GitHub Push
                          </button>
                        </div>
                        <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                          <p className="text-[10px] font-bold text-amber-600 mb-3 uppercase tracking-wider">System Generation Failed</p>
                          <button 
                            onClick={() => handleRegenerate(app.id)}
                            disabled={isRegenerating[app.id]}
                            className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                          >
                            {isRegenerating[app.id] ? <Sparkles size={14} className="animate-pulse" /> : <Sparkles size={14} />}
                            Retry Generation
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {app.feedbacks?.length > 0 && (
                      <div className="mb-4 space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Feedback</div>
                        {app.feedbacks.map((f: any) => (
                          <div key={f.id} className="p-3 bg-surface border border-outline-variant rounded-xl text-xs">
                            <p className="font-medium text-on-surface">{f.comment}</p>
                            <span className="text-[9px] text-on-surface-variant uppercase mt-1 block">{new Date(f.created_at).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {app.attachments?.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Attachments</div>
                        <div className="flex flex-wrap gap-2">
                          {app.attachments.map((a: any) => (
                            <a 
                              key={a.id} 
                              href={a.file} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-primary/5 text-primary border border-primary/10 rounded-lg text-[10px] font-bold hover:bg-primary/10 transition-all"
                            >
                              {a.filename}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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
