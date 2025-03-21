// src/components/layout/MainLayout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import useAuth from '../../hooks/useAuth';

const MainLayout = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers la page de connexion si non authentifié
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    // Vérifier la validité du token périodiquement
    const checkTokenInterval = setInterval(() => {
      const token = localStorage.getItem('auth_token');
      if (!token && isAuthenticated) {
        logout();
        navigate('/login');
      }
    }, 60000); // Vérifier toutes les minutes
    
    return () => clearInterval(checkTokenInterval);
  }, [isAuthenticated, navigate, logout]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;