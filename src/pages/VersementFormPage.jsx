// src/pages/VersementFormPage.jsx
import React from 'react';
import { MainLayout } from '../components/layout';
import { VersementForm } from '../components/features/versements';
import { usePermissions } from '../hooks/usePermissions';
import { useNavigate, useParams } from 'react-router-dom';

const VersementFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const canAddVersement = hasPermission('versement_add');
  const canEditVersement = hasPermission('versement_edit');
  
  const hasRequiredPermission = isEditMode ? canEditVersement : canAddVersement;

  if (!hasRequiredPermission) {
    return (
      <MainLayout>
        <div className="p-6 bg-red-50 border border-red-200 rounded-md text-red-700">
          <h2 className="text-xl font-semibold mb-2">Accès refusé</h2>
          <p>Vous n'avez pas les permissions nécessaires pour {isEditMode ? 'modifier' : 'créer'} un versement.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <button
            onClick={() => navigate('/versements')}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <span className="mr-1">←</span> Retour à la liste
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-4">
          {isEditMode ? 'Modifier le Versement' : 'Nouveau Versement'}
        </h1>
        <VersementForm />
      </div>
    </MainLayout>
  );
};

export default VersementFormPage;