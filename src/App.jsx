import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Providers
import { AuthProvider } from './context/AuthContext';
// import { SocketProvider } from './context/SocketContext';

// Layouts
// import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages
import LoginPage from './pages/LoginPage';
// import DashboardPage from './pages/DashboardPage';
// import ClientsPage from './pages/ClientsPage';
// import ClientDetailPage from './pages/ClientDetailPage';
// import VersementsPage from './pages/VersementsPage';
// import VersementDetailPage from './pages/VersementDetailPage';
// import UsersPage from './pages/UsersPage';
// import UserDetailPage from './pages/UserDetailPage';
// import ProfilePage from './pages/ProfilePage';
// import AuditPage from './pages/AuditPage';
// import PermissionsPage from './pages/PermissionsPage';
// import NotFoundPage from './pages/NotFoundPage';

// // Components
// import ProtectedRoute from './components/features/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* <SocketProvider> */}
          {/* Configuration de React Toastify */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
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
            
            {/* Redirection de la page d'accueil vers le tableau de bord
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Routes protégées */}
            {/* <Route path="/dashboard" element={
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
            
            <Route path="/clients/:id" element={
              <ProtectedRoute requiredPermission="client_read">
                <MainLayout>
                  <ClientDetailPage />
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
            
            <Route path="/versements/:id" element={
              <ProtectedRoute requiredPermission="versement_read">
                <MainLayout>
                  <VersementDetailPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/users" element={
              <ProtectedRoute requiredPermission="user_read">
                <MainLayout>
                  <UsersPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/users/:id" element={
              <ProtectedRoute requiredPermission="user_read">
                <MainLayout>
                  <UserDetailPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/audit" element={
              <ProtectedRoute requiredPermission="audit_read">
                <MainLayout>
                  <AuditPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/permissions" element={
              <ProtectedRoute requiredPermission="permission_manage">
                <MainLayout>
                  <PermissionsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
             */}
            {/* Page 404 */}
            {/* <Route path="*" element={<NotFoundPage />} />  */}
          </Routes>
        {/* </SocketProvider> */}
      </AuthProvider>
    </Router>
  );
}

export default App;