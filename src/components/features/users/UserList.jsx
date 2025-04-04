import React, { useState } from 'react';
import { 
  FaEdit, 
  FaTrash, 
  FaUserCircle, 
  FaCheckCircle, 
  FaTimesCircle,
  FaSearch,
  FaFilter,
  FaUnlock
} from 'react-icons/fa';




const UserList = ({ users, onEditUser, onDeleteUser, onManagePermissions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const userList = Array.isArray(users) ? users : (users?.data || []);

  // Filtrage des utilisateurs pour la recherche
  const filteredUsers = userList.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gestion des permissions
  const handleManagePermissions = (user) => {
    // Ne permettre la gestion des permissions que pour les utilisateurs non-admin
    if (user.role_name?.toLowerCase() !== 'admin' && typeof onManagePermissions === 'function') {
      onManagePermissions(user);
    }
  };


  return (
    <div className="p-1 rounded-2xl border border-transparent">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden backdrop-blur-sm">
        {/* Barre de recherche et filtres */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 flex justify-between items-center">
          <div className="relative flex-grow mr-4">
            <input 
              type="text" 
              placeholder="Rechercher des utilisateurs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full pl-10 pr-4 py-3
                border-0 rounded-lg
                bg-white bg-opacity-70 backdrop-blur-sm
                shadow-inner
                focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                transition-all duration-300
                text-gray-700
              "
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
          </div>
          <button 
            className="
              flex items-center 
              bg-white bg-opacity-70 backdrop-blur-sm
              text-indigo-700 
              px-4 py-3
              rounded-lg 
              shadow-sm
              hover:bg-opacity-90
              hover:shadow
              transition-all duration-300
              font-medium
            "
          >
            <FaFilter className="mr-2" /> Filtres
          </button>
        </div>

        {/* Liste des utilisateurs */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-indigo-900 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-indigo-900 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className="
                    hover:bg-indigo-50
                    transition-colors 
                    duration-200 
                    border-b border-gray-200 
                    last:border-b-0
                  "
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 mr-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                          <FaUserCircle className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name || user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-gray-700">{user.email}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="
                      inline-flex 
                      items-center 
                      px-3 py-1 
                      rounded-full 
                      text-sm 
                      font-medium
                      shadow-sm
                      bg-gradient-to-r from-indigo-100 to-purple-100
                      text-indigo-800
                    ">
                      {user.role_name || user.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`
                      inline-flex 
                      items-center 
                      px-3 py-1 
                      rounded-full 
                      text-sm 
                      font-medium
                      shadow-sm
                      ${user.is_active 
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' 
                        : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800'}
                    `}>
                      {user.is_active !== undefined 
                        ? (user.is_active 
                          ? <><FaCheckCircle className="mr-1" /> Actif</> 
                          : <><FaTimesCircle className="mr-1" /> Inactif</>) 
                        : 'Non défini'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => onEditUser(user)}
                        className="
                          text-indigo-600 hover:text-indigo-800
                          bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100
                          p-2 rounded-lg
                          transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-indigo-300
                          shadow-sm hover:shadow
                        "
                        aria-label="Modifier l'utilisateur"
                      >
                        <FaEdit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => onDeleteUser(user.id)}
                        className="
                          text-rose-600 hover:text-rose-800
                          bg-gradient-to-br from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100
                          p-2 rounded-lg
                          transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-red-300
                          shadow-sm hover:shadow
                        "
                        aria-label="Supprimer l'utilisateur"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                      {user.role_name?.toLowerCase() !== 'admin' && (
                        <button 
                          onClick={() => handleManagePermissions(user)}
                          className="
                            text-emerald-600 hover:text-emerald-800
                            bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100
                            p-2 rounded-lg
                            transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-green-300
                            shadow-sm hover:shadow
                          "
                          aria-label="Gérer les permissions"
                        >
                          <FaUnlock className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* État vide */}
          {filteredUsers.length === 0 && (
            <div className="
              text-center 
              py-16
              bg-gradient-to-br from-indigo-50 to-purple-50
              border-t 
              border-gray-200
            ">
              <div className="
                flex 
                flex-col 
                items-center 
                justify-center
                space-y-4
              ">
                <div className="
                  w-20 h-20 
                  rounded-full 
                  bg-gradient-to-br from-indigo-500 to-purple-500 
                  flex items-center justify-center 
                  shadow-lg
                ">
                  <FaUserCircle className="
                    text-5xl 
                    text-white
                  " />
                </div>
                <h3 className="
                  text-xl 
                  font-semibold 
                  text-indigo-900
                ">
                  Aucun utilisateur trouvé
                </h3>
                <p className="
                  text-sm 
                  text-indigo-600
                  max-w-md 
                  text-center
                ">
                  {searchTerm 
                    ? `Aucun résultat pour "${searchTerm}". Essayez d'autres termes de recherche.`
                    : "Votre liste d'utilisateurs est vide. Commencez par créer un nouvel utilisateur."}
                </p>
              </div>
            </div>
          )}

          
        </div>
      </div>
    </div>
  );
};

export default UserList;