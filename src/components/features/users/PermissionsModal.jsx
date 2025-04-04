import React, { useState, useEffect } from 'react';
import { FaLock, FaCheckCircle, FaRegCircle, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import apiService from '../../../services/api';

const PermissionModal = ({ user, onClose, onSavePermissions }) => {
  const permissionsList = [
    { 
      category: 'Clients', 
      permissions: [
        { id: 'client_read', label: 'Consulter les clients' },
        { id: 'client_create', label: 'Créer des clients', dependsOn: 'client_read' },
        { id: 'client_update', label: 'Modifier des clients', dependsOn: 'client_read' },
        { id: 'client_delete', label: 'Supprimer des clients', dependsOn: 'client_read' }
      ]
    },
    { 
      category: 'Versements', 
      permissions: [
        { id: 'versement_read', label: 'Consulter les versements' },
        { id: 'versement_create', label: 'Créer des versements', dependsOn: 'versement_read' },
        { id: 'versement_update', label: 'Modifier des versements', dependsOn: 'versement_read' },
        { id: 'versement_delete', label: 'Supprimer des versements', dependsOn: 'versement_read' }
      ]
    }
  ];

  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(permissionsList[0].category);

  // Fetch existing user permissions when modal opens
  useEffect(() => {
    const fetchUserPermissions = async () => {
      if (!user?.id) {
        setError('Informations utilisateur invalides');
        setLoading(false);
        return;
      }
  
      try {
        setLoading(true);
        
        const response = await apiService.get(`/permissions/user/${user.id}`);
  
        let permissionsData = [];
        
        if (response?.data?.data && Array.isArray(response.data.data)) {
          permissionsData = response.data.data;
        } else if (Array.isArray(response?.data)) {
          permissionsData = response.data;
        } else {
          console.warn('Structure de réponse inattendue:', response);
        }
  
        const existingPermissions = permissionsData
          .filter(perm => perm.is_granted)
          .map(perm => perm.permission_name);
        
        setSelectedPermissions(existingPermissions);
        setError(null);
      } catch (err) {
        console.error('Erreur de chargement des permissions:', err);
        
        setError(
          err.response?.data?.message || 
          err.message || 
          'Impossible de charger les permissions existantes'
        );
        setSelectedPermissions([]); 
      } finally {
        setLoading(false);
      }
    };
  
    if (user?.id) {
      fetchUserPermissions();
    }
  }, [user]);

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions(prev => {
      const permission = permissionsList
        .flatMap(category => category.permissions)
        .find(p => p.id === permissionId);

      if (permission.dependsOn) {
        if (!prev.includes(permission.dependsOn)) {
          return [...prev, permission.dependsOn, permissionId];
        }
      }

      return prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId];
    });
  };

  const isPermissionDisabled = (permission) => {
    return permission.dependsOn && 
           !selectedPermissions.includes(permission.dependsOn);
  };

  const savePermissions = async () => {
    try {
      setLoading(true);
      
      const permissionsToSave = permissionsList
        .flatMap(category => category.permissions)
        .map(permission => ({
          permissionName: permission.id,
          isGranted: selectedPermissions.includes(permission.id)
        }));
  
      await apiService.put(`/permissions/user/${user.id}`, {
        permissions: permissionsToSave
      });
      
      toast.success(`Permissions mises à jour pour ${user.full_name || user.name}`);
      
      if (onSavePermissions) {
        onSavePermissions(user.id, selectedPermissions);
      }
      
      onClose();
    } catch (err) {
      console.error('Erreur:', err);
      
      toast.error(
        err.response?.data?.message || 
        'Impossible de mettre à jour les permissions'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden backdrop-blur-sm shadow-md">
      {/* Main Content */}
      <div className="flex bg-white">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                  <FaLock className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {user?.full_name || user?.name || 'Utilisateur'}
                </div>
                <div className="text-xs text-gray-600">{user?.email || 'Email non disponible'}</div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-xs font-semibold text-indigo-900 uppercase tracking-wider mb-3">
              Catégories
            </h3>
            <div className="space-y-2">
              {permissionsList.map((category) => (
                <button
                  key={category.category}
                  onClick={() => setActiveCategory(category.category)}
                  className={`
                    w-full text-left px-4 py-3 rounded-lg text-sm font-medium
                    transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-200
                    ${activeCategory === category.category
                      ? 'bg-white text-indigo-800 shadow-md'
                      : 'text-gray-700 hover:bg-white hover:text-indigo-700 hover:shadow-sm'}
                  `}
                >
                  {category.category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Permissions Content */}
        <div className="flex-1 flex flex-col max-h-[70vh]">
          {loading ? (
            <div className="flex justify-center items-center h-64 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 flex-1">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md mb-4">
                  <FaLock className="h-8 w-8 text-white animate-pulse" />
                </div>
                <p className="text-indigo-700 font-medium">Chargement des permissions...</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-6 overflow-y-auto">
              {permissionsList
                .filter(category => category.category === activeCategory)
                .map((category) => (
                  <div key={category.category}>
                    <h2 className="text-lg font-semibold mb-4 text-indigo-900 pb-2 border-b border-gray-200">
                      Permissions {category.category}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {category.permissions.map((permission) => {
                        const isDisabled = isPermissionDisabled(permission);
                        const isSelected = selectedPermissions.includes(permission.id);
                        
                        return (
                          <div
                            key={permission.id}
                            onClick={() => !isDisabled && handlePermissionToggle(permission.id)}
                            className={`
                              flex items-center space-x-3 p-3 rounded-lg border
                              transition-all duration-300
                              ${isDisabled 
                                ? 'opacity-60 border-gray-200 bg-gray-50 cursor-not-allowed'
                                : isSelected
                                  ? 'border-indigo-200 bg-indigo-50 cursor-pointer hover:bg-indigo-100'
                                  : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50 cursor-pointer'}
                            `}
                          >
                            <div className="flex-shrink-0 w-6 h-6">
                              {isSelected ? (
                                <FaCheckCircle className={`w-5 h-5 ${isDisabled ? 'text-gray-400' : 'text-indigo-600'}`} />
                              ) : (
                                <FaRegCircle className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {permission.label}
                              </p>
                              {isDisabled && permission.dependsOn && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Nécessite: {
                                    category.permissions.find(p => p.id === permission.dependsOn)?.label
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="
                px-4 py-2 
                bg-white text-gray-700
                border border-gray-300
                rounded-lg 
                hover:bg-gray-50
                transition-all duration-300
                shadow-sm hover:shadow
                focus:outline-none focus:ring-2 focus:ring-gray-200
              "
            >
              Annuler
            </button>
            <button
              onClick={savePermissions}
              disabled={loading}
              className="
                group
                relative
                flex items-center 
                bg-white
                text-indigo-600
                px-5 py-2
                rounded-lg 
                overflow-hidden
                shadow-sm
                hover:shadow-md
                transition-all duration-300
                font-medium
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-indigo-200
              "
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              <span className="relative z-10">
                {loading ? 'Enregistrement...' : 'Enregistrer les permissions'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;