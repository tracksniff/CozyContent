import { motion } from 'framer-motion';
import { Mail, Phone, Clock, Send } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact-us/`, formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body transition-colors duration-300 min-h-screen">
      <Navbar />
      <main className="pt-44 pb-32 px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-6xl font-black mb-8 tracking-tighter">Contact Us</h1>
            <p className="text-2xl text-on-surface-variant font-medium leading-relaxed mb-12">
              We’re here to help. If you have any questions about our services or your website, feel free to reach out.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Response Time</h3>
                  <p className="text-on-surface-variant font-medium">We aim to respond within 2-3 business days.</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10">
                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Business Hours</h3>
                  <p className="text-on-surface-variant font-medium">Monday – Friday, 9 a.m. to 5 p.m.</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Email</h3>
                  <p className="text-on-surface-variant font-medium">contact@cosycontent.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-container-low p-10 md:p-12 rounded-[3rem] border border-outline-variant/20 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <h2 className="text-3xl font-black mb-8 relative z-10">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-4">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-surface border border-outline-variant/50 rounded-2xl focus:border-primary outline-none transition-all font-medium"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-4">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 bg-surface border border-outline-variant/50 rounded-2xl focus:border-primary outline-none transition-all font-medium"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-4">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-6 py-4 bg-surface border border-outline-variant/50 rounded-2xl focus:border-primary outline-none transition-all font-medium resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:shadow-2xl shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {status === 'sending' ? 'Sending...' : (
                  <>Send Message <Send className="w-5 h-5" /></>
                )}
              </button>

              {status === 'success' && (
                <p className="text-center font-bold text-primary mt-4">Message sent successfully! We'll be in touch soon.</p>
              )}
              {status === 'error' && (
                <p className="text-center font-bold text-red-500 mt-4">Failed to send message. Please try again or email us directly.</p>
              )}
            </form>

            <div className="mt-12 pt-12 border-t border-outline-variant/10 text-center">
              <p className="text-xl font-bold mb-6">Want a new or upgraded website?</p>
              <Link to="/signup" className="text-primary font-black hover:underline inline-flex items-center gap-2">
                Fill out the application form here →
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
