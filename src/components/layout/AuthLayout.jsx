import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../context/AuthContext';

const AuthLayout = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-200 relative overflow-hidden">
          {/* Retro gradient loading background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-amber-100 opacity-40"></div>
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          {/* Spinner with retro colors */}
          <div className="relative z-10 w-20 h-20 mb-8">
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent border-b-transparent animate-spin"></div>
            <div className="absolute inset-1 border-4 border-purple-400 rounded-full border-t-transparent border-l-transparent animate-spin" style={{animationDuration: '1.5s'}}></div>
          </div>
          
          {/* Message with retro typography */}
          <div className="text-center relative z-10">
            <h3 className="text-lg font-medium text-indigo-800 mb-2">Chargement en cours</h3>
            <p className="text-gray-600 mb-4">Veuillez patienter pendant que nous préparons vos données</p>
            
            {/* Indicator with retro colors */}
            <div className="flex items-center justify-center space-x-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" style={{animationDelay: '300ms'}}></div>
              <div className="w-2 h-2 rounded-full bg-pink-600 animate-pulse" style={{animationDelay: '600ms'}}></div>
            </div>
          </div>
          
          {/* Secure footer */}
          <div className="mt-6 flex items-center text-xs text-gray-500 relative z-10">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
            </svg>
            Connexion sécurisée
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Left side - Banner with retro gradient */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex-col items-center justify-center text-white p-8 relative overflow-hidden">
        {/* Retro pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <pattern id="retro-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#retro-grid)" />
          </svg>
        </div>
        
        {/* Retro geometric shapes in background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute bottom-40 right-10 w-60 h-60 rounded-full bg-white"></div>
          <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-white transform rotate-45"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-md">
          {/* Logo with retro style */}
          <div className="mb-10 text-center">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-lg shadow-lg inline-block mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-6 tracking-tight">
            <span className="text-white font-extrabold">Bank</span> Manager
          </h1>
          <p className="mt-4 text-indigo-100 leading-relaxed text-lg">
            Accédez à votre plateforme de gestion sécurisée pour gérer vos opérations financières en toute simplicité.
          </p>
          
          {/* Retro pill badge */}
          <div className="mt-8">
            <span className="inline-block px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-sm font-medium border border-white border-opacity-30">
              Sécurité & Performance
            </span>
          </div>
        </div>
        
        <div className="absolute bottom-4 text-sm opacity-70 z-10">
          © {new Date().getFullYear()} Bank Manager. Tous droits réservés.
        </div>
      </div>

      {/* Right side - Content */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white bg-opacity-90 backdrop-blur-sm">
        <div className="w-full max-w-md">
          {children || <Outlet />}
        </div>
      </div>
      
      <ToastContainer 
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default AuthLayout;