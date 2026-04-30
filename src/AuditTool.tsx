import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

export interface AuditResult {
  overall_score: number;
  scores: {
    design: number;
    mobile_ux: number;
    lead_conversion: number;
    seo_basics: number;
    performance: number;
  };
  findings: Array<{ severity: string; issue: string; detail: string }>;
  quick_wins: Array<{ action: string; detail: string }>;
  summary: string;
}

interface AuditToolProps {
  onResult?: (result: AuditResult | null) => void;
}

const SCORE_LABELS: Record<string, string> = {
  design: 'Design',
  mobile_ux: 'Mobile UX',
  lead_conversion: 'Conversion',
  seo_basics: 'SEO',
  performance: 'Performance',
};

const scoreColor = (score: number) => {
  if (score >= 75) return '#4ade80';
  if (score >= 50) return '#facc15';
  return '#f87171';
};

const AuditTool: React.FC<AuditToolProps> = ({ onResult }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResultState] = useState<AuditResult | null>(null);
  const [formData, setFormData] = useState({
    name: localStorage.getItem('audit_name') || '',
    email: localStorage.getItem('audit_email') || '',
    business_name: localStorage.getItem('audit_business_name') || '',
    website_url: localStorage.getItem('audit_website_url') || '',
    industry: localStorage.getItem('audit_industry') || '',
    location: localStorage.getItem('audit_location') || '',
  });

  const setResult = (res: AuditResult | null) => {
    setResultState(res);
    if (onResult) onResult(res);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    Object.entries(formData).forEach(([k, v]) => localStorage.setItem(`audit_${k}`, v));
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/audits/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setResult(data.report_data);
      toast.success('Thanks — your request has been received.');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (circumference * result.overall_score) / 100;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ maxWidth: '900px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <style>{`
          .audit-result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
          @media (max-width: 640px) { .audit-result-grid { grid-template-columns: 1fr; } }
          .scores-strip { display: grid; grid-template-columns: repeat(5, 1fr); gap: 2px; }
          @media (max-width: 640px) { .scores-strip { grid-template-columns: repeat(2, 1fr); } }
        `}</style>

        {/* Confirmation banner */}
        <div style={{
          background: 'rgba(74, 222, 128, 0.06)',
          border: '1px solid rgba(74, 222, 128, 0.15)',
          borderRadius: '8px',
          padding: '20px 28px',
          marginBottom: '2px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}>
          <span style={{ fontSize: '20px' }}>✓</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#4ade80', marginBottom: '2px' }}>Thanks — your request has been received.</div>
            <div style={{ fontSize: '14px', color: '#78716c' }}>
              We’ll review your website and send your personalised audit shortly to <span style={{ color: '#a8a29e' }}>{formData.email}</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div style={{
          background: '#0f0f0f',
          border: '1px solid rgba(255,255,255,0.06)',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          padding: '40px 40px 0',
          marginBottom: '2px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '32px', paddingBottom: '40px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#57534e', marginBottom: '12px' }}>
                Audit Report
              </div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '36px', fontWeight: 900, color: '#f0ede8', margin: '0 0 8px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                {formData.business_name}
              </h2>
              <p style={{ fontSize: '14px', color: '#57534e', margin: 0 }}>{formData.website_url}</p>
            </div>

            {/* Score ring */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                <motion.circle
                  cx="60" cy="60" r="54"
                  fill="none"
                  stroke={scoreColor(result.overall_score)}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                />
              </svg>
              <div style={{ position: 'absolute', marginTop: '0px', textAlign: 'center', pointerEvents: 'none' }}>
                {/* Overlaid via flex trick below */}
              </div>
              <div style={{ marginTop: '-88px', textAlign: 'center', lineHeight: 1 }}>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '38px', fontWeight: 900, color: '#f0ede8', letterSpacing: '-0.04em' }}>
                  {result.overall_score}
                </div>
                <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#57534e', marginTop: '68px' }}>
                  Overall
                </div>
              </div>
            </div>
          </div>

          {/* Score strip */}
          <div style={{ margin: '0 -40px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="scores-strip" style={{ gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
              {Object.entries(result.scores).map(([key, score], i) => (
                <div key={i} style={{ background: '#0f0f0f', padding: '20px 24px' }}>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: scoreColor(score), marginBottom: '4px' }}>{score}</div>
                  <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#44403c' }}>
                    {SCORE_LABELS[key] ?? key}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Findings + Quick wins */}
        <div className="audit-result-grid" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '2px' }}>
          <div style={{ background: '#0f0f0f', padding: '36px 32px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#57534e', marginBottom: '24px' }}>
              Critical findings
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {result.findings.map((f, i) => (
                <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f87171', marginBottom: '4px' }}>
                    {f.severity}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#f0ede8', marginBottom: '4px' }}>{f.issue}</div>
                  <div style={{ fontSize: '13px', color: '#57534e', lineHeight: 1.5 }}>{f.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#0f0f0f', padding: '36px 32px', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#57534e', marginBottom: '24px' }}>
              Quick wins
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {result.quick_wins.map((w, i) => (
                <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#4ade80', fontSize: '13px', marginTop: '1px', flexShrink: 0 }}>→</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#f0ede8', marginBottom: '4px' }}>{w.action}</div>
                    <div style={{ fontSize: '13px', color: '#57534e', lineHeight: 1.5 }}>{w.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: '#0f0f0f',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          padding: '48px 40px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#57534e', marginBottom: '16px' }}>
            Next step
          </div>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '32px', fontWeight: 900, color: '#f0ede8', margin: '0 0 16px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            We can fix this <em style={{ fontStyle: 'italic', color: '#c8b8a2' }}>in 7 days.</em>
          </h3>
          <p style={{ fontSize: '15px', color: '#78716c', maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.65 }}>
            We'll rebuild your site into a modern, high-converting lead machine — zero upfront cost on our monthly plan.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: '#f0ede8',
              color: '#0a0a0a',
              padding: '14px 32px',
              borderRadius: '4px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: '14px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}>
              Get my new website →
            </Link>
            <button onClick={() => setResult(null)} style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#78716c',
              padding: '14px 28px',
              borderRadius: '4px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
              Run another audit
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        .audit-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 640px) { .audit-form-grid { grid-template-columns: 1fr; } }
        .audit-input::placeholder { color: #44403c; }
        .audit-input:focus { border-color: rgba(255,255,255,0.28) !important; }
        .submit-btn:hover { background: #ffffff !important; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; }
      `}</style>

      <div style={{
        background: '#0f0f0f',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        {/* Form header */}
        <div style={{ padding: '48px 48px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#57534e', marginBottom: '16px' }}>
            Free website audit
          </div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: '#f0ede8', margin: '0 0 12px', lineHeight: 1.1, letterSpacing: '-0.04em' }}>
            Is your website losing<br /><em style={{ fontStyle: 'italic', color: '#c8b8a2' }}>you leads?</em>
          </h2>
          <p style={{ fontSize: '15px', color: '#57534e', margin: 0, lineHeight: 1.6 }}>
            Paste your URL and get a full breakdown — no signup, no card, no catch.
          </p>
        </div>

        {/* Form body */}
        <div style={{ padding: '40px 48px 48px' }}>
          <form onSubmit={handleSubmit}>
            <div className="audit-form-grid" style={{ marginBottom: '20px' }}>
              {/* Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#57534e' }}>Your name</label>
                <input
                  required type="text" placeholder="Jane Smith"
                  className="audit-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '14px 18px', color: '#f0ede8', fontSize: '15px', fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none', transition: 'border-color 0.15s', width: '100%' }}
                />
              </div>
              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#57534e' }}>Email address</label>
                <input
                  required type="email" placeholder="jane@company.com"
                  className="audit-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '14px 18px', color: '#f0ede8', fontSize: '15px', fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none', transition: 'border-color 0.15s', width: '100%' }}
                />
              </div>
              {/* Business name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#57534e' }}>Business name</label>
                <input
                  required type="text" placeholder="Acme Plumbing"
                  className="audit-input"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '14px 18px', color: '#f0ede8', fontSize: '15px', fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none', transition: 'border-color 0.15s', width: '100%' }}
                />
              </div>
              {/* Location */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#57534e' }}>City / Location</label>
                <input
                  required type="text" placeholder="London, UK"
                  className="audit-input"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '14px 18px', color: '#f0ede8', fontSize: '15px', fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none', transition: 'border-color 0.15s', width: '100%' }}
                />
              </div>
              {/* Website URL — full width */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#57534e' }}>Website URL</label>
                <input
                  required type="url" placeholder="https://yourwebsite.com"
                  className="audit-input"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '14px 18px', color: '#f0ede8', fontSize: '15px', fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none', transition: 'border-color 0.15s', width: '100%' }}
                />
              </div>
              {/* Industry — full width */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#57534e' }}>Industry</label>
                <select
                  required
                  className="audit-input"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '14px 18px', color: formData.industry ? '#f0ede8' : '#44403c', fontSize: '15px', fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none', transition: 'border-color 0.15s', width: '100%', appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="" disabled>Select your industry</option>
                  {['Plumbing', 'Electrical', 'Roofing', 'Locksmith', 'Cleaning', 'Removals', 'Construction', 'Restaurant', 'Beauty/Salon', 'Other'].map(o => (
                    <option key={o} value={o} style={{ background: '#111', color: '#f0ede8' }}>{o}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
              style={{
                width: '100%',
                background: '#f0ede8',
                color: '#0a0a0a',
                border: 'none',
                borderRadius: '6px',
                padding: '16px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s',
                marginTop: '8px',
              }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                  Analyzing...
                </>
              ) : (
                'Run free audit →'
              )}
            </button>

            <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#44403c', letterSpacing: '0.04em' }}>
              No credit card · No account · Results in seconds
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuditTool;
