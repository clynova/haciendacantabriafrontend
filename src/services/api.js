import axios from 'axios';
import Cookies from 'js-cookie';

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
        // Obtener el token CSRF de las cookies usando js-cookie
        const csrfToken = Cookies.get('CSRF-Token');

        console.log('CSRF Token (cookie):', csrfToken); // Para depuración
        
        // Asegurarse de que config.headers existe
        if (!config.headers) {
            config.headers = {};
        }
        
        // Si existe el token CSRF en cookies, añadirlo a los encabezados
        if (csrfToken) {
            // Asegurarse de que los encabezados se establecen correctamente
            config.headers['CSRF-Token'] = csrfToken;
            config.headers['X-CSRF-TOKEN'] = csrfToken; // Para compatibilidad con Laravel/otros frameworks
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
        // Comprobar si ya existe un token CSRF en las cookies
        let csrfToken = Cookies.get('CSRF-Token');
        
        // Si ya existe un token en las cookies, lo usamos
        if (csrfToken) {
            console.log('Usando token CSRF existente de cookies:', csrfToken);
            return true;
        }
        
        // Intentar obtener un token CSRF del servidor
        const response = await api.get('/api/csrf-token');
        
        // Si el servidor devuelve un token, lo guardamos en una cookie
        if (response.data && response.data.csrfToken) {
            // Guardar en cookie con opciones de seguridad
            Cookies.set('CSRF-Token', response.data.csrfToken, {
                secure: window.location.protocol === 'https:', // Solo en HTTPS en producción
                sameSite: 'Lax', // Protección contra CSRF
                expires: 1 // Expira en 1 día
            });
            return true;
        }
        
        // Si el servidor no devuelve un token, crear uno temporal para desarrollo
        const tempToken = `temp-csrf-${Math.random().toString(36).substring(2, 15)}`;
        Cookies.set('CSRF-Token', tempToken, { 
            secure: window.location.protocol === 'https:',
            sameSite: 'none',
            expires: 1
        });
        console.warn('Usando token CSRF temporal. En producción, este token debe ser generado por el servidor.');
        return true;
    } catch (error) {
        console.error('Error al obtener el token CSRF:', error);
        
        // Como medida temporal para desarrollo, generamos un token
        const tempToken = `temp-csrf-${Math.random().toString(36).substring(2, 15)}`;
        Cookies.set('CSRF-Token', tempToken, { 
            secure: window.location.protocol === 'https:',
            sameSite: 'none',
            expires: 1
        });
        console.warn('Usando token CSRF temporal debido a error. En producción, este token debe ser generado por el servidor.');
        return true;
    }
};

export default api;