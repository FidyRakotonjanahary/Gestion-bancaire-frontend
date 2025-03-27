import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { userService } from '../../services/userService';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../common/Spinner';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Alert } from '../common/Alert';
import { Card } from '../common/Card';
import { Table } from '../common/Table';
import { Modal } from '../common/Modal';

const UserProfile = () => {
  const { user: currentUser, updateCurrentUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // États pour le formulaire de modification du profil
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: ''
  });
  
  // États pour le changement de mot de passe
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordError, setPasswordError] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer le profil de l'utilisateur connecté
        const profileData = await userService.getCurrentUserProfile();
        setProfile(profileData.data);
        setFormData({
          username: profileData.data.username,
          email: profileData.data.email,
          full_name: profileData.data.full_name || ''
        });
        
        // Récupérer l'historique des connexions
        const loginData = await userService.getCurrentUserLoginHistory();
        setLoginHistory(loginData.data);
      } catch (err) {
        setError('Erreur lors du chargement des données utilisateur');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Mettre à jour le profil
      const response = await userService.updateCurrentUserProfile(formData);
      
      setProfile(response.data);
      setSuccess('Profil mis à jour avec succès');
      setEditMode(false);
      
      // Mettre à jour l'utilisateur dans le contexte d'authentification
      updateCurrentUser(response.data);
    } catch (err) {
      setError(`Erreur lors de la mise à jour du profil: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    
    // Vérifier que les mots de passe correspondent
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }
    
    // Vérifier la complexité du mot de passe
    if (passwordData.new_password.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    try {
      await userService.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      
      setSuccess('Mot de passe modifié avec succès');
      setShowPasswordModal(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (err) {
      setPasswordError('Erreur lors du changement de mot de passe. Vérifiez votre mot de passe actuel.');
    }
  };
  
  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error && !profile) {
    return <Alert type="error" message={error} />;
  }
  
  return (
    <div className="space-y-6">
      {success && (
        <Alert 
          type="success" 
          message={success} 
          onClose={() => setSuccess(null)}
          dismissible
        />
      )}
      
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
          dismissible
        />
      )}
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Mon profil</h1>
        <div className="space-x-2">
          {!editMode ? (
            <>
              <Button 
                variant="primary"
                onClick={() => setEditMode(true)}
              >
                Modifier le profil
              </Button>
              <Button 
                variant="secondary"
                onClick={() => setShowPasswordModal(true)}
              >
                Changer le mot de passe
              </Button>
            </>
          ) : (
            <Button 
              variant="secondary"
              onClick={() => {
                setEditMode(false);
                setFormData({
                  username: profile.username,
                  email: profile.email,
                  full_name: profile.full_name || ''
                });
              }}
            >
              Annuler
            </Button>
          )}
        </div>
      </div>
      
      <Card>
        {!editMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-medium text-gray-600">Nom d'utilisateur</h3>
              <p className="mt-1">{profile?.username}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-600">Nom complet</h3>
              <p className="mt-1">{profile?.full_name || 'Non spécifié'}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-600">Email</h3>
              <p className="mt-1">{profile?.email}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-600">Rôle</h3>
              <p className="mt-1">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  profile?.role_name === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {profile?.role_name}
                </span>
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-600">Date de création</h3>
              <p className="mt-1">{formatDate(profile?.created_at)}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-600">Dernière connexion</h3>
              <p className="mt-1">{profile?.last_login ? formatDate(profile.last_login) : 'Jamais connecté'}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Nom d'utilisateur
              </label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : 'Enregistrer'}
              </Button>
            </div>
          </form>
        )}
      </Card>
      
      <Card>
        <h2 className="text-lg font-semibold mb-4">Historique des connexions</h2>
        {loginHistory.length === 0 ? (
          <p className="text-gray-500 italic">Aucun historique de connexion disponible</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Adresse IP</th>
                <th>Navigateur</th>
              </tr>
            </thead>
            <tbody>
              {loginHistory.map((entry) => (
                <tr key={entry.id}>
                  <td>{formatDate(entry.timestamp)}</td>
                  <td>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      entry.action_type === 'login' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {entry.action_type === 'login' ? 'Connexion' : 'Déconnexion'}
                    </span>
                  </td>
                  <td>{entry.ip_address}</td>
                  <td className="truncate max-w-xs">{entry.user_agent}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
      
      {/* Modal pour le changement de mot de passe */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordError(null);
          setPasswordData({
            current_password: '',
            new_password: '',
            confirm_password: ''
          });
        }}
        title="Changer le mot de passe"
      >
        {passwordError && (
          <Alert type="error" message={passwordError} className="mb-4" />
        )}
        
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
              Mot de passe actuel
            </label>
            <Input
              id="current_password"
              name="current_password"
              type="password"
              value={passwordData.current_password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
              Nouveau mot de passe
            </label>
            <Input
              id="new_password"
              name="new_password"
              type="password"
              value={passwordData.new_password}
              onChange={handlePasswordChange}
              required
              minLength={8}
            />
            <p className="mt-1 text-xs text-gray-500">
              Le mot de passe doit contenir au moins 8 caractères
            </p>
          </div>
          
          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
              Confirmer le nouveau mot de passe
            </label>
            <Input
              id="confirm_password"
              name="confirm_password"
              type="password"
              value={passwordData.confirm_password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordError(null);
                setPasswordData({
                  current_password: '',
                  new_password: '',
                  confirm_password: ''
                });
              }}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              variant="primary"
            >
              Changer le mot de passe
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserProfile;