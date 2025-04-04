import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Providers
import { AuthProvider } from './context/AuthContext';
// import { SocketProvider } from './context/SocketContext';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import VersementsPage from './pages/VersementsPage';
import UsersPage from './pages/UsersPage';

// import ProfilePage from './pages/ProfilePage';
import AuditPage from './pages/AuditPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Components
import ProtectedRoute from './components/features/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* <SocketProvider> */}
          {/* Configuration de React Toastify */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          
          <Routes>
            {/* Routes publiques */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>
            
            {/* Redirection de la page d'accueil vers le tableau de bord */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Routes protégées */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            
            <Route path="/clients" element={
              <ProtectedRoute requiredPermission="client_read">
                <MainLayout>
                  <ClientsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            
            <Route path="/versements" element={
              <ProtectedRoute requiredPermission="versement_read">
                <MainLayout>
                  <VersementsPage />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/users" element={
              <ProtectedRoute>
                <MainLayout>
                  <UsersPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            
           
            
           {/* <Route path="/profile" element={
              <ProtectedRoute>
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            } /> */}
            
            <Route path="/audit" element={
              <ProtectedRoute>
                <MainLayout>
                  <AuditPage />
                </MainLayout>
              </ProtectedRoute>
            } /> 
            
            {/* Page 404 */}
            <Route path="*" element={<NotFoundPage />} />  
            {/* Page non autorisé */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Routes>
        {/* </SocketProvider> */}
      </AuthProvider>
    </Router>
  );
}

export default App;