import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import Login from './Login';
import Signup from './Signup';
import AuthCallback from './AuthCallback';
import ForgotPassword from './ForgotPassword';
import Checkout from './Checkout';
import Pricing from './Pricing';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Websites from './Websites';
import Settings from './Settings';
import Users from './Users';
import AddOns from './AddOns';
import RequestChanges from './RequestChanges';
import DNSSetupPage from './DNSSetupPage';
import OurBrands from './OurBrands';
import PrivacyPolicy from './PrivacyPolicy';
import TermsConditions from './TermsConditions';
import CookiePolicy from './CookiePolicy';
import Contact from './Contact';
import AuditPage from './AuditPage';
import GenericSEOPage from './GenericSEOPage';
import ScrollToTop from './ScrollToTop';
import { seoPagesData } from './seoPagesData';
import FloatingThemeToggle from './FloatingThemeToggle';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider, useAuth } from './AuthContext';
import { Toaster } from 'react-hot-toast';

const PrivateRoute: React.FC<{ children: React.ReactNode, adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
      return <div className="min-h-screen bg-surface flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>;
  }

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && !user?.is_staff) return <Navigate to="/dashboard" />;

  return (
    <>
      {children}
      <FloatingThemeToggle />
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" />
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route 
              path="/free-plumbing-website-audit" 
              element={<AuditPage 
                title="Free Plumbing Website Audit | Cosy Content" 
                industry="Plumbing"
                description="Find out why your plumbing website isn’t generating enquiries. Free audit — no obligation."
              />} 
            />
            <Route 
              path="/free-roofer-website-audit" 
              element={<AuditPage 
                title="Free Roofing Website Audit | Cosy Content" 
                industry="Roofing"
                description="Discover what’s stopping your roofing website from ranking and converting. Free audit."
              />} 
            />
            <Route 
              path="/free-locksmith-website-audit" 
              element={<AuditPage 
                title="Free Locksmith Website Audit | Cosy Content" 
                industry="Locksmith"
                description="Find out why local customers aren’t calling you. Free locksmith website audit."
              />} 
            />
            <Route 
              path="/free-electrician-website-audit" 
              element={<AuditPage 
                title="Free Electrician Website Audit | Cosy Content" 
                industry="Electrical"
                description="See why your electrician website isn’t winning work locally. Free audit — no obligation."
              />} 
            />
            <Route 
              path="/free-cleaning-website-audit" 
              element={<AuditPage 
                title="Free Cleaning Website Audit | Cosy Content" 
                industry="Cleaning"
                description="Discover why your cleaning website isn’t attracting regular clients. Free audit."
              />} 
            />
            <Route 
              path="/free-removals-website-audit" 
              element={<AuditPage 
                title="Free Removal Company Website Audit | Cosy Content" 
                industry="Removals"
                description="See why your removal website isn’t converting researchers into bookings. Free audit."
              />} 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/our-brands" element={<OurBrands />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Dynamic SEO Pages */}
            {Object.entries(seoPagesData).map(([path, data]) => (
              <Route key={path} path={`/${path}`} element={<GenericSEOPage data={data} />} />
            ))}

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/websites"
              element={
                <PrivateRoute>
                  <Websites />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute adminOnly>
                  <Users />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-ons"
              element={
                <PrivateRoute>
                  <AddOns />
                </PrivateRoute>
              }
            />
            <Route
              path="/request-changes"
              element={
                <PrivateRoute>
                  <RequestChanges />
                </PrivateRoute>
              }
            />
            <Route
              path="/dns-setup/:id"
              element={
                <PrivateRoute>
                  <DNSSetupPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
