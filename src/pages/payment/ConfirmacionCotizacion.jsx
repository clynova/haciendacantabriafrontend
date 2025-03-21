import { Link } from 'react-router-dom';
import { HiCheckCircle, HiArrowLeft } from 'react-icons/hi';
import { motion } from 'framer-motion';

const ConfirmacionCotizacion = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 px-4">
            <motion.div 
                className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                        <HiCheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    ¡Cotización Enviada!
                </h1>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-4 mb-6">
                    <p className="text-green-800 dark:text-green-300 text-lg mb-2">
                        Tu solicitud de cotización ha sido recibida exitosamente
                    </p>
                    <p className="text-green-700 dark:text-green-400">
                        Nos pondremos en contacto contigo pronto para brindarte todos los detalles
                    </p>
                </div>

                <div className="space-y-4">
                    <Link 
                        to="/profile"
                        className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                    >
                        Ver mi perfil
                    </Link>
                    
                    <Link 
                        to="/"
                        className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                    >
                        <HiArrowLeft className="w-5 h-5 mr-2" />
                        Volver al inicio
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export { ConfirmacionCotizacion };