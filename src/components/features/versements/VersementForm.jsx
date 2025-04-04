import React, { useState, useEffect } from 'react';
import { 
  FaSave, 
  FaTimes, 
  FaMoneyBillWave, 
  FaFileInvoice,
  FaUserAlt,
  FaInfoCircle,
  FaCheck,
  FaExclamationTriangle,
  FaEuroSign,
  FaPlus
} from 'react-icons/fa';
import versementService from '../../../services/versementService';
import clientService from '../../../services/clientService';
import { toast } from 'react-toastify';
import Input from '../../common/Input';
import Alert from '../../common/Alert';
import Spinner from '../../common/Spinner';

const VersementForm = ({ versement, onClose, onVersementCreated, onVersementUpdated }) => {
  const [formData, setFormData] = useState({
    client_id: versement?.client_id || '',
    amount: versement?.amount || '',
    description: versement?.description || ''
  });

  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [errors, setErrors] = useState({});
  const isEditMode = !!versement;
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const response = await clientService.getAllClients();
        
        // Accéder au bon chemin pour récupérer le tableau
        const clientsData = response.data.data || [];
        setClients(clientsData);
        
        // Si un versement existe, sélectionner le client correspondant
        if (versement?.client_id) {
          const client = clientsData.find(c => c.id === versement.client_id);
          setSelectedClient(client || null);
        }
      } catch (error) {
        toast.error('Erreur lors de la récupération des clients', {
          icon: <FaExclamationTriangle className="text-red-500" />
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [versement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si le champ est client_id, mettre à jour le client sélectionné
    if (name === 'client_id') {
      const client = clients.find(c => c.id === parseInt(value));
      setSelectedClient(client || null);
    }
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Réinitialiser l'erreur pour ce champ
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const validationErrors = {};
    
    if (!formData.client_id) {
      validationErrors.client_id = 'Veuillez sélectionner un client';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      validationErrors.amount = 'Veuillez entrer un montant valide';
    }
    
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Veuillez corriger les erreurs dans le formulaire', {
        icon: <FaExclamationTriangle className="text-red-500" />
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const payload = {
        client_id: parseInt(formData.client_id),
        amount: parseFloat(formData.amount),
        description: formData.description
      };
      
      if (versement?.id) {
        // Mise à jour d'un versement existant
        await versementService.updateVersement(versement.id, payload);
       
        if (onVersementUpdated) onVersementUpdated();
      } else {
        // Création d'un nouveau versement
        await versementService.createVersement(payload);
        
        if (onVersementCreated) onVersementCreated();
      }
      
      if (onClose) onClose();
      
    } catch (error) {
      toast.error(`Erreur: ${error.response?.data?.message || error.message}`, {
        icon: <FaExclamationTriangle className="text-red-500" />
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    if (!amount) return '';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (isLoading && !formData.client_id) return <Spinner />;

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/60 to-purple-100/40 opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300"></div>
        
        <div className="relative z-10 p-6">
          <p className="text-gray-600 flex items-center">
            {isEditMode ? (
              <span className="flex items-center">
                <FaMoneyBillWave className="h-4 w-4 text-indigo-500 mr-2" />
                Complétez les champs ci-dessous pour mettre à jour le versement
              </span>
            ) : (
              <span className="flex items-center">
                <FaPlus className="h-4 w-4 text-indigo-500 mr-2" />
                Complétez les champs ci-dessous pour créer un nouveau versement
              </span>
            )}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Client Selection Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="client_id">
            Client
          </label>
          <div className="relative group">
            {isEditMode ? (
              // En mode édition, afficher le client sélectionné dans un champ désactivé
              <select
                id="client_id"
                name="client_id"
                value={formData.client_id}
                disabled={true}
                className={`
                  w-full pl-10 pr-4 py-2.5
                  border border-gray-200
                  rounded-lg
                  bg-gray-50
                  text-gray-700
                  shadow-sm
                  cursor-not-allowed
                  transition-all duration-300
                `}
              >
                <option value={formData.client_id}>
                  {selectedClient?.name || ''} {selectedClient ? `- ${selectedClient.account_number}` : ''}
                </option>
              </select>
            ) : (
              // En mode création, permettre la sélection
              <select
                id="client_id"
                name="client_id"
                value={formData.client_id}
                onChange={handleChange}
                className={`
                  w-full pl-10 pr-4 py-2.5
                  border ${errors.client_id ? 'border-red-300' : 'border-gray-200'}
                  rounded-lg
                  shadow-sm
                  focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  transition-all duration-300
                `}
                required
              >
                <option value="">Sélectionner un client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.account_number}
                  </option>
                ))}
              </select>
            )}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUserAlt className={`${isEditMode ? 'text-gray-400' : 'text-indigo-400 group-hover:text-indigo-600'} transition-colors duration-300`} />
            </div>
            {errors.client_id && !isEditMode && (
              <p className="mt-1 text-sm text-red-500">{errors.client_id}</p>
            )}
          </div>
        </div>
        
        {/* Selected Client Information */}
        {selectedClient && (
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm">
                  <FaUserAlt className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-indigo-900">{selectedClient.name}</h4>
                <div className="mt-1 text-xs text-indigo-700">
                  Numéro de compte: <span className="font-medium">{selectedClient.account_number}</span>
                </div>
                <div className="mt-1 text-xs text-indigo-700">
                  Solde actuel: <span className={`font-medium ${parseFloat(selectedClient.balance) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(selectedClient.balance)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Versement Details */}
        <div>
          {/* Montant */}
          <div className="relative group">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Montant
            </label>
            <div className="relative">
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className={`
                  w-full pl-10 pr-4 py-2.5
                  border ${errors.amount ? 'border-red-300' : 'border-gray-200'}
                  rounded-lg
                  shadow-sm
                  focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  transition-all duration-300
                `}
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEuroSign className="text-indigo-400 group-hover:text-indigo-600 transition-colors duration-300" />
              </div>
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
            )}
          </div>
        </div>
        
        {/* Description */}
        <div className="relative group">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <div className="relative">
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description du versement (optionnel)"
              rows="3"
              className="
                w-full pl-10 pr-4 py-2.5
                border border-gray-200
                rounded-lg
                shadow-sm
                focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                transition-all duration-300
              "
            ></textarea>
            <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
              <FaInfoCircle className="text-indigo-400 group-hover:text-indigo-600 transition-colors duration-300" />
            </div>
          </div>
        </div>
        


<div className="mt-2 px-4 py-3 bg-blue-50 border-l-4 border-blue-400 text-xs text-blue-700">
  <div className="flex items-start">
    <FaInfoCircle className="flex-shrink-0 mt-0.5 mr-2 text-blue-500" />
    <div>
      <p>
        <span className="font-semibold">Important :</span> Les versements augmentent le solde du client.
        Le numéro de chèque sera automatiquement généré par le système.
      </p>
    </div>
  </div>
</div>
        
        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end items-center space-y-3 sm:space-y-0 pt-6 border-t border-gray-100">
          <div className="flex space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="
                group
                relative
                px-5 py-2.5
                border border-gray-200
                rounded-lg
                text-gray-600
                bg-white
                shadow-sm
                hover:shadow
                transition-all duration-300
                overflow-hidden
                focus:outline-none focus:ring-2 focus:ring-indigo-200
              "
            >
              <span className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10">Annuler</span>
            </button>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="
                group
                relative
                px-5 py-2.5
                rounded-lg
                text-white
                bg-indigo-600
                shadow-sm
                hover:shadow
                transition-all duration-300
                overflow-hidden
                focus:outline-none focus:ring-2 focus:ring-indigo-400
              "
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10 flex items-center">
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement...
                  </>
                ) : (
                  <>
                    {isEditMode ? 'Mettre à jour' : 'Enregistrer'}
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VersementForm;