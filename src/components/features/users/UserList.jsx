import React, { useState } from 'react';
import { 
  FaEdit, 
  FaTrash, 
  FaUserCircle, 
  FaCheckCircle, 
  FaTimesCircle,
  FaSearch,
  FaFilter
} from 'react-icons/fa';

const UserList = ({ users, onEditUser, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const userList = Array.isArray(users) ? users : (users?.data || []);

  // Filtrage des utilisateurs
  const filteredUsers = userList.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
      {/* Barre de recherche et filtres */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div className="relative flex-grow mr-4">
          <input 
            type="text" 
            placeholder="Rechercher des utilisateurs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full pl-10 pr-4 py-2 
              border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-300
            "
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button 
          className="
            flex items-center 
            bg-white border border-gray-300 
            text-gray-700 
            px-4 py-2 
            rounded-lg 
            hover:bg-gray-100 
            transition-colors
          "
        >
          <FaFilter className="mr-2" /> Filtres
        </button>
      </div>

      {/* Liste des utilisateurs */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Utilisateur</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr 
                key={user.id} 
                className="
                  hover:bg-gray-50 
                  transition-colors 
                  duration-200 
                  border-b border-gray-200 
                  last:border-b-0
                "
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 mr-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaUserCircle className="w-8 h-8 text-blue-500" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.full_name || user.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="
                    inline-flex 
                    items-center 
                    px-3 py-1 
                    rounded-full 
                    text-xs 
                    font-medium 
                    bg-gray-100 
                    text-gray-800
                  ">
                    {user.role_name || user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`
                    inline-flex 
                    items-center 
                    px-3 py-1 
                    rounded-full 
                    text-xs 
                    font-medium
                    ${user.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'}
                  `}>
                    {user.is_active !== undefined 
                      ? (user.is_active 
                        ? <><FaCheckCircle className="mr-1" /> Actif</> 
                        : <><FaTimesCircle className="mr-1" /> Inactif</>) 
                      : 'Non défini'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => onEditUser(user)}
                      className="
                        text-blue-600 hover:text-blue-800
                        bg-blue-50 hover:bg-blue-100
                        p-2 rounded-lg
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-blue-300
                      "
                      aria-label="Modifier l'utilisateur"
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onDeleteUser(user.id)}
                      className="
                        text-red-600 hover:text-red-800
                        bg-red-50 hover:bg-red-100
                        p-2 rounded-lg
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-red-300
                      "
                      aria-label="Supprimer l'utilisateur"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
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
            py-12 
            bg-gray-50 
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
              <FaUserCircle className="
                text-6xl 
                text-gray-300 
                mb-4
              " />
              <h3 className="
                text-xl 
                font-semibold 
                text-gray-600
              ">
                Aucun utilisateur trouvé
              </h3>
              <p className="
                text-sm 
                text-gray-500 
                max-w-md 
                text-center
              ">
                Votre liste d'utilisateurs est vide. Commencez par créer un nouvel utilisateur.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;