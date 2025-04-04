import React from 'react';
import LoginForm from '../components/features/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 relative overflow-hidden">
      {/* Retro gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-pink-100 to-amber-100 opacity-30 z-0"></div>
      
      {/* Retro pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="retro-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366f1" strokeWidth="1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#retro-grid)" />
        </svg>
      </div>
      
      {/* Content with z-index to appear above the background */}
      <div className="relative z-10">
        {/* Decorative retro lines */}
        <div className="absolute -top-6 -left-6 -right-6 h-2 bg-gradient-to-r from-amber-400 via-purple-500 to-pink-500 rounded-t-xl"></div>
        
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-3 text-gray-800 font-sans tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-800">Bienvenue</h2>
          <p className="text-center text-gray-600 mb-6 font-light">
            Gérez vos clients et leurs versements en toute sécurité
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg text-sm border-l-4 border-indigo-600 shadow-sm">
            <div className="mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-indigo-700">Accès sécurisé</h3>
              <p className="text-gray-600 text-xs">Authentifiez-vous pour accéder au système</p>
            </div>
          </div>
        </div>
        
        {/* Adding a subtle container for the form */}
        <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-100">
          <LoginForm />
        </div>
        
      </div>
    </div>
  );
};

export default LoginPage;