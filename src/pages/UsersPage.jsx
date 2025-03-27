import React, { useState, useEffect } from 'react';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import UserForm from '../components/features/users/UserForm';
import UserList from '../components/features/users/UserList';
import userService from '../services/userService';
import { toast } from 'react-toastify';

const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      toast.error('Erreur lors de la récupération des utilisateurs');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsAddingUser(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsAddingUser(false);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await userService.deleteUser(userId);
      await fetchUsers();
      toast.success('Utilisateur supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression de l\'utilisateur');
      console.error(error);
    }
  };

  const handleFormClose = () => {
    setSelectedUser(null);
    setIsAddingUser(false);
  };

  const handleUserCreated = async () => {
    await fetchUsers();
    setIsAddingUser(false);
  };

  const handleUserUpdated = async () => {
    await fetchUsers();
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="px-6 py-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Gestion des Utilisateurs
          </h1>
          {!isAddingUser && !selectedUser && (
            <button 
              onClick={handleAddUser} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <FaPlus className="mr-2" />
              Ajouter un utilisateur
            </button>
          )}
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : isAddingUser ? (
            <UserForm
              onClose={handleFormClose}
              onUserCreated={handleUserCreated}
            />
          ) : selectedUser ? (
            <UserForm
              user={selectedUser}
              onClose={handleFormClose}
              onUserUpdated={handleUserUpdated}
            />
          ) : (
            <UserList
              users={users}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;