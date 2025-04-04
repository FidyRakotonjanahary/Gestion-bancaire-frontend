import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaSpinner, 
  FaFileInvoice, 
  FaArrowLeft
} from 'react-icons/fa';
import VersementForm from '../components/features/versements/VersementForm';
import VersementList from '../components/features/versements/VersementList';
import versementService from '../services/versementService';
import { toast } from 'react-toastify';
import usePermissions from '../hooks/usePermissions';

const VersementsPage = () => {
  const [selectedVersement, setSelectedVersement] = useState(null);
  const [isAddingVersement, setIsAddingVersement] = useState(false);
  const [versements, setVersements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { hasPermission } = usePermissions();

  const fetchVersements = async () => {
    try {
      setIsLoading(true);
      const response = await versementService.getAllVersements();
      setVersements(response.data || []);
    } catch (error) {
      toast.error('Erreur lors de la récupération des versements');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVersements();
  }, []);

  const handleAddVersement = () => {
    if (!hasPermission('versement_create')) {
      toast.error("Vous n'avez pas la permission de créer un versement");
      return;
    }
    setSelectedVersement(null);
    setIsAddingVersement(true);
  };
  

// Modifier la fonction handleEditVersement
const handleEditVersement = (versement) => {
  if (!hasPermission('versement_update')) {
    toast.error("Vous n'avez pas la permission de modifier un versement");
    return;
  }
  setSelectedVersement(versement);
  setIsAddingVersement(false);
};

// Modifier la fonction handleDeleteVersement
const handleDeleteVersement = async (versementId) => {
  if (!hasPermission('versement_delete')) {
    toast.error("Vous n'avez pas la permission de supprimer un versement");
    return;
  }
  
  try {
    await versementService.deleteVersement(versementId);
    await fetchVersements();
    toast.success('Versement supprimé avec succès');
  } catch (error) {
    toast.error('Erreur lors de la suppression du versement');
    console.error(error);
  }
};

  const handleFormClose = () => {
    setSelectedVersement(null);
    setIsAddingVersement(false);
  };

  const handleVersementCreated = async () => {
    await fetchVersements();
    setIsAddingVersement(false);
    toast.success('Versement créé avec succès');
  };

  const handleVersementUpdated = async () => {
    await fetchVersements();
    setSelectedVersement(null);
    toast.success('Versement mis à jour avec succès');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto p-1 rounded-2xl border border-transparent">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden backdrop-blur-sm shadow-md">
          {/* Header with gradient background */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 flex justify-between items-center">
            <div className="flex items-center">
              {selectedVersement && (
                <button 
                  onClick={() => {
                    setSelectedVersement(null);
                    setIsAddingVersement(false);
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
                {isAddingVersement 
                  ? 'Enregistrer un Versement' 
                  : selectedVersement 
                    ? 'Modifier un Versement' 
                    : 'Gestion des Versements'}
              </h1>
            </div>
            {!isAddingVersement && !selectedVersement && hasPermission('versement_create') && (
              <button 
                onClick={handleAddVersement} 
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
                <span className="relative z-10">Nouveau versement</span>
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
              {isAddingVersement ? (
                <div className="p-6 bg-white">
                  <VersementForm
                    onClose={handleFormClose}
                    onVersementCreated={handleVersementCreated}
                  />
                </div>
              ) : selectedVersement ? (
                <div className="p-6 bg-white">
                  <VersementForm
                    versement={selectedVersement}
                    onClose={handleFormClose}
                    onVersementUpdated={handleVersementUpdated}
                  />
                </div>
              ) : (
                <VersementList
                  versements={versements}
                  onEditVersement={handleEditVersement}
                  onDeleteVersement={handleDeleteVersement}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VersementsPage;