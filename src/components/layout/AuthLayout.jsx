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
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md max-w-md w-full border border-gray-200">
          
          {/* Spinner principal avec les couleurs du sidebar */}
          <div className="relative w-20 h-20 mb-8">
            <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent border-b-transparent animate-spin"></div>
            <div className="absolute inset-1 border-4 border-blue-400 rounded-full border-t-transparent border-l-transparent animate-spin" style={{animationDuration: '1.5s'}}></div>
          </div>
          
          {/* Message avec style typographique professionnel */}
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Chargement en cours</h3>
            <p className="text-gray-600 mb-4">Veuillez patienter pendant que nous préparons vos données</p>
            
            {/* Indicateur de progression avec couleurs du sidebar */}
            <div className="flex items-center justify-center space-x-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" style={{animationDelay: '300ms'}}></div>
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" style={{animationDelay: '600ms'}}></div>
            </div>
          </div>
          
          {/* Pied de page sécurisé */}
          <div className="mt-6 flex items-center text-xs text-gray-500">
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Partie gauche - Bannière bleue avec couleurs du sidebar */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 flex-col items-center justify-center text-white p-8 relative overflow-hidden">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative z-10 text-center max-w-md">
          {/* Logo bancaire adapté au style du sidebar */}
          <div className="mb-10 text-center">
            <div className="bg-blue-600 p-6 rounded-lg shadow-lg inline-block mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-6 tracking-tight">
            <span className="text-white font-extrabold">Bank</span> Manager
          </h1>
          <p className="mt-4 text-blue-100 leading-relaxed text-lg">
            Accédez à votre plateforme de gestion sécurisée pour gérer vos opérations financières en toute simplicité.
          </p>
        </div>
        <div className="absolute bottom-4 text-sm opacity-70 z-10">
          © {new Date().getFullYear()} Bank Manager. Tous droits réservés.
        </div>
      </div>

      {/* Partie droite - Contenu */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
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