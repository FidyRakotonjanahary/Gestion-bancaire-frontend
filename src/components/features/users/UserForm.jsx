import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaIdBadge, 
  FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaPlus
} from 'react-icons/fa';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Alert from '../../common/Alert';
import Spinner from '../../common/Spinner';
import Dropdown from '../../common/Dropdown';
import useForm from '../../../hooks/useForm';
import apiService from '../../../services/api';
import { toast } from 'react-toastify';

const PasswordStrengthIndicator = ({ password }) => {
  const getPasswordStrength = useCallback((pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  }, []);

  const strengthLevel = useMemo(() => getPasswordStrength(password), [password, getPasswordStrength]);

  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-green-600'
  ];

  return (
    <div className="flex items-center space-x-2 mt-1">
      {[...Array(5)].map((_, index) => (
        <div 
          key={index} 
          className={`h-1 w-1/5 rounded-full transition-all duration-300 
            ${index < strengthLevel 
              ? strengthColors[strengthLevel - 1] 
              : 'bg-gray-300'}`}
        />
      ))}
    </div>
  );
};

const UserForm = ({ 
  onClose, 
  onUserCreated, 
  onUserUpdated, 
  user 
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id || !!user;
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [enablePasswordFields, setEnablePasswordFields] = useState(!isEditMode);

  const initialValues = {
    username: '',
    full_name: '',
    email: '',
    role_id: '',
    is_active: true,
    password: '',
    confirm_password: ''
  };

  const { 
    values, 
    handleChange, 
    setValues, 
    errors, 
    setErrors = () => {}, 
    validate 
  } = useForm(initialValues);

  // Memoized role options
  const roleOptions = useMemo(() => 
    roles.length > 0 
      ? roles.map(role => ({ 
          value: role.id, 
          label: role.name,
          description: role.description 
        })) 
      : [], 
    [roles]
  );

  // Fetch roles with improved error handling
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await apiService.get('/roles');
        setRoles(response.data || []);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        toast.error(`Impossible de charger les rôles : ${errorMessage}`);
        setRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  // Fetch user data in edit mode with improved data loading
  useEffect(() => {
    if (isEditMode) {
      const userData = user || {};
      const userId = id || userData.id;
      
      const fetchUserData = async () => {
        try {
          setLoading(true);
          
          const response = userId 
            ? await apiService.get(`/users/${userId}`)
            : { data: { data: userData } };
          
          // Detailed user data update
          const fetchedUserData = response.data.data;
          setValues({
            username: fetchedUserData.username,
            full_name: fetchedUserData.full_name,
            email: fetchedUserData.email,
            role_id: fetchedUserData.role_id,
            is_active: fetchedUserData.is_active,
            password: '',
            confirm_password: ''
          });
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message;
          toast.error(`Erreur de chargement des données : ${errorMessage}`);
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [id, isEditMode, setValues, user]);

  // Advanced form validation
  const validateForm = useCallback(() => {
    const validationErrors = {};
    
    // Comprehensive username validation
    if (!values.username) {
      validationErrors.username = "Le nom d'utilisateur est requis";
    } else if (values.username.length < 3) {
      validationErrors.username = "Le nom d'utilisateur doit contenir au moins 3 caractères";
    } else if (!/^[a-zA-Z0-9_]+$/.test(values.username)) {
      validationErrors.username = "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores";
    }
    
    // Advanced full name validation
    if (!values.full_name) {
      validationErrors.full_name = "Le nom complet est requis";
    } else if (values.full_name.length < 2) {
      validationErrors.full_name = "Le nom complet est trop court";
    }
    
    // Comprehensive email validation
    if (!values.email) {
      validationErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      validationErrors.email = "L'email n'est pas valide";
    }
    
    // Role validation with more detail
    if (!values.role_id) {
      validationErrors.role_id = "Un rôle est requis";
    }
    
    // Advanced password validation
    if ((!isEditMode || enablePasswordFields) && values.password) {
      if (!isEditMode && !values.password) {
        validationErrors.password = "Le mot de passe est requis";
      } else if (values.password) {
        if (values.password.length < 8) {
          validationErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
        }
      }
      
      if (values.password !== values.confirm_password) {
        validationErrors.confirm_password = "Les mots de passe ne correspondent pas";
      }
    }
    
    return validationErrors;
  }, [values, isEditMode, enablePasswordFields]);

  // Submission handler with enhanced error management
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      if (typeof setErrors === 'function') {
        setErrors(validationErrors);
        toast.error('Veuillez corriger les erreurs dans le formulaire');
      } else {
        console.error('setErrors is not a function', setErrors);
        toast.error('Erreur de validation du formulaire');
      }
      return;
    }

    const userData = {
      username: values.username,
      full_name: values.full_name,
      email: values.email,
      role_id: values.role_id,
      is_active: values.is_active
    };
    
    if ((!isEditMode || enablePasswordFields) && values.password) {
      userData.password = values.password;
    }
    
    try {
      let response;
      if (isEditMode) {
        const userId = id || user.id;
        response = await apiService.put(`/users/${userId}`, userData);
        
        
        if (onUserUpdated) {
          onUserUpdated(response.data.data);
        }
      } else {
        response = await apiService.post('/users', userData);
        
        
        if (onUserCreated) {
          onUserCreated(response.data.data);
        }
      }
      
      if (onClose) {
        onClose();
      } else {
        navigate('/users');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(`Erreur : ${errorMessage}`, {
        icon: <FaExclamationTriangle className="text-red-500" />
      });
    }
  };

  if (loading || loadingRoles) return <Spinner />;

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="relative overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/60 to-purple-100/40 opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300"></div>
        
        <div className="relative z-10 p-6">
          <p className="text-gray-600 flex items-center">
            {isEditMode ? (
              <span className="flex items-center">
                <FaUser className="h-4 w-4 text-indigo-500 mr-2" />
                Complétez les champs ci-dessous pour mettre à jour les informations
              </span>
            ) : (
              <span className="flex items-center">
                <FaPlus className="h-4 w-4 text-indigo-500 mr-2" />
                Complétez les champs ci-dessous pour créer un nouvel utilisateur
              </span>
            )}
          </p>
        </div>
      </div>
      
      {error && (
        <Alert 
          variant="danger" 
          className="m-6 rounded-lg border border-red-200 bg-red-50"
        >
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username Input */}
          <div className="group relative">
            <Input
              label="Nom d'utilisateur"
              id="username"
              name="username"
              value={values.username}
              onChange={handleChange}
              error={errors.username}
              required
              autoComplete="username"
              icon={<FaUser className="text-indigo-400 group-hover:text-indigo-600 transition-colors duration-300" />}
              className="pl-10 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg transition-all duration-300"
            />
          </div>
          
          {/* Full Name Input */}
          <div className="group relative">
            <Input
              label="Nom complet"
              id="full_name"
              name="full_name"
              value={values.full_name}
              onChange={handleChange}
              error={errors.full_name}
              required
              autoComplete="name"
              icon={<FaIdBadge className="text-indigo-400 group-hover:text-indigo-600 transition-colors duration-300" />}
              className="pl-10 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg transition-all duration-300"
            />
          </div>
          
          {/* Email Input */}
          <div className="group relative">
            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
              required
              autoComplete="email"
              icon={<FaEnvelope className="text-indigo-400 group-hover:text-indigo-600 transition-colors duration-300" />}
              className="pl-10 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg transition-all duration-300"
            />
          </div>
          
          {/* Role Dropdown */}
          <div className="group relative">
            <Dropdown
              label="Rôle"
              id="role_id"
              name="role_id"
              value={values.role_id}
              onChange={handleChange}
              options={roleOptions}
              error={errors.role_id}
              required
              className="w-full border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg transition-all duration-300"
            />
          </div>
          
          {/* Active Account Toggle - Improved Design */}
          {isEditMode && (
            <div className="col-span-2">
              <label className="flex items-center space-x-3 mt-2 mb-4 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={values.is_active}
                    onChange={(e) => handleChange({
                      target: {
                        name: 'is_active',
                        value: e.target.checked
                      }
                    })}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${values.is_active ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-0 top-0 bg-white w-6 h-6 rounded-full transition-all duration-300 shadow-md transform ${values.is_active ? 'translate-x-6' : 'translate-x-0'} flex items-center justify-center`}>
                    {values.is_active && <FaCheckCircle className="text-indigo-500 text-xs" />}
                  </div>
                </div>
                <span className="text-gray-700 group-hover:text-indigo-600 transition-colors duration-300">Compte actif</span>
              </label>
            </div>
          )}
          
          {isEditMode && (
            <div className="col-span-2">
              <label className="flex items-center space-x-3 mt-2 mb-4 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="enable_password"
                    checked={enablePasswordFields}
                    onChange={(e) => setEnablePasswordFields(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${enablePasswordFields ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-0 top-0 bg-white w-6 h-6 rounded-full transition-all duration-300 shadow-md transform ${enablePasswordFields ? 'translate-x-6' : 'translate-x-0'} flex items-center justify-center`}>
                    {enablePasswordFields && <FaLock className="text-indigo-500 text-xs" />}
                  </div>
                </div>
                <span className="text-gray-700 group-hover:text-indigo-600 transition-colors duration-300">Modifier le mot de passe</span>
              </label>
            </div>
          )}
          
          {/* Password Input */}
          <div className="group relative">
            <Input
              label={isEditMode ? "Nouveau mot de passe" : "Mot de passe"}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              required={!isEditMode}
              autoComplete={isEditMode ? "new-password" : "new-password"}
              icon={<FaLock className="text-indigo-400 group-hover:text-indigo-600 transition-colors duration-300" />}
              className="pl-10 pr-12 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg transition-all duration-300"
              disabled={isEditMode && !enablePasswordFields}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-11 text-gray-500 hover:text-indigo-600 transition-colors ${isEditMode && !enablePasswordFields ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              disabled={isEditMode && !enablePasswordFields}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
            {values.password && enablePasswordFields && (
              <PasswordStrengthIndicator password={values.password} />
            )}
          </div>
          
          {/* Confirm Password Input */}
          <div className="group relative">
            <Input
              label="Confirmer le mot de passe"
              id="confirm_password"
              name="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              value={values.confirm_password}
              onChange={handleChange}
              error={errors.confirm_password}
              required={!isEditMode || (enablePasswordFields && !!values.password)}
              autoComplete="new-password"
              icon={<FaLock className="text-indigo-400 group-hover:text-indigo-600 transition-colors duration-300" />}
              className="pl-10 pr-12 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg transition-all duration-300"
              disabled={isEditMode && !enablePasswordFields}
            />
            <button 
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`absolute right-3 top-11 text-gray-500 hover:text-indigo-600 transition-colors ${isEditMode && !enablePasswordFields ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              disabled={isEditMode && !enablePasswordFields}
            >
              {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 italic flex items-center">
            <FaInfoCircle className="mr-2 text-indigo-400" />
            {isEditMode 
              ? "Les champs laissés vides resteront inchangés" 
              : "Tous les champs sont obligatoires"}
          </p>
          <div className="flex space-x-3">
            <button 
              type="button" 
              className="
                group
                relative
                px-5 py-2.5
                border border-gray-200
                rounded-lg
                text-gray-600
                bg-white
                shadow-sm
                hover:shadow
                transition-all duration-300
                overflow-hidden
                focus:outline-none focus:ring-2 focus:ring-indigo-200
              "
              onClick={onClose || (() => navigate('/users'))}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10">Annuler</span>
            </button>
            <button 
              type="submit" 
              className="
                group
                relative
                px-5 py-2.5
                rounded-lg
                text-white
                bg-indigo-600
                shadow-sm
                hover:shadow
                transition-all duration-300
                overflow-hidden
                focus:outline-none focus:ring-2 focus:ring-indigo-400
              "
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10">{isEditMode ? 'Mettre à jour' : 'Créer'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserForm;