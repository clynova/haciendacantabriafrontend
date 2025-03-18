import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { HiCheckCircle } from 'react-icons/hi';
import { validarToken } from '../../services/authService';
import { toast } from 'react-hot-toast';

const VerificationSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const urlEmail = searchParams.get('email');
    const urlToken = searchParams.get('token');
    
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState('');

    // Verificar automáticamente cuando hay parámetros en la URL
    useEffect(() => {
        if (urlToken && urlEmail) {
            verifyFromUrl();
        } else if (location.state?.verified) {
            // Si ya viene verificado desde otra página
            setIsVerified(true);
        } else {
            // Si no hay ni token ni estado previo, redirigir
            navigate('/auth');
        }
    }, [urlToken, urlEmail]);

    const verifyFromUrl = async () => {
        setIsVerifying(true);
        setError('');
        
        try {
            await validarToken(urlToken, urlEmail);
            setIsVerified(true);
            toast.success('¡Cuenta verificada exitosamente!');
        } catch (error) {
            setError('No se pudo verificar la cuenta. El token puede ser inválido o haber expirado.');
            toast.error('Error de verificación');
            setTimeout(() => navigate('/auth/verification-pending', { 
                state: { email: urlEmail } 
            }), 3000);
        } finally {
            setIsVerifying(false);
        }
    };

    if (isVerifying) {
        return (
            <div className="flex flex-col items-center justify-center p-8 w-full max-w-md mx-auto">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="rounded-full bg-blue-100 p-4">
                        <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent animate-spin"></div>
                    </div>
                    <h2 className="text-2xl font-medium mt-4 text-gray-800 dark:text-white">Verificando tu cuenta...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8 w-full max-w-md mx-auto">
                <div className="text-red-500 text-6xl mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Error de verificación</h2>
                <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-lg mb-6 text-center">
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Serás redirigido para intentar nuevamente...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 w-full max-w-md mx-auto">
            <HiCheckCircle className="text-6xl text-green-500 mb-6" />
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">¡Verificación exitosa!</h2>
            
            <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg mb-6 text-center">
                <p className="text-green-700 dark:text-green-300">
                    Tu cuenta ha sido verificada exitosamente.
                </p>
                <p className="mt-2 text-green-700 dark:text-green-300">
                    Ya puedes acceder a todas las funciones de la plataforma.
                </p>
            </div>

            <div className="w-full space-y-4">
                <Link 
                    to="/auth/login"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg 
                             transition-colors duration-200 flex items-center justify-center"
                >
                    Iniciar sesión
                </Link>
                
                <Link 
                    to="/"
                    className="w-full py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
                             text-gray-800 dark:text-white font-semibold rounded-lg transition-colors duration-200 
                             flex items-center justify-center"
                >
                    Ir a la página principal
                </Link>
            </div>
        </div>
    );
};

export { VerificationSuccess };