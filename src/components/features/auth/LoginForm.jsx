import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import authService from '../../../services/authService'; 

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);
  
  useEffect(() => {
    // Vérification initiale de l'authentification
    const checkAuth = async () => {
      const isAuthenticated = authService.isAuthenticated();
      if (isAuthenticated) {
        navigate('/dashboard');
      }
    };
  
    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    
    if (!credentials.username || !usernameRegex.test(credentials.username)) {
      setError('Nom d\'utilisateur invalide. 3-20 caractères alphanumériques ou underscores');
      return false;
    }
    if (!credentials.password || credentials.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
  
    setError('');
    setIsLoading(true);
  
    try {
      const result = await login(credentials);
      
      if (result?.success) {
        navigate(from, { 
          replace: true,
          state: { user: result.user }
        });
      } else {
        setError(result?.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Error message with retro styling */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm mb-4 border-l-4 border-red-500 flex items-start relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-pink-50 opacity-50"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5 relative z-10" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="relative z-10">{error}</span>
        </div>
      )}
      
      {/* Username field with retro styling */}
      <div className="space-y-3">
        <label htmlFor="username" className="block text-sm font-medium text-indigo-800">
          Nom d'utilisateur
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className="block w-full pl-10 pr-3 py-3 border border-purple-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 bg-white bg-opacity-80"
            placeholder="Votre nom d'utilisateur"
            value={credentials.username}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>
      
      {/* Password field with retro styling */}
      <div className="space-y-3">
        <label htmlFor="password" className="block text-sm font-medium text-indigo-800">
          Mot de passe
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="block w-full pl-10 pr-10 py-3 border border-purple-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 bg-white bg-opacity-80"
            placeholder="Votre mot de passe"
            value={credentials.password}
            onChange={handleChange}
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              className="text-indigo-400 hover:text-indigo-600 focus:outline-none transition duration-150"
              onClick={toggleShowPassword}
              disabled={isLoading}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <p className="text-xs text-indigo-700 mt-1 italic font-light">Votre mot de passe doit rester strictement confidentiel.</p>
      </div>
      
      {/* Submit button with retro gradient */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
          style={{
            backgroundImage: "linear-gradient(to right, #6366f1, #8b5cf6, #d946ef)",
            backgroundSize: "200% auto"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundPosition = "right center"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundPosition = "left center"}
        >
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connexion en cours...
            </>
          ) : (
            'Se connecter'
          )}
        </button>
      </div>
      
      {/* Retro decorative line */}
      <div className="pt-4 flex items-center">
        <div className="flex-grow h-px bg-gradient-to-r from-purple-200 via-indigo-300 to-transparent"></div>
        <div className="px-2">
          <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
        </div>
        <div className="flex-grow h-px bg-gradient-to-l from-purple-200 via-indigo-300 to-transparent"></div>
      </div>
    </form>
  );
};

export default LoginForm;