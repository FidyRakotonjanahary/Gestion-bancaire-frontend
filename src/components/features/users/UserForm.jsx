import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaIdBadge, 
  FaCheckCircle, FaExclamationTriangle, FaInfoCircle 
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
    if (!isEditMode || values.password) {
      if (!isEditMode && !values.password) {
        validationErrors.password = "Le mot de passe est requis";
      } else if (values.password) {
        if (values.password.length < 8) {
          validationErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
        }
        // if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(values.password)) {
        //   validationErrors.password = "Le mot de passe doit contenir des majuscules, minuscules, chiffres et caractères spéciaux";
        // }
      }
      
      if (values.password !== values.confirm_password) {
        validationErrors.confirm_password = "Les mots de passe ne correspondent pas";
      }
    }
    
    return validationErrors;
  }, [values, isEditMode]);

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
    
    if (!isEditMode || values.password) {
      userData.password = values.password;
    }
    
    try {
      let response;
      if (isEditMode) {
        const userId = id || user.id;
        response = await apiService.put(`/users/${userId}`, userData);
        toast.success("Profil utilisateur mis à jour avec succès", {
          icon: <FaCheckCircle className="text-green-500" />
        });
        
        if (onUserUpdated) {
          onUserUpdated(response.data.data);
        }
      } else {
        response = await apiService.post('/users', userData);
        toast.success("Nouvel utilisateur créé avec succès", {
          icon: <FaCheckCircle className="text-green-500" />
        });
        
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {isEditMode ? 'Modifier le profil' : 'Créer un compte'}
          </h1>
          <p className="text-gray-600">
            {isEditMode 
              ? 'Mettez à jour vos informations personnelles' 
              : 'Remplissez le formulaire pour créer un nouveau compte'}
          </p>
        </div>
        
        {error && (
          <Alert 
            variant="danger" 
            className="mb-6 rounded-lg"
          >
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username Input */}
            <div className="relative">
              <Input
                label="Nom d'utilisateur"
                id="username"
                name="username"
                value={values.username}
                onChange={handleChange}
                error={errors.username}
                required
                autoComplete="username"
                icon={<FaUser className="text-gray-400" />}
                className="pl-10"
              />
            </div>
            
            {/* Full Name Input */}
            <div className="relative">
              <Input
                label="Nom complet"
                id="full_name"
                name="full_name"
                value={values.full_name}
                onChange={handleChange}
                error={errors.full_name}
                required
                autoComplete="name"
                icon={<FaIdBadge className="text-gray-400" />}
                className="pl-10"
              />
            </div>
            
            {/* Email Input */}
            <div className="relative">
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
                icon={<FaEnvelope className="text-gray-400" />}
                className="pl-10"
              />
            </div>
            
            {/* Role Dropdown */}
            <div>
              <Dropdown
                label="Rôle"
                id="role_id"
                name="role_id"
                value={values.role_id}
                onChange={handleChange}
                options={roleOptions}
                error={errors.role_id}
                required
                className="w-full"
              />
            </div>
            
            {/* Active Account Toggle */}
            {isEditMode && (
              <div className="col-span-2">
                <label className="flex items-center space-x-3 text-gray-700">
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
                    className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span>Compte actif</span>
                </label>
              </div>
            )}
            
            {/* Password Input */}
            <div className="relative">
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
                icon={<FaLock className="text-gray-400" />}
                className="pl-10 pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
              {values.password && (
                <PasswordStrengthIndicator password={values.password} />
              )}
            </div>
            
            {/* Confirm Password Input */}
            <div className="relative">
              <Input
                label="Confirmer le mot de passe"
                id="confirm_password"
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                value={values.confirm_password}
                onChange={handleChange}
                error={errors.confirm_password}
                required={!isEditMode || !!values.password}
                autoComplete="new-password"
                icon={<FaLock className="text-gray-400" />}
                className="pl-10 pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 pt-4">
            <p className="text-sm text-gray-500 italic flex items-center">
              <FaInfoCircle className="mr-2" />
              {isEditMode 
                ? "Les champs laissés vides resteront inchangés" 
                : "Tous les champs sont obligatoires"}
            </p>
            <div className="flex space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={onClose || (() => navigate('/users'))}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full sm:w-auto bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out"
              >
                {isEditMode ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;