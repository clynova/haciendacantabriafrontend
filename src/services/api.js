// En tu archivo de servicios (ej: src/services/api.js)

import axios from 'axios'; // Asegúrate que esté importado
import Cookies from 'js-cookie'; // Asegúrate que esté importado

// ... (tu configuración de 'api' con Axios create, interceptors, etc.) ...
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor (lo dejamos como estaba, es importante)
api.interceptors.request.use(
  (config) => {
    const methodsRequiringCsrf = ['POST', 'PUT', 'DELETE', 'PATCH'];
    if (config.method && methodsRequiringCsrf.includes(config.method.toUpperCase())) {
        const csrfToken = Cookies.get('XSRF-TOKEN');
        console.log('Interceptor: Intentando leer XSRF-TOKEN cookie:', csrfToken); // <-- ESTE LOG ES CLAVE AHORA
        if (csrfToken) {
            if (!config.headers) { config.headers = {}; }
            config.headers['X-CSRF-TOKEN'] = csrfToken;
            console.log('Interceptor: Añadiendo X-CSRF-TOKEN header:', csrfToken);
        } else {
            console.warn('Interceptor: No se encontró la cookie XSRF-TOKEN para añadir el header.');
        }
    }
    const authToken = localStorage.getItem('token');
    if (authToken) {
      if (!config.headers) { config.headers = {}; }
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => { return Promise.reject(error); }
);


// *** VERSIÓN SIMPLIFICADA DE ensureCsrfCookie ***
export const ensureCsrfCookie = async () => {
  // Comprobar si ya existe para evitar llamadas innecesarias
  if (Cookies.get('XSRF-TOKEN')) {
    console.log('ensureCsrfCookie: La cookie XSRF-TOKEN ya existe.');
    return true; // Ya existe, todo bien
  }

  console.log('ensureCsrfCookie: Cookie XSRF-TOKEN no encontrada. Solicitando al backend...');
  try {
    // Hacemos la solicitud GET para que el backend establezca la cookie
    const response = await api.get('/api/csrf-token');

    // Verificamos solo si la solicitud API fue exitosa
    if (response.status >= 200 && response.status < 300 && response.data?.success) {
      console.log('ensureCsrfCookie: Solicitud a /api/csrf-token exitosa. Asumiendo que el navegador almacenó la cookie.');
      // YA NO intentamos leerla aquí. Confiamos en que estará lista para el interceptor.
      return true; // Marcamos como éxito si la API respondió bien
    } else {
      console.error('ensureCsrfCookie: La solicitud a /api/csrf-token no fue exitosa o el backend no confirmó success.', response);
      return false;
    }
  } catch (error) {
    console.error('ensureCsrfCookie: Error durante la solicitud a /api/csrf-token:', error.response || error.message || error);
     if (error.response) {
      console.error('Detalles del error:', { status: error.response.status, data: error.response.data });
    }
    return false;
  }
};

// ... resto de tus exportaciones de API ...
export default api;
