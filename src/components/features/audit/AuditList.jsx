import React, { useState } from 'react';
import { 
  FaPlus, FaEdit, FaTrash, FaInfo, FaUser, 
  FaCalendarAlt, FaMoneyBillWave, FaUserEdit,
  FaSort, FaSortUp, FaSortDown, FaEye, FaChevronRight,
  FaSearch, FaFilter
} from 'react-icons/fa';

const AuditList = ({ audits, formatCurrency }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortField, setSortField] = useState('date_operation');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fonction pour trier les données
  const sortedAudits = [...audits].sort((a, b) => {
    if (sortField === 'date_operation') {
      return sortDirection === 'asc' 
        ? new Date(a.date_operation) - new Date(b.date_operation)
        : new Date(b.date_operation) - new Date(a.date_operation);
    }
    
    // Pour les autres champs
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Filtrer les audits en fonction du terme de recherche
  const filteredAudits = sortedAudits.filter(audit => 
    audit.nom_client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audit.numero_compte?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audit.utilisateur?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour changer le tri
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Fonction pour afficher l'icône de tri appropriée
  const renderSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="h-3 w-3 ml-1 text-indigo-400" />;
    return sortDirection === 'asc' 
      ? <FaSortUp className="h-3 w-3 ml-1 text-indigo-600" />
      : <FaSortDown className="h-3 w-3 ml-1 text-indigo-600" />;
  };

  // Fonction pour obtenir l'icône et la couleur en fonction du type d'action
  const getActionTypeDisplay = (actionType) => {
    switch (actionType) {
      case 'INSERT':
        return {
          icon: <FaPlus className="h-3.5 w-3.5" />,
          text: 'Ajout',
          bgColor: 'from-green-100 to-emerald-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          iconBg: 'from-green-500 to-emerald-500',
        };
      case 'UPDATE':
        return {
          icon: <FaEdit className="h-3.5 w-3.5" />,
          text: 'Modification',
          bgColor: 'from-amber-100 to-yellow-100',
          textColor: 'text-amber-800',
          borderColor: 'border-amber-200',
          iconBg: 'from-amber-500 to-yellow-500',
        };
      case 'DELETE':
        return {
          icon: <FaTrash className="h-3.5 w-3.5" />,
          text: 'Suppression',
          bgColor: 'from-red-100 to-rose-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          iconBg: 'from-red-500 to-rose-500',
        };
      default:
        return {
          icon: <FaInfo className="h-3.5 w-3.5" />,
          text: actionType,
          bgColor: 'from-gray-100 to-gray-200',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          iconBg: 'from-gray-500 to-gray-600',
        };
    }
  };

  // Formater la date d'opération
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Gestion de l'expansion d'une ligne
  const toggleRowExpansion = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="p-1 rounded-2xl border border-transparent">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden backdrop-blur-sm">
        {/* Barre de recherche et de filtres - plus compacte */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 flex justify-between items-center">
          <div className="relative flex-grow mr-3">
            <input 
              type="text" 
              placeholder="Rechercher des opérations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border-0 rounded-lg bg-white bg-opacity-70 backdrop-blur-sm shadow-inner focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 text-gray-700 text-sm"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 h-3 w-3" />
          </div>
          <button className="flex items-center bg-white bg-opacity-70 backdrop-blur-sm text-indigo-700 px-3 py-2 rounded-lg shadow-sm hover:bg-opacity-90 hover:shadow transition-all duration-300 font-medium text-sm">
            <FaFilter className="mr-1.5 h-3 w-3" /> Filtres
          </button>
        </div>

        {/* Table des audits - plus compacte */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                  <button className="flex items-center font-semibold text-indigo-900 hover:text-indigo-700 focus:outline-none"
                    onClick={() => handleSort('action_type')}>
                    Action {renderSortIcon('action_type')}
                  </button>
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                  <button className="flex items-center font-semibold text-indigo-900 hover:text-indigo-700 focus:outline-none"
                    onClick={() => handleSort('date_operation')}>
                    Date {renderSortIcon('date_operation')}
                  </button>
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                  <button className="flex items-center font-semibold text-indigo-900 hover:text-indigo-700 focus:outline-none"
                    onClick={() => handleSort('nom_client')}>
                    Client {renderSortIcon('nom_client')}
                  </button>
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                  <button className="flex items-center font-semibold text-indigo-900 hover:text-indigo-700 focus:outline-none"
                    onClick={() => handleSort('numero_compte')}>
                    Compte {renderSortIcon('numero_compte')}
                  </button>
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                  <span className="flex items-center font-semibold text-indigo-900">Versement</span>
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                  <span className="flex items-center font-semibold text-indigo-900">Avant</span>
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                  <span className="flex items-center font-semibold text-indigo-900">Après</span>
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                  <button className="flex items-center font-semibold text-indigo-900 hover:text-indigo-700 focus:outline-none"
                    onClick={() => handleSort('utilisateur')}>
                    Utilisateur {renderSortIcon('utilisateur')}
                  </button>
                </th>
                <th scope="col" className="px-3 py-3 text-right text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAudits.map((audit) => {
                const actionTypeDisplay = getActionTypeDisplay(audit.action_type);
                const isExpanded = expandedRow === audit.id;
                
                return (
                  <React.Fragment key={audit.id}>
                    <tr className={`${isExpanded ? 'bg-indigo-50' : 'hover:bg-indigo-50'} transition-colors duration-200 border-b border-gray-200 last:border-b-0`}>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${actionTypeDisplay.bgColor} ${actionTypeDisplay.textColor} border ${actionTypeDisplay.borderColor} shadow-sm`}>
                          <div className={`flex-shrink-0 h-3.5 w-3.5 rounded-full bg-gradient-to-br ${actionTypeDisplay.iconBg} flex items-center justify-center mr-1 shadow-sm`}>
                            {React.cloneElement(actionTypeDisplay.icon, { className: 'h-2 w-2 text-white' })}
                          </div>
                          {actionTypeDisplay.text}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center text-xs text-gray-700">
                          <FaCalendarAlt className="flex-shrink-0 mr-1 h-3 w-3 text-indigo-500" />
                          {formatDate(audit.date_operation)}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 mr-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                              <FaUser className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-900">
                              {audit.nom_client}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-xs text-gray-700 font-medium">
                          {audit.numero_compte}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {audit.numero_versement ? (
                          <div className="flex items-center text-xs">
                            <div className="h-5 w-5 rounded-md bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mr-1.5 shadow-sm">
                              <FaMoneyBillWave className="flex-shrink-0 h-3 w-3 text-green-600" />
                            </div>
                            <span className="font-medium text-gray-700">{audit.numero_versement}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-xs">--</span>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {audit.montant_ancien !== null ? (
                          <span className="font-medium text-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 py-0.5 px-1.5 rounded-md inline-block shadow-sm text-xs">
                            {formatCurrency(audit.montant_ancien)}
                          </span>
                        ) : (
                          <span className="font-medium text-gray-500 bg-gradient-to-r from-gray-50 to-slate-50 py-0.5 px-1.5 rounded-md inline-block shadow-sm text-xs border border-dashed border-gray-200">
                            0,00 €
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {audit.montant_nouveau !== null ? (
                          <span className="font-medium text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 py-0.5 px-1.5 rounded-md inline-block shadow-sm text-xs">
                            {formatCurrency(audit.montant_nouveau)}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic text-xs">--</span>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center text-xs">
                          <div className="h-5 w-5 rounded-md bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mr-1.5 shadow-sm">
                            <FaUserEdit className="flex-shrink-0 h-3 w-3 text-indigo-600" />
                          </div>
                          <span className="font-medium text-gray-700">{audit.utilisateur}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => toggleRowExpansion(audit.id)}
                          className={`p-1.5 rounded-lg ${isExpanded ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white' : 'bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 hover:from-indigo-100 hover:to-purple-100'} transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                        >
                          {isExpanded ? <FaEye className="h-3.5 w-3.5" /> : <FaChevronRight className="h-3.5 w-3.5" />}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Ligne de détails - s'affiche quand la ligne est étendue (légèrement plus compacte) */}
                    {isExpanded && (
                      <tr className="bg-indigo-50">
                        <td colSpan="9" className="px-3 py-4 border-t border-indigo-100">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div className="bg-white p-3 rounded-lg shadow-sm border border-indigo-100 bg-gradient-to-br from-white to-indigo-50">
                              <h4 className="text-xs font-semibold text-indigo-800 mb-2 uppercase">Informations de l'opération</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">ID:</span>
                                  <span className="font-medium text-gray-800">{audit.id}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Type:</span>
                                  <span className={`font-medium ${actionTypeDisplay.textColor}`}>{actionTypeDisplay.text}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Date:</span>
                                  <span className="font-medium text-gray-800">{formatDate(audit.date_operation)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-white p-3 rounded-lg shadow-sm border border-indigo-100 bg-gradient-to-br from-white to-indigo-50">
                              <h4 className="text-xs font-semibold text-indigo-800 mb-2 uppercase">Détails client</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Nom:</span>
                                  <span className="font-medium text-gray-800">{audit.nom_client}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Compte:</span>
                                  <span className="font-medium text-gray-800">{audit.numero_compte}</span>
                                </div>
                                {audit.numero_versement && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Versement:</span>
                                    <span className="font-medium text-gray-800">{audit.numero_versement}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="bg-white p-3 rounded-lg shadow-sm border border-indigo-100 bg-gradient-to-br from-white to-indigo-50">
                              <h4 className="text-xs font-semibold text-indigo-800 mb-2 uppercase">Changements financiers</h4>
                              <div className="space-y-2">
                                {audit.montant_ancien !== null && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Avant:</span>
                                    <span className="font-medium text-amber-700">{formatCurrency(audit.montant_ancien)}</span>
                                  </div>
                                )}
                                {audit.montant_nouveau !== null && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Après:</span>
                                    <span className="font-medium text-green-700">{formatCurrency(audit.montant_nouveau)}</span>
                                  </div>
                                )}
                                {audit.montant_ancien !== null && audit.montant_nouveau !== null && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Différence:</span>
                                    <span className={`font-medium ${audit.montant_nouveau > audit.montant_ancien ? 'text-green-700' : 'text-red-700'}`}>
                                      {formatCurrency(audit.montant_nouveau - audit.montant_ancien)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {/* État vide - légèrement plus compact */}
          {filteredAudits.length === 0 && (
            <div className="text-center py-10 bg-gradient-to-br from-indigo-50 to-purple-50 border-t border-gray-200">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <FaCalendarAlt className="text-3xl text-white" />
                </div>
                <h3 className="text-lg font-semibold text-indigo-900">
                  Aucune opération trouvée
                </h3>
                <p className="text-xs text-indigo-600 max-w-md text-center">
                  {searchTerm 
                    ? `Aucun résultat pour "${searchTerm}". Essayez d'autres termes de recherche.`
                    : "Aucune opération n'est disponible pour le moment."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditList;