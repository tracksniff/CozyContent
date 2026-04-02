import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Websites from './Websites';
import Settings from './Settings';
import Users from './Users';
import OurBrands from './OurBrands';
import PrivacyPolicy from './PrivacyPolicy';
import TermsConditions from './TermsConditions';
import CookiePolicy from './CookiePolicy';
import Contact from './Contact';
import FloatingThemeToggle from './FloatingThemeToggle';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider, useAuth } from './AuthContext';

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
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/our-brands" element={<OurBrands />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/contact" element={<Contact />} />
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
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
