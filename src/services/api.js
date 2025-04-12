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

        console.log('CSRF Token:', csrfToken); // Para depuración
        
        // Asegurarse de que config.headers existe
        if (!config.headers) {
            config.headers = {};
        }
        
        // Si existe el token CSRF, añadirlo a los encabezados de la solicitud
        if (csrfToken) {
            // Asegurarse de que los encabezados se establecen correctamente
            // Usar todos los formatos comunes para mayor compatibilidad
            config.headers['CSRF-Token'] = csrfToken;
            config.headers['X-CSRF-TOKEN'] = csrfToken;
            config.headers['X-XSRF-TOKEN'] = csrfToken;
            // Algunas APIs también esperan el token en un encabezado simplificado
            config.headers['csrf-token'] = csrfToken;
            // Para Express.js que a menudo usa este formato
            config.headers['_csrf'] = csrfToken;
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
        const response = await api.get('/api/csrf-token'); // Nota: quité '/api' porque ya está en baseURL
        
        // Si el servidor devuelve un token, lo guardamos
        if (response.data && response.data.csrfToken) {
            localStorage.setItem('CSRF-TOKEN', response.data.csrfToken);
            return true;
        }
        
        console.error('El servidor no devolvió un token CSRF válido');
        return false;
    } catch (error) {
        console.error('Error al obtener el token CSRF:', error);
        return false;
    }
};

export default api;