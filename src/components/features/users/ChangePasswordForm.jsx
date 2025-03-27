// components/features/users/ChangePasswordForm.jsx
import React, { useState } from 'react';
import { userService } from '../../../services/userService';

const ChangePasswordForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.current_password || !formData.new_password || !formData.confirm_password) {
      setError('Tous les champs sont requis');
      return false;
    }

    if (formData.new_password !== formData.confirm_password) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return false;
    }

    if (formData.new_password.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const passwordData = {
        current_password: formData.current_password,
        new_password: formData.new_password
      };
      
      await userService.changePassword(passwordData);
      setSuccess(true);
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Changer le mot de passe</h2>
      
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          Mot de passe modifié avec succès
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
            Mot de passe actuel
          </label>
          <input
            type="password"
            name="current_password"
            value={formData.current_password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Confirmer le nouveau mot de passe
          </label>
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Modifier le mot de passe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;