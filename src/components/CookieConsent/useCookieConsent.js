import { useState, useEffect } from 'react';

export const useCookieConsent = () => {
  const [consent, setConsent] = useState(null);
  
  useEffect(() => {
    // Cargar el consentimiento desde localStorage cuando el componente se monta
    const storedConsent = localStorage.getItem('cookieConsent');
    if (storedConsent) {
      try {
        setConsent(JSON.parse(storedConsent));
      } catch (e) {
        console.error('Error parsing cookie consent data:', e);
        localStorage.removeItem('cookieConsent');
      }
    }
  }, []);

  // Función para comprobar si un tipo específico de cookie está permitido
  const hasConsent = (type = 'necessary') => {
    if (!consent) return false;
    return consent[type] === true;
  };

  // Función para actualizar el consentimiento
  const updateConsent = (newConsent) => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      ...newConsent,
      timestamp: new Date().toISOString()
    }));
    setConsent(newConsent);
  };

  // Función para borrar el consentimiento (útil para pruebas o para permitir al usuario restablecer sus preferencias)
  const clearConsent = () => {
    localStorage.removeItem('cookieConsent');
    setConsent(null);
  };

  return {
    consent,
    hasConsent,
    updateConsent,
    clearConsent
  };
};