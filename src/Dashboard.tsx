import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Trash2,
  ExternalLink,
  Globe,
  Search,
  Sparkles,
  Cpu,
  Zap,
  Star,
  Clock,
  CheckCircle2,
  Upload,
  MessageSquare,
  Send,
  Edit3,
  Settings,
  ChevronRight,
  AlertCircle,
  LayoutGrid,
  List,
  RefreshCw,
  Bell,
  X,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
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
  "Fine-tuning the User Experience...",
];

const TIMELINE_STEPS = [
  { label: "Project Confirmed", target: 0, desc: "Details received, build started." },
  { label: "Design & Build", target: 20, desc: "Your website is being created." },
  { label: "Quality Check", target: 60, desc: "Testing speed, mobile & UX." },
  { label: "Final Review", target: 80, desc: "Ready for your approval & tweaks." },
  { label: "Live!", target: 100, desc: "Your site is live for customers." },
];

/* ─── Reusable sub-components ─────────────────────────────────── */

const SectionHeading = ({
  title,
  badge,
  accent = "primary",
}: {
  title: string;
  badge?: number;
  accent?: string;
}) => (
  <div className="flex items-center gap-3 mb-6">
    <div className={`h-5 w-1 rounded-full bg-${accent}`} />
    <h2 className="text-lg font-black text-on-surface tracking-tight uppercase">{title}</h2>
    {badge !== undefined && badge > 0 && (
      <span
        className={`bg-${accent}/10 text-${accent} border border-${accent}/20 text-[10px] font-black px-2 py-0.5 rounded-full`}
      >
        {badge}
      </span>
    )}
  </div>
);

const StatCard = ({
  label,
  value,
  icon: Icon,
  highlight = false,
}: {
  label: string;
  value: number;
  icon: any;
  highlight?: boolean;
}) => (
  <div
    className={`rounded-2xl p-4 sm:p-5 border transition-all ${highlight && value > 0 ? "bg-primary/5 border-primary/30" : "bg-surface-container-low border-outline-variant/30"}`}
  >
    <div className="flex items-center justify-between mb-2 sm:mb-3">
      <Icon
        size={14}
        className={highlight && value > 0 ? "text-primary" : "text-on-surface-variant"}
      />
      <span
        className={`text-xl sm:text-2xl font-black tabular-nums ${highlight && value > 0 ? "text-primary" : "text-on-surface"}`}
      >
        {value}
      </span>
    </div>
    <p className="text-[10px] sm:text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
      {label}
    </p>
  </div>
);

interface SiteCardProps {
  site: any;
  user: any;
  isRedeploying: Record<number, boolean>;
  onDelete: (id: number) => void;
  onRedeploy: (id: number) => void;
  onDNS: () => void;
  onRequestUpdate: () => void;
}

