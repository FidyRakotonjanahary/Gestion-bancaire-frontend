// components/features/users/UserRoleBadge.jsx
import React from 'react';

const UserRoleBadge = ({ role }) => {
  let badgeStyle = 'px-2 py-1 text-xs font-semibold rounded-full ';
  
  switch (role) {
    case 'ADMIN':
      badgeStyle += 'bg-purple-100 text-purple-800';
      break;
    case 'USER':
      badgeStyle += 'bg-blue-100 text-blue-800';
      break;
    default:
      badgeStyle += 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={badgeStyle}>
      {role}
    </span>
  );
};

export default UserRoleBadge;