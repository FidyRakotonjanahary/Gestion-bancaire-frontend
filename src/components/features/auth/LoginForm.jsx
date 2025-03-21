// src/components/features/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Alert from '../../common/Alert';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(credentials);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <Alert type="error" message={error} />}
      
      <div>
        <Input
          label="Nom d'utilisateur"
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          required
          leadingIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          }
          placeholder="Entrez votre nom d'utilisateur"
        />
      </div>
      
      <div>
        <Input
          label="Mot de passe"
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          required
          leadingIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          }
          placeholder="Entrez votre mot de passe"
        />
      </div>
      
      <div className="flex items-center justify-between">
      </div>
      
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isLoading}
          loading={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
        >
          {isLoading ? 'Connexion en cours...' : 'Se connecter'}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;