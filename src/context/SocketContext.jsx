// // src/context/SocketContext.jsx
// import React, { createContext, useContext, useEffect } from 'react';
// import socketService from '../services/socketService';
// import { AuthContext } from '../AuthContext';

// export const SocketContext = createContext();

// export const SocketProvider = ({ children }) => {
//   const { user, isAuthenticated } = useContext(AuthContext);

//   useEffect(() => {
//     if (isAuthenticated) {
//       const token = localStorage.getItem('token');
//       socketService.connect(token);
//     }

//     return () => {
//       socketService.disconnect();
//     };
//   }, [isAuthenticated]);

//   return (
//     <SocketContext.Provider value={socketService}>
//       {children}
//     </SocketContext.Provider>
//   );
// };