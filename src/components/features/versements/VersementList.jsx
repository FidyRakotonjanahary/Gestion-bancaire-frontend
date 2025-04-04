import React, { useState } from 'react';
import { 
  FaEdit, 
  FaTrash, 
  FaFileInvoice, 
  FaSearch,
  FaFilter,
  FaCreditCard,
  FaMoneyBillWave
} from 'react-icons/fa';
import usePermissions from '../../../hooks/usePermissions';
import { toast } from 'react-toastify';


const VersementList = ({ versements, onEditVersement, onDeleteVersement }) => {
  const { hasPermission } = usePermissions();
  const [searchTerm, setSearchTerm] = useState('');
  const versementList = Array.isArray(versements) ? versements : (versements?.data || []);

  // Filter versements for search
  const filteredVersements = versementList.filter(versement => 
    versement.nom_client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    versement.numero_cheque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    versement.numero_compte?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Format date - amélioration pour gérer les formats de dates
  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    
    // Essayer de convertir la date
    const date = new Date(dateString);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      console.log("Date invalide:", dateString);
      return "Format de date invalide";
    }
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return date.toLocaleDateString('fr-FR', options);
  };

  const handleEdit = (versement) => {
    if (hasPermission('versement_update')) {
      onEditVersement(versement);
    } else {
      toast.error("Vous n'avez pas la permission de modifier un versement");
    }
  };
  
  const handleDelete = (versementId) => {
    if (hasPermission('versement_delete')) {
      onDeleteVersement(versementId);
    } else {
      toast.error("Vous n'avez pas la permission de supprimer un versement");
    }
  };

  return (
    <div className="p-1 rounded-2xl border border-transparent">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden backdrop-blur-sm">
        {/* Search and Filter Bar */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 flex justify-between items-center">
          <div className="relative flex-grow mr-4">
            <input 
              type="text" 
              placeholder="Rechercher des versements..."
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

        {/* Versement List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">N° Chèque</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-indigo-900 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-indigo-900 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVersements.map((versement) => (
                <tr 
                  key={versement.id} 
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
                          <FaFileInvoice className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {versement.nom_client}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center">
                      <FaCreditCard className="text-indigo-400 mr-2" />
                      <span className="text-sm text-gray-700 font-medium">{versement.numero_cheque || "-"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-gray-700">
                      {formatDate(versement.date_creation)}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="
                      inline-flex 
                      items-center 
                      px-3 py-1 
                      rounded-full 
                      text-sm 
                      font-medium
                      shadow-sm
                      bg-gradient-to-r from-green-100 to-emerald-100 text-green-800
                    ">
                      <FaMoneyBillWave className="mr-1" />
                      {formatCurrency(versement.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                  <div className="flex justify-end space-x-2">
  {hasPermission('versement_update') && (
    <button 
      onClick={() => handleEdit(versement)}
      className="
        text-indigo-600 hover:text-indigo-800
        bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100
        p-2 rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-300
        shadow-sm hover:shadow
      "
      aria-label="Modifier le versement"
    >
      <FaEdit className="w-5 h-5" />
    </button>
  )}
  
  {hasPermission('versement_delete') && (
    <button 
      onClick={() => handleDelete(versement.id)}
      className="
        text-rose-600 hover:text-rose-800
        bg-gradient-to-br from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100
        p-2 rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-red-300
        shadow-sm hover:shadow
      "
      aria-label="Supprimer le versement"
    >
      <FaTrash className="w-5 h-5" />
    </button>
  )}
</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredVersements.length === 0 && (
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
                  <FaFileInvoice className="
                    text-5xl 
                    text-white
                  " />
                </div>
                <h3 className="
                  text-xl 
                  font-semibold 
                  text-indigo-900
                ">
                  Aucun versement trouvé
                </h3>
                <p className="
                  text-sm 
                  text-indigo-600
                  max-w-md 
                  text-center
                ">
                  {searchTerm 
                    ? `Aucun résultat pour "${searchTerm}". Essayez d'autres termes de recherche.`
                    : "Votre liste de versements est vide. Commencez par créer un nouveau versement."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VersementList;