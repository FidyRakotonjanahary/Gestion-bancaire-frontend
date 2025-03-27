import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import clientService from '../services/clientService';
import versementService from '../services/versementService';
import StatCard from '../components/features/dashboard/StatCard';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import authService from '../services/authService';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalVersements: 0,
    clientsWithBalance: [],
    recentVersements: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Récupération du nombre total de clients
        const clientCountResponse = await clientService.getClientCount();
        const totalClients = clientCountResponse.data.count;
        
        // Récupération du nombre total de versements
        const versementCountResponse = await versementService.getVersementCount();
        const totalVersements = versementCountResponse.data.count;
        
        // Récupération des clients avec solde positif
        const clientsWithBalanceResponse = await clientService.getClientsWithBalance();

        const clientsWithBalance = clientsWithBalanceResponse.data.data;
        
        // Récupération des versements récents
        const currentDate = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        const recentVersementsResponse = await versementService.getVersementsByDateRange(
          lastWeek.toISOString().split('T')[0],
          currentDate.toISOString().split('T')[0]
        );
        const recentVersements = recentVersementsResponse.data.data.slice(0, 5);
        
        setStats({
          totalClients,
          totalVersements,
          clientsWithBalance,
          recentVersements
        });
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données du tableau de bord', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    const checkAuth = async () => {
      const user = await authService.getCurrentUser();
      if (!user) {
        // Rediriger vers la page de connexion
        navigate('/login');
      }
    };
  
    checkAuth();
  }, []);

  const handleClientClick = (clientId) => {
    navigate(`/clients/${clientId}`);
  };

  const handleVersementClick = (versementId) => {
    navigate(`/versements/${versementId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Tableau de bord</h1>
        {/* <p className="text-gray-600">Bienvenue, {user?.username || 'Utilisateur'}</p> */}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total des clients" 
          value={stats.totalClients} 
          icon="users"
          onClick={() => navigate('/clients')}
          className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
        />
        <StatCard 
          title="Total des versements" 
          value={stats.totalVersements} 
          icon="cash"
          onClick={() => navigate('/versements')}
          className="bg-gradient-to-r from-green-50 to-green-100 border-green-200"
        />
        <StatCard 
          title="Clients avec solde" 
          value={stats.clientsWithBalance.length} 
          icon="chart"
          onClick={() => navigate('/clients')}
          className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Clients avec solde
            </h3>
          </div>
          <div className="p-4">
            {stats.clientsWithBalance.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Compte</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Solde</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.clientsWithBalance.slice(0, 5).map((client) => (
                      <tr 
                        key={client.id} 
                        className="hover:bg-blue-50 cursor-pointer transition-colors duration-150" 
                        onClick={() => handleClientClick(client.id)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">{client.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-500">{client.account_number}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-blue-600">
                          {(client?.solde || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500 bg-gray-50 rounded">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p>Aucun client avec solde.</p>
              </div>
            )}
            
            {stats.clientsWithBalance.length > 5 && (
              <div className="mt-4 text-right">
                <button 
                  onClick={() => navigate('/clients')}
                  className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                >
                  Voir tous les clients
                  <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </Card>
        
        <Card className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Versements récents
            </h3>
          </div>
          <div className="p-4">
            {stats.recentVersements.length > 0 ? (
              <div className="space-y-3">
                {stats.recentVersements.map((versement) => (
                  <div 
                    key={versement.id} 
                    className="flex items-center p-3 border border-gray-100 rounded-md hover:bg-green-50 cursor-pointer transition-colors duration-150"
                    onClick={() => handleVersementClick(versement.id)}
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {versement.client_name ? `Versement de ${versement.client_name}` : `Versement #${versement.id}`}
                        </p>
                        <span className="text-sm font-semibold text-green-600">
                          {versement.amount ? versement.amount.toLocaleString('fr-FR') + ' €' : '0.00 €'}
                        </span>
                      </div>
                      {versement.created_at && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(versement.created_at).toLocaleDateString('fr-FR', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      )}
                      {versement.numero_cheque && (
                        <p className="text-xs mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            Chèque n°{versement.numero_cheque}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500 bg-gray-50 rounded">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p>Aucun versement récent.</p>
              </div>
            )}
            
            {stats.recentVersements.length > 0 && (
              <div className="mt-4 text-right">
                <button 
                  onClick={() => navigate('/versements')}
                  className="inline-flex items-center px-4 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
                >
                  Voir tous les versements
                  <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;