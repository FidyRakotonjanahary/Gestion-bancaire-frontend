import React from 'react';
import usePermissions from '../../../hooks/usePermissions';

const PermissionGate = ({ permissions, children, fallback = null }) => {
  const { hasPermission } = usePermissions();
  
  // Accepte une permission unique ou un tableau de permissions
  const hasAccess = Array.isArray(permissions)
    ? permissions.some(permission => hasPermission(permission))
    : hasPermission(permissions);
    
  return hasAccess ? children : fallback;
};

export default PermissionGate;