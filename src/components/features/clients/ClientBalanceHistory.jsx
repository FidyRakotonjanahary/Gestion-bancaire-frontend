import React from 'react';
import { FaArrowLeft, FaMoneyBillWave, FaHistory } from 'react-icons/fa';

const ClientBalanceHistory = ({ data, onBack }) => {
  const { client, history } = data;
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Extraire le tableau d'historique depuis la structure de données
  const historyItems = history && history.data ? history.data : [];

  return (
    <div className="p-1 rounded-2xl border border-transparent">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden backdrop-blur-sm">

        {/* Current Balance */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-indigo-600">Solde actuel</div>
              <div className={`text-2xl font-bold ${
                parseFloat(client.balance) > 0 
                  ? 'text-green-600' 
                  : parseFloat(client.balance) < 0
                    ? 'text-red-600'
                    : 'text-gray-600'
              }`}>
                {formatCurrency(client.balance)}
              </div>
            </div>
            <div className={`
              flex items-center 
              px-4 py-2 
              rounded-lg
              shadow-sm
              ${parseFloat(client.balance) > 0 
                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' 
                : parseFloat(client.balance) < 0
                  ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'}
            `}>
              <FaMoneyBillWave className="mr-2" />
              {parseFloat(client.balance) > 0 
                ? 'Solde positif' 
                : parseFloat(client.balance) < 0
                  ? 'Solde négatif'
                  : 'Solde nul'}
            </div>
          </div>
        </div>

        {/* Balance History */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-indigo-900 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-indigo-900 uppercase tracking-wider">Solde après</th>
              </tr>
            </thead>
            <tbody>
              {historyItems.length > 0 ? (
                historyItems.map((item) => {
                  // Déterminer si c'est un crédit ou un débit basé sur les données disponibles
                  const isCredit = !item.montant_ancien || parseFloat(item.montant_nouveau) > parseFloat(item.montant_ancien);
                  const amount = !item.montant_ancien 
                    ? parseFloat(item.montant_nouveau) 
                    : Math.abs(parseFloat(item.montant_nouveau) - parseFloat(item.montant_ancien));
                  
                  return (
                    <tr 
                      key={item.id} 
                      className="
                        hover:bg-indigo-50
                        transition-colors 
                        duration-200 
                        border-b border-gray-200 
                        last:border-b-0
                      "
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(item.date_operation).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-indigo-500">
                          {new Date(item.date_operation).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`
                          inline-flex 
                          items-center 
                          px-3 py-1 
                          rounded-full 
                          text-xs 
                          font-medium
                          shadow-sm
                          ${isCredit 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' 
                            : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800'}
                        `}>
                          {isCredit ? 'Crédit' : 'Débit'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`text-sm font-medium ${
                          isCredit 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {isCredit ? '+' : '-'} {formatCurrency(amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.montant_nouveau)}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center">
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
                        <FaHistory className="
                          text-5xl 
                          text-white
                        " />
                      </div>
                      <h3 className="
                        text-xl 
                        font-semibold 
                        text-indigo-900
                      ">
                        Aucun historique disponible
                      </h3>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientBalanceHistory;