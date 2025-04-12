import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Asegúrate que esta URL sea la correcta de Render (https://...)
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CORRECTO: Necesario para cookies cross-origin
});

// Interceptor para añadir el token CSRF a las solicitudes POST, PUT, DELETE, etc.
api.interceptors.request.use(
  (config) => {
    // Solo añadir X-CSRF-TOKEN para métodos que modifican estado (más seguro)
    // o si la ruta específica lo requiere. GET/HEAD/OPTIONS usualmente no lo necesitan.
    const methodsRequiringCsrf = ['POST', 'PUT', 'DELETE', 'PATCH'];

    if (config.method && methodsRequiringCsrf.includes(config.method.toUpperCase())) {
        const csrfToken = Cookies.get('XSRF-TOKEN'); // Lee la cookie

        console.log('Interceptor: Intentando leer XSRF-TOKEN cookie:', csrfToken); // Para depuración

        if (csrfToken) {
            if (!config.headers) {
                config.headers = {};
            }
            config.headers['X-CSRF-TOKEN'] = csrfToken; // Añade el header
            console.log('Interceptor: Añadiendo X-CSRF-TOKEN header:', csrfToken);
        } else {
            console.warn('Interceptor: No se encontró la cookie XSRF-TOKEN para añadir el header.');
            // Podrías querer bloquear la solicitud aquí si el token es estrictamente necesario
        }
    }

    // Incluir token de autenticación si existe (esto está bien)
    const authToken = localStorage.getItem('token');
    if (authToken) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Llama al endpoint del backend para que establezca la cookie XSRF-TOKEN.
 * Debe llamarse ANTES de cualquier operación que requiera protección CSRF.
 * Devuelve true si la solicitud fue exitosa, false en caso contrario.
 * El almacenamiento real de la cookie depende de la respuesta del backend y del navegador.
 */
export const ensureCsrfCookie = async () => {
  // Comprobar si ya existe para evitar llamadas innecesarias (opcional pero bueno)
  if (Cookies.get('XSRF-TOKEN')) {
    console.log('ensureCsrfCookie: La cookie XSRF-TOKEN ya existe.');
    return true;
  }

  console.log('ensureCsrfCookie: Cookie XSRF-TOKEN no encontrada. Solicitando al backend...');
  try {
    // Hacemos la solicitud GET a la ruta que genera el token y establece la cookie
    const response = await api.get('/api/csrf-token');

    // Verificamos si la solicitud fue exitosa (status 2xx y el backend confirma success)
    if (response.status >= 200 && response.status < 300 && response.data && response.data.success) {
      console.log('ensureCsrfCookie: Solicitud a /api/csrf-token exitosa. El backend DEBERÍA haber enviado Set-Cookie.');

      // DAMOS UN PEQUEÑO respiro al navegador para procesar el Set-Cookie
      await new Promise(resolve => setTimeout(resolve, 200));

      // VERIFICAMOS (para depuración) si la cookie AHORA existe
      const tokenJustSet = Cookies.get('XSRF-TOKEN');
      if (tokenJustSet) {
        console.log('ensureCsrfCookie: ¡Éxito! La cookie XSRF-TOKEN ahora existe:', tokenJustSet);
        return true;
      } else {
        console.error('ensureCsrfCookie: ERROR CRÍTICO - La solicitud fue exitosa, pero la cookie XSRF-TOKEN AÚN NO se encuentra. Revisa las DevTools (Network y Application).');
        return false;
      }
    } else {
      console.error('ensureCsrfCookie: La solicitud a /api/csrf-token no fue exitosa o el backend no confirmó success.', response);
      return false;
    }
  } catch (error) {
    console.error('ensureCsrfCookie: Error durante la solicitud a /api/csrf-token:', error.response || error.message || error);
    if (error.response) {
      console.error('Detalles del error:', { status: error.response.status, data: error.response.data, headers: error.response.headers });
    }
    return false;
  }
};

export default api;
