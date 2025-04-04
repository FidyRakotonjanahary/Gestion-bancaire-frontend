import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaHome } from 'react-icons/fa';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50" style={{
      backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
      backgroundSize: '30px 30px',
      backgroundAttachment: 'fixed',
      opacity: '0.9',
    }}>
      <div className="max-w-lg w-full backdrop-blur-md bg-white/70 shadow-xl rounded-lg overflow-hidden border border-white/20 relative">
        {/* Cercles décoratifs avec dégradé rouge-orange */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-orange-500 opacity-30 blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-tr from-orange-600 to-red-400 opacity-30 blur-xl"></div>
        
        <div className="bg-gradient-to-r from-red-700 to-orange-600 p-6 text-center relative overflow-hidden">
          <div className="relative z-10 inline-flex justify-center items-center p-4 bg-white rounded-full mb-4 shadow-lg backdrop-blur-sm">
            <FaShieldAlt 
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 w-8 h-8" 
            />
          </div>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 rounded-full bg-gradient-to-br from-red-400 to-orange-300 opacity-20 blur-xl"></div>
          
          <h1 className="text-3xl font-bold text-white mb-3 relative z-10">
            Accès Non Autorisé
          </h1>
          <p className="text-white text-lg font-medium relative z-10">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
        </div>
        
        <div className="p-8 space-y-6 relative z-10">
          <div className="bg-white/60 backdrop-blur-sm border-l-4 p-5 rounded shadow-sm" style={{
            borderImage: 'linear-gradient(to bottom, #ef4444, #f97316) 1'
          }}>
            <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-orange-600 mb-3 text-lg">Raisons possibles :</h3>
            <ul className="text-gray-700 space-y-3">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-gradient-to-br from-red-500 to-orange-600 rounded-full mt-0.5 mr-3 flex-shrink-0">
                  <span className="text-white text-xs">1</span>
                </span>
                <span className="text-base">Droits d'accès insuffisants pour cette section</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-gradient-to-br from-red-500 to-orange-600 rounded-full mt-0.5 mr-3 flex-shrink-0">
                  <span className="text-white text-xs">2</span>
                </span>
                <span className="text-base">Votre rôle utilisateur ne permet pas cette action</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-gradient-to-br from-red-500 to-orange-600 rounded-full mt-0.5 mr-3 flex-shrink-0">
                  <span className="text-white text-xs">3</span>
                </span>
                <span className="text-base">Accès restreint par l'administrateur système</span>
              </li>
            </ul>
          </div>
          
          <div className="flex justify-center pt-4">
            <Link 
              to="/dashboard" 
              className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-3 px-8 rounded-lg transition-all font-medium text-lg shadow-md"
              style={{
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(79, 70, 229, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              <FaHome className="mr-2 w-5 h-5" />
              Retour au Tableau de Bord
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;