import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaUser, FaCreditCard, FaDollarSign,
  FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaPlus 
} from 'react-icons/fa';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Alert from '../../common/Alert';
import Spinner from '../../common/Spinner';
import useForm from '../../../hooks/useForm';
import apiService from '../../../services/api';
import { toast } from 'react-toastify';

const ClientForm = ({ 
  onClose, 
  onClientCreated, 
  onClientUpdated, 
  client 
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id || !!client;
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  const initialValues = {
    name: '',
    account_number: '',
    balance: 0
  };

  const { 
    values, 
    handleChange, 
    setValues, 
    errors, 
    setErrors, 
    validate 
  } = useForm(initialValues);

  // Fetch client data in edit mode
  useEffect(() => {
    if (isEditMode) {
      const clientData = client || {};
      const clientId = id || clientData.id;
      
      const fetchClientData = async () => {
        try {
          setLoading(true);
          
          const response = clientId 
            ? await apiService.get(`/clients/${clientId}`)
            : { data: { data: clientData } };
          
          const fetchedClientData = response.data.data;
          setValues({
            name: fetchedClientData.name,
            account_number: fetchedClientData.account_number,
            balance: fetchedClientData.balance || 0
          });
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message;
          toast.error(`Erreur de chargement des données : ${errorMessage}`);
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };

      fetchClientData();
    }
  }, [id, isEditMode, setValues, client]);

  // Form validation
  const validateForm = () => {
    const validationErrors = {};
    
    if (!values.name) {
      validationErrors.name = "Le nom du client est requis";
    } else if (values.name.length < 2) {
      validationErrors.name = "Le nom du client est trop court";
    }
    
    // En mode création, le numéro de compte sera généré automatiquement par le backend
    if (isEditMode && !values.account_number) {
      validationErrors.account_number = "Le numéro de compte est requis";
    }
    
    return validationErrors;
  };

  // Submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    const clientData = {
      name: values.name
    };
    
    // En mode édition, inclure le numéro de compte
    if (isEditMode) {
      clientData.account_number = values.account_number;
    }
    
    try {
      let response;
      if (isEditMode) {
        const clientId = id || client.id;
        response = await apiService.put(`/clients/${clientId}`, clientData);
        
        if (onClientUpdated) {
          onClientUpdated(response.data.data);
        }
      } else {
        response = await apiService.post('/clients', clientData);
        
        if (onClientCreated) {
          onClientCreated(response.data.data);
        }
      }
      
      if (onClose) {
        onClose();
      } else {
        navigate('/clients');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(`Erreur : ${errorMessage}`, {
        icon: <FaExclamationTriangle className="text-red-500" />
      });
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="relative overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/60 to-purple-100/40 opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300"></div>
        
        <div className="relative z-10 p-6">
          <p className="text-gray-600 flex items-center">
            {isEditMode ? (
              <span className="flex items-center">
                <FaUser className="h-4 w-4 text-indigo-500 mr-2" />
                Complétez les champs ci-dessous pour mettre à jour les informations
              </span>
            ) : (
              <span className="flex items-center">
                <FaPlus className="h-4 w-4 text-indigo-500 mr-2" />
                Complétez les champs ci-dessous pour créer un nouveau client
              </span>
            )}
          </p>
        </div>
      </div>
      
      {error && (
        <Alert 
          variant="danger" 
          className="m-6 rounded-lg border border-red-200 bg-red-50"
        >
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Name Input */}
          <div className="group relative">
            <Input
              label="Nom du client"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              error={errors.name}
              required
              icon={<FaUser className="text-indigo-400 group-hover:text-indigo-600 transition-colors duration-300" />}
              className="pl-10 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg transition-all duration-300"
            />
          </div>
        </div>
        
        {/* Info Box */}
        <div className="mt-2 px-4 py-3 bg-blue-50 border-l-4 border-blue-400 text-xs text-blue-700">
          <div className="flex items-start">
            <FaInfoCircle className="flex-shrink-0 mt-0.5 mr-2 text-blue-500" />
            <div>
              <p>
                <span className="font-semibold">Important :</span> {isEditMode 
              ? "Le numéro de compte ne peut pas être modifié"
              : "Le numéro de compte sera généré automatiquement"}
              </p>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end items-center space-y-3 sm:space-y-0 pt-6 border-t border-gray-100">

          <div className="flex space-x-3">
            <button 
              type="button" 
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
              onClick={onClose || (() => navigate('/clients'))}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10">Annuler</span>
            </button>
            <button 
              type="submit" 
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
              <span className="relative z-10">{isEditMode ? 'Mettre à jour' : 'Créer'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;