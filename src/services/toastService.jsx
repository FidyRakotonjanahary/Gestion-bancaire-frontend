import { toast } from 'react-toastify';

// Options par défaut pour les toasts
const defaultOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const toastService = {
  success: (message, options = {}) => {
    return toast.success(message, { ...defaultOptions, ...options });
  },
  
  error: (message, options = {}) => {
    return toast.error(message, { ...defaultOptions, ...options });
  },
  
  warning: (message, options = {}) => {
    return toast.warning(message, { ...defaultOptions, ...options });
  },
  
  info: (message, options = {}) => {
    return toast.info(message, { ...defaultOptions, ...options });
  },
  
  // Toast personnalisé
  custom: (message, options = {}) => {
    return toast(message, { ...defaultOptions, ...options });
  },
  
  // Mise à jour d'un toast existant
  update: (toastId, message, options = {}) => {
    return toast.update(toastId, { 
      render: message,
      ...options
    });
  },
  
  // Fermer un toast spécifique
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
  
  // Fermer tous les toasts
  dismissAll: () => {
    toast.dismiss();
  }
};

export default toastService;