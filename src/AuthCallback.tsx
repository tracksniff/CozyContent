import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AuthCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const access = params.get('access');
    const refresh = params.get('refresh');

    if (access && refresh) {
      // login function from AuthContext usually takes the access token
      // and sets it in localStorage.
      login(access);
      // We might also want to store the refresh token if the context supports it
      localStorage.setItem('refresh_token', refresh);
      
      const next = params.get('next');
      if (next) {
        window.location.href = next;
      } else {
        navigate('/dashboard');
      }
    } else {
      const error = params.get('error') || 'Authentication failed';
      navigate(`/login?error=${encodeURIComponent(error)}`);
    }
  }, [location, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-on-surface-variant font-bold">Completing login...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
