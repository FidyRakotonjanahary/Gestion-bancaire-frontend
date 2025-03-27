import React, { useState, useEffect } from 'react';
import { userService } from '../../../services/userService';

const UpdateProfileForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userService.getCurrentUserProfile();
        if (response.success) {
          const { username, email, full_name } = response.data;
          setFormData({ username, email, full_name: full_name || '' });
        } else {
          setError('Erreur lors de la récupération du profil');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement du profil');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.email) {
      setError('Les champs nom d\'utilisateur et email sont requis');
      return false;
    }

    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('L\'adresse email saisie n\'est pas valide');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const profileData = {
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name
      };
      
      const response = await userService.updateCurrentUserProfile(profileData);
      
      if (response.success) {
        setSuccess(true);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError('Erreur lors de la mise à jour du profil');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Mettre à jour le profil</h2>
      
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          Profil mis à jour avec succès
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Nom complet
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Mettre à jour le profil'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfileForm;