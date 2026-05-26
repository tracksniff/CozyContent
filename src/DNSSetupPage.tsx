import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Settings,
  Copy,
  Check,
  Info,
  ArrowRight,
  ShoppingCart,
  ChevronLeft,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";

const DNSSetupPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [customDomain, setCustomDomain] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [dnsStatus, setDnsStatus] = useState<"idle" | "ready" | "pending" | "error">("idle");
  const [copied, setCopied] = useState(false);
  const serverIp = "128.140.103.20";

  const fetchSite = async () => {
    if (!token || !id) return;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/websites/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSite(response.data);
      setCustomDomain(response.data.custom_domain || "");
      if (response.data.dns_ready) setDnsStatus("ready");
    } catch (err) {
      toast.error("Failed to load website details.");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchSite();
    }
  }, [id, token, authLoading]);

  const handleCopy = () => {
    navigator.clipboard.writeText(serverIp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("IP Address copied!");
  };

  const handleUpdateDomain = async () => {
    if (!customDomain) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/websites/${id}/update_custom_domain/`,
        { custom_domain: customDomain },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Domain updated!");
      fetchSite();
    } catch (err) {
      toast.error("Failed to update domain.");
    }
  };

  const handleCheckDNS = async () => {
    if (!site?.custom_domain && !customDomain) {
      toast.error("Please save your domain first.");
      return;
    }
    setIsChecking(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/websites/${id}/check_dns/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.is_ready) {
        setDnsStatus("ready");
        toast.success("DNS is correctly configured!");
      } else {
        setDnsStatus("pending");
        toast.error("DNS is not ready yet. It may take some time to propagate.");
      }
    } catch (err) {
      setDnsStatus("error");
      toast.error("Failed to check DNS.");
    } finally {
      setIsChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center transition-colors duration-300">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex transition-colors duration-300">
      <Sidebar />

      <main className="flex-grow lg:ml-64 transition-all duration-500 mt-16 lg:mt-0">
        {/* ── Sticky top bar ── */}
        <div className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/15 px-6 md:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 hover:bg-surface-container-high rounded-lg transition-all text-on-surface-variant hover:text-primary"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-black text-on-surface tracking-tight">
              DNS Configuration
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${dnsStatus === "ready" ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"}`}>
               {dnsStatus === "ready" ? <ShieldCheck size={12} /> : <Info size={12} />}
               <span className="text-[10px] font-black uppercase tracking-widest">{dnsStatus === "ready" ? "Connected" : "Setup Required"}</span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
          {/* ── Header Area ── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-1">
               Step-by-step setup
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-on-surface tracking-tighter">
              Connect <span className="text-primary italic">Domain.</span>
            </h1>
            <p className="text-sm text-on-surface-variant font-medium mt-1">
              Pointing <span className="font-bold text-on-surface">{site.name}</span> to our
              hosting servers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Instructions */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1 */}
              <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface-container-low rounded-2xl border border-outline-variant/30 p-6 md:p-8 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shadow-lg shadow-primary/20">
                    1
                  </div>
                  <h3 className="text-lg font-black text-on-surface uppercase tracking-tight">
                    Get Your Server IP
                  </h3>
                </div>
                <p className="text-sm text-on-surface-variant font-medium mb-6 leading-relaxed">
                  First, copy our server's public IP address. You will need this to create the A
                  Record in your domain provider's settings.
                </p>
                <div className="bg-white dark:bg-surface border border-outline-variant rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 group">
                  <div className="text-center sm:text-left">
                    <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-1">
                      Target IP Address
                    </div>
                    <div className="text-2xl font-black font-mono tracking-tighter text-primary">
                      {serverIp}
                    </div>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="w-full sm:w-auto px-6 py-3.5 bg-on-surface text-surface rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2.5"
                  >
                    {copied ? (
                      <>
                        <Check size={14} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy IP
                      </>
                    )}
                  </button>
                </div>
              </motion.section>

              {/* Step 2 */}
              <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-surface-container-low rounded-2xl border border-outline-variant/30 p-6 md:p-8 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shadow-lg shadow-primary/20">
                    2
                  </div>
                  <h3 className="text-lg font-black text-on-surface uppercase tracking-tight">
                    Add DNS Records
                  </h3>
                </div>
                <p className="text-sm text-on-surface-variant font-medium mb-6 leading-relaxed">
                  Log in to your domain registrar (like Namecheap, GoDaddy, or Cloudflare) and add
                  the following <span className="text-on-surface font-bold">A Record</span>:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-separate border-spacing-y-2">
                    <thead>
                      <tr>
                        <th className="text-left px-4 py-2 text-[9px] font-black uppercase tracking-widest text-on-surface-variant">
                          Type
                        </th>
                        <th className="text-left px-4 py-2 text-[9px] font-black uppercase tracking-widest text-on-surface-variant">
                          Name / Host
                        </th>
                        <th className="text-left px-4 py-2 text-[9px] font-black uppercase tracking-widest text-on-surface-variant">
                          Value / Points To
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white dark:bg-surface">
                        <td className="px-4 py-4 rounded-l-xl font-black text-primary border-y border-l border-outline-variant/20">
                          A
                        </td>
                        <td className="px-4 py-4 font-mono font-bold border-y border-outline-variant/20">
                          @
                        </td>
                        <td className="px-4 py-4 rounded-r-xl font-mono font-bold text-on-surface border-y border-r border-outline-variant/20">
                          {serverIp}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                  <Info size={16} className="text-yellow-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-medium text-on-surface-variant leading-relaxed">
                    Note: If you use <span className="font-bold">Cloudflare</span>, ensure the Proxy
                    status is set to <span className="font-bold italic">"DNS Only" (Grey Cloud)</span>{" "}
                    to pass the verification.
                  </p>
                </div>
              </motion.section>

              {/* Step 3 */}
              <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-surface-container-low rounded-2xl border border-outline-variant/30 p-6 md:p-8 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shadow-lg shadow-primary/20">
                    3
                  </div>
                  <h3 className="text-lg font-black text-on-surface uppercase tracking-tight">
                    Enter Your Domain
                  </h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="e.g. mybusiness.com"
                    className="flex-grow bg-white dark:bg-surface border border-outline-variant/40 rounded-xl px-5 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-sm"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                  />
                  <button
                    onClick={handleUpdateDomain}
                    className="px-8 py-3.5 bg-on-surface text-surface rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary active:scale-95 transition-all shadow-lg shadow-black/10 whitespace-nowrap"
                  >
                    Save Domain
                  </button>
                </div>
              </motion.section>
            </div>

            {/* Right Column: Status & Affiliate */}
            <div className="space-y-8">
              {/* Status Check Card */}
              <section className="bg-surface-container-low rounded-2xl border border-outline-variant/30 p-6 md:p-8 shadow-sm flex flex-col items-center text-center">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-6">
                  Live Verification
                </h3>

                <div
                  className={`w-20 h-24 rounded-2xl flex items-center justify-center mb-6 shadow-2xl transition-all duration-500 ${
                    dnsStatus === "ready"
                      ? "bg-green-500 text-white shadow-green-500/30"
                      : isChecking
                        ? "bg-primary/10 text-primary animate-pulse"
                        : "bg-surface-variant text-on-surface-variant"
                  }`}
                >
                  {dnsStatus === "ready" ? (
                    <ShieldCheck size={40} strokeWidth={2.5} />
                  ) : isChecking ? (
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Settings size={36} className="animate-spin-slow" />
                  )}
                </div>

                <div className="mb-8">
                  <h4 className="text-base font-black text-on-surface mb-2 font-headline">
                    {dnsStatus === "ready" ? "Domain Connected!" : "Awaiting Connection"}
                  </h4>
                  <p className="text-[11px] font-medium text-on-surface-variant leading-relaxed">
                    {dnsStatus === "ready"
                      ? "Your DNS is correctly configured and your site is ready for deployment."
                      : "Once you've updated your DNS records, click verify. Propagation can take up to 48 hours."}
                  </p>
                </div>

                <button
                  onClick={handleCheckDNS}
                  disabled={isChecking || dnsStatus === "ready"}
                  className={`w-full py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg ${
                    dnsStatus === "ready"
                      ? "bg-green-500/10 text-green-600 border border-green-500/20 cursor-default"
                      : "bg-primary text-white hover:scale-105 active:scale-95 shadow-primary/20"
                  }`}
                >
                  {isChecking ? "Verifying..." : "Verify DNS Status"}
                </button>
              </section>

              {/* Affiliate Card */}
              <section className="bg-surface-container-low rounded-2xl border border-outline-variant/30 p-6 md:p-8 shadow-sm overflow-hidden relative group">
                <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <ShoppingCart size={80} />
                </div>
                <h3 className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-4">
                  No Domain Yet?
                </h3>
                <p className="text-xs font-bold text-on-surface mb-6 leading-snug">
                  Get a professional domain for your business at Namecheap.
                </p>
                <a
                  href="https://namecheap.pxf.io/c/7336842/386170/5618"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-white dark:bg-surface border border-outline-variant/40 rounded-xl hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500/10 text-orange-600 rounded-lg flex items-center justify-center">
                      <ShoppingCart size={14} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-on-surface uppercase tracking-tight">
                        Buy Domain
                      </div>
                      <div className="text-[8px] font-bold text-on-surface-variant uppercase">Namecheap</div>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-on-surface-variant group-hover:translate-x-1 transition-transform"
                  />
                </a>
              </section>

              <div className="pt-2">
                <button
                  onClick={() => window.open(site.url, '_blank')}
                  className="w-full py-3.5 border border-outline-variant/30 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 text-on-surface-variant hover:text-on-surface"
                >
                  View Preview Site <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DNSSetupPage;
