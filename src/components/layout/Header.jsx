import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';
import Dropdown from '../common/Dropdown';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setAlert({
      type: 'success',
      message: 'Déconnexion réussie',
    });
  };

  return (
    <header className="bg-white shadow-md px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/dashboard" className="text-xl font-bold text-blue-600">
          Bank App
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative">
          <button className="text-gray-600 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="hidden md:block font-medium">{user?.name || 'Utilisateur'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isProfileOpen && (
            <Dropdown
              items={[
                { label: 'Mon Profil', onClick: () => window.location.href = '/profile' },
                { label: 'Paramètres', onClick: () => window.location.href = '/profile' },
                { label: 'Déconnexion', onClick: handleLogout }
              ]}
              onClose={() => setIsProfileOpen(false)}
              className="absolute right-0 top-10 z-10"
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;