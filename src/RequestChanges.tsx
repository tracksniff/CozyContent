import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle, 
  ArrowLeft,
  Zap,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Sidebar from './Sidebar';

const RequestChanges: React.FC = () => {
  const [websites, setWebsites] = useState<any[]>([]);
  const [siteRequests, setSiteRequests] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    
    // Fetch websites
    axios.get(`${import.meta.env.VITE_API_URL}/api/websites/`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setWebsites(res.data));

    // Fetch site requests
    axios.get(`${import.meta.env.VITE_API_URL}/api/site-requests/`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setSiteRequests(res.data));
  }, [token]);

  const handleEditRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const totalRemaining = (user.monthly_requests_remaining || 0) + (user.purchased_requests_remaining || 0);
    if (totalRemaining <= 0) {
      alert('You have no remaining requests. Please purchase an update pack.');
      navigate('/add-ons');
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
      
      // Refresh requests
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/site-requests/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSiteRequests(res.data);
      target.reset();
    } catch (err) {
      alert('Failed to send request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex transition-colors duration-300">
      <Sidebar />
      
      <main className="flex-grow lg:ml-64 p-4 md:p-8 lg:p-10 mt-16 lg:mt-0 transition-all duration-500">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 md:mb-10">
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary font-bold text-[10px] md:text-xs mb-4 transition-colors group">
              <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </Link>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-on-surface tracking-tight mb-1.5">Request Changes</h1>
                <p className="text-on-surface-variant font-medium text-[10px] sm:text-xs lg:text-sm">Tell us what you'd like to update on your website.</p>
              </div>
              
              {user && !user.is_staff && (
                <div className="flex items-center gap-3 bg-surface-container-high px-4 py-2.5 md:px-5 md:py-3 rounded-xl md:rounded-2xl border border-outline-variant shadow-sm">
                  <div>
                    <div className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-0.5">Available Updates</div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg md:text-xl font-black text-on-surface">
                        {(user.monthly_requests_remaining || 0) + (user.purchased_requests_remaining || 0)}
                      </span>
                      {user.priority_updates_active && <Zap size={10} className="text-yellow-500 fill-yellow-500" />}
                    </div>
                  </div>
                  <Link to="/add-ons" className="ml-2 md:ml-4 p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all">
                    <CheckCircle size={16} className="md:size-[18px]" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-10">
            {/* Form Section */}
            <div className="lg:col-span-3">
              <div className="bg-surface-container-low p-5 md:p-8 rounded-2xl md:rounded-3xl border border-outline-variant shadow-sm">
                <form className="space-y-4 md:space-y-6" onSubmit={handleEditRequest}>
                  <div>
                    <label className="block text-[8px] md:text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Select Website</label>
                    <select
                      name="website"
                      required
                      className="w-full px-4 py-2.5 md:py-3 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold text-xs md:text-sm appearance-none cursor-pointer"
                    >
                      {websites.map(site => (
                        <option key={site.id} value={site.id}>{site.name}</option>
                      ))}
                      {websites.length === 0 && <option value="">No websites available</option>}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[8px] md:text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Edit Details</label>
                    <textarea
                      name="details"
                      required
                      rows={6}
                      placeholder="Be as specific as possible. E.g., 'Change the header color to blue'..."
                      className="w-full px-4 py-3 md:py-4 bg-surface border border-outline-variant rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-medium text-xs md:text-sm resize-none h-32 md:h-40"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      disabled={isSubmitting || websites.length === 0}
                      className="w-full py-3.5 bg-primary text-white font-black rounded-xl hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-[10px] md:text-xs uppercase tracking-widest"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Submit Request <CheckCircle size={16} /></>
                      )}
                    </button>
                    <p className="mt-3 text-center text-[8px] md:text-[9px] text-on-surface-variant font-bold uppercase tracking-widest">
                      Typical turnaround: 24-48 hours
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar/Recent Requests */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              <div className="bg-surface-container-high p-5 md:p-6 rounded-2xl md:rounded-3xl border border-outline-variant">
                <h3 className="flex items-center gap-2 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-4 md:mb-5 ml-1">
                  <Clock size={12} className="md:size-[14px]" /> Recent Requests
                </h3>
                
                <div className="space-y-2.5 md:space-y-3">
                  {siteRequests.length === 0 ? (
                    <div className="text-center py-6 md:py-8 px-4">
                      <div className="w-8 h-8 md:w-10 bg-surface rounded-full flex items-center justify-center mx-auto mb-3 text-on-surface-variant opacity-20">
                        <CheckCircle size={16} className="md:size-[20px]" />
                      </div>
                      <p className="text-[10px] md:text-xs font-bold text-on-surface-variant">No requests yet.</p>
                    </div>
                  ) : (
                    siteRequests.map(req => (
                      <div key={req.id} className="p-3.5 md:p-4 bg-surface rounded-xl border border-outline-variant hover:border-primary/30 transition-all group">
                        <div className="flex justify-between items-start mb-1.5 md:mb-2">
                          <span className="text-[8px] md:text-[9px] font-black uppercase text-primary tracking-wider truncate">{req.website_name}</span>
                          <span className={`text-[7px] md:text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter shrink-0 ${
                            req.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                            req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                            'bg-surface-variant text-on-surface-variant'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-[11px] md:text-xs text-on-surface font-medium line-clamp-2 mb-2 md:mb-3">{req.details}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] md:text-[9px] font-bold text-on-surface-variant opacity-60">
                            {new Date(req.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {siteRequests.length > 5 && (
                  <button className="w-full mt-4 py-2 bg-surface border border-outline-variant text-[8px] md:text-[9px] font-black text-on-surface-variant uppercase tracking-widest rounded-lg hover:bg-surface-container-highest transition-all">
                    View History
                  </button>
                )}
              </div>

              {/* Help Box */}
              <div className="p-5 md:p-6 bg-primary/5 rounded-2xl md:rounded-3xl border border-primary/10">
                <h4 className="font-black text-on-surface text-[11px] md:text-xs mb-1.5">Need help?</h4>
                <p className="text-[9px] md:text-[10px] text-on-surface-variant font-medium leading-relaxed mb-3">
                  For complex requests, contact our support team directly.
                </p>
                <Link to="/contact" className="inline-flex items-center gap-1.5 text-primary text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:gap-2 transition-all">
                  Contact Support <ExternalLink size={10} className="md:size-[12px]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RequestChanges;