const SiteCard: React.FC<SiteCardProps> = ({
  site,
  user,
  isRedeploying,
  onDelete,
  onRedeploy,
  onDNS,
  onRequestUpdate,
}) => {
  const showDNS =
    site.hosting_type === "PLATFORM" &&
    ["monthly", "annual", "priority_monthly"].includes(site.plan_type) &&
    (user?.is_staff || user?.plan_type?.includes("monthly"));
  const showUpdate =
    user?.is_staff || ["monthly", "annual", "priority_monthly"].includes(site.plan_type);

  return (
    <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 p-4 sm:p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all group flex flex-col">
      {/* Top row */}
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 bg-white dark:bg-surface rounded-xl border border-outline-variant/20 flex items-center justify-center text-primary shadow-sm group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
          <Globe size={18} />
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {user?.is_staff && (
            <button
              onClick={() => onRedeploy(site.id)}
              disabled={isRedeploying[site.id]}
              title="Redeploy to Vercel"
              className="p-1.5 rounded-lg text-on-surface-variant hover:bg-secondary/10 hover:text-secondary transition-all disabled:opacity-40"
            >
              <Zap size={14} className={isRedeploying[site.id] ? "animate-pulse" : ""} />
            </button>
          )}
          <button
            onClick={() => onDelete(site.id)}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-red-500/10 hover:text-red-500 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex-grow min-w-0">
        <h3 className="text-sm font-black text-on-surface group-hover:text-primary transition-colors truncate mb-0.5">
          {site.name}
        </h3>
        {user?.is_staff && site.owner_email && (
          <p className="text-[11px] text-on-surface-variant/50 font-medium truncate mb-0.5">
            {site.owner_email}
          </p>
        )}
        <p className="text-[11px] text-on-surface-variant truncate font-medium">{site.url}</p>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-outline-variant/15 flex items-center justify-between">
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:gap-2.5 transition-all"
        >
          View Live <ExternalLink size={11} />
        </a>
        <div className="flex items-center gap-1">
          {showDNS && (
            <button
              onClick={onDNS}
              title="Setup DNS"
              className="p-1.5 rounded-lg text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all"
            >
              <Settings size={14} />
            </button>
          )}
          {showUpdate && (
            <button
              onClick={onRequestUpdate}
              title="Request Update"
              className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
            >
              <Edit3 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SiteListRow: React.FC<SiteCardProps> = ({
  site,
  user,
  isRedeploying,
  onDelete,
  onRedeploy,
  onDNS,
  onRequestUpdate,
}) => {
  const showDNS =
    site.hosting_type === "PLATFORM" &&
    ["monthly", "annual", "priority_monthly"].includes(site.plan_type) &&
    (user?.is_staff || user?.plan_type?.includes("monthly"));
  const showUpdate =
    user?.is_staff || ["monthly", "annual", "priority_monthly"].includes(site.plan_type);

  return (
    <div className="bg-surface-container-low rounded-xl border border-outline-variant/30 px-3.5 py-3 sm:px-5 sm:py-3.5 flex items-center gap-3 sm:gap-4 hover:border-primary/20 transition-all group">
      <div className="w-8 h-8 bg-white dark:bg-surface rounded-lg border border-outline-variant/20 flex items-center justify-center text-primary shadow-sm shrink-0">
        <Globe size={14} />
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-sm font-black text-on-surface truncate group-hover:text-primary transition-colors">
          {site.name}
        </p>
        <p className="text-[11px] text-on-surface-variant font-medium truncate">{site.url}</p>
      </div>
      {user?.is_staff && site.owner_email && (
        <p className="text-[11px] text-on-surface-variant/50 font-medium hidden md:block truncate max-w-[160px]">
          {site.owner_email}
        </p>
      )}
      <div className="flex items-center gap-1 shrink-0">
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-all"
          title="View live"
        >
          <ExternalLink size={14} />
        </a>
        {showDNS && (
          <button
            onClick={onDNS}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all"
            title="DNS Setup"
          >
            <Settings size={14} />
          </button>
        )}
        {showUpdate && (
          <button
            onClick={onRequestUpdate}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
            title="Request Update"
          >
            <Edit3 size={14} />
          </button>
        )}
        {user?.is_staff && (
          <button
            onClick={() => onRedeploy(site.id)}
            disabled={isRedeploying[site.id]}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-secondary/10 hover:text-secondary transition-all disabled:opacity-40"
            title="Redeploy"
          >
            <Zap size={14} className={isRedeploying[site.id] ? "animate-pulse" : ""} />
          </button>
        )}
        <button
          onClick={() => onDelete(site.id)}
          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-red-500/10 hover:text-red-500 transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

/* ─── Main Dashboard ───────────────────────────────────────────── */

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [siteRequests, setSiteRequests] = useState<any[]>([]);
  const [fetchingWebsites, setFetchingWebsites] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isRedeploying, setIsRedeploying] = useState<Record<number, boolean>>({});
  const [isProcessingRequest, setIsProcessingRequest] = useState<Record<number, boolean>>({});
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const [githubUsernames, setGithubUsernames] = useState<Record<number, string>>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedRequest, setExpandedRequest] = useState<number | null>(null);
  const [selectedSiteId, setSelectedSiteId] = useState<number | "all">(-1);

  const { token, user, loading: authLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (websites.length > 0 && selectedSiteId === -1) {
      setSelectedSiteId(websites[0].id);
    }
  }, [websites]);

  /* ── API helpers ── */
  const authHeader = { Authorization: `Bearer ${token}` };

  const handleApproveRequest = async (requestId: number) => {
    if (!token) return;
    setIsProcessingRequest((p) => ({ ...p, [requestId]: true }));
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/site-requests/${requestId}/approve/`,
        {},
        { headers: authHeader },
      );
      toast.success("Request approved and notification sent!");
      fetchData();
    } catch {
      toast.error("Failed to approve request.");
    } finally {
      setIsProcessingRequest((p) => ({ ...p, [requestId]: false }));
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    if (!token) return;
    const reason = prompt('Please enter a reason for rejection:');
    if (reason === null) return;

    setIsProcessingRequest((p) => ({ ...p, [requestId]: true }));
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/site-requests/${requestId}/reject/`,
        { reason },
        { headers: authHeader },
      );
      toast.success("Request rejected.");
      fetchData();
    } catch {
      toast.error("Failed to reject request.");
    } finally {
      setIsProcessingRequest((p) => ({ ...p, [requestId]: false }));
    }
  };

  const handleCompleteRequest = async (requestId: number) => {
    if (!token) return;
    setIsProcessingRequest((p) => ({ ...p, [requestId]: true }));
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/site-requests/${requestId}/complete/`,
        {},
        { headers: authHeader },
      );
      toast.success("Request marked as completed and user notified!");
      fetchData();
    } catch {
      toast.error("Failed to complete request.");
    } finally {
      setIsProcessingRequest((p) => ({ ...p, [requestId]: false }));
    }
  };

  const handleRedeployVercel = async (websiteId: number) => {
    if (!token) return;
    setIsRedeploying((p) => ({ ...p, [websiteId]: true }));
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/websites/${websiteId}/redeploy_vercel/`,
        {},
        { headers: authHeader },
      );
      toast.success("Vercel redeployment triggered!");
      if (res.data.url) window.open(res.data.url, "_blank");
      fetchData();
    } catch {
      toast.error("Vercel redeployment failed.");
    } finally {
      setIsRedeploying((p) => ({ ...p, [websiteId]: false }));
    }
  };

  const handleSubmitGithub = async (applicationId: number) => {
    if (!githubUsernames[applicationId] || !token) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/applications/${applicationId}/submit_github_username/`,
        { github_username: githubUsernames[applicationId] },
        { headers: authHeader },
      );
      toast.success("GitHub username submitted!");
      fetchData();
    } catch {
      toast.error("Failed to submit GitHub username.");
    }
  };

  const handleFileUpload = async (
    applicationId: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/applications/${applicationId}/add_attachment/`,
        formData,
        { headers: { ...authHeader, "Content-Type": "multipart/form-data" } },
      );
      toast.success("File uploaded successfully!");
      fetchData();
    } catch {
      toast.error("Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitFeedback = async (applicationId: number) => {
    if (!feedback[applicationId] || !token) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/applications/${applicationId}/add_feedback/`,
        { section_name: "General / 80% Review", comment: feedback[applicationId] },
        { headers: authHeader },
      );
      toast.success("Feedback submitted!");
      setFeedback((f) => ({ ...f, [applicationId]: "" }));
      fetchData();
    } catch {
      toast.error("Failed to submit feedback.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this website?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/websites/${id}/`, {
        headers: authHeader,
      });
      fetchData();
      toast.success("Website deleted.");
    } catch {
      toast.error("Failed to delete website.");
    }
  };

  const fetchData = async () => {
    if (!token) return;
    try {
      const [sitesRes, appsRes, requestsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/websites/`, { headers: authHeader }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/applications/`, { headers: authHeader }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/site-requests/`, { headers: authHeader }),
      ]);
      setWebsites(sitesRes.data);
      setApplications(appsRes.data);
      setSiteRequests(requestsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingWebsites(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [token, authLoading]);

  useEffect(() => {
    const id = setInterval(() => setCurrentMessageIndex((p) => (p + 1) % funMessages.length), 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("success") === "true" && !params.get("new_user")) {
      toast.success("Payment successful! Your subscription has been updated.", {
        duration: 5000,
        icon: "💳",
      });
      window.history.replaceState({}, "", location.pathname);
    }
  }, [location]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ── Derived state ── */
  const processingApps = applications.filter((a) => a.status === "processing");
  const pendingRequests = siteRequests.filter((r) => r.status === "pending");
  const inProgressRequests = siteRequests.filter((r) => r.status === "in_progress");

  // Filter logic based on selected site (for non-staff)
  const isStaff = user?.is_staff;
    
  // Better application filtering for non-staff
  const visibleApplications = !isStaff && selectedSiteId !== "all"
    ? applications.filter(a => {
        const matchingSite = websites.find(s => s.id === selectedSiteId);
        return a.company_name === matchingSite?.name;
      })
    : applications;

  // DNS setup sites: always check all sites for the dashboard banner
  const allDnsSetupSites = websites.filter(
    (s) =>
      s.hosting_type === "PLATFORM" &&
      !s.dns_ready &&
      ["monthly", "annual", "priority_monthly"].includes(s.plan_type),
  );

  const filteredWebsites = websites.filter(

    (s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.owner_email && s.owner_email.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesSiteFilter = isStaff || selectedSiteId === "all" || s.id === selectedSiteId;
      
      return matchesSearch && matchesSiteFilter;
    }
  );
  const displayName = user?.first_name || (user?.email ? user.email.split("@")[0] : "User");

  return (
    <div className="min-h-screen bg-surface flex transition-colors duration-300">
      <Sidebar />

      <main className="flex-grow lg:ml-64 transition-all duration-500 mt-16 lg:mt-0">
        {/* ── Sticky top bar ── */}
        <div className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/15 px-6 md:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-black text-on-surface tracking-tight">
              {user?.is_staff ? "Admin Console" : "Dashboard"}
            </span>
            {user?.is_staff && (
              <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                Staff
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {user?.is_staff && pendingRequests.length > 0 && (
              <div className="relative">
                <div className="w-8 h-8 bg-surface-container-low border border-outline-variant/30 rounded-xl flex items-center justify-center">
                  <Bell size={14} className="text-on-surface-variant" />
                </div>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {pendingRequests.length}
                </span>
              </div>
            )}
            <button
              onClick={fetchData}
              className="w-8 h-8 bg-surface-container-low border border-outline-variant/30 rounded-xl flex items-center justify-center hover:border-primary/40 transition-all group"
            >
              <RefreshCw
                size={13}
                className="text-on-surface-variant group-hover:text-primary transition-colors"
              />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto space-y-8 sm:space-y-10">
          {/* ── Header Area ── */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-on-surface tracking-tighter">
                {user?.is_staff ? (
                  <>
                    Good to see you, <span className="text-primary italic">Admin.</span>
                  </>
                ) : (
                  <>
                    Welcome back, <span className="text-primary italic">{displayName}.</span>
                  </>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-1">
                {user?.is_staff
                  ? `${websites.length} sites · ${pendingRequests.length} pending · ${inProgressRequests.length} active`
                  : `You are viewing details for your selected site portfolio.`}
              </p>
            </motion.div>

            {/* Site Selector Dropdown */}
            {!isStaff && websites.length > 1 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-1.5 w-full lg:w-auto lg:min-w-[240px]"
              >
                <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">
                  Select Website
                </label>
                <div className="relative group">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" size={14} />
                  <select 
                    value={selectedSiteId}
                    onChange={(e) => setSelectedSiteId(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                    className="w-full pl-10 pr-9 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl appearance-none font-bold text-xs sm:text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none cursor-pointer group-hover:border-primary/50"
                  >
                    <option value="all">All Websites</option>
                    {websites.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant group-hover:text-primary transition-colors">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Admin stat cards ── */}
          {user?.is_staff && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
            >
              <StatCard label="Total Sites" value={websites.length} icon={Globe} />
              <StatCard label="Pending" value={pendingRequests.length} icon={Bell} highlight />
              <StatCard label="In Progress" value={inProgressRequests.length} icon={TrendingUp} />
              <StatCard label="Building" value={processingApps.length} icon={Sparkles} />
            </motion.div>
          )}

          {/* ── Build progress banner ── */}
          <AnimatePresence>
            {processingApps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-surface-container-low rounded-2xl border border-primary/20 p-6 md:p-8 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Spinner */}
                  <div className="shrink-0 relative w-14 h-14">
                    <div className="absolute inset-0 border-[3px] border-primary/20 rounded-full" />
                    <div className="absolute inset-0 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles size={18} className="text-primary" />
                    </div>
                  </div>
                  <div className="flex-grow w-full text-center sm:text-left">
                    <h2 className="text-lg font-black text-on-surface tracking-tight mb-0.5">
                      Your website is <span className="text-primary italic">coming to life!</span>
                    </h2>
                    <p className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant flex items-center justify-center sm:justify-start gap-1.5 mb-4">
                      <Cpu size={11} className="text-primary animate-pulse" />
                      {funMessages[currentMessageIndex]}
                    </p>
                    <div className="w-full max-w-sm mx-auto sm:mx-0">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                          Build Progress
                        </span>
                        <span className="text-xs font-black text-on-surface">
                          {processingApps[0].progress}%
                        </span>
                      </div>
                      <div className="w-full bg-outline-variant/20 h-2 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          style={{ boxShadow: "0 0 10px rgba(0,105,109,0.4)" }}
                          initial={{ width: 0 }}
                          animate={{ width: `${processingApps[0].progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Admin: Pending requests ── */}
          {user?.is_staff && pendingRequests.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <SectionHeading
                title="Pending Requests"
                badge={pendingRequests.length}
                accent="secondary"
              />
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <RequestCard
                    key={req.id}
                    req={req}
                    expandedRequest={expandedRequest}
                    setExpandedRequest={setExpandedRequest}
                    primaryAction={
                      <button
                        onClick={() => handleApproveRequest(req.id)}
                        disabled={isProcessingRequest[req.id]}
                        className="bg-primary text-white px-4 py-2 rounded-xl font-black text-xs hover:scale-105 transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 disabled:opacity-60"
                      >
                        {isProcessingRequest[req.id] ? (
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 size={13} /> Approve
                          </>
                        )}
                      </button>
                    }
                    secondaryAction={
                      <button
                        onClick={() => handleRejectRequest(req.id)}
                        disabled={isProcessingRequest[req.id]}
                        className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all disabled:opacity-40"
                        title="Reject"
                      >
                        <X size={15} />
                      </button>
                    }
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* ── Admin: In-progress requests ── */}
          {user?.is_staff && inProgressRequests.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <SectionHeading
                title="In Progress"
                badge={inProgressRequests.length}
                accent="primary"
              />
              <div className="space-y-3">
                {inProgressRequests.map((req) => (
                  <RequestCard
                    key={req.id}
                    req={req}
                    expandedRequest={expandedRequest}
                    setExpandedRequest={setExpandedRequest}
                    primaryAction={
                      <button
                        onClick={() => handleCompleteRequest(req.id)}
                        disabled={isProcessingRequest[req.id]}
                        className="bg-green-600 text-white px-4 py-2 rounded-xl font-black text-xs hover:scale-105 transition-all shadow-md shadow-green-600/20 flex items-center gap-1.5 disabled:opacity-60"
                      >
                        {isProcessingRequest[req.id] ? (
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 size={13} /> Mark Done
                          </>
                        )}
                      </button>
                    }
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* ── DNS setup alert (customers) ── */}
          {!user?.is_staff && allDnsSetupSites.length > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <AlertCircle size={16} className="text-primary" />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-black text-on-surface">Domain setup required</p>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                  {allDnsSetupSites.length === 1
                    ? `"${allDnsSetupSites[0].name}" is ready but needs a domain to go live.`
                    : `${allDnsSetupSites.length} sites need domain configuration to go live.`}
                </p>
              </div>
              <button
                onClick={() => navigate(`/dns-setup/${allDnsSetupSites[0].id}`)}
                className="bg-primary text-white px-5 py-2.5 rounded-xl font-black text-xs hover:scale-105 transition-all shadow-lg shadow-primary/20 whitespace-nowrap flex items-center gap-2 shrink-0"
              >
                <Settings size={13} /> Configure DNS
              </button>
            </div>
          )}

          {/* ── Project timeline (customers) ── */}
          {!user?.is_staff &&
            visibleApplications.map((app) => (
              <motion.section
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <SectionHeading title={app.company_name} />
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                  {/* Timeline */}
                  <div className="lg:col-span-2 bg-surface-container-low rounded-2xl border border-outline-variant/30 p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-sm font-black text-on-surface flex items-center gap-2">
                        <Clock size={15} className="text-primary" /> Timeline
                      </h3>
                      <span className="text-[10px] font-black text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                        {app.progress}% done
                      </span>
                    </div>
                    <div className="space-y-1">
                      {TIMELINE_STEPS.map((step, idx) => {
                        const isDone = app.progress >= step.target;
                        const isCurrent =
                          isDone &&
                          (idx === TIMELINE_STEPS.length - 1 ||
                            app.progress < TIMELINE_STEPS[idx + 1].target);
                        return (
                          <div
                            key={idx}
                            className={`flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all ${isCurrent ? "bg-primary/5 border border-primary/15" : ""}`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2 transition-all ${isDone ? "bg-primary border-primary text-white" : "border-outline-variant/40"}`}
                            >
                              {isDone && <CheckCircle2 size={11} />}
                            </div>
                            <div>
                              <p
                                className={`text-xs font-black ${isCurrent ? "text-primary" : isDone ? "text-on-surface" : "text-on-surface-variant/40"}`}
                              >
                                {step.label}
                              </p>
                              <p
                                className={`text-[11px] font-medium leading-snug ${isDone ? "text-on-surface-variant" : "text-on-surface-variant/30"}`}
                              >
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right panel */}
                  <div className="lg:col-span-3 space-y-4">
                    {/* GitHub transfer */}
                    {app.plan_type === "one_time" &&
                      app.progress >= 80 &&
                      !app.github_username_for_transfer && (
                        <div className="bg-on-surface dark:bg-surface-container-high rounded-2xl p-6">
                          <p className="text-[10px] font-black uppercase tracking-widest text-surface/50 dark:text-on-surface-variant mb-1">
                            Code Ready
                          </p>
                          <h3 className="text-base font-black text-surface dark:text-on-surface mb-4">
                            Enter your GitHub username to receive your code
                          </h3>
                          <div className="flex gap-2">
                            <input
                              className="flex-grow bg-surface border border-outline-variant rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-all text-sm text-on-surface"
                              placeholder="e.g. johndoe"
                              value={githubUsernames[app.id] || ""}
                              onChange={(e) =>
                                setGithubUsernames((g) => ({ ...g, [app.id]: e.target.value }))
                              }
                            />
                            <button
                              onClick={() => handleSubmitGithub(app.id)}
                              className="bg-primary text-white px-5 py-2.5 rounded-xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20"
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      )}

                    {/* Feedback - Only for monthly/annual sites per user request */}
                    {app.plan_type !== "one_time" && (
                      <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 p-6">
                        <h3 className="text-sm font-black text-on-surface mb-4 flex items-center gap-2">
                          <MessageSquare size={15} className="text-primary" /> Feedback & Files
                        </h3>
                        <div className="relative mb-3">
                          <textarea
                            className="w-full p-4 bg-white dark:bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none text-sm min-h-[96px] font-medium transition-all resize-none"
                            placeholder="Describe what you'd like changed..."
                            value={feedback[app.id] || ""}
                            onChange={(e) => setFeedback((f) => ({ ...f, [app.id]: e.target.value }))}
                          />
                          <button
                            onClick={() => handleSubmitFeedback(app.id)}
                            disabled={!feedback[app.id]}
                            className="absolute bottom-3 right-3 p-2 bg-primary text-white rounded-lg disabled:opacity-30 hover:scale-105 transition-all shadow-md"
                          >
                            <Send size={13} />
                          </button>
                        </div>
                        <label className="cursor-pointer block">
                          <div className="w-full py-3 px-4 border border-dashed border-outline-variant rounded-xl hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 text-xs font-black text-on-surface-variant">
                            {isUploading ? (
                              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Upload size={13} /> Upload Assets
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileUpload(app.id, e)}
                          />
                        </label>
                      </div>
                    )}

                    {/* Review CTA */}
                    {app.progress >= 80 && (
                      <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-black text-on-surface">
                            Loving the experience?
                          </p>
                          <p className="text-xs text-on-surface-variant font-medium">
                            A Google review helps us a lot!
                          </p>
                        </div>
                        <a
                          href="https://g.page/r/CcL50VdU9y65EAE/review"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-black text-xs hover:scale-105 transition-all shadow-lg shadow-primary/20"
                        >
                          <Star size={13} fill="currentColor" /> Review Us
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.section>
            ))}

          {/* ── Websites section ── */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <SectionHeading title={user?.is_staff ? "All Websites" : "Your Portfolio"} />
              <div className="flex items-center gap-2 mb-6">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                    size={13}
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-9 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary outline-none text-sm transition-all w-44 focus:w-60"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex bg-surface-container-low border border-outline-variant/30 rounded-xl p-1 shrink-0">
                  {(["grid", "list"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`p-1.5 rounded-lg transition-all ${viewMode === mode ? "bg-primary text-white" : "text-on-surface-variant hover:text-on-surface"}`}
                    >
                      {mode === "grid" ? <LayoutGrid size={13} /> : <List size={13} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {fetchingWebsites ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredWebsites.length === 0 ? (
              <div className="bg-surface-container-low border-2 border-dashed border-outline-variant/30 rounded-2xl py-20 text-center">
                <Globe className="mx-auto text-on-surface-variant/20 mb-3" size={36} />
                <p className="text-sm font-bold text-on-surface-variant">No websites found</p>
                {searchQuery && (
                  <p className="text-xs text-on-surface-variant/50 mt-1">
                    Try a different search term
                  </p>
                )}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWebsites.map((site, i) => (
                  <motion.div
                    key={site.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <SiteCard
                      site={site}
                      user={user}
                      isRedeploying={isRedeploying}
                      onDelete={handleDelete}
                      onRedeploy={handleRedeployVercel}
                      onDNS={() => navigate(`/dns-setup/${site.id}`)}
                      onRequestUpdate={() => navigate("/request-changes")}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredWebsites.map((site, i) => (
                  <motion.div
                    key={site.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <SiteListRow
                      site={site}
                      user={user}
                      isRedeploying={isRedeploying}
                      onDelete={handleDelete}
                      onRedeploy={handleRedeployVercel}
                      onDNS={() => navigate(`/dns-setup/${site.id}`)}
                      onRequestUpdate={() => navigate("/request-changes")}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        </div>
      </main>
    </div>
  );
};

/* ─── RequestCard ──────────────────────────────────────────────── */

interface RequestCardProps {
  req: any;
  expandedRequest: number | null;
  setExpandedRequest: (id: number | null) => void;
  primaryAction: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

const RequestCard: React.FC<RequestCardProps> = ({
  req,
  expandedRequest,
  setExpandedRequest,
  primaryAction,
  secondaryAction,
}) => {
  const isExpanded = expandedRequest === req.id;
  return (
    <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 overflow-hidden">
      <div
        className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 cursor-pointer hover:bg-surface-container/40 transition-colors"
        onClick={() => setExpandedRequest(isExpanded ? null : req.id)}
      >
        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
          <Globe size={15} className="text-primary" />
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-black text-on-surface truncate">{req.user_email}</span>
            {req.is_priority && (
              <span className="bg-yellow-500/10 text-yellow-600 text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1 shrink-0">
                <Zap size={8} fill="currentColor" /> Priority
              </span>
            )}
          </div>
          <p className="text-[10px] sm:text-[11px] text-on-surface-variant font-medium truncate">
            {req.website_name}
          </p>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          {primaryAction}
          {secondaryAction}
        </div>
        <ChevronRight
          size={14}
          className={`text-on-surface-variant transition-transform shrink-0 ${isExpanded ? "rotate-90" : ""}`}
        />
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-outline-variant/15">
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed pt-4 whitespace-pre-wrap">
                {req.details}
              </p>
              {req.status === 'denied' && req.rejection_reason && (
                <div className="mt-4 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">Reason for rejection</p>
                  <p className="text-sm text-on-surface-variant font-medium">{req.rejection_reason}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
