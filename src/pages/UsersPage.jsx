import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaSpinner, 
  FaUserCircle, 
  FaArrowLeft
} from 'react-icons/fa';
import UserForm from '../components/features/users/UserForm';
import UserList from '../components/features/users/UserList';
import userService from '../services/userService';
import { toast } from 'react-toastify';
import PermissionModal from '../components/features/users/PermissionsModal';

const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userForPermissions, setUserForPermissions] = useState(null);

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
  const handleManagePermissions = (user) => {
    setUserForPermissions(user);
    setSelectedUser(null);
    setIsAddingUser(false);
  };
  const handleFormClose = () => {
    setSelectedUser(null);
    setIsAddingUser(false);
  };

  const handleUserCreated = async () => {
    await fetchUsers();
    setIsAddingUser(false);
    toast.success('Utilisateur créé avec succès');
  };

  const handleUserUpdated = async () => {
    await fetchUsers();
    setSelectedUser(null);
    toast.success('Utilisateur mis à jour avec succès');
  };

  const handleUpdatePermissions = async (userId, permissions) => {
    try {
      // Si vous avez besoin de rafraîchir la liste des utilisateurs après la mise à jour des permissions
      await fetchUsers();
      toast.success('Permissions mises à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des permissions');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto p-1 rounded-2xl border border-transparent">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden backdrop-blur-sm shadow-md">
          {/* Header with gradient background similar to ClientList */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 flex justify-between items-center">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold text-indigo-900">
                  {isAddingUser 
                    ? 'Ajouter un Utilisateur' 
                    : selectedUser 
                      ? 'Modifier un Utilisateur' 
                      : userForPermissions
                        ? `Gérer les Permissions - ${userForPermissions.full_name || userForPermissions.name}`
                        : 'Gestion des Utilisateurs'}
                </h1>
            </div>
            {!isAddingUser && !selectedUser && !userForPermissions && (
              <button 
                onClick={handleAddUser} 
                className="
                  group
                  relative
                  flex items-center 
                  bg-white
                  text-indigo-600
                  px-5 py-3
                  rounded-lg 
                  overflow-hidden
                  shadow-sm
                  hover:shadow-md
                  transition-all duration-300
                  font-medium
                "
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                <FaPlus className="mr-2 relative z-10" />
                <span className="relative z-10">Ajouter un utilisateur</span>
              </button>
            )}
          </div>

          {/* Main Content */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md mb-4">
                  <FaSpinner className="h-8 w-8 animate-spin text-white" />
                </div>
                <p className="text-indigo-700 font-medium">Chargement en cours...</p>
              </div>
            </div>
          ) : (
            <div>
              {isAddingUser ? (
                    <div className="p-6 bg-white">
                      <UserForm
                        onClose={handleFormClose}
                        onUserCreated={handleUserCreated}
                      />
                    </div>
                  ) : selectedUser ? (
                    <div className="p-6 bg-white">
                      <UserForm
                        user={selectedUser}
                        onClose={handleFormClose}
                        onUserUpdated={handleUserUpdated}
                      />
                    </div>
                  ) : userForPermissions ? (
                    <div className="p-6 bg-white">
                      <PermissionModal
                        user={userForPermissions}
                        onClose={() => setUserForPermissions(null)}
                        onSavePermissions={handleUpdatePermissions}
                      />
                    </div>
                  ) : (
                    <UserList
                      users={users}
                      onEditUser={handleEditUser}
                      onDeleteUser={handleDeleteUser}
                      onManagePermissions={handleManagePermissions}
                    />
                  )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;