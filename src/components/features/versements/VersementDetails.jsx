// src/components/features/versements/VersementDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Spinner, Modal } from '../../common';
import { getVersementById, deleteVersement } from '../../../services/versementService';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import { useAlertContext } from '../../../context/AlertContext';
import { usePermissions } from '../../../hooks/usePermissions';

const VersementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlertContext();
  const { hasPermission } = usePermissions();
  const [versement, setVersement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const canEditVersement = hasPermission('versement_edit');
  const canDeleteVersement = hasPermission('versement_delete');

  useEffect(() => {
    const fetchVersement = async () => {
      try {
        setLoading(true);
        const response = await getVersementById(id);
        setVersement(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement du versement:', error);
        showAlert('Erreur lors du chargement du versement', 'error');
        navigate('/versements');
      } finally {
        setLoading(false);
      }
    };

    fetchVersement();
  }, [id, navigate, showAlert]);

  const handleEdit = () => {
    navigate(`/versements/modifier/${id}`);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteVersement(id);
      showAlert('Versement supprimé avec succès', 'success');
      navigate('/versements');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      showAlert(
        error.response?.data?.message || 'Erreur lors de la suppression', 
        'error'
      );
      setDeleting(false);
      setShowDeleteModal(false);
    }
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

  if (!versement) {
    return (
      <Card className="w-full p-6">
        <Alert type="error">Ce versement n'existe pas ou a été supprimé.</Alert>
      </Card>
    );
  }

  return (
    <Card className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Détails du Versement #{versement.numero_versement}
        </h2>
        <div className="flex gap-2">
          {canEditVersement && (
            <Button variant="outlined" onClick={handleEdit}>
              Modifier
            </Button>
          )}
          {canDeleteVersement && (
            <Button 
              variant="danger" 
              onClick={() => setShowDeleteModal(true)}
            >
              Supprimer
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-gray-500 text-sm mb-1">Numéro de Versement</h3>
          <p className="font-medium">{versement.numero_versement}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-gray-500 text-sm mb-1">Numéro de Chèque</h3>
          <p className="font-medium">{versement.numero_cheque}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-gray-500 text-sm mb-1">Client</h3>
          <p className="font-medium">
            {versement.client.numero_compte} - {versement.client.nom}
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-gray-500 text-sm mb-1">Montant</h3>
          <p className="font-medium text-lg text-green-600">
            {formatCurrency(versement.montant)}
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-gray-500 text-sm mb-1">Date de Création</h3>
          <p className="font-medium">{formatDate(versement.created_at)}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-gray-500 text-sm mb-1">Dernière Modification</h3>
          <p className="font-medium">{formatDate(versement.updated_at)}</p>
        </div>
      </div>

      {versement.notes && (
        <div className="bg-gray-50 p-4 rounded mb-6">
          <h3 className="text-gray-500 text-sm mb-1">Notes</h3>
          <p>{versement.notes}</p>
        </div>
      )}

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h3 className="text-blue-700 font-medium">Impact sur le solde</h3>
        <p className="mt-1 text-blue-600">
          Le solde du client a été augmenté de {formatCurrency(versement.montant)}.
          Nouveau solde : {formatCurrency(versement.client.solde)}
        </p>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmer la suppression"
      >
        <div className="p-6">
          <p className="mb-4">
            Êtes-vous sûr de vouloir supprimer ce versement ? Cette action est irréversible et mettra à jour le solde du client.
          </p>
          <div className="flex justify-end gap-4">
            <Button 
              variant="outlined" 
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
            >
              Annuler
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDelete}
              loading={deleting}
              disabled={deleting}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default VersementDetails;