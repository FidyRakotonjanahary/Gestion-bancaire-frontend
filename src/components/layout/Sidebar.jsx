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
      title: 'Audit',
      path: '/audit',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      visible: isAdmin,
    },
    {
      title: 'Permissions',
      path: '/permissions',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
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
          `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
            isActive
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span className={`mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {link.icon}
            </span>
            {link.title}
          </>
        )}
      </NavLink>
    </li>
  );

  return (
    <aside className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white w-64 flex-shrink-0 h-screen sticky top-0 overflow-y-auto shadow-lg border-r border-gray-200 dark:border-gray-800 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center justify-center mb-10">
          <div className="bg-blue-600 p-2 rounded-lg shadow-md mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
            Bank Manager
          </h2>
        </div>
        
        <nav className="space-y-8">
          {/* Section Générale */}
          <div>
            <h3 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-4 pl-3">Navigation Principale</h3>
            <ul className="space-y-1">
              {standardLinks.map((link, index) => renderNavLink(link, index))}
            </ul>
          </div>
          
          {/* Section Administration (conditionnelle) */}
          {isAdmin && adminLinks.length > 0 && (
            <div>
              <h3 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-4 pl-3">Administration</h3>
              <ul className="space-y-1">
                {adminLinks.map((link, index) => renderNavLink(link, index))}
              </ul>
            </div>
          )}
        </nav>
      </div>
      
      {/* Section de profil utilisateur avec bouton de déconnexion */}
      <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0 ml-3">
            <p className="font-medium truncate">{user?.username || 'Utilisateur'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.role || 'Rôle'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            title="Déconnexion"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;