// src/pages/VersementsPage.jsx
import React from 'react';
import { MainLayout } from '../components/layout';
import { VersementList } from '../components/features/versements';
import { usePermissions } from '../hooks/usePermissions';

const VersementsPage = () => {
  const { hasPermission } = usePermissions();
  const canViewVersements = hasPermission('versement_view');

  if (!canViewVersements) {
    return (
      <MainLayout>
        <div className="p-6 bg-red-50 border border-red-200 rounded-md text-red-700">
          <h2 className="text-xl font-semibold mb-2">Accès refusé</h2>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Gestion des Versements</h1>
        <VersementList />
      </div>
    </MainLayout>
  );
};

export default VersementsPage;
