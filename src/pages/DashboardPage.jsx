import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import clientService from '../services/clientService';
import versementService from '../services/versementService';
import StatCard from '../components/features/dashboard/StatCard';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import authService from '../services/authService';
import {
  FaUsers,
  FaMoneyBillWave,
  FaChartLine,
  FaUserCircle,
  FaCreditCard,
  FaSpinner
} from 'react-icons/fa';

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
        const totalClients = clientCountResponse.data.data.count;
        
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md mb-4">
            <FaSpinner className="h-8 w-8 animate-spin text-white" />
          </div>
          <p className="text-indigo-700 font-medium">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto p-1 rounded-2xl border border-transparent">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden backdrop-blur-sm shadow-md">
          {/* Header with gradient background */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-indigo-900">Tableau de bord</h1>
            </div>
          </div>

          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div 
                onClick={() => navigate('/clients')}
                className="
                  group
                  bg-white 
                  rounded-lg 
                  overflow-hidden 
                  shadow-sm
                  hover:shadow-md
                  transition-all duration-300
                  cursor-pointer
                  relative
                  p-1
                "
              >
                <div className="
                  absolute inset-0 
                  bg-gradient-to-br from-indigo-50 to-purple-50 
                  opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300
                "></div>
                <div className="
                  absolute bottom-0 left-0 w-full h-0.5 
                  bg-gradient-to-r from-indigo-400 to-purple-400 
                  transform scale-x-0 group-hover:scale-x-100 
                  transition-transform origin-left duration-300
                "></div>
                
                <div className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                      <FaUsers className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-indigo-900">{stats.totalClients}</span>
                  </div>
                  <h3 className="text-gray-700 font-medium">Total des clients</h3>
                </div>
              </div>
              
              <div 
                onClick={() => navigate('/versements')}
                className="
                  group
                  bg-white 
                  rounded-lg 
                  overflow-hidden 
                  shadow-sm
                  hover:shadow-md
                  transition-all duration-300
                  cursor-pointer
                  relative
                  p-1
                "
              >
                <div className="
                  absolute inset-0 
                  bg-gradient-to-br from-teal-50 to-green-50 
                  opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300
                "></div>
                <div className="
                  absolute bottom-0 left-0 w-full h-0.5 
                  bg-gradient-to-r from-teal-400 to-green-400 
                  transform scale-x-0 group-hover:scale-x-100 
                  transition-transform origin-left duration-300
                "></div>
                
                <div className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center shadow-md">
                      <FaMoneyBillWave className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-teal-800">{stats.totalVersements}</span>
                  </div>
                  <h3 className="text-gray-700 font-medium">Total des versements</h3>
                </div>
              </div>
              
              <div 
                onClick={() => navigate('/clients')}
                className="
                  group
                  bg-white 
                  rounded-lg 
                  overflow-hidden 
                  shadow-sm
                  hover:shadow-md
                  transition-all duration-300
                  cursor-pointer
                  relative
                  p-1
                "
              >
                <div className="
                  absolute inset-0 
                  bg-gradient-to-br from-blue-50 to-sky-50 
                  opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300
                "></div>
                <div className="
                  absolute bottom-0 left-0 w-full h-0.5 
                  bg-gradient-to-r from-blue-400 to-sky-400 
                  transform scale-x-0 group-hover:scale-x-100 
                  transition-transform origin-left duration-300
                "></div>
                
                <div className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center shadow-md">
                      <FaChartLine className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-blue-900">{stats.clientsWithBalance.length}</span>
                  </div>
                  <h3 className="text-gray-700 font-medium">Clients avec solde</h3>
                </div>
              </div>
            </div>
            
            {/* Main Content: 2 Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Clients avec solde Card */}
              <div className="p-1 rounded-lg overflow-hidden">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="p-5 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                    <h3 className="text-lg font-semibold text-indigo-900 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm mr-3">
                        <FaUserCircle className="w-4 h-4 text-white" />
                      </div>
                      Clients avec solde
                    </h3>
                  </div>
                  
                  <div className="bg-white">
                    {stats.clientsWithBalance.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">Nom</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">N° Compte</th>
                              <th className="px-6 py-3 text-right text-xs font-semibold text-indigo-900 uppercase tracking-wider">Solde</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.clientsWithBalance.slice(0, 5).map((client) => (
                              <tr 
                                key={client.id} 
                                className="hover:bg-indigo-50 transition-colors duration-200 border-b border-gray-200 last:border-b-0"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 w-8 h-8 mr-3">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm">
                                        <FaUserCircle className="w-5 h-5 text-white" />
                                      </div>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {client.name}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center">
                                    <FaCreditCard className="text-indigo-400 mr-2" />
                                    <span className="text-sm text-gray-700">{client.account_number}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-indigo-600">
                                  {formatCurrency(client?.solde || 0)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-gray-500 bg-gradient-to-br from-indigo-50 to-purple-50">
                        <div className="w-16 h-16 mx-auto rounded-full bg-white flex items-center justify-center shadow-md mb-4">
                          <FaUserCircle className="w-8 h-8 text-indigo-300" />
                        </div>
                        <p className="text-indigo-700">Aucun client avec solde.</p>
                      </div>
                    )}
                    
                    {stats.clientsWithBalance.length > 2 && (
                      <div className="p-5 text-right">
                        <button 
                          onClick={() => navigate('/clients')}
                          className="
                            group
                            inline-flex items-center 
                            px-4 py-2 
                            bg-white
                            border border-indigo-200
                            rounded-lg 
                            text-indigo-700
                            relative
                            overflow-hidden
                            shadow-sm
                            hover:shadow
                            transition-all duration-300
                          "
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                          <span className="relative z-10">Voir tous les clients</span>
                          <svg className="ml-2 w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Versements récents Card */}
              <div className="p-1 rounded-lg overflow-hidden">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="p-5 border-b bg-gradient-to-r from-teal-50 to-green-50">
                    <h3 className="text-lg font-semibold text-teal-900 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center shadow-sm mr-3">
                        <FaMoneyBillWave className="w-4 h-4 text-white" />
                      </div>
                      Versements récents
                    </h3>
                  </div>
                  
                  <div className="bg-white">
                    {stats.recentVersements.length > 0 ? (
                      <div className="p-5 space-y-3">
                        {stats.recentVersements.map((versement) => (
                          <div 
                            key={versement.id} 
                            className="
                              group
                              flex items-center 
                              p-4 
                              bg-white
                              border border-gray-100 
                              rounded-lg 
                              shadow-sm
                              hover:border-teal-200
                              relative
                              overflow-hidden
                            "
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-teal-400 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                            
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-green-400 flex items-center justify-center mr-4 flex-shrink-0 shadow-sm relative z-10">
                              <FaMoneyBillWave className="w-5 h-5 text-white" />
                            </div>
                            
                            <div className="flex-1 min-w-0 relative z-10">
                              <div className="flex justify-between">
                                <p className="text-sm font-medium text-gray-900">
                                  {`Versement de ${versement.nom_client}`}
                                </p>
                                <span className="text-sm font-semibold text-teal-600">
                                  {formatCurrency(versement.amount || 0)}
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
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800">
                                    {versement.numero_cheque}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-gray-500 bg-gradient-to-br from-teal-50 to-green-50">
                        <div className="w-16 h-16 mx-auto rounded-full bg-white flex items-center justify-center shadow-md mb-4">
                          <FaMoneyBillWave className="w-8 h-8 text-teal-300" />
                        </div>
                        <p className="text-teal-700">Aucun versement récent.</p>
                      </div>
                    )}
                    
                    {stats.recentVersements.length > 2 && (
                      <div className="p-5 text-right">
                        <button 
                          onClick={() => navigate('/versements')}
                          className="
                            group
                            inline-flex items-center 
                            px-4 py-2 
                            bg-white
                            border border-teal-200
                            rounded-lg 
                            text-teal-700
                            relative
                            overflow-hidden
                            shadow-sm
                            hover:shadow
                            transition-all duration-300
                          "
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-teal-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-teal-400 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                          <span className="relative z-10">Voir tous les versements</span>
                          <svg className="ml-2 w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;