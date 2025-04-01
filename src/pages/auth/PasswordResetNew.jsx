import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { requestPasswordResetConfirmNewPass } from '../../services/authService';
import { FiLock } from 'react-icons/fi';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import InputField from '../../components/Auth/InputField';
import AuthIllustration from '../../components/Auth/AuthIllustration';
import illustration from "../../images/login-illustration.svg";
import PasswordStrengthMeter from '../../components/Auth/PasswordStrengthMeter';

const PasswordResetNew = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
        email: location.state?.email || '',
        token: location.state?.token || ''
    });

    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
        general: ''
    });

    const [touched, setTouched] = useState({
        password: false,
        confirmPassword: false
    });

    const [showPasswords, setShowPasswords] = useState({
        password: false,
        confirmPassword: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Verificar que se tiene un token y email validados
    useEffect(() => {
        if (!location.state?.validated || !formData.email || !formData.token) {
            toast.error('Se requiere validación previa');
            navigate('/auth/forgot-password');
        }
    }, [location.state, formData.email, formData.token, navigate]);

    // Validación
    const validatePassword = (value) => {
        if (!value) return 'La contraseña es requerida';
        if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
        if (!/[A-Z]/.test(value)) return 'La contraseña debe incluir al menos una mayúscula';
        if (!/[a-z]/.test(value)) return 'La contraseña debe incluir al menos una minúscula';
        if (!/[0-9]/.test(value)) return 'La contraseña debe incluir al menos un número';
        return '';
    };

    const validateConfirmPassword = (value) => {
        if (!value) return 'Debes confirmar tu contraseña';
        if (value !== formData.password) return 'Las contraseñas no coinciden';
        return '';
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field, formData[field]);
    };

    const validateField = (name, value) => {
        let error = '';
        if (name === 'password') error = validatePassword(value);
        if (name === 'confirmPassword') error = validateConfirmPassword(value);
        setErrors(prev => ({ ...prev, [name]: error }));
        return !error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (touched[name]) {
            validateField(name, value);
        }
        // Si cambia la contraseña, validar también la confirmación si ya fue tocada
        if (name === 'password' && touched.confirmPassword) {
            validateField('confirmPassword', formData.confirmPassword);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar todos los campos
        setTouched({ password: true, confirmPassword: true });
        const passwordValid = validateField('password', formData.password);
        const confirmPasswordValid = validateField('confirmPassword', formData.confirmPassword);
        
        if (!passwordValid || !confirmPasswordValid) return;
        
        setIsSubmitting(true);
        setErrors(prev => ({ ...prev, general: '' }));
        
        try {
            // Enviar solicitud con email, token y nueva contraseña
            const response = await requestPasswordResetConfirmNewPass(
                formData.token, 
                formData.email, 
                formData.password, 
                formData.confirmPassword
            );
            
            if (response.success) {
                toast.success('Contraseña actualizada con éxito');
                navigate('/auth/password-confirmada');
            } else {
                setErrors(prev => ({ ...prev, general: response.message || 'Error al actualizar la contraseña' }));
                toast.error(response.message || 'Error al actualizar la contraseña');
            }
        } catch (error) {
            const errorMsg = error?.message || 'Error al actualizar la contraseña. Inténtalo de nuevo.';
            setErrors(prev => ({ ...prev, general: errorMsg }));
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center p-12 w-full lg:w-1/2">
                <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Crear nueva contraseña</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
                    Crea una nueva contraseña segura que no hayas utilizado antes.
                </p>

                <form className="w-full max-w-md space-y-6" onSubmit={handleSubmit}>
                    {errors.general && (
                        <div className="p-4 text-sm rounded-lg bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400">
                            <p>{errors.general}</p>
                        </div>
                    )}

                    <div>
                        <label 
                            htmlFor="password" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Nueva contraseña
                        </label>
                        <div className="relative">
                            <input 
                                type={showPasswords.password ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={() => handleBlur('password')}
                                className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none
                                        dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-10
                                        ${errors.password 
                                            ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-800' 
                                            : 'border-gray-300 focus:ring-blue-200 dark:focus:ring-blue-800'}`}
                                placeholder="Nueva contraseña"
                                autoComplete="new-password"
                                required
                            />
                            <div className="absolute inset-y-0 left-0 px-3 flex items-center pointer-events-none">
                                <FiLock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </div>
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('password')}
                                className="absolute inset-y-0 right-0 px-3 flex items-center"
                            >
                                {showPasswords.password ? 
                                    <HiEyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" /> : 
                                    <HiEye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                }
                            </button>
                        </div>
                        {errors.password && touched.password && (
                            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                        )}
                        <PasswordStrengthMeter password={formData.password} />
                    </div>

                    <div>
                        <label 
                            htmlFor="confirmPassword" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Confirmar contraseña
                        </label>
                        <div className="relative">
                            <input 
                                type={showPasswords.confirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onBlur={() => handleBlur('confirmPassword')}
                                className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none
                                        dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-10
                                        ${errors.confirmPassword 
                                            ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-800' 
                                            : 'border-gray-300 focus:ring-blue-200 dark:focus:ring-blue-800'}`}
                                placeholder="Confirmar contraseña"
                                autoComplete="new-password"
                                required
                            />
                            <div className="absolute inset-y-0 left-0 px-3 flex items-center pointer-events-none">
                                <FiLock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </div>
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirmPassword')}
                                className="absolute inset-y-0 right-0 px-3 flex items-center"
                            >
                                {showPasswords.confirmPassword ? 
                                    <HiEyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" /> : 
                                    <HiEye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                }
                            </button>
                        </div>
                        {errors.confirmPassword && touched.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                                   text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center
                                   ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Actualizando...
                            </>
                        ) : (
                            'Cambiar contraseña'
                        )}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/auth/password-reset-validate', { 
                                state: { 
                                    email: formData.email, 
                                    token: formData.token
                                } 
                            })}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            ← Volver al paso anterior
                        </button>
                    </div>
                </form>
            </div>
            <AuthIllustration illustration={illustration} />
        </>
    );
};

export { PasswordResetNew };