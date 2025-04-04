import React from 'react';
import { 
  FaHistory, 
  FaUserEdit, 
  FaPlus, 
  FaTrashAlt,
  FaExclamationTriangle,
  FaUser
} from 'react-icons/fa';

const VersementAuditTrail = ({ data, onBack }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Helper to get icon for action type
  const getActionIcon = (actionType) => {
    switch (actionType.toLowerCase()) {
      case 'création':
      case 'creation':
        return <FaPlus className="text-green-500" />;
      case 'modification':
      case 'update':
        return <FaUserEdit className="text-blue-500" />;
      case 'suppression':
      case 'delete':
        return <FaTrashAlt className="text-red-500" />;
      default:
        return <FaHistory className="text-indigo-500" />;
    }
  };

  // Helper to get style based on action type
  const getActionStyle = (actionType) => {
    switch (actionType.toLowerCase()) {
      case 'création':
      case 'creation':
        return 'border-green-200 bg-green-50';
      case 'modification':
      case 'update':
        return 'border-blue-200 bg-blue-50';
      case 'suppression':
      case 'delete':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl p-6">
      <div className="mb-6 flex items-center">
        <div className="flex-shrink-0 w-12 h-12 mr-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
            <FaHistory className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Historique du versement
          </h2>
          <p className="text-sm text-indigo-600">
            Numéro de versement: {data?.versement?.id || "N/A"}
          </p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-indigo-100">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Informations du versement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Client:</p>
            <p className="text-sm font-medium text-gray-800">{data?.versement?.client_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Numéro de compte:</p>
            <p className="text-sm font-medium text-gray-800">{data?.versement?.account_number || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Numéro de chèque:</p>
            <p className="text-sm font-medium text-gray-800">{data?.versement?.numero_cheque || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Montant:</p>
            <p className="text-sm font-medium text-green-600">{formatCurrency(data?.versement?.amount)}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden border border-indigo-100 rounded-xl shadow-sm">
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-4 border-b border-indigo-200">
          <h3 className="font-medium text-indigo-900">Historique des modifications</h3>
        </div>
        
        {data?.history && data.history.length > 0 ? (
          <div className="bg-white">
            <div className="relative">
              {/* Timeline indicator */}
              <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-indigo-200"></div>
              
              {/* Audit entries */}
              <ul className="relative">
                {data.history.map((entry, index) => (
                  <li key={index} className="relative pl-16 pr-6 py-5 border-b border-gray-100 last:border-b-0">
                    {/* Action indicator */}
                    <div className={`
                      absolute left-6 w-4 h-4 rounded-full border-2 border-white
                      ${entry.action_type?.toLowerCase().includes('creat') ? 'bg-green-500' : 
                         entry.action_type?.toLowerCase().includes('modif') ? 'bg-blue-500' :
                         entry.action_type?.toLowerCase().includes('suppr') ? 'bg-red-500' : 
                         'bg-indigo-500'}
                      shadow-sm
                      z-10
                      mt-1.5
                    `}></div>
                    
                    {/* Content */}
                    <div className={`
                      p-4 rounded-lg border
                      ${getActionStyle(entry.action_type)}
                    `}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <span className="mr-2">
                            {getActionIcon(entry.action_type)}
                          </span>
                          <h4 className="font-medium text-gray-900">{entry.action_type}</h4>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(entry.date_operation)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Client</p>
                          <p className="text-sm font-medium">{entry.nom_client || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Numéro de compte</p>
                          <p className="text-sm font-medium">{entry.numero_compte || "N/A"}</p>
                        </div>
                      </div>
                      
                      {(entry.montant_ancien !== null || entry.montant_nouveau !== null) && (
                        <div className="border-t border-dashed border-gray-200 pt-3 mt-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-500">Montant précédent</p>
                              <p className={`text-sm font-medium ${entry.montant_ancien ? 'text-gray-800' : 'text-gray-400'}`}>
                                {formatCurrency(entry.montant_ancien) || "N/A"}
                              </p>
                            </div>
                            <div className="flex items-center text-gray-400 px-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Nouveau montant</p>
                              <p className={`text-sm font-medium ${entry.montant_nouveau ? 'text-green-600' : 'text-gray-400'}`}>
                                {formatCurrency(entry.montant_nouveau) || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3 flex items-center text-xs text-gray-500">
                        <FaUser className="mr-1" /> 
                        <span>Utilisateur: {entry.utilisateur || "Système"}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-white py-8 px-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
              <FaExclamationTriangle className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">Aucun historique disponible</h3>
            <p className="text-gray-500 text-sm">
              Aucun enregistrement d'audit n'a été trouvé pour ce versement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VersementAuditTrail;