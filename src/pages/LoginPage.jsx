// src/pages/LoginPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/features/auth/LoginForm';
import Card from '../components/common/Card';

const LoginPage = () => {
  return (
      <Card>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-gray-600">Connectez-vous à votre compte bancaire</p>
        </div>
        
        <LoginForm />
        
        <div className="mt-4 text-center">
          <p>
            Vous n'avez pas de compte ?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </Card>
  );
};

export default LoginPage;