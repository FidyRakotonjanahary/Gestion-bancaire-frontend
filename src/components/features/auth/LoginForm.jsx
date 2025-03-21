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

  // Récupérer l'URL de redirection après la connexion
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}
      
      <div>
        <Input
          label="Nom d'utilisateur"
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          required
          fullWidth
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
          fullWidth
        />
      </div>
      
      <div className="pt-2">
        <Button
          type="submit"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Connexion en cours...' : 'Se connecter'}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;