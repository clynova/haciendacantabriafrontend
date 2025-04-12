import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Para permitir enviar y recibir cookies en solicitudes cross-origin
});

// Interceptor para añadir el token CSRF a las solicitudes
api.interceptors.request.use(
    (config) => {
        // Obtener el token CSRF del localStorage
        const csrfToken = localStorage.getItem('CSRF-TOKEN');
        
        if (csrfToken) {
            // Usar el nombre de encabezado que espera tu backend
            config.headers['X-CSRF-TOKEN'] = csrfToken;
            // También agregar como X-XSRF-TOKEN para compatibilidad
            config.headers['X-XSRF-TOKEN'] = csrfToken;
        }
        
        // Si hay un token de autenticación, incluirlo en todas las solicitudes
        const authToken = localStorage.getItem('token');
        if (authToken) {
            config.headers['Authorization'] = `Bearer ${authToken}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getCsrfToken = async () => {
    try {
        // Intentar obtener un token CSRF del servidor
        const response = await api.get('/api/csrf-token');
        
        // Si el servidor devuelve un token directamente, lo guardamos
        if (response.data && response.data.csrfToken) {
            localStorage.setItem('CSRF-TOKEN', response.data.csrfToken);
            return true;
        }
        
        // Si el servidor no devuelve un token pero la respuesta es exitosa
        // generamos uno temporal (esto es solo para desarrollo, en producción
        // el token siempre debe venir del servidor)
        const tempToken = `temp-csrf-${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('CSRF-TOKEN', tempToken);
        console.warn('Usando token CSRF temporal. En producción, este token debe ser generado por el servidor.');
        return true;
    } catch (error) {
        console.error('Error al obtener el token CSRF:', error);
        
        // Como medida temporal para desarrollo, generamos un token
        // Esto NO debe usarse en producción
        const tempToken = `temp-csrf-${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('CSRF-TOKEN', tempToken);
        console.warn('Usando token CSRF temporal debido a error. En producción, este token debe ser generado por el servidor.');
        
        // No bloqueamos el flujo de autenticación
        return true;
    }
};

export default api;