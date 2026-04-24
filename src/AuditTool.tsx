import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ArrowRight, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface AuditResult {
  overall_score: number;
  scores: {
    design: number;
    mobile_ux: number;
    lead_conversion: number;
    seo_basics: number;
    trust_signals: number;
  };
  findings: Array<{ type: string, text: string }>;
  quick_wins: Array<{ type: string, text: string }>;
  summary: string;
}

const AuditTool: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business_name: '',
    website_url: '',
    industry: '',
    location: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/audits/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to generate audit');

      const data = await response.json();
      setResult(data.report_data);
      toast.success('Audit complete!');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-surface rounded-[3rem] p-8 md:p-12 border border-outline-variant/30 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
              <div>
                <h2 className="text-3xl font-black mb-2">{formData.business_name} Audit Report</h2>
                <p className="text-on-surface-variant font-medium">We've sent a detailed PDF copy to <strong>{formData.email}</strong></p>
              </div>
              <div className="relative flex-shrink-0">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64" cy="64" r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-outline-variant/20"
                  />
                  <motion.circle
                    cx="64" cy="64" r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364.4}
                    initial={{ strokeDashoffset: 364.4 }}
                    animate={{ strokeDashoffset: 364.4 - (364.4 * result.overall_score) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-primary"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black leading-none">{result.overall_score}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Score</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
              {Object.entries(result.scores).map(([key, score], idx) => (
                <div key={idx} className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 text-center">
                  <div className="text-xl font-black mb-1">{score}/20</div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant leading-tight">
                    {key.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-4">
                <h3 className="text-lg font-black flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" /> Critical Findings
                </h3>
                <div className="space-y-3">
                  {result.findings.map((f, i) => (
                    <div key={i} className="flex gap-3 text-sm font-medium text-on-surface-variant bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                      {f.text}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-black flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" /> Quick Wins
                </h3>
                <div className="space-y-3">
                  {result.quick_wins.map((w, i) => (
                    <div key={i} className="flex gap-3 text-sm font-medium text-on-surface-variant bg-green-500/5 p-3 rounded-xl border border-green-500/10">
                      {w.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/20 text-center">
              <h3 className="text-2xl font-black mb-4">We can fix this in 7 days.</h3>
              <p className="text-on-surface-variant font-medium mb-8 max-w-xl mx-auto">
                We'll rebuild your site into a modern, high-converting lead machine with zero upfront cost on our monthly plan.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/signup" className="bg-primary text-white px-8 py-4 rounded-xl font-black hover:scale-105 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2">
                  Get My New Website <ArrowRight className="w-5 h-5" />
                </Link>
                <button onClick={() => setResult(null)} className="text-on-surface font-bold px-8 py-4 hover:bg-surface-container-high rounded-xl transition-all">
                  Run Another Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-surface rounded-[3rem] p-8 md:p-16 border border-outline-variant/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20"
            >
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Free Growth Audit</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Is your website losing you leads?</h2>
            <p className="text-on-surface-variant font-medium max-w-xl mx-auto leading-relaxed">
              Get an instant AI-powered audit of your website's design, SEO, and conversion potential.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-2">Your Name</label>
              <input
                required
                type="text"
                placeholder="John Doe"
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-2">Email Address</label>
              <input
                required
                type="email"
                placeholder="john@example.com"
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-2">Business Name</label>
              <input
                required
                type="text"
                placeholder="ABC Plumbing"
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-2">Website URL</label>
              <input
                required
                type="url"
                placeholder="https://example.com"
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-2">Industry</label>
              <select
                required
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium appearance-none"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              >
                <option value="">Select Industry</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Construction">Construction</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Beauty/Salon">Beauty/Salon</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-2">Location (City)</label>
              <input
                required
                type="text"
                placeholder="London, UK"
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            
            <button
              disabled={loading}
              type="submit"
              className="md:col-span-2 mt-4 bg-primary text-white py-5 rounded-2xl font-black text-lg hover:shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> Analyzing Website...
                </>
              ) : (
                <>
                  Generate My Free Audit <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </form>
          
          <p className="mt-8 text-center text-xs text-on-surface-variant font-bold uppercase tracking-widest opacity-60">
            No credit card required. Instant results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuditTool;
