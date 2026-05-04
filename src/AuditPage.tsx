import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AuditTool from "./AuditTool";
import type { AuditResult } from "./AuditTool";
import { motion, AnimatePresence } from "framer-motion";
import { auditContent } from "./auditContent";

interface AuditPageProps {
  title?: string;
  industry?: string;
  description?: string;
}

const checks = [
  { icon: "⚡", label: "Page Speed" },
  { icon: "🔍", label: "SEO Health" },
  { icon: "📱", label: "Mobile Experience" },
  { icon: "🔒", label: "Security & HTTPS" },
  { icon: "♿", label: "Accessibility" },
  { icon: "📈", label: "Conversion Rate" },
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
    <div
      className="min-h-screen bg-surface text-on-surface"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <style>{`
        .audit-page * { box-sizing: border-box; }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--color-surface-container-low);
          border: 1px solid var(--color-outline-variant);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: var(--color-on-surface-variant);
          margin-bottom: 32px;
        }

        .hero-badge::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px #4ade80;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .hero-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(3rem, 8vw, 6.5rem);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.04em;
          color: var(--color-on-surface);
          margin: 0 0 28px;
        }

        .hero-title em {
          font-style: italic;
          color: var(--color-primary);
        }

        .hero-subtitle {
          font-size: 18px;
          line-height: 1.65;
          color: var(--color-on-surface-variant);
          font-weight: 400;
          max-width: 520px;
          margin: 0 auto 44px;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--color-on-surface);
          color: var(--color-surface);
          border: none;
          cursor: pointer;
          padding: 16px 36px;
          border-radius: 4px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.01em;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .cta-button:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .cta-button svg {
          width: 16px;
          height: 16px;
          transition: transform 0.2s;
        }

        .cta-button:hover svg {
          transform: translateY(3px);
        }

        .divider-line {
          width: 100%;
          height: 1px;
          background: var(--color-outline-variant);
          margin: 80px 0;
        }

        .checks-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--color-outline-variant);
          border: 1px solid var(--color-outline-variant);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 80px;
        }

        @media (max-width: 640px) {
          .checks-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .check-cell {
          background: var(--color-surface);
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: background 0.2s;
        }

        .check-cell:hover { background: var(--color-surface-container-low); }

        .check-icon {
          font-size: 22px;
          line-height: 1;
        }

        .check-label {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-on-surface-variant);
          letter-spacing: 0.01em;
        }

        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          background: var(--color-outline-variant);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--color-outline-variant);
          margin-bottom: 80px;
        }

        @media (max-width: 768px) {
          .two-col { grid-template-columns: 1fr; }
        }

        .col-panel {
          background: var(--color-surface);
          padding: 48px 40px;
        }

        .col-panel-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-on-surface-variant);
          margin-bottom: 32px;
        }

        .col-panel-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: var(--color-on-surface);
          margin: 0 0 28px;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .list-item {
          display: flex;
          align-items: baseline;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid var(--color-outline-variant);
          color: var(--color-on-surface-variant);
          font-size: 15px;
          line-height: 1.5;
          font-weight: 400;
        }

        .list-item:last-child { border-bottom: none; }

        .list-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--color-outline-variant);
          flex-shrink: 0;
          margin-top: 8px;
        }

        .list-dot-accent { background: var(--color-primary); }

        .scroll-nudge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 56px;
        }

        .scroll-nudge-text {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-on-surface-variant);
        }

        .scroll-arrow {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }

        .scroll-arrow span {
          display: block;
          width: 1px;
          height: 20px;
          background: linear-gradient(to bottom, var(--color-on-surface-variant), transparent);
          animation: drip 1.6s ease-in-out infinite;
        }

        @keyframes drip {
          0% { transform: scaleY(0); transform-origin: top; opacity: 0; }
          50% { transform: scaleY(1); transform-origin: top; opacity: 1; }
          100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
        }

        .stat-row {
          display: flex;
          gap: 2px;
          margin-bottom: 80px;
          background: var(--color-outline-variant);
          border: 1px solid var(--color-outline-variant);
          border-radius: 12px;
          overflow: hidden;
        }

        @media (max-width: 640px) {
          .stat-row { flex-direction: column; }
        }

        .stat-cell {
          flex: 1;
          background: var(--color-surface);
          padding: 36px 32px;
        }

        .stat-number {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 48px;
          font-weight: 900;
          color: var(--color-on-surface);
          line-height: 1;
          margin-bottom: 8px;
          letter-spacing: -0.04em;
        }

        .stat-label {
          font-size: 13px;
          color: var(--color-on-surface-variant);
          font-weight: 400;
          line-height: 1.5;
        }
      `}</style>

      <div className="audit-page">
        <Navbar />

        <main style={{ paddingTop: "120px", paddingBottom: "80px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 32px" }}>
            <AnimatePresence>
              {!result && (
                <>
                  {/* Hero */}
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ textAlign: "center", marginBottom: "80px" }}
                  >
                    <div className="hero-badge">Free · No signup required · Instant results</div>

                    <h1 className="hero-title">
                      {content?.heroTitle ? (
                        content.heroTitle
                      ) : (
                        <>
                          Your website
                          <br />
                          is <em>losing you money.</em>
                          <br />
                          Let's fix that.
                        </>
                      )}
                    </h1>

                    <p className="hero-subtitle">
                      {content?.heroSubtitle ||
                        "Paste your URL and get a detailed breakdown of every issue costing you traffic, leads, and revenue."}
                    </p>

                    <button className="cta-button" onClick={scrollToAudit}>
                      Run my free audit
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <polyline points="19 12 12 19 5 12" />
                      </svg>
                    </button>
                  </motion.div>

                  {/* Stats row */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="stat-row"
                  >
                    <div className="stat-cell">
                      <div className="stat-number">94%</div>
                      <div className="stat-label">
                        of first impressions are
                        <br />
                        design-related
                      </div>
                    </div>
                    <div className="stat-cell">
                      <div className="stat-number">3s</div>
                      <div className="stat-label">
                        before visitors abandon
                        <br />a slow-loading page
                      </div>
                    </div>
                    <div className="stat-cell">
                      <div className="stat-number">68%</div>
                      <div className="stat-label">
                        of online experiences
                        <br />
                        begin with a search engine
                      </div>
                    </div>
                  </motion.div>

                  {/* What we check grid */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--color-on-surface-variant)",
                        marginBottom: "20px",
                      }}
                    >
                      What gets audited
                    </p>
                    <div className="checks-grid">
                      {(content?.whatWeCheck
                        ? content.whatWeCheck.map((label: string, i: number) => ({
                            icon: checks[i % checks.length].icon,
                            label,
                          }))
                        : checks
                      ).map((item: { icon: string; label: string }, i: number) => (
                        <div key={i} className="check-cell">
                          <span className="check-icon">{item.icon}</span>
                          <span className="check-label">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Two column: what we check vs common problems */}
                  {content && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="two-col"
                    >
                      <div className="col-panel">
                        <div className="col-panel-label">What you'll learn</div>
                        <div className="col-panel-title">A full picture of your site's health</div>
                        <div>
                          {content.whatWeCheck.map((item: string, i: number) => (
                            <div key={i} className="list-item">
                              <span className="list-dot list-dot-accent" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-panel">
                        <div className="col-panel-label">Common findings</div>
                        <div className="col-panel-title">
                          Issues most sites don't know they have
                        </div>
                        <div>
                          {content.commonProblems.map((item: string, i: number) => (
                            <div key={i} className="list-item">
                              <span className="list-dot" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Scroll nudge */}
                  <div className="scroll-nudge">
                    <span className="scroll-nudge-text">
                      {content?.ctaText || "Start your audit"}
                    </span>
                    <div className="scroll-arrow">
                      <span />
                    </div>
                  </div>
                </>
              )}
            </AnimatePresence>

            <div id="audit-tool">
              <AuditTool onResult={setResult} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AuditPage;
