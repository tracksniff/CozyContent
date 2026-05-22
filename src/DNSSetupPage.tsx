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
  Globe,
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
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex transition-colors duration-300">
      <Sidebar />
      <main className="flex-grow lg:ml-64 p-4 md:p-8 lg:p-12 transition-all duration-500 mt-16 lg:mt-0">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-bold group w-fit"
              >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-on-surface tracking-tighter mb-2">
                  Connect <span className="text-primary italic">Domain.</span>
                </h1>
                <p className="text-on-surface-variant font-medium text-sm md:text-lg">
                  Pointing <span className="font-bold text-on-surface">{site.name}</span> to our
                  hosting servers.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-low border border-outline-variant/30 rounded-[1.5rem] px-6 py-4 flex items-center gap-4 shadow-xl shadow-black/5">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Globe size={24} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                  Current Status
                </div>
                <div
                  className={`text-sm font-black uppercase flex items-center gap-2 ${dnsStatus === "ready" ? "text-green-600" : "text-yellow-600"}`}
                >
                  {dnsStatus === "ready" ? (
                    <>
                      <ShieldCheck size={16} /> Connected
                    </>
                  ) : (
                    <>
                      <Info size={16} /> Setup Required
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Instructions */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1 */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface-container-low rounded-[2rem] border border-outline-variant/30 p-8 shadow-xl shadow-black/5"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20">
                    1
                  </div>
                  <h3 className="text-xl font-black text-on-surface uppercase tracking-tight">
                    Get Your Server IP
                  </h3>
                </div>
                <p className="text-on-surface-variant font-medium mb-6 leading-relaxed">
                  First, copy our server's public IP address. You will need this to create the A
                  Record in your domain provider's settings.
                </p>
                <div className="bg-white dark:bg-surface border border-outline-variant rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 group">
                  <div className="text-center sm:text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">
                      Target IP Address
                    </div>
                    <div className="text-3xl font-black font-mono tracking-tighter text-primary">
                      {serverIp}
                    </div>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="w-full sm:w-auto px-8 py-4 bg-on-surface text-surface rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3"
                  >
                    {copied ? (
                      <>
                        <Check size={18} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={18} /> Copy IP
                      </>
                    )}
                  </button>
                </div>
              </motion.section>

              {/* Step 2 */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-surface-container-low rounded-[2rem] border border-outline-variant/30 p-8 shadow-xl shadow-black/5"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20">
                    2
                  </div>
                  <h3 className="text-xl font-black text-on-surface uppercase tracking-tight">
                    Add DNS Records
                  </h3>
                </div>
                <p className="text-on-surface-variant font-medium mb-6 leading-relaxed">
                  Log in to your domain registrar (like Namecheap, GoDaddy, or Cloudflare) and add
                  the following <span className="text-on-surface font-bold">A Record</span>:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-separate border-spacing-y-2">
                    <thead>
                      <tr>
                        <th className="text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                          Type
                        </th>
                        <th className="text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                          Name / Host
                        </th>
                        <th className="text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                          Value / Points To
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white dark:bg-surface border border-outline-variant">
                        <td className="px-4 py-4 rounded-l-xl font-black text-primary border-y border-l border-outline-variant/30">
                          A
                        </td>
                        <td className="px-4 py-4 font-mono font-bold border-y border-outline-variant/30">
                          @
                        </td>
                        <td className="px-4 py-4 rounded-r-xl font-mono font-bold text-on-surface border-y border-r border-outline-variant/30">
                          {serverIp}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 flex items-start gap-4 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                  <Info size={20} className="text-yellow-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-on-surface-variant leading-relaxed">
                    Note: If you use <span className="font-bold">Cloudflare</span>, ensure the Proxy
                    status is set to <span className="font-bold italic">"DNS Only" (Grey Cloud)</span>{" "}
                    to pass the verification.
                  </p>
                </div>
              </motion.section>

              {/* Step 3 */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-surface-container-low rounded-[2rem] border border-outline-variant/30 p-8 shadow-xl shadow-black/5"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20">
                    3
                  </div>
                  <h3 className="text-xl font-black text-on-surface uppercase tracking-tight">
                    Enter Your Domain
                  </h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="e.g. mybusiness.com"
                    className="flex-grow bg-white dark:bg-surface border border-outline-variant rounded-xl px-6 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                  />
                  <button
                    onClick={handleUpdateDomain}
                    className="px-10 py-4 bg-on-surface text-surface rounded-xl font-black text-sm uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-black/10 whitespace-nowrap"
                  >
                    Save Domain
                  </button>
                </div>
              </motion.section>
            </div>

            {/* Right Column: Status & Affiliate */}
            <div className="space-y-8">
              {/* Status Check Card */}
              <section className="bg-surface-container-low rounded-[2rem] border border-outline-variant/30 p-8 shadow-xl shadow-black/5 flex flex-col items-center text-center">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-6">
                  Live Verification
                </h3>

                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-2xl transition-all duration-500 ${
                    dnsStatus === "ready"
                      ? "bg-green-500 text-white shadow-green-500/30 rotate-0"
                      : isChecking
                        ? "bg-primary/10 text-primary animate-pulse"
                        : "bg-surface-variant text-on-surface-variant"
                  }`}
                >
                  {dnsStatus === "ready" ? (
                    <ShieldCheck size={48} strokeWidth={2.5} />
                  ) : isChecking ? (
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Settings size={40} className="animate-spin-slow" />
                  )}
                </div>

                <div className="mb-8">
                  <h4 className="text-lg font-black text-on-surface mb-2">
                    {dnsStatus === "ready" ? "Domain Connected!" : "Awaiting Connection"}
                  </h4>
                  <p className="text-xs font-medium text-on-surface-variant leading-relaxed">
                    {dnsStatus === "ready"
                      ? "Your DNS is correctly configured and your site is ready for deployment."
                      : "Once you've updated your DNS records, click verify. Note that changes can take up to 48 hours to spread globally."}
                  </p>
                </div>

                <button
                  onClick={handleCheckDNS}
                  disabled={isChecking || dnsStatus === "ready"}
                  className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${
                    dnsStatus === "ready"
                      ? "bg-green-500/10 text-green-600 border border-green-500/20 cursor-default"
                      : "bg-primary text-white hover:scale-105 active:scale-95 shadow-primary/20"
                  }`}
                >
                  {isChecking ? "Verifying..." : "Verify DNS Status"}
                </button>
              </section>

              {/* Affiliate Card */}
              <section className="bg-surface-container-low rounded-[2rem] border border-outline-variant/30 p-8 shadow-xl shadow-black/5 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                  <ShoppingCart size={80} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">
                  No Domain Yet?
                </h3>
                <p className="text-sm font-bold text-on-surface mb-6 leading-snug">
                  Get a professional domain for your business at Namecheap.
                </p>
                <a
                  href="https://namecheap.pxf.io/c/5950882/1301211/15832"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-5 bg-white dark:bg-surface border border-outline-variant rounded-2xl hover:border-primary hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-500/10 text-orange-600 rounded-xl flex items-center justify-center">
                      <ShoppingCart size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-on-surface uppercase tracking-tight">
                        Buy Domain
                      </div>
                      <div className="text-[10px] font-bold text-on-surface-variant">Namecheap.com</div>
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-on-surface-variant group-hover:translate-x-1 transition-transform"
                  />
                </a>
              </section>

              <div className="pt-4">
                <button
                  onClick={() => navigate(site.url)}
                  className="w-full py-4 border border-outline-variant/30 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-surface-variant transition-all flex items-center justify-center gap-2"
                >
                  View Preview Site <ExternalLink size={14} />
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
