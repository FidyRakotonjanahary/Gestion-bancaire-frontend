import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      {/* Fond avec subtil motif à points */}
      <div className="absolute inset-0 bg-gray-50" style={{
        backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        opacity: '0.4',
      }}></div>
      
      {/* Carte principale avec effet flou et dégradé */}
      <div className="relative z-10 max-w-md w-full p-10 rounded-lg shadow-xl backdrop-blur-md bg-white/70 border border-white/20">
        {/* Cercles décoratifs avec dégradé */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 opacity-30 blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-tr from-blue-600 to-purple-400 opacity-30 blur-xl"></div>
        
        <div className="flex items-center justify-center mb-8 relative">
          {/* 404 stylisé avec dégradé rétro */}
          <h1 className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-400">4</h1>
          <div className="mx-1 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-4xl font-bold text-white">0</span>
          </div>
          <h1 className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">4</h1>
        </div>
        
        {/* Titre avec effet de texte dégradé */}
        <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-blue-600">
          PAGE NON TROUVÉE
        </h2>
        
        {/* Divider stylisé */}
        <div className="h-1 mx-auto mb-6 w-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
        
        {/* Description */}
        <p className="text-gray-600 text-center text-lg mb-8 backdrop-blur-sm">
          Nous sommes désolés, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        {/* Boutons avec effets dégradés */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 font-medium rounded-md transition duration-300 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-md"
          >
            RETOUR À L'ACCUEIL
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 font-medium rounded-md transition duration-300 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 border border-gray-200 shadow-sm"
          >
            PAGE PRÉCÉDENTE
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;