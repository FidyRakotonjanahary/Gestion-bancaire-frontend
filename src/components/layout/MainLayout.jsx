import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import Header from './Header';
import Sidebar from './Sidebar';
import useAuth from '../../hooks/useAuth';

// Ajoutez ce style pour les animations
const MainLayout = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
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
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          {/* <Header /> */}
          <main className="flex-1 p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto animate-fadeIn">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;