import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../../../hooks/useForm';
import Button from '../../common/Button';
import Input from '../../common/Input';
import Card from '../../common/Card';
import clientService from '../../../services/clientService';
import toastService from '../../../services/toastService';

const validateForm = (values) => {
  const errors = {};
  
  if (!values.accountNumber) {
    errors.accountNumber = 'Le numéro de compte est requis';
  }
  
  if (!values.name) {
    errors.name = 'Le nom du client est requis';
  }
  
  return errors;
};

const ClientForm = ({ client = null }) => {
  const isEditing = !!client;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const initialValues = isEditing 
    ? { 
        accountNumber: client.accountNumber,
        name: client.name,
      }
    : { 
        accountNumber: '',
        name: '',
      };
  
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm(initialValues, validateForm);
  
  const onSubmit = async (formValues) => {
    setIsLoading(true);
    
    try {
      let response;
      let toastId;
      
      // Afficher un toast de chargement
      toastId = toastService.info(
        isEditing ? 'Mise à jour du client...' : 'Création du client...',
        { autoClose: false }
      );
      
      if (isEditing) {
        response = await clientService.updateClient(client.id, formValues);
        
        // Mettre à jour le toast avec un message de succès
        toastService.update(toastId, `Le client ${response.data.name} a été mis à jour avec succès`, {
          type: toastService.success,
          autoClose: 5000
        });
      } else {
        response = await clientService.createClient(formValues);
        
        // Mettre à jour le toast avec un message de succès
        toastService.update(toastId, `Le client ${response.data.name} a été créé avec succès`, {
          type: toastService.success,
          autoClose: 5000
        });
      }
      
      // Rediriger vers la page de détail du client
      navigate(`/clients/${response.data.id}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        (isEditing ? 'Erreur lors de la mise à jour du client' : 'Erreur lors de la création du client');
      
      toastService.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card title={isEditing ? 'Modifier le client' : 'Ajouter un nouveau client'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Input
              label="Numéro de compte"
              type="text"
              name="accountNumber"
              id="accountNumber"
              value={values.accountNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.accountNumber && errors.accountNumber}
              disabled={isEditing} // Impossible de modifier le numéro de compte existant
              required
            />
          </div>
          
          <div>
            <Input
              label="Nom du client"
              type="text"
              name="name"
              id="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && errors.name}
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/clients')}
          >
            Annuler
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            {isEditing ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ClientForm;