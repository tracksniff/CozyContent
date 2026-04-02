import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';

const CookiePolicy = () => {
  return (
    <div className="bg-surface text-on-surface font-body transition-colors duration-300 min-h-screen">
      <Navbar />
      <main className="pt-44 pb-32 px-8">
        <div className="max-w-4xl mx-auto bg-surface-container-low p-12 rounded-[2.5rem] border border-outline-variant/20 shadow-xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black mb-8 tracking-tighter"
          >
            Cookie Policy
          </motion.h1>
          <p className="text-on-surface-variant mb-12 font-bold italic">Last updated: April 02, 2026</p>
          
          <div className="prose dark:prose-invert max-w-none space-y-8 text-on-surface-variant font-medium leading-relaxed">
            <h2 className="text-2xl font-bold text-on-surface mb-4">What Are Cookies</h2>
            <p>As is common practice on almost all professional websites, this site uses cookies, which are tiny files downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies.</p>

            <h2 className="text-2xl font-bold text-on-surface mt-12 mb-4">How We Use Cookies</h2>
            <p>We use cookies for a variety of reasons, detailed below. Unfortunately, in most cases, there are no industry-standard options for disabling cookies without completely disabling the functionality and features they add to this site.</p>

            <h2 className="text-2xl font-bold text-on-surface mt-12 mb-4">Disabling Cookies</h2>
            <p>You can prevent cookies from being set by adjusting your browser settings (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this website and many others you visit.</p>

            <h2 className="text-2xl font-bold text-on-surface mt-12 mb-4">The Cookies We Set</h2>
            <ul className="list-disc pl-6 space-y-6">
              <li>
                <strong>Account-related cookies</strong>
                <p>If you create an account with us, we will use cookies to manage the signup process and general administration.</p>
              </li>
              <li>
                <strong>Login-related cookies</strong>
                <p>We use cookies when you are logged in to remember this. This prevents you from having to log in every single time you visit a new page.</p>
              </li>
              <li>
                <strong>Forms related cookies</strong>
                <p>When you submit data through a form such as those found on contact pages or comment forms, cookies may be set to remember your user details for future correspondence.</p>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-on-surface mt-12 mb-4">Third-Party Cookies</h2>
            <p>In some special cases, we also use cookies provided by trusted third parties. The following section details which third-party cookies you might encounter through this site.</p>
            <ul className="list-disc pl-6 space-y-4">
              <li>This site uses Google Analytics for helping us to understand how you use the site and ways that we can improve your experience.</li>
              <li>We use adverts to offset the costs of running this site and provide funding for further development.</li>
            </ul>

            <h2 className="text-2xl font-bold text-on-surface mt-12 mb-4">More Information</h2>
            <p>Hopefully, that has clarified things for you. If you are still looking for more information, then you can contact us through one of our preferred contact methods:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: contact@cosycontent.com</li>
              <li>By visiting this link: https://cosycontent.com/contact/</li>
              <li>Phone: +44 (0) 7864 670 284</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
