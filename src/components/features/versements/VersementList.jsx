// src/components/features/versements/VersementList.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Pagination, Spinner, Card } from '../../common';
import { getVersements } from '../../../services/versementService';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../../hooks/usePermissions';

const VersementList = () => {
  const [versements, setVersements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const canAddVersement = hasPermission('versement_add');
  const canEditVersement = hasPermission('versement_edit');

  useEffect(() => {
    const fetchVersements = async () => {
      try {
        setLoading(true);
        const response = await getVersements(page, pageSize);
        setVersements(response.data.versements);
        setTotalPages(Math.ceil(response.data.total / pageSize));
      } catch (error) {
        console.error('Erreur lors du chargement des versements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVersements();
  }, [page, pageSize]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleAddNew = () => {
    navigate('/versements/nouveau');
  };

  const handleEdit = (id) => {
    navigate(`/versements/${id}`);
  };

  const columns = [
    { header: 'N° Versement', accessor: 'numero_versement' },
    { header: 'N° Chèque', accessor: 'numero_cheque' },
    { 
      header: 'Client', 
      accessor: 'client', 
      cell: (row) => `${row.client.numero_compte} - ${row.client.nom}` 
    },
    { 
      header: 'Montant', 
      accessor: 'montant', 
      cell: (row) => formatCurrency(row.montant) 
    },
    { 
      header: 'Date', 
      accessor: 'created_at', 
      cell: (row) => formatDate(row.created_at) 
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => canEditVersement && (
        <Button 
          variant="outlined" 
          size="sm" 
          onClick={() => handleEdit(row.id)}
        >
          Modifier
        </Button>
      )
    }
  ];

  return (
    <Card className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Liste des Versements</h2>
        {canAddVersement && (
          <Button variant="primary" onClick={handleAddNew}>
            Nouveau Versement
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center my-8">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <Table 
            columns={columns} 
            data={versements} 
            emptyMessage="Aucun versement trouvé"
          />
          <div className="mt-4 flex justify-center">
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          </div>
        </>
      )}
    </Card>
  );
};

export default VersementList;