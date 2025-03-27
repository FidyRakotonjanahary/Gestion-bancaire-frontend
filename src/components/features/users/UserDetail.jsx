// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Tab } from '@headlessui/react';
// import { userService } from '../../services/userService';
// import { formatDate } from '../../utils/formatters';
// import { useAuth } from '../../hooks/useAuth';
// import { Spinner } from '../common/Spinner';
// import { Button } from '../common/Button';
// import { Alert } from '../common/Alert';
// import { Card } from '../common/Card';
// import { Table } from '../common/Table';
// import { Modal } from '../common/Modal';

// const UserDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user: currentUser } = useAuth();
  
//   const [user, setUser] = useState(null);
//   const [loginHistory, setLoginHistory] = useState([]);
//   const [permissionHistory, setPermissionHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showStatusModal, setShowStatusModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
  
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // Récupérer les informations de l'utilisateur
//         const userData = await userService.getUserById(id);
//         setUser(userData.data);
        
//         // Récupérer l'historique des connexions
//         const loginData = await userService.getUserLoginHistory(id);
//         setLoginHistory(Array.isArray(loginData.data) ? loginData.data : []);
        
//         // Récupérer l'historique des permissions
//         const permissionData = await userService.getPermissionHistory(id);
//         setPermissionHistory(Array.isArray(permissionData.data) ? permissionData.data : []);
//       } catch (err) {
//         setError('Erreur lors du chargement des données utilisateur');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchUserData();
//   }, [id]);
  
//   const handleStatusChange = async () => {
//     try {
//       const newStatus = !user.is_active;
//       await userService.updateUserStatus(id, { is_active: newStatus });
      
//       setUser(prev => ({
//         ...prev,
//         is_active: newStatus
//       }));
      
//       setShowStatusModal(false);
//     } catch (err) {
//       setError(`Erreur lors de la modification du statut: ${err.message}`);
//     }
//   };
  
//   const handleDelete = async () => {
//     try {
//       await userService.deleteUser(id);
//       navigate('/users', { 
//         replace: true, 
//         state: { message: `L'utilisateur ${user.username} a été supprimé avec succès` } 
//       });
//     } catch (err) {
//       setError(`Erreur lors de la suppression: ${err.message}`);
//       setShowDeleteModal(false);
//     }
//   };
  
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spinner size="lg" />
//       </div>
//     );
//   }
  
//   if (error) {
//     return <Alert type="error" message={error} />;
//   }
  
//   if (!user) {
//     return <Alert type="warning" message="Utilisateur non trouvé" />;
//   }
  
//   // Préparation des données pour les tableaux, avec vérification que les tableaux existent
// const loginData = Array.isArray(loginHistory) && loginHistory.length > 0
// ? loginHistory.map(entry => ({
//     id: entry.id,
//     date: formatDate(entry.timestamp),
//     type: entry.action_type === 'login' ? 'Connexion' : 'Déconnexion',
//     ip_address: entry.ip_address,
//     user_agent: entry.user_agent
//   }))
// : [];

// const permissionData = Array.isArray(permissionHistory) && permissionHistory.length > 0
// ? permissionHistory.map(entry => ({
//     id: entry.id,
//     changed_at: formatDate(entry.changed_at),
//     permission_name: entry.permission_name,
//     status: entry.is_granted ? 'Accordée' : 'Retirée',
//     changed_by: entry.changed_by_username,
//     is_granted: entry.is_granted
//   }))
// : [];
//   console.log('loginHistory:', loginHistory);
// console.log('loginData constructed:', loginData);
  
//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-800">
//           Détails de l'utilisateur: {user.username}
//         </h1>
//         <div className="space-x-2">
//           <Button 
//             variant="primary"
//             onClick={() => navigate(`/users/edit/${id}`)}
//           >
//             Modifier
//           </Button>
//           <Button 
//             variant={user.is_active ? "warning" : "success"}
//             onClick={() => setShowStatusModal(true)}
//           >
//             {user.is_active ? 'Désactiver' : 'Activer'}
//           </Button>
//           <Button 
//             variant="danger"
//             onClick={() => setShowDeleteModal(true)}
//           >
//             Supprimer
//           </Button>
//         </div>
//       </div>
      
