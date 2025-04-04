import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const isAdmin = user?.role === 'ADMIN';
  const navigate = useNavigate();

  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  // Définition des liens de navigation
  const navLinks = [
    {
      title: 'Tableau de bord',
      path: '/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      visible: true,
    },
    {
      title: 'Clients',
      path: '/clients',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      visible: true,
    },
    {
      title: 'Versements',
      path: '/versements',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      visible: true,
    },
    {
      title: 'Utilisateurs',
      path: '/users',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      visible: isAdmin,
    },
    {
      title: 'Historique',
      path: '/audit',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      visible: isAdmin,
    },
  ];

  // Groupement des liens par catégorie
  const standardLinks = navLinks.filter(link => link.visible && !link.path.includes('/users') && !link.path.includes('/audit') && !link.path.includes('/permissions'));
  const adminLinks = navLinks.filter(link => link.visible && (link.path.includes('/users') || link.path.includes('/audit') || link.path.includes('/permissions')));

  // Fonction pour rendre un lien individuel
  const renderNavLink = (link, index) => (
    <li key={index}>
      <NavLink
        to={link.path}
        className={({ isActive }) => 
          `flex items-center px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden group ${
            isActive
              ? 'bg-white bg-opacity-25 text-white font-medium shadow-md'
              : 'text-white hover:bg-white hover:bg-opacity-20'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span className={`mr-3 relative z-10 transition-all duration-300 ${isActive ? 'text-white' : 'text-white'}`}>
              {link.icon}
            </span>
            <span className="relative z-10 font-medium">{link.title}</span>
            {isActive && (
              <span className="ml-auto w-2 h-8 bg-white rounded-full"></span>
            )}
          </>
        )}
      </NavLink>
    </li>
  );

  return (
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0 overflow-y-auto bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white relative">
      {/* Retro pattern overlay - opacité réduite pour améliorer la lisibilité */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <pattern id="retro-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#retro-grid)" />
        </svg>
      </div>
      
      {/* Retro geometric shapes in background - opacité réduite */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white"></div>
        <div className="absolute bottom-40 right-10 w-60 h-60 rounded-full bg-white"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-white transform rotate-45"></div>
      </div>
   
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-center mb-10">
          <div className="bg-white bg-opacity-20 p-3 rounded-lg shadow-md mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">
            Bank Manager
          </h2>
        </div>
        
        <nav className="space-y-8">
          {/* Section Générale */}
          <div>
            <h3 className="flex items-center text-xs uppercase font-semibold text-white mb-4 pl-3 tracking-wider">
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-white via-opacity-50 to-transparent mr-2"></div>
              Navigation Principale
              <div className="flex-grow h-px bg-gradient-to-r from-white from-opacity-50 via-white via-opacity-50 to-transparent ml-2"></div>
            </h3>
            <ul className="space-y-1.5">
              {standardLinks.map((link, index) => renderNavLink(link, index))}
            </ul>
          </div>
          
          {/* Section Administration (conditionnelle) */}
          {isAdmin && adminLinks.length > 0 && (
            <div>
              <h3 className="flex items-center text-xs uppercase font-semibold text-white mb-4 pl-3 tracking-wider">
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-white via-opacity-50 to-transparent mr-2"></div>
                Administration
                <div className="flex-grow h-px bg-gradient-to-r from-white from-opacity-50 via-white via-opacity-50 to-transparent ml-2"></div>
              </h3>
              <ul className="space-y-1.5">
                {adminLinks.map((link, index) => renderNavLink(link, index))}
              </ul>
            </div>
          )}
        </nav>
      </div>
      
      {/* Section de profil utilisateur avec bouton de déconnexion */}
      <div className="mt-auto p-5 border-t border-white border-opacity-30 relative z-10">
        {/* Background stylisé légèrement plus clair */}
        <div className="absolute inset-0 bg-white bg-opacity-15 z-0"></div>
        
        <div className="flex items-center relative z-10">
          <div className="w-11 h-11 rounded-full bg-white bg-opacity-25 flex items-center justify-center text-white font-bold shadow-md">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0 ml-3">
            <p className="font-medium truncate text-white">{user?.username || 'Utilisateur'}</p>
            <p className="text-xs text-white text-opacity-90 truncate">{user?.role || 'Rôle'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-full text-white hover:bg-white hover:bg-opacity-25 transition-all duration-200 relative overflow-hidden group"
            title="Déconnexion"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;