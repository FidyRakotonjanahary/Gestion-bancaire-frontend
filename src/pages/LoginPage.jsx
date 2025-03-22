import React from 'react';
import LoginForm from '../components/features/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 font-sans tracking-tight">Bienvenue</h2>
      <p className="text-center text-gray-600 mb-8 font-light">
        Gérez vos clients et leurs versements en toute sécurité
      </p>
      
      <div className="mb-8">
        <div className="flex items-center p-4 bg-blue-50 rounded-lg text-sm border-l-4 border-indigo-600">
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
      
      <LoginForm />
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm border border-gray-200">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-700 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
          </svg>
          <p className="text-gray-700 leading-relaxed">
            Les activités sur ce système sont enregistrées et auditées. Chaque action est tracée pour garantir la sécurité des données.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;