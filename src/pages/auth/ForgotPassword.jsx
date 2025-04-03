import { useGlobal } from '../../context/GlobalContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import InputField from '../../components/Auth/InputField';
import AuthIllustration from '../../components/Auth/AuthIllustration';
import illustration from "../../images/email-illustration.svg";
import { toast } from 'react-hot-toast';
import { requestPasswordReset } from '../../services/authService';

const ForgotPassword = () => {
    const { setPageTitle } = useGlobal();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [touched, setTouched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    useEffect(() => {
        setPageTitle('Recuperar Contraseña | Cohesa');
    }, [setPageTitle]);

    const validateEmail = (value) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!value) return 'El correo es requerido';
        if (!emailRegex.test(value)) return 'Correo electrónico inválido';
        return '';
    };

    const handleBlur = () => {
        setTouched(true);
        setError(validateEmail(email));
    };

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (touched) setError(validateEmail(e.target.value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched(true);
        const validationError = validateEmail(email);
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        try {
            await requestPasswordReset(email);
            toast.success('Se ha enviado un código de verificación a tu correo', {
                icon: '✉️',
                duration: 5000,
            });
            // Redirigir a la página de validación de token en lugar de mostrar el mensaje de éxito
            navigate('/auth/password-reset-validate', { state: { email } });
        } catch (error) {
            const errorMessage = error.response?.status === 404
                ? 'No existe una cuenta con este correo electrónico'
                : 'Hubo un problema al enviar el código de verificación. Por favor, intenta nuevamente.';
            
            toast.error(errorMessage, {
                icon: '❌',
            });
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (emailSent) {
        return (
            <>
                <div className="flex flex-col items-center justify-center p-12 w-full lg:w-1/2">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">¡Correo Enviado!</h1>
                    <div className="bg-green-100 dark:bg-green-900/50 p-6 rounded-lg mb-6 max-w-md">
                        <p className="text-green-700 dark:text-green-300 text-center">
                            Hemos enviado un código de verificación a <strong>{email}</strong>. 
                            Por favor, revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/auth/password-reset-validate', { state: { email } })}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                                 text-white rounded-lg font-semibold transition-all duration-300 mb-4"
                    >
                        Continuar con la verificación
                    </button>
                    <button
                        onClick={() => navigate('/auth')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Volver al inicio de sesión
                    </button>
                </div>
                <AuthIllustration illustration={illustration} />
            </>
        );
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center p-12 w-full lg:w-1/2">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Recuperar Contraseña</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
                    Ingresa tu correo electrónico y te enviaremos un código de verificación para restablecer tu contraseña.
                </p>

                <form className="w-full max-w-md space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <InputField
                            id="email"
                            name="email"
                            label="Correo electrónico"
                            type="email"
                            icon={FiMail}
                            value={email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Ingresa tu correo electrónico"
                            required
                        />
                        {error && touched && (
                            <p className="mt-1 text-sm text-red-500">{error}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                                   text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center
                                   ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Enviando...
                            </>
                        ) : (
                            'Enviar código de verificación'
                        )}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/auth')}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            ← Volver al inicio de sesión
                        </button>
                    </div>
                </form>
            </div>
            <AuthIllustration illustration={illustration} />
        </>
    );
};

export { ForgotPassword };