import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaSpinner, 
  FaUserCircle, 
  FaArrowLeft,
  FaHistory
} from 'react-icons/fa';
import ClientForm from '../components/features/clients/ClientForm';
import ClientList from '../components/features/clients/ClientList';
import ClientBalanceHistory from '../components/features/clients/ClientBalanceHistory';
import clientService from '../services/clientService';
import { toast } from 'react-toastify';
import usePermissions from '../hooks/usePermissions'


const ClientsPage = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingBalance, setViewingBalance] = useState(false);
  const [balanceData, setBalanceData] = useState(null);
  const { hasPermission } = usePermissions();
  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await clientService.getAllClients();
      setClients(response.data || []);
    } catch (error) {
      toast.error('Erreur lors de la récupération des clients');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

// Fonction pour ajouter un client avec vérification de permission
const handleAddClient = () => {
  if (!hasPermission('client_create')) {
    toast.error("Vous n'avez pas la permission d'ajouter un client");
    return;
  }
  setSelectedClient(null);
  setIsAddingClient(true);
  setViewingBalance(false);
};

// Fonction pour modifier un client avec vérification de permission
const handleEditClient = (client) => {
  if (!hasPermission('client_update')) {
    toast.error("Vous n'avez pas la permission de modifier un client");
    return;
  }
  setSelectedClient(client);
  setIsAddingClient(false);
  setViewingBalance(false);
};

// Fonction pour supprimer un client avec vérification de permission
const handleDeleteClient = async (clientId) => {
  if (!hasPermission('client_delete')) {
    toast.error("Vous n'avez pas la permission de supprimer un client");
    return;
  }
  
  try {
    await clientService.deleteClient(clientId);
    await fetchClients();
    toast.success('Client supprimé avec succès');
  } catch (error) {
    toast.error('Erreur lors de la suppression du client');
    console.error(error);
  }
};

  const handleViewBalance = async (client) => {
    try {
      setIsLoading(true);
      const response = await clientService.getClientBalanceHistory(client.id);
      setBalanceData({
        client: client,
        history: response.data || []
      });
      setViewingBalance(true);
      setIsAddingClient(false);
      setSelectedClient(null);
    } catch (error) {
      toast.error('Erreur lors de la récupération de l\'historique du solde');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormClose = () => {
    setSelectedClient(null);
    setIsAddingClient(false);
  };

  const handleClientCreated = async () => {
    await fetchClients();
    setIsAddingClient(false);
    toast.success('Client créé avec succès');
  };

  const handleClientUpdated = async () => {
    await fetchClients();
    setSelectedClient(null);
    toast.success('Client mis à jour avec succès');
  };

  const handleBackFromBalance = () => {
    setViewingBalance(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto p-1 rounded-2xl border border-transparent">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden backdrop-blur-sm shadow-md">
          {/* Header with gradient background similar to ClientList */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 flex justify-between items-center">
            <div className="flex items-center">
              {(viewingBalance) && (
                <button 
                  onClick={() => {
                    setSelectedClient(null);
                    setIsAddingClient(false);
                    setViewingBalance(false);
                  }}
                  className="
                    group
                    relative
                    mr-4
                    text-indigo-600 
                    bg-white
                    p-2.5
                    rounded-lg
                    shadow-sm
                    hover:shadow-md
                    transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-indigo-200
                    overflow-hidden
                  "
                >               
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              <FaArrowLeft className="w-5 h-5 relative z-10" />
            </button>
              )}
              <h1 className="text-xl font-semibold text-indigo-900">
                {isAddingClient 
                  ? 'Ajouter un Client' 
                  : selectedClient 
                    ? 'Modifier un Client' 
                    : viewingBalance 
                      ? `Historique du Solde : ${balanceData?.client.name}` 
                      : 'Gestion des Clients'}
              </h1>
            </div>
            {!isAddingClient && !selectedClient && !viewingBalance && hasPermission('client_create') && (
              <button 
  onClick={handleAddClient} 
  className="
    group
    relative
    flex items-center 
    bg-white
    text-indigo-600
    px-5 py-3
    rounded-lg 
    overflow-hidden
    shadow-sm
    hover:shadow-md
    transition-all duration-300
    font-medium
  "
>
  <span className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
  <FaPlus className="mr-2 relative z-10" />
  <span className="relative z-10">Ajouter un client</span>
</button>
            )}
          </div>

          {/* Main Content */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md mb-4">
                  <FaSpinner className="h-8 w-8 animate-spin text-white" />
                </div>
                <p className="text-indigo-700 font-medium">Chargement en cours...</p>
              </div>
            </div>
          ) : (
            <div>
              {isAddingClient ? (
                <div className="p-6 bg-white">
                  <ClientForm
                    onClose={handleFormClose}
                    onClientCreated={handleClientCreated}
                  />
                </div>
              ) : selectedClient ? (
                <div className="p-6 bg-white">
                  <ClientForm
                    client={selectedClient}
                    onClose={handleFormClose}
                    onClientUpdated={handleClientUpdated}
                  />
                </div>
              ) : viewingBalance && balanceData ? (
                <div className="p-6 bg-white">
                  <ClientBalanceHistory 
                    data={balanceData} 
                    onBack={handleBackFromBalance} 
                  />
                </div>
              ) : (
                <ClientList
                  clients={clients}
                  onEditClient={handleEditClient}
                  onDeleteClient={handleDeleteClient}
                  onViewBalance={handleViewBalance}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;