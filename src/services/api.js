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
    const csrfToken = Cookies.get('XSRF-TOKEN'); // Coincide con el nombre del backend

    console.log('CSRF Token (cookie):', csrfToken); // Para depuración

    // Asegurarse de que config.headers existe
    if (!config.headers) {
      config.headers = {};
    }

    // Si existe el token CSRF en cookies, añadirlo a los encabezados
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken; // Solo este encabezado será enviado
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
    let csrfToken = Cookies.get('XSRF-TOKEN'); // Coincide con el nombre del backend

    // Si ya existe un token en las cookies, lo usamos
    if (csrfToken) {
      console.log('Usando token CSRF existente de cookies:', csrfToken);
      return true;
    }

    // Intentar obtener un token CSRF del servidor
    const response = await api.get('/api/csrf-token');

    // Si el servidor devuelve un token, lo guardamos en una cookie
    if (response.data && response.data.success) {
      const csrfToken = Cookies.get('XSRF-TOKEN'); // Leer el token de la cookie
      if (csrfToken) {
        console.log('Usando token CSRF recibido del servidor:', csrfToken);
        return true;
      }
    }

    console.error('El servidor no devolvió un token CSRF válido.');
    return false;
  } catch (error) {
    console.error('Error al obtener el token CSRF:', error);
    return false;
  }
};

export default api;