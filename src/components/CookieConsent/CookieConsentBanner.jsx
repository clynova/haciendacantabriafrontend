import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiShieldCheck, HiInformationCircle } from 'react-icons/hi';

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Verificar si el usuario ya ha dado su consentimiento
  useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      // Mostrar el banner después de un pequeño retraso para mejorar la experiencia del usuario
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Función para aceptar todas las cookies
  const acceptAll = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
      timestamp: new Date().toISOString()
    }));
    setIsVisible(false);
  };

  // Función para aceptar solo las cookies necesarias
  const acceptNecessary = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
      timestamp: new Date().toISOString()
    }));
    setIsVisible(false);
  };

  // Si el banner no es visible, no renderizar nada
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-0"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <HiShieldCheck className="w-6 h-6 text-blue-400 mr-2" />
                    <h3 className="text-lg font-semibold text-white">Política de Cookies</h3>
                  </div>
                  <p className="text-slate-300 mb-4">
                    Este sitio web utiliza cookies para mejorar su experiencia, personalizar el contenido y analizar el tráfico. Puedes elegir aceptar todas las cookies o ajustar tu configuración.
                  </p>
                  
                  {showDetails && (
                    <div className="mb-4 bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-medium text-white mb-2">Tipos de cookies utilizadas:</h4>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-start">
                          <span className="font-medium mr-2">•</span>
                          <div>
                            <span className="font-medium text-white">Necesarias:</span> Para el funcionamiento básico del sitio.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">•</span>
                          <div>
                            <span className="font-medium text-white">Analíticas:</span> Para entender cómo utilizas nuestro sitio.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">•</span>
                          <div>
                            <span className="font-medium text-white">Marketing:</span> Para mostrar anuncios relevantes.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">•</span>
                          <div>
                            <span className="font-medium text-white">Preferencias:</span> Para recordar tus ajustes y preferencias.
                          </div>
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                  >
                    <HiInformationCircle className="mr-1" />
                    {showDetails ? 'Ocultar detalles' : 'Más información'}
                  </button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={acceptNecessary}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg 
                               transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                  >
                    Solo necesarias
                  </button>
                  <button
                    onClick={acceptAll}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg 
                               transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 
                               shadow-lg shadow-blue-900/30"
                  >
                    Aceptar todas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;