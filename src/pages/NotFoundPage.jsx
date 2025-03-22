import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Numéro d'erreur avec effet visuel */}
        <h1 className="text-9xl font-extrabold text-gray-700 tracking-widest">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-600">
            404
          </span>
        </h1>
        
        {/* Message d'erreur principal */}
        <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-8">
          Page non trouvée
        </h2>
        
        {/* Description avec police élégante */}
        <p className="text-gray-600 text-lg mb-8 font-light">
          Nous sommes désolés, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        {/* Ligne de séparation décorative */}
        <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-blue-600 mx-auto mb-8"></div>
        
        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Retour à l'accueil
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm transition duration-300 ease-in-out"
          >
            Page précédente
          </button>
        </div>
      </div>
      
      {/* Illustration décorative (représentation graphique simplifiée) */}
      <div className="mt-12 opacity-75">
        <svg 
          className="w-64 h-48"
          viewBox="0 0 200 150"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fill="#e2e8f0" 
            d="M20,60 L50,30 L150,30 L180,60 L180,110 L20,110 Z" 
          />
          <path 
            fill="#cbd5e0" 
            d="M50,30 L150,30 L150,80 L50,80 Z" 
          />
          <path 
            stroke="#4a5568" 
            strokeWidth="3"
            fill="none" 
            d="M85,50 L115,50 M85,65 L115,65" 
          />
          <circle 
            cx="100" 
            cy="130" 
            r="10"
            fill="#4299e1" 
          />
          <path 
            stroke="#4a5568" 
            strokeWidth="2"
            fill="none" 
            d="M70,95 L130,95" 
          />
        </svg>
      </div>
    </div>
  );
};

export default NotFoundPage;