// src/components/features/versements/VersementForm.jsx
import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Dropdown, Alert, Spinner } from '../../common';
import { useForm } from '../../../hooks/useForm';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  createVersement, 
  getVersementById, 
  updateVersement 
} from '../../../services/versementService';
import { getClients } from '../../../services/clientService';
import { useAlertContext } from '../../../context/AlertContext';

const VersementForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { showAlert } = useAlertContext();
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(true);

  const initialValues = {
    numero_cheque: '',
    client_id: '',
    montant: '',
    notes: ''
  };

  const { values, handleChange, setValues, errors, validate } = useForm(initialValues, validateVersement);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const response = await getClients();
        setClients(response.data.clients);
      } catch (error) {
        console.error('Erreur lors du chargement des clients:', error);
        showAlert('Erreur lors du chargement des clients', 'error');
      } finally {
        setClientsLoading(false);
      }
    };

    loadClients();

    if (isEditMode) {
      const fetchVersement = async () => {
        try {
          const response = await getVersementById(id);
          setValues({
            ...response.data,
            client_id: response.data.client.id
          });
        } catch (error) {
          console.error('Erreur lors du chargement du versement:', error);
          showAlert('Erreur lors du chargement du versement', 'error');
          navigate('/versements');
        } finally {
          setLoading(false);
        }
      };

      fetchVersement();
    }
  }, [id, isEditMode, navigate, setValues, showAlert]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      
      if (isEditMode) {
        await updateVersement(id, values);
        showAlert('Versement mis à jour avec succès', 'success');
      } else {
        await createVersement(values);
        showAlert('Versement créé avec succès', 'success');
      }
      
      navigate('/versements');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      showAlert(
        error.response?.data?.message || 'Une erreur est survenue', 
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/versements');
  };

  if (loading) {
    return (
      <Card className="w-full p-6">
        <div className="flex justify-center my-8">
          <Spinner size="lg" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full p-6">
      <h2 className="text-xl font-semibold mb-6">
        {isEditMode ? 'Modifier le Versement' : 'Nouveau Versement'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Numéro de Chèque"
            name="numero_cheque"
            value={values.numero_cheque}
            onChange={handleChange}
            error={errors.numero_cheque}
            required
          />

          <Dropdown
            label="Client"
            name="client_id"
            value={values.client_id}
            onChange={handleChange}
            error={errors.client_id}
            loading={clientsLoading}
            required
            options={clients.map(client => ({
              value: client.id,
              label: `${client.numero_compte} - ${client.nom} (Solde: ${client.solde}€)`
            }))}
          />

          <Input
            label="Montant"
            name="montant"
            type="number"
            value={values.montant}
            onChange={handleChange}
            error={errors.montant}
            required
            min="0.01"
            step="0.01"
          />

          <Input
            label="Notes"
            name="notes"
            value={values.notes || ''}
            onChange={handleChange}
            error={errors.notes}
            multiline
            rows={3}
          />
        </div>

        {isEditMode && (
          <Alert type="warning" className="mt-4">
            Attention : La modification du montant mettra à jour automatiquement le solde du client.
          </Alert>
        )}

        <div className="flex justify-end gap-4 mt-6">
          <Button 
            type="button" 
            variant="outlined" 
            onClick={handleCancel}
            disabled={submitting}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={submitting}
            loading={submitting}
          >
            {isEditMode ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

// Fonction de validation des versements
function validateVersement(values) {
  const errors = {};

  if (!values.numero_cheque) {
    errors.numero_cheque = 'Le numéro de chèque est requis';
  }

  if (!values.client_id) {
    errors.client_id = 'Veuillez sélectionner un client';
  }

  if (!values.montant) {
    errors.montant = 'Le montant est requis';
  } else if (parseFloat(values.montant) <= 0) {
    errors.montant = 'Le montant doit être supérieur à 0';
  }

  return errors;
}

export default VersementForm;