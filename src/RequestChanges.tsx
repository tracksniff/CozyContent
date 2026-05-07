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
    <div className="min-h-screen bg-surface flex">
      <Sidebar />
      
      <main className="flex-grow lg:ml-64 p-6 md:p-12 mt-16 lg:mt-0 transition-all duration-500">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold text-sm mb-6 transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </Link>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight mb-2">Request Changes</h1>
                <p className="text-on-surface-variant font-medium text-lg">Tell us what you'd like to update on your website.</p>
              </div>
              
              {user && !user.is_staff && (
                <div className="flex items-center gap-3 bg-surface-container-high px-6 py-4 rounded-[2rem] border border-outline-variant shadow-sm">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Available Updates</div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-on-surface">
                        {(user.monthly_requests_remaining || 0) + (user.purchased_requests_remaining || 0)}
                      </span>
                      {user.priority_updates_active && <Zap size={14} className="text-yellow-500 fill-yellow-500" />}
                    </div>
                  </div>
                  <Link to="/add-ons" className="ml-4 p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                    <CheckCircle size={20} />
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form Section */}
            <div className="lg:col-span-3">
              <div className="bg-surface-container-low p-8 md:p-10 rounded-[3rem] border border-outline-variant shadow-sm">
                <form className="space-y-8" onSubmit={handleEditRequest}>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4 ml-1">Select Website</label>
                    <select
                      name="website"
                      required
                      className="w-full px-6 py-4 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
                    >
                      {websites.map(site => (
                        <option key={site.id} value={site.id}>{site.name}</option>
                      ))}
                      {websites.length === 0 && <option value="">No websites available</option>}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4 ml-1">Edit Details</label>
                    <textarea
                      name="details"
                      required
                      rows={6}
                      placeholder="Be as specific as possible. E.g., 'Change the header color to blue' or 'Update the contact number'..."
                      className="w-full px-6 py-5 bg-surface border border-outline-variant rounded-[2rem] focus:border-primary outline-none transition-all font-medium text-sm resize-none h-48"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      disabled={isSubmitting || websites.length === 0}
                      className="w-full py-5 bg-primary text-white font-black rounded-2xl hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Submit Edit Request <CheckCircle size={20} /></>
                      )}
                    </button>
                    <p className="mt-4 text-center text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                      Typical turnaround: 24-48 hours
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar/Recent Requests */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-surface-container-high p-8 rounded-[2.5rem] border border-outline-variant">
                <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-on-surface-variant mb-6 ml-1">
                  <Clock size={14} /> Recent Requests
                </h3>
                
                <div className="space-y-4">
                  {siteRequests.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mx-auto mb-4 text-on-surface-variant opacity-20">
                        <CheckCircle size={24} />
                      </div>
                      <p className="text-sm font-bold text-on-surface-variant">No requests yet.</p>
                    </div>
                  ) : (
                    siteRequests.map(req => (
                      <div key={req.id} className="p-5 bg-surface rounded-2xl border border-outline-variant hover:border-primary/30 transition-all group">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-black uppercase text-primary tracking-wider">{req.website_name}</span>
                          <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-tighter ${
                            req.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                            req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                            'bg-surface-variant text-on-surface-variant'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-sm text-on-surface font-medium line-clamp-3 mb-4">{req.details}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-on-surface-variant opacity-60">
                            {new Date(req.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {siteRequests.length > 5 && (
                  <button className="w-full mt-6 py-3 bg-surface border border-outline-variant text-[10px] font-black text-on-surface-variant uppercase tracking-widest rounded-xl hover:bg-surface-container-highest transition-all">
                    View All History
                  </button>
                )}
              </div>

              {/* Help Box */}
              <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10">
                <h4 className="font-black text-on-surface text-sm mb-2">Need help?</h4>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed mb-4">
                  If you have a complex request or need to upload files, you can also contact our support team directly.
                </p>
                <Link to="/contact" className="inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest hover:gap-3 transition-all">
                  Contact Support <ExternalLink size={12} />
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
