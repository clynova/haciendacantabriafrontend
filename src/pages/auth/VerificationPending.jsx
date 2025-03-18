import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { HiMail } from 'react-icons/hi';
import { validarToken, reenviarToken } from '../../services/authService';
import { toast } from 'react-hot-toast';
import TokenInput from '../../components/Auth/TokenInput';

const VerificationPending = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const urlEmail = searchParams.get('email');
    const urlToken = searchParams.get('token');
    
    // Use URL params if available, otherwise use location state
    const { email: stateEmail, message: stateMessage } = location.state || {};
    const email = urlEmail || stateEmail || '';
    const message = stateMessage || 'Te hemos enviado un código de verificación a tu correo electrónico.';
    
    const [token, setToken] = useState(urlToken || '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Protección contra acceso directo sin parámetros
    useEffect(() => {
        if (!email) {
            navigate('/auth');
            toast.error('Acceso no válido a la página de verificación');
        }
    }, [email, navigate]);

    // Verificación automática si llega con token en la URL
    useEffect(() => {
        if (urlToken && urlToken.length === 6 && urlEmail && !isSubmitting && !success) {
            handleVerifyToken();
        }
    }, []);

    // Manejo del contador para reenvío
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Auto-submit cuando el token está completo
    useEffect(() => {
        if (token.length === 6 && !isSubmitting && !success) {
            handleVerifyToken();
        }
    }, [token]);

    const handleVerifyToken = async (e) => {
        if (e) e.preventDefault();
        if (isSubmitting) return;

        setError('');
        setSuccess(false);
        setIsSubmitting(true);

        try {
            if (!token || token.length !== 6) {
                setError('Por favor, ingresa el código completo.');
                setIsSubmitting(false);
                return;
            }

            await validarToken(token, email);
            setSuccess(true);
            toast.success('¡Cuenta verificada exitosamente!');
            setTimeout(() => navigate('/auth'), 2000);
        } catch (error) {
            setError(error.message || 'Código inválido. Por favor, intenta nuevamente.');
            toast.error('Código inválido');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendToken = useCallback(async () => {
        if (countdown > 0) return;
        
        setIsResending(true);
        try {
            await reenviarToken(email);
            setCountdown(60); // 1 minuto de espera
            toast.success('Nuevo código enviado. Revisa tu correo.', {
                duration: 4000,
                icon: '✉️',
            });
        } catch (error) {
            toast.error('Error al reenviar el código. Por favor, intenta más tarde.', {
                icon: '❌',
            });
        } finally {
            setIsResending(false);
        }
    }, [email, countdown]);

    return (
        <div className="flex flex-col items-center justify-center p-8 w-full max-w-md mx-auto">
            <HiMail className="text-6xl text-blue-500 mb-6" />
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">Verifica tu cuenta</h2>
            
            <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg mb-6 text-center">
                <p className="text-blue-700 dark:text-blue-300">{message}</p>
                <p className="mt-2 font-medium text-blue-800 dark:text-blue-200">
                    Correo enviado a: <strong>{email}</strong>
                </p>
            </div>

            <form onSubmit={handleVerifyToken} className="w-full space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                        Ingresa el código de verificación:
                    </label>
                    <TokenInput 
                        length={6} 
                        onChange={setToken}
                        initialValue={urlToken || ''}
                    />
                </div>

                {error && (
                    <div className="p-3 text-sm rounded-lg bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-3 text-sm rounded-lg bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">
                        ¡Tu cuenta ha sido verificada exitosamente! Redirigiendo...
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting || token.length !== 6}
                    className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg 
                             transition-colors duration-200 flex items-center justify-center
                             ${(isSubmitting || token.length !== 6) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                        'Verificar código'
                    )}
                </button>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={handleResendToken}
                        disabled={countdown > 0 || isResending}
                        className={`text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium
                                  ${(countdown > 0 || isResending) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isResending ? 'Reenviando...' : 
                         countdown > 0 ? `Reenviar código (${countdown}s)` : 
                         'Reenviar código'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export { VerificationPending };