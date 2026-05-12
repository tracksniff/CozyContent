import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AuditTool from "./AuditTool";
import type { AuditResult } from "./AuditTool";
import { motion, AnimatePresence } from "framer-motion";
import { auditContent } from "./auditContent";
import { Check, ArrowDown, BarChart3, Zap, Search, ShieldCheck, Smartphone, Accessibility } from "lucide-react";

interface AuditPageProps {
  title?: string;
  industry?: string;
  description?: string;
}

const checks = [
  { icon: Zap, label: "Page Speed" },
  { icon: Search, label: "SEO Health" },
  { icon: Smartphone, label: "Mobile Experience" },
  { icon: ShieldCheck, label: "Security & HTTPS" },
  { icon: Accessibility, label: "Accessibility" },
  { icon: BarChart3, label: "Conversion Rate" },
];

const AuditPage: React.FC<AuditPageProps> = ({ title, industry, description }) => {
  const [result, setResult] = useState<AuditResult | null>(null);
  const content = industry ? auditContent[industry] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (industry) localStorage.setItem("audit_industry", industry);
    if (title) document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && description) {
      metaDescription.setAttribute("content", description);
    } else if (description) {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.getElementsByTagName("head")[0].appendChild(meta);
    }
  }, [industry, title, description]);

  const scrollToAudit = () => {
    document.getElementById("audit-tool")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/20 selection:text-primary transition-colors duration-300">
      <Navbar />

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {!result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-24"
              >
                {/* Hero */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-surface-container-low border border-outline-variant/30 shadow-sm">
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                      Free · No signup required · Instant results
                    </span>
                  </div>

                  <h1 className="text-4xl md:text-7xl font-black text-on-surface tracking-tighter leading-[0.95] mb-6">
                    {content?.heroTitle ? (
                      content.heroTitle
                    ) : (
                      <>
                        Your website is <br />
                        <span className="text-primary italic">losing you money.</span>
                      </>
                    )}
                  </h1>

                  <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto font-medium leading-relaxed mb-10">
                    {content?.heroSubtitle ||
                      "Paste your URL and get a detailed breakdown of every issue costing you traffic, leads, and revenue."}
                  </p>

                  <button 
                    onClick={scrollToAudit}
                    className="group bg-on-surface text-surface px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:gap-6 transition-all shadow-3xl flex items-center gap-4 mx-auto hover:scale-105 active:scale-95"
                  >
                    Run my free audit <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                  </button>
                </motion.div>

                {/* Stats row */}
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {[
                    { val: "94%", label: "of first impressions are design-related" },
                    { val: "3s", label: "before visitors abandon a slow-loading page" },
                    { val: "68%", label: "of online experiences begin with search" }
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 text-center shadow-xl shadow-black/5 hover:shadow-2xl hover:-translate-y-1 transition-all"
                    >
                      <div className="text-5xl font-black text-primary mb-2 tracking-tighter">{stat.val}</div>
                      <p className="text-sm text-on-surface-variant font-bold uppercase tracking-wider leading-snug px-4">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* What we check grid */}
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-black text-on-surface tracking-tight mb-4">Standard with Every Audit</h2>
                    <p className="text-on-surface-variant font-medium max-w-xl mx-auto text-lg">
                      We analyze the critical factors that influence your website's performance and ranking.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {(content?.whatWeCheck
                      ? content.whatWeCheck.map((label: string, i: number) => ({
                          icon: checks[i % checks.length].icon,
                          label,
                        }))
                      : checks
                    ).map((item: any, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="p-6 md:p-8 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-primary/50 transition-all group flex flex-col items-center text-center shadow-lg shadow-black/5 hover:shadow-2xl hover:-translate-y-1"
                      >
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                          <item.icon className="w-6 h-6" strokeWidth={2} />
                        </div>
                        <h4 className="font-black text-base md:text-lg text-on-surface leading-tight">{item.label}</h4>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Two column: what we check vs common problems */}
                {content && (
                  <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    <div className="p-8 md:p-12 rounded-[2.5rem] bg-surface-container-low border border-outline-variant/30 shadow-xl">
                      <h3 className="text-2xl font-black text-on-surface mb-8 tracking-tight">What you'll learn</h3>
                      <div className="space-y-4">
                        {content.whatWeCheck.map((item: string, i: number) => (
                          <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white dark:hover:bg-surface-container-high transition-colors group">
                            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1">
                              <Check className="w-4 h-4" strokeWidth={4} />
                            </div>
                            <span className="text-on-surface font-bold text-base md:text-lg leading-snug">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-8 md:p-12 rounded-[2.5rem] bg-on-surface dark:bg-surface-container-high text-surface dark:text-on-surface shadow-2xl relative overflow-hidden">
                      <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-8 tracking-tight">Common findings</h3>
                        <div className="space-y-4">
                          {content.commonProblems.map((item: string, i: number) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group">
                              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-primary/20">
                                <Check className="w-4 h-4 text-white" strokeWidth={4} />
                              </div>
                              <span className="font-bold text-base md:text-lg leading-snug opacity-90">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div id="audit-tool" className="mt-24">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-surface-container-low rounded-[2.5rem] md:rounded-[3.5rem] p-1 shadow-3xl border border-outline-variant/20"
            >
              <AuditTool onResult={setResult} />
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuditPage;
