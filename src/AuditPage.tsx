import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AuditTool from './AuditTool';
import { motion } from 'framer-motion';

interface AuditPageProps {
  title?: string;
  industry?: string;
}

const AuditPage: React.FC<AuditPageProps> = ({ title, industry }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    if (industry) {
      localStorage.setItem('audit_industry', industry);
    }
  }, [industry]);

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/30">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              {title || 'Free Website Audit'}
            </h1>
            <p className="text-xl text-on-surface-variant font-medium max-w-2xl mx-auto">
              Stop leaving money on the table. Get a detailed report on how to turn your website into a high-converting lead machine.
            </p>
          </motion.div>

          <AuditTool />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuditPage;
