import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';
import AuditList from '../components/features/audit/AuditList';
import auditService from '../services/auditService';
import {
  FaHistory, FaUserEdit, FaChartBar, FaExclamationTriangle, FaCheck, 
  FaTrash, FaPlus, FaSpinner, FaCalendarAlt, FaUser, FaEdit,
  FaInfo, FaMoneyBillWave, FaSearch, FaEye, FaTimes
} from 'react-icons/fa';

const AuditPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [audits, setAudits] = useState([]);
  const [stats, setStats] = useState({
    total: 0, unique_users: 0, unique_clients: 0, unique_versements: 0,
    inserts: 0, updates: 0, deletes: 0
  });

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        setLoading(true);
        const countersResponse = await auditService.getAuditCounters();
        if (countersResponse.data && countersResponse.data.counts) {
          const counts = countersResponse.data.counts;
          setStats({
            total: parseInt(counts.total) || 0,
            unique_users: parseInt(counts.unique_users) || 0,
            unique_clients: parseInt(counts.unique_clients) || 0,
            unique_versements: counts.unique_versements ? parseInt(counts.unique_versements) : 0,
            inserts: parseInt(counts.insert) || 0,
            updates: parseInt(counts.update) || 0,
            deletes: parseInt(counts.delete) || 0
          });
        }
        const auditsResponse = await auditService.getRecentAudits({ limit: 50 });
        setAudits(auditsResponse.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données d\'audit', error);
        setLoading(false);
      }
    };
    fetchAuditData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency', currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md mb-4">
            <FaSpinner className="h-8 w-8 animate-spin text-white" />
          </div>
          <p className="text-indigo-700 font-medium">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="max-w-7xl mx-auto rounded-xl border border-transparent">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden backdrop-blur-sm shadow-md">
          {/* Header with gradient background */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center">
            <div className="flex items-center">
              {/* <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm mr-2">
                <FaHistory className="w-3 h-3 text-white" />
              </div> */}
              <h1 className="text-lg font-semibold text-indigo-900">Journal d'audit</h1>
            </div>
          </div>

          <div className="p-3">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                
                <div className="p-3 relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                      <FaHistory className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-indigo-900">{stats.total.toLocaleString()}</span>
                  </div>
                  <h3 className="text-gray-700 font-medium text-sm">Total des opérations</h3>
                </div>
              </div>
              
              <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-teal-400 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                
                <div className="p-3 relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center shadow-md">
                      <FaPlus className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-teal-800">{stats.inserts.toLocaleString()}</span>
                  </div>
                  <h3 className="text-gray-700 font-medium text-sm">Ajouts</h3>
                </div>
              </div>
              
              <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-sky-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-sky-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                
                <div className="p-3 relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center shadow-md">
                      <FaUserEdit className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-blue-900">{stats.updates.toLocaleString()}</span>
                  </div>
                  <h3 className="text-gray-700 font-medium text-sm">Modifications</h3>
                </div>
              </div>
              
              <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-rose-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-400 to-rose-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                
                <div className="p-3 relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-md">
                      <FaTrash className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-red-900">{stats.deletes.toLocaleString()}</span>
                  </div>
                  <h3 className="text-gray-700 font-medium text-sm">Suppressions</h3>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="rounded-lg overflow-hidden">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <div className="p-3 border-b bg-gradient-to-r from-indigo-50 to-purple-50 flex justify-between items-center">
                  <h3 className="text-base font-semibold text-indigo-900 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm mr-2">
                      <FaHistory className="w-3 h-3 text-white" />
                    </div>
                    Journal des opérations
                  </h3>
                  <span className="text-xs text-indigo-700 font-medium">
                    {audits.length} enregistrement{audits.length !== 1 ? 's' : ''} trouvé{audits.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="bg-white">
                  {audits.length > 0 ? (
                    <AuditList audits={audits} formatCurrency={formatCurrency} />
                  ) : (
                    <div className="py-6 text-center text-gray-500 bg-gradient-to-br from-indigo-50 to-purple-50">
                      <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center shadow-md mb-2">
                        <FaExclamationTriangle className="w-6 h-6 text-indigo-300" />
                      </div>
                      <p className="text-indigo-700 text-sm">Aucune entrée d'audit trouvée.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <p className="text-xs text-center text-indigo-700">
              {stats.total.toLocaleString()} opérations enregistrées au total • {stats.unique_users} utilisateurs • {stats.unique_clients} clients
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditPage;