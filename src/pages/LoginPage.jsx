// src/pages/LoginPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/features/auth/LoginForm';
import AuthLayout from '../components/layout/AuthLayout';
import Card from '../components/common/Card';

const LoginPage = () => {
  return (
      <Card className="border-t-4 border-indigo-600 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Connexion</h1>
          <p className="text-gray-600 mt-2">Accédez à votre espace bancaire sécurisé</p>
        </div>        
        <LoginForm />
      </Card>
  );
};

export default LoginPage;