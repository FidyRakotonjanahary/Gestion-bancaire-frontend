// components/features/users/UserStatusBadge.jsx
import React from 'react';

const UserStatusBadge = ({ isActive }) => {
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
      isActive 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {isActive ? 'Actif' : 'Inactif'}
    </span>
  );
};