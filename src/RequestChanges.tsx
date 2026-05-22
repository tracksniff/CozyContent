import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CheckCircle,
  Zap,
  Clock,
  ExternalLink,
  Send,
  X,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Sidebar from './Sidebar';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:     { label: 'Pending',     color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  in_progress: { label: 'In Progress', color: 'bg-primary/10 text-primary border-primary/20' },
  completed:   { label: 'Completed',   color: 'bg-green-500/10 text-green-600 border-green-500/20' },
  rejected:    { label: 'Rejected',    color: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = statusConfig[status] || { label: status, color: 'bg-surface-container text-on-surface-variant border-outline-variant' };
  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};

const RequestChanges: React.FC = () => {
  const [websites, setWebsites] = useState<any[]>([]);
  const [siteRequests, setSiteRequests] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingRequest, setIsProcessingRequest] = useState<Record<number, boolean>>({});
  const [details, setDetails] = useState('');
  const [selectedWebsite, setSelectedWebsite] = useState('');
  const [expandedReq, setExpandedReq] = useState<number | null>(null);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const authHeader = { Authorization: `Bearer ${token}` };
  const totalUpdates = (user?.monthly_requests_remaining || 0) + (user?.purchased_requests_remaining || 0);

  const fetchSiteRequests = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/site-requests/`, { headers: authHeader });
      setSiteRequests(res.data);
    } catch { console.error('Failed to fetch requests'); }
  };

  useEffect(() => {
    if (!token) return;
    axios.get(`${import.meta.env.VITE_API_URL}/api/websites/`, { headers: authHeader }).then(res => {
      // Filter for monthly/annual sites only
      const monthlySites = res.data.filter((site: any) => 
        ['monthly', 'annual', 'priority_monthly'].includes(site.plan_type)
      );
      setWebsites(monthlySites);
      if (monthlySites.length > 0) setSelectedWebsite(monthlySites[0].id.toString());
    });
    fetchSiteRequests();
  }, [token]);

  const handleApproveRequest = async (requestId: number) => {
    if (!token) return;
    setIsProcessingRequest(p => ({ ...p, [requestId]: true }));
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/site-requests/${requestId}/approve/`, {}, { headers: authHeader });
      toast.success('Request approved!');
      fetchSiteRequests();
    } catch { toast.error('Failed to approve request.'); }
    finally { setIsProcessingRequest(p => ({ ...p, [requestId]: false })); }
  };

  const handleRejectRequest = async (requestId: number) => {
    if (!token) return;
    setIsProcessingRequest(p => ({ ...p, [requestId]: true }));
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/site-requests/${requestId}/reject/`, {}, { headers: authHeader });
      toast.success('Request rejected.');
      fetchSiteRequests();
    } catch { toast.error('Failed to reject request.'); }
    finally { setIsProcessingRequest(p => ({ ...p, [requestId]: false })); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedWebsite || !details.trim()) return;

    if (!user.is_staff && totalUpdates <= 0) {
      toast.error('No updates remaining. Purchase an update pack to continue.');
      navigate('/add-ons');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/site-requests/`, { website: selectedWebsite, details }, { headers: authHeader });
      toast.success("Request submitted! We'll get back to you within 24–48 hours.");
      setDetails('');
      fetchSiteRequests();
    } catch { toast.error('Failed to send request.'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-surface flex transition-colors duration-300">
      <Sidebar />

      <main className="flex-grow lg:ml-64 transition-all duration-500 mt-16 lg:mt-0">

        {/* Sticky top bar */}
        <div className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/15 px-6 md:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
              ← Dashboard
            </Link>
            <span className="text-outline-variant/40">/</span>
            <span className="text-sm font-black text-on-surface">Request Changes</span>
          </div>
          {user && !user.is_staff && (
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black ${totalUpdates > 0 ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-red-500/5 border-red-500/20 text-red-500'}`}>
                {totalUpdates > 0
                  ? <><CheckCircle size={12} /> {totalUpdates} update{totalUpdates !== 1 ? 's' : ''} left</>
                  : <><AlertCircle size={12} /> No updates left</>
                }
                {user.priority_updates_active && <Zap size={11} className="text-yellow-500 fill-yellow-500" />}
              </div>
              {totalUpdates === 0 && (
                <Link to="/add-ons" className="text-[10px] font-black uppercase tracking-widest text-primary hover:brightness-125 transition-all">
                  Get More +
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="p-6 md:p-10 max-w-5xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-on-surface tracking-tighter">
              Request <span className="text-primary italic">Changes.</span>
            </h1>
            <p className="text-sm text-on-surface-variant font-medium mt-1">Tell us what you'd like updated on your website.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* ── Form ── */}
            <motion.div className="lg:col-span-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 p-6 md:p-8">
                <h2 className="text-sm font-black text-on-surface uppercase tracking-widest mb-6">New Request</h2>

                {/* No updates warning */}
                {user && !user.is_staff && totalUpdates <= 0 && (
                  <div className="mb-6 bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-black text-on-surface">No updates remaining</p>
                      <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                        You've used all your available updates.{' '}
                        <Link to="/add-ons" className="text-primary font-black hover:brightness-125">Get more →</Link>
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Website select */}
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Select Website</label>
                    <div className="relative">
                      <select
                        value={selectedWebsite}
                        onChange={e => setSelectedWebsite(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white dark:bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold text-sm appearance-none cursor-pointer pr-10"
                      >
                        {websites.map(site => (
                          <option key={site.id} value={site.id}>{site.name}</option>
                        ))}
                        {websites.length === 0 && <option value="">No websites available</option>}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Change Details</label>
                    <textarea
                      value={details}
                      onChange={e => setDetails(e.target.value)}
                      required
                      rows={6}
                      placeholder="Be specific — e.g. 'Change the header background to dark green and update the phone number to +44 7700 000000'"
                      className="w-full px-4 py-3 bg-white dark:bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-medium text-sm resize-none"
                    />
                    <p className="mt-1.5 text-[10px] font-medium text-on-surface-variant/60 text-right">{details.length} chars</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || websites.length === 0 || (!user?.is_staff && totalUpdates <= 0)}
                    className="w-full py-3.5 bg-primary text-white font-black rounded-xl hover:shadow-xl hover:shadow-primary/25 transition-all active:scale-[0.99] disabled:opacity-40 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                  >
                    {isSubmitting
                      ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><Send size={14} /> Submit Request</>
                    }
                  </button>

                  <p className="text-center text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                    Typical turnaround: 24–48 hours
                  </p>
                </form>
              </div>
            </motion.div>

            {/* ── Right panel ── */}
            <motion.div className="lg:col-span-2 space-y-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>

              {/* Recent requests */}
              <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 p-6">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2 mb-5">
                  <Clock size={12} /> Request History
                </h3>

                {siteRequests.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle size={18} className="text-on-surface-variant/20" />
                    </div>
                    <p className="text-xs font-bold text-on-surface-variant">No requests yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {siteRequests.map(req => (
                      <div key={req.id} className="bg-white dark:bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
                        {/* Header row */}
                        <div
                          className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-surface-container/40 transition-colors"
                          onClick={() => setExpandedReq(expandedReq === req.id ? null : req.id)}
                        >
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-xs font-black text-on-surface truncate">{req.website_name}</p>
                            </div>
                            <p className="text-[10px] text-on-surface-variant font-medium">
                              {new Date(req.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            <StatusBadge status={req.status} />
                            <ChevronDown size={12} className={`text-on-surface-variant transition-transform ${expandedReq === req.id ? 'rotate-180' : ''}`} />
                          </div>
                        </div>

                        {/* Expandable details */}
                        <AnimatePresence>
                          {expandedReq === req.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.18 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 border-t border-outline-variant/15">
                                <p className="text-xs text-on-surface-variant font-medium leading-relaxed pt-3 whitespace-pre-wrap">{req.details}</p>

                                {/* Admin actions */}
                                {user?.is_staff && req.status === 'pending' && (
                                  <div className="flex gap-2 mt-3">
                                    <button
                                      onClick={() => handleApproveRequest(req.id)}
                                      disabled={isProcessingRequest[req.id]}
                                      className="flex-1 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
                                    >
                                      {isProcessingRequest[req.id] ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle size={11} /> Approve</>}
                                    </button>
                                    <button
                                      onClick={() => handleRejectRequest(req.id)}
                                      disabled={isProcessingRequest[req.id]}
                                      className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all disabled:opacity-40"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Help box */}
              <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5">
                <h4 className="text-sm font-black text-on-surface mb-1">Need help?</h4>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed mb-3">
                  For complex requests, our support team is happy to assist.
                </p>
                <Link to="/contact" className="inline-flex items-center gap-1.5 text-primary text-[10px] font-black uppercase tracking-widest hover:gap-2.5 transition-all">
                  Contact Support <ExternalLink size={11} />
                </Link>
              </div>

              {/* Turnaround info */}
              <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-3">What to expect</h4>
                <div className="space-y-2">
                  {[
                    ['Acknowledgement', 'Within 1 hour'],
                    ['Work begins', 'Within 24 hours'],
                    ['Completion', '24–48 hours'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-on-surface-variant font-medium">{label}</span>
                      <span className="text-[10px] font-black text-on-surface">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RequestChanges;
