import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';

const TermsConditions = () => {
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
            Terms & Conditions
          </motion.h1>
          <p className="text-on-surface-variant mb-12 font-bold italic">Last updated: April 02, 2026</p>
          
          <div className="prose dark:prose-invert max-w-none space-y-8 text-on-surface-variant font-medium leading-relaxed">
            <p>Welcome to Cosy Content Limited!</p>
            <p>These terms and conditions outline the rules and regulations for the use of Cosy Content Limited’s Website, located at https://cosycontent.com.</p>
            <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Cosy Content Limited if you do not agree to take all of the terms and conditions stated on this page.</p>

            <h2 className="text-2xl font-bold text-on-surface mt-12 mb-4">Cookies</h2>
            <p>We employ the use of cookies. By accessing Cosy Content Limited, you agreed to use cookies in agreement with the Cosy Content Limited’s Privacy Policy.</p>

            <h2 className="text-2xl font-bold text-on-surface mt-12 mb-4">Services</h2>
            <p>We provide website design, development, and optional ongoing maintenance services. By using our services, you agree to the following terms:</p>
            
            <ol className="list-decimal pl-6 space-y-6">
              <li>
                <strong>Preview Model</strong>
                <p>We may create and provide a preview website before purchase. Ownership is only transferred after full payment or subscription activation.</p>
              </li>
              <li>
                <strong>Payments</strong>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>One-time purchases must be paid in full before transfer of ownership.</li>
                  <li>Subscription plans are billed monthly.</li>
                  <li>Failure to pay may result in suspension of services.</li>
                </ul>
              </li>
              <li>
                <strong>Ownership</strong>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Upon full payment, ownership of the website is transferred to the client.</li>
                  <li>For subscription plans, ownership may remain with us until the subscription terms are fulfilled.</li>
                </ul>
              </li>
              <li>
                <strong>Refunds</strong>
                <p>Due to the nature of digital services: All sales are final unless otherwise stated. No refunds are provided after delivery or access to the website.</p>
              </li>
            </ol>

            <h2 className="text-2xl font-bold text-on-surface mt-12 mb-4">License</h2>
            <p>Unless otherwise stated, Cosy Content Limited and/or its licensors own the intellectual property rights for all material on Cosy Content Limited. All intellectual property rights are reserved.</p>
            
            <p>You must not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Republish material from Cosy Content Limited</li>
              <li>Sell, rent or sub-license material from Cosy Content Limited</li>
              <li>Reproduce, duplicate or copy material from Cosy Content Limited</li>
              <li>Redistribute content from Cosy Content Limited</li>
            </ul>

            <h2 className="text-2xl font-bold text-on-surface mt-12 mb-4">Content Liability</h2>
            <p>We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims arising from your Website.</p>

            <h2 className="text-2xl font-bold text-on-surface mt-12 mb-4">Disclaimer</h2>
            <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsConditions;