//       <Card>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <div>
//             <h3 className="font-medium text-gray-600">Nom d'utilisateur</h3>
//             <p className="mt-1">{user.username}</p>
//           </div>
//           <div>
//             <h3 className="font-medium text-gray-600">Nom complet</h3>
//             <p className="mt-1">{user.full_name || 'Non spécifié'}</p>
//           </div>
//           <div>
//             <h3 className="font-medium text-gray-600">Email</h3>
//             <p className="mt-1">{user.email}</p>
//           </div>
//           <div>
//             <h3 className="font-medium text-gray-600">Rôle</h3>
//             <p className="mt-1">
//               <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                 user.role_name === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
//               }`}>
//                 {user.role_name}
//               </span>
//             </p>
//           </div>
//           <div>
//             <h3 className="font-medium text-gray-600">Statut</h3>
//             <p className="mt-1">
//               <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                 user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//               }`}>
//                 {user.is_active ? 'Actif' : 'Inactif'}
//               </span>
//             </p>
//           </div>
//           <div>
//             <h3 className="font-medium text-gray-600">Date de création</h3>
//             <p className="mt-1">{formatDate(user.created_at)}</p>
//           </div>
//           <div>
//             <h3 className="font-medium text-gray-600">Dernière connexion</h3>
//             <p className="mt-1">{user.last_login ? formatDate(user.last_login) : 'Jamais connecté'}</p>
//           </div>
//           <div>
//             <h3 className="font-medium text-gray-600">Dernière déconnexion</h3>
//             <p className="mt-1">{user.last_logout ? formatDate(user.last_logout) : 'N/A'}</p>
//           </div>
//         </div>
//       </Card>
      
//       <Tab.Group>
//         <Tab.List className="flex space-x-1 rounded-xl bg-blue-50 p-1">
//           <Tab className={({ selected }) =>
//             `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
//              ${selected 
//               ? 'bg-white shadow text-blue-700' 
//               : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-700'
//             }`
//           }>
//             Historique des connexions
//           </Tab>
//           <Tab className={({ selected }) =>
//             `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
//              ${selected 
//               ? 'bg-white shadow text-blue-700' 
//               : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-700'
//             }`
//           }>
//             Historique des permissions
//           </Tab>
//         </Tab.List>
//         <Tab.Panels className="mt-2">
//           <Tab.Panel>
//             <Card>
//               <h2 className="text-lg font-semibold mb-4">Historique des connexions</h2>
//               {loginData.length === 0 ? (
//                 <p className="text-gray-500 italic">Aucun historique de connexion disponible</p>
//               ) : (
//                 <Table 
//                   columns={[
//                     { header: 'Date', accessor: 'date' },
//                     { header: 'Type', accessor: 'type' },
//                     { header: 'Adresse IP', accessor: 'ip_address' },
//                     { header: 'Navigateur', accessor: 'user_agent' }
//                   ]}
//                   data={loginData}
//                 />
//               )}
//             </Card>
//           </Tab.Panel>
//           <Tab.Panel>
//             <Card>
//               <h2 className="text-lg font-semibold mb-4">Historique des permissions</h2>
//               {permissionData.length === 0 ? (
//                 <p className="text-gray-500 italic">Aucun historique de permission disponible</p>
//               ) : (
//                 <Table 
//                   columns={[
//                     { header: 'Date', accessor: 'changed_at' },
//                     { header: 'Permission', accessor: 'permission_name' },
//                     { 
//                       header: 'Statut', 
//                       accessor: 'status',
//                       cell: (row) => (
//                         <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           row.is_granted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}>
//                           {row.status}
//                         </span>
//                       )
//                     },
//                     { header: 'Modifié par', accessor: 'changed_by' }
//                   ]}
//                   data={permissionData}
//                 />
//               )}
//             </Card>
//           </Tab.Panel>
//         </Tab.Panels>
//       </Tab.Group>
      
//       {/* Modal de confirmation de changement de statut */}
//       <Modal
//         isOpen={showStatusModal}
//         onClose={() => setShowStatusModal(false)}
//         title={user.is_active ? "Désactiver l'utilisateur" : "Activer l'utilisateur"}
//       >
//         <p className="mb-4">
//           {user.is_active 
//             ? `Êtes-vous sûr de vouloir désactiver l'utilisateur "${user.username}" ? Il ne pourra plus se connecter à l'application.` 
//             : `Êtes-vous sûr de vouloir activer l'utilisateur "${user.username}" ? Il pourra à nouveau se connecter à l'application.`
//           }
//         </p>
//         <div className="flex justify-end space-x-2">
//           <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
//             Annuler
//           </Button>
//           <Button 
//             variant={user.is_active ? "warning" : "success"}
//             onClick={handleStatusChange}
//           >
//             {user.is_active ? 'Désactiver' : 'Activer'}
//           </Button>
//         </div>
//       </Modal>
      
//       {/* Modal de confirmation de suppression */}
//       <Modal
//         isOpen={showDeleteModal}
//         onClose={() => setShowDeleteModal(false)}
//         title="Supprimer l'utilisateur"
//       >
//         <p className="mb-4">
//           Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur "{user.username}" ? 
//           Cette action est irréversible.
//         </p>
//         <div className="flex justify-end space-x-2">
//           <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
//             Annuler
//           </Button>
//           <Button 
//             variant="danger"
//             onClick={handleDelete}
//           >
//             Supprimer
//           </Button>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default UserDetail;