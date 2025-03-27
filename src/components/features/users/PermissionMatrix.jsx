import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Alert from '../../common/Alert';
import Spinner from '../../common/Spinner';

const PermissionMatrix = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userData, setUserData] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [userPermissions, setUserPermissions] = useState({});
  const [permissionGroups, setPermissionGroups] = useState({});
  
  // Charger les données de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUserData(response.data.data);
      } catch (err) {
        setError('Erreur lors du chargement des données utilisateur: ' + (err.response?.data?.message || err.message));
      } finally {
        setUserLoading(false);
      }
    };
    
    fetchUserData();
  }, [id]);
  
  // Charger toutes les permissions disponibles et celles de l'utilisateur
  useEffect(() => {
    const fetchPermissionsData = async () => {
      try {
        // Charger toutes les permissions disponibles
        const allPermissionsResponse = await axios.get('/api/permissions', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Charger les permissions de l'utilisateur
        const userPermissionsResponse = await axios.get(`/api/users/${id}/permissions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Organiser les permissions par groupes
        const groups = {};
        allPermissionsResponse.data.data.forEach(perm => {
          // Extraire le groupe (par exemple, "client" de "client_create")
          const groupName = perm.name.split('_')[0];
          if (!groups[groupName]) {
            groups[groupName] = [];
          }
          groups[groupName].push(perm);
        });
        
        setPermissionGroups(groups);
        
        // Créer un objet de permission pour faciliter la gestion des états
        const userPerms = {};
        userPermissionsResponse.data.data.forEach(perm => {
          userPerms[perm.permission_name] = perm.is_granted;
        });
        
        setPermissions(allPermissionsResponse.data.data);
        setUserPermissions(userPerms);
      } catch (err) {
        setError('Erreur lors du chargement des permissions: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    
    fetchPermissionsData();
  }, [id]);
  
  const handlePermissionChange = (permissionName) => {
    setUserPermissions(prev => ({
      ...prev,
      [permissionName]: !prev[permissionName]
    }));
  };
  
  const handleSavePermissions = async () => {
    try {
      const permissionsToUpdate = Object.keys(userPermissions).map(key => ({
        permission_name: key,
        is_granted: userPermissions[key]
      }));
      
      await axios.put(`/api/users/${id}/permissions`, {
        permissions: permissionsToUpdate
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setSuccess('Permissions mises à jour avec succès');
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Erreur lors de la mise à jour des permissions: ' + (err.response?.data?.message || err.message));
    }
  };
  
  // Fonction pour obtenir un libellé plus lisible du nom de permission
  const formatPermissionLabel = (permName) => {
    const parts = permName.split('_');
    if (parts.length === 2) {
      const [resource, action] = parts;
      
      const resourceMap = {
        'client': 'Client',
        'versement': 'Versement',
        'user': 'Utilisateur',
        'permission': 'Permission',
        'audit': 'Audit'
      };
      
      const actionMap = {
        'create': 'Création',
        'read': 'Consultation',
        'update': 'Modification',
        'delete': 'Suppression',
        'list': 'Liste',
        'manage': 'Gestion'
      };
      
      return `${actionMap[action] || action} de ${resourceMap[resource] || resource}`;
    }
    
    return permName;
  };
  
  if (loading || userLoading) return <Spinner />;
  
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">
          Gestion des permissions - {userData?.username}
        </h1>
        <div>
          <Button 
            variant="secondary" 
            className="mr-2" 
            onClick={() => navigate('/users')}
          >
            Retour
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSavePermissions}
          >
            Enregistrer
          </Button>
        </div>
      </div>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      {success && <Alert variant="success" className="mb-4">{success}</Alert>}
      
      <div className="mb-4">
        <p><strong>Nom:</strong> {userData?.full_name}</p>
        <p><strong>Rôle:</strong> {userData?.role_name}</p>
      </div>
      
      <div className="space-y-6">
        {Object.keys(permissionGroups).map(groupName => (
          <div key={groupName} className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold capitalize mb-3">{groupName}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {permissionGroups[groupName].map(permission => (
                <div key={permission.name} className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!userPermissions[permission.name]}
                      onChange={() => handlePermissionChange(permission.name)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span>{formatPermissionLabel(permission.name)}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button 
          variant="secondary" 
          onClick={() => navigate('/users')}
        >
          Retour
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSavePermissions}
        >
          Enregistrer
        </Button>
      </div>
    </Card>
  );
};

export default PermissionMatrix;