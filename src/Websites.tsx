import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe,
  Search,
  ExternalLink,
  Trash2,
  UserPlus,
  Edit3,
  Settings,
  LayoutGrid,
  List,
  Calendar,
} from "lucide-react";
import axios from "axios";
import DNSModal from "./DNSModal";
import toast from "react-hot-toast";

const PlanBadge = ({ type }: { type: string }) => {
  const isPlatform = type === "PLATFORM";
  return (
    <span
      className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
        isPlatform
          ? "bg-primary/10 text-primary border-primary/20"
          : "bg-surface-container text-on-surface-variant border-outline-variant/40"
      }`}
    >
      {type}
    </span>
  );
};

const Websites: React.FC = () => {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSiteForDNS, setSelectedSiteForDNS] = useState<any | null>(null);
  const { token, user, loading: authLoading } = useAuth();

  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchWebsites = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/websites/`, {
        headers: authHeader,
      });
      setWebsites(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchWebsites();
  }, [token, authLoading]);

  const handleTransfer = async (siteId: number) => {
    if (!user?.is_staff) return;
    const newOwnerId = prompt("Enter the New Owner ID:");
    if (!newOwnerId) return;
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/websites/${siteId}/`,
        { owner_id: parseInt(newOwnerId) },
        { headers: authHeader },
      );
      toast.success("Ownership transferred.");
      fetchWebsites();
    } catch {
      toast.error("Failed to transfer ownership.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this website?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/websites/${id}/`, {
        headers: authHeader,
      });
      toast.success("Website deleted.");
      fetchWebsites();
    } catch {
      toast.error("Failed to delete website.");
    }
  };

  const isMonthlyUser =
    user?.is_staff || ["monthly", "annual", "priority_monthly"].includes(user?.plan_type || "");

  const filteredWebsites = websites.filter(
    (site) =>
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (site.owner_email && site.owner_email.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const showDNS = (site: any) =>
    site.hosting_type === "PLATFORM" &&
    ["monthly", "annual", "priority_monthly"].includes(site.plan_type) &&
    isMonthlyUser;

  return (
    <div className="min-h-screen bg-surface flex transition-colors duration-300">
      <Sidebar />

      <main className="flex-grow lg:ml-64 transition-all duration-500 mt-16 lg:mt-0">
        {/* Sticky top bar */}
        <div className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/15 px-6 md:px-10 h-14 flex items-center justify-between">
          <div>
            <span className="text-sm font-black text-on-surface tracking-tight">Websites</span>
            {!loading && (
              <span className="ml-2 text-[10px] font-black text-on-surface-variant/50">
                {filteredWebsites.length} site{filteredWebsites.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                size={13}
              />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary outline-none text-sm transition-all w-40 focus:w-56"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex bg-surface-container-low border border-outline-variant/30 rounded-xl p-1">
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

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-black text-on-surface tracking-tighter">
              {user?.is_staff ? "All Websites" : "Your"}{" "}
              <span className="text-primary italic">Websites.</span>
            </h1>
            <p className="text-sm text-on-surface-variant font-medium mt-1">
              {user?.is_staff
                ? "Manage all hosted platform assets."
                : "Manage and configure your hosted assets."}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredWebsites.length === 0 ? (
            <div className="bg-surface-container-low border-2 border-dashed border-outline-variant/30 rounded-2xl py-24 text-center">
              <Globe className="mx-auto text-on-surface-variant/20 mb-3" size={36} />
              <p className="text-sm font-bold text-on-surface-variant">No websites found</p>
              {searchQuery && (
                <p className="text-xs text-on-surface-variant/50 mt-1">Try a different search</p>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredWebsites.map((site, i) => (
                <motion.div
                  key={site.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-surface-container-low rounded-2xl border border-outline-variant/30 p-5 flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                >
                  {/* Top */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white dark:bg-surface rounded-xl border border-outline-variant/20 flex items-center justify-center text-primary shadow-sm group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                        <Globe size={18} />
                      </div>
                      <PlanBadge type={site.hosting_type} />
                    </div>
                    <button
                      onClick={() => handleDelete(site.id)}
                      className="p-1.5 rounded-lg text-on-surface-variant hover:bg-red-500/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="flex-grow">
                    <h3 className="text-sm font-black text-on-surface group-hover:text-primary transition-colors truncate mb-0.5">
                      {site.name}
                    </h3>
                    <p className="text-[11px] text-on-surface-variant font-medium truncate mb-4">
                      {site.url}
                    </p>

                    {/* Owner */}
                    <div className="bg-white dark:bg-surface rounded-xl border border-outline-variant/20 p-3 mb-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-1">
                        Owner
                      </p>
                      <p className="text-xs font-bold text-on-surface truncate">
                        {site.owner_email}
                      </p>
                      {user?.is_staff && (
                        <button
                          onClick={() => handleTransfer(site.id)}
                          className="mt-2 w-full py-1.5 bg-surface-container-high border border-outline-variant rounded-lg text-[9px] font-black uppercase tracking-widest text-on-surface-variant hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-1.5"
                        >
                          <UserPlus size={11} /> Transfer Ownership
                        </button>
                      )}
                    </div>

                    {/* Date */}
                    {site.created_at && (
                      <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant/50 font-medium mb-3">
                        <Calendar size={10} />
                        {new Date(site.created_at).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    )}
                  </div>

                  {/* Footer actions */}
                  <div className="pt-4 border-t border-outline-variant/15 space-y-2">
                    <div className="flex items-center justify-between">
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:gap-2.5 transition-all"
                      >
                        Visit Site <ExternalLink size={11} />
                      </a>
                    </div>

                    {showDNS(site) && (
                      <button
                        onClick={() => setSelectedSiteForDNS(site)}
                        className="w-full py-2 bg-primary/5 border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-1.5"
                      >
                        <Settings size={11} /> Setup DNS
                      </button>
                    )}

                    {isMonthlyUser && (
                      <button
                        onClick={() => navigate("/request-changes")}
                        className="w-full py-2 bg-surface-container border border-outline-variant/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-1.5"
                      >
                        <Edit3 size={11} /> Request Update
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* List view */
            <div className="space-y-2">
              {filteredWebsites.map((site, i) => (
                <motion.div
                  key={site.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-surface-container-low rounded-xl border border-outline-variant/30 px-5 py-4 flex items-center gap-4 hover:border-primary/20 transition-all group"
                >
                  <div className="w-9 h-9 bg-white dark:bg-surface rounded-xl border border-outline-variant/20 flex items-center justify-center text-primary shadow-sm shrink-0">
                    <Globe size={16} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-black text-on-surface truncate group-hover:text-primary transition-colors">
                        {site.name}
                      </p>
                      <PlanBadge type={site.hosting_type} />
                    </div>
                    <p className="text-[11px] text-on-surface-variant font-medium truncate">
                      {site.url}
                    </p>
                  </div>
                  {user?.is_staff && (
                    <p className="text-[11px] text-on-surface-variant/50 font-medium hidden md:block truncate max-w-[180px]">
                      {site.owner_email}
                    </p>
                  )}
                  {site.created_at && (
                    <p className="text-[10px] text-on-surface-variant/40 font-medium hidden lg:block shrink-0">
                      {new Date(site.created_at).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  )}
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-all"
                      title="Visit site"
                    >
                      <ExternalLink size={14} />
                    </a>
                    {showDNS(site) && (
                      <button
                        onClick={() => setSelectedSiteForDNS(site)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all"
                        title="Setup DNS"
                      >
                        <Settings size={14} />
                      </button>
                    )}
                    {isMonthlyUser && (
                      <button
                        onClick={() => navigate("/request-changes")}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
                        title="Request Update"
                      >
                        <Edit3 size={14} />
                      </button>
                    )}
                    {user?.is_staff && (
                      <button
                        onClick={() => handleTransfer(site.id)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
                        title="Transfer Ownership"
                      >
                        <UserPlus size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(site.id)}
                      className="p-1.5 rounded-lg text-on-surface-variant hover:bg-red-500/10 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedSiteForDNS && (
        <DNSModal
          site={selectedSiteForDNS}
          onClose={() => setSelectedSiteForDNS(null)}
          onUpdate={fetchWebsites}
        />
      )}
    </div>
  );
};

export default Websites;
