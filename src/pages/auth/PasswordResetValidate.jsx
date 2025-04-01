import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { requestPasswordResetConfirmToken } from '../../services/authService';
import { FiMail, FiKey } from 'react-icons/fi';
import InputField from '../../components/Auth/InputField';
import AuthIllustration from '../../components/Auth/AuthIllustration';
import illustration from "../../images/email-illustration.svg";
import TokenInput from '../../components/Auth/TokenInput';

const PasswordResetValidate = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: searchParams.get('email') || location.state?.email || '',
        token: searchParams.get('token') || location.state?.token || ''
    });
    const [errors, setErrors] = useState({
        email: '',
        token: ''
    });
    const [touched, setTouched] = useState({
        email: false,
        token: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validación
    const validateEmail = (value) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!value) return 'El correo electrónico es requerido';
        if (!emailRegex.test(value)) return 'Correo electrónico inválido';
        return '';
    };

    const validateToken = (value) => {
        if (!value) return 'El código de verificación es requerido';
        if (value.length !== 6) return 'El código debe tener 6 dígitos';
        if (!/^\d+$/.test(value)) return 'El código debe contener solo números';
        return '';
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field, formData[field]);
    };

    const validateField = (name, value) => {
        let error = '';
        if (name === 'email') error = validateEmail(value);
        if (name === 'token') error = validateToken(value);
        setErrors(prev => ({ ...prev, [name]: error }));
        return !error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (touched[name]) {
            validateField(name, value);
        }
    };

    const handleTokenChange = (value) => {
        setFormData(prev => ({ ...prev, token: value }));
        if (touched.token) {
            validateField('token', value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar todos los campos
        setTouched({ email: true, token: true });
        const emailValid = validateField('email', formData.email);
        const tokenValid = validateField('token', formData.token);
        
        if (!emailValid || !tokenValid) return;
        
        setIsSubmitting(true);
        
        try {
            const response = await requestPasswordResetConfirmToken(formData.token, formData.email);
            
            if (response.success) {
                // Redirigir a la página de nueva contraseña
                navigate('/auth/password-reset-new', { 
                    state: { 
                        email: formData.email, 
                        token: formData.token,
                        validated: true
                    } 
                });
                toast.success('Código verificado con éxito');
            } else {
                toast.error(response.message || 'Error al verificar el código');
                setErrors(prev => ({ ...prev, token: 'Código de verificación inválido' }));
            }
        } catch (error) {
            const errorMsg = error?.message || 'Error al verificar el código';
            toast.error(errorMsg);
            setErrors(prev => ({ ...prev, token: errorMsg }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center p-12 w-full lg:w-1/2">
                <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Verificar código</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
                    Por favor, introduce el código de verificación que hemos enviado a tu correo electrónico para restablecer tu contraseña.
                </p>

                <form className="w-full max-w-md space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <InputField
                            id="email"
                            name="email"
                            label="Correo electrónico"
                            type="email"
                            icon={FiMail}
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={() => handleBlur('email')}
                            placeholder="Ingresa tu correo electrónico"
                            required
                        />
                        {errors.email && touched.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Código de verificación
                        </label>
                        <div className="mt-1">
                            <TokenInput 
                                length={6} 
                                onChange={handleTokenChange}
                                initialValue={formData.token}
                            />
                        </div>
                        {errors.token && touched.token && (
                            <p className="mt-1 text-sm text-red-500">{errors.token}</p>
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
                                Verificando...
                            </>
                        ) : (
                            'Verificar y continuar'
                        )}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/auth/forgot-password')}
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

export { PasswordResetValidate };