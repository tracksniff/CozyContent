import React, { useState } from 'react';
import { Settings, Copy, Check, Info, ArrowRight, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

interface DNSModalProps {
  site: any;
  onClose: () => void;
  onUpdate: () => void;
}

const DNSModal: React.FC<DNSModalProps> = ({ site, onClose, onUpdate }) => {
  const { token } = useAuth();
  const [customDomain, setCustomDomain] = useState(site.custom_domain || '');
  const [isChecking, setIsChecking] = useState(false);
  const [dnsStatus, setDnsStatus] = useState<'idle' | 'ready' | 'pending' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const serverIp = "128.140.103.20";

  const handleCopy = () => {
    navigator.clipboard.writeText(serverIp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("IP Address copied!");
  };

  const handleUpdateDomain = async () => {
    if (!customDomain) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/websites/${site.id}/update_custom_domain/`, {
        custom_domain: customDomain
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Domain updated!");
      onUpdate();
    } catch (err) {
      toast.error("Failed to update domain.");
    }
  };

  const handleCheckDNS = async () => {
    if (!site.custom_domain && !customDomain) {
        toast.error("Please save your domain first.");
        return;
    }
    setIsChecking(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/websites/${site.id}/check_dns/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.is_ready) {
        setDnsStatus('ready');
        toast.success("DNS is correctly configured!");
      } else {
        setDnsStatus('pending');
        toast.error("DNS is not ready yet. It may take some time to propagate.");
      }
    } catch (err) {
      setDnsStatus('error');
      toast.error("Failed to check DNS.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-surface w-full max-w-2xl rounded-[2.5rem] border border-outline-variant shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Left Side: Instructions */}
        <div className="flex-grow p-6 md:p-10 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Settings size={20} />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-on-surface tracking-tight">Setup DNS Routing</h2>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-3">Step 1: Get Your IP</h3>
              <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 flex items-center justify-between group">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Server IP Address</div>
                  <div className="text-lg font-black font-mono tracking-tight">{serverIp}</div>
                </div>
                <button 
                  onClick={handleCopy}
                  className="p-3 bg-surface border border-outline-variant rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-3">Step 2: Add DNS Records</h3>
              <p className="text-sm font-medium text-on-surface-variant leading-relaxed mb-4">
                Login to your domain provider (GoDaddy, Namecheap, etc.) and add an <span className="text-on-surface font-bold">A Record</span>:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm font-medium text-on-surface-variant">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black shrink-0 mt-0.5">1</div>
                    <span>Set Host/Name to <code className="bg-surface-variant px-1.5 py-0.5 rounded text-on-surface">@</code></span>
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-on-surface-variant">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black shrink-0 mt-0.5">2</div>
                    <span>Set Value/Points to <code className="bg-surface-variant px-1.5 py-0.5 rounded text-on-surface">{serverIp}</code></span>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-3">Step 3: Enter Your Domain</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="example.com"
                  className="flex-grow bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-sm font-medium"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                />
                <button 
                  onClick={handleUpdateDomain}
                  className="bg-on-surface text-surface px-6 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all"
                >
                  Save
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Right Side: Actions & Status */}
        <div className="w-full md:w-72 bg-surface-container-low border-t md:border-t-0 md:border-l border-outline-variant p-6 md:p-8 flex flex-col justify-between">
          <div>
             <div className="mb-8">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">Status Check</h3>
               <div className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center text-center transition-all ${
                 dnsStatus === 'ready' ? 'border-green-500/30 bg-green-500/5' : 
                 dnsStatus === 'pending' ? 'border-yellow-500/30 bg-yellow-500/5' :
                 'border-outline-variant'
               }`}>
                 {dnsStatus === 'ready' ? (
                   <>
                     <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mb-3 shadow-lg shadow-green-500/20">
                        <Check size={20} strokeWidth={3} />
                     </div>
                     <div className="text-sm font-black text-green-600 uppercase tracking-tight">Connected</div>
                   </>
                 ) : (
                   <>
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${isChecking ? 'bg-primary/20 text-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
                        {isChecking ? <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <Info size={20} />}
                     </div>
                     <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-4">
                        {dnsStatus === 'pending' ? 'Propagation in Progress' : 'Not Connected Yet'}
                     </div>
                     <button 
                       onClick={handleCheckDNS}
                       disabled={isChecking}
                       className="w-full py-2.5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
                     >
                       Verify DNS
                     </button>
                   </>
                 )}
               </div>
             </div>

             <div className="pt-6 border-t border-outline-variant">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">No Domain?</h3>
                <a 
                  href="https://namecheap.pxf.io/c/5950882/1301211/15832" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-white dark:bg-surface border border-outline-variant rounded-2xl hover:border-primary transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500/10 text-orange-600 rounded-lg flex items-center justify-center">
                       <ShoppingCart size={14} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-on-surface">Buy Domain</div>
                      <div className="text-[8px] font-bold text-on-surface-variant">at Namecheap</div>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                </a>
             </div>
          </div>

          <button 
            onClick={onClose}
            className="mt-8 w-full py-3 border border-outline-variant rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-surface-variant transition-all"
          >
            Close Setup
          </button>
        </div>
      </div>
    </div>
  );
};

export default DNSModal;
