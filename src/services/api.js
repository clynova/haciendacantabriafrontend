// En tu archivo de servicios (ej: src/services/api.js)

import axios from 'axios';
// Ya no necesitamos js-cookie para CSRF
// import Cookies from 'js-cookie';

// --- Variable para almacenar el token CSRF en memoria ---
let csrfTokenInMemory = null;
// ---

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Sigue siendo necesario para la cookie de SESIÓN
});

// Interceptor Modificado para usar el token en memoria
api.interceptors.request.use(
  (config) => {
    const methodsRequiringCsrf = ['POST', 'PUT', 'DELETE', 'PATCH'];
    if (config.method && methodsRequiringCsrf.includes(config.method.toUpperCase())) {

        console.log("--- Interceptor CSRF Check ---");
        console.log("Interceptor: Intentando usar token CSRF desde memoria:", csrfTokenInMemory);

        if (csrfTokenInMemory) {
            if (!config.headers) { config.headers = {}; }
            config.headers['X-CSRF-TOKEN'] = csrfTokenInMemory; // Usa el token de la variable
            console.log('Interceptor: Añadiendo X-CSRF-TOKEN header desde memoria:', csrfTokenInMemory);
        } else {
            // Esto NO debería pasar si ensureCsrfCookie se llamó correctamente antes
            console.error('Interceptor: ¡ERROR! Token CSRF en memoria es null. La solicitud probablemente fallará.');
        }
        console.log("--- Fin Interceptor CSRF Check ---");
    }

    // Código del token de autenticación (sin cambios)
    const authToken = localStorage.getItem('token');
    if (authToken) {
      if (!config.headers) { config.headers = {}; }
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => { return Promise.reject(error); }
);


// --- ensureCsrfCookie MODIFICADA para obtener token de la respuesta ---
export const ensureCsrfCookie = async () => {
  // Si ya tenemos el token en memoria, no hacemos nada más
  if (csrfTokenInMemory) {
    console.log('ensureCsrfCookie: Token CSRF ya existe en memoria.');
    return true;
  }

  console.log('ensureCsrfCookie: Token CSRF no en memoria. Solicitando al backend...');
  try {
    // Hacemos la solicitud GET para obtener el token en la respuesta
    const response = await api.get('/api/csrf-token');

    // Verificamos la respuesta y extraemos el token
    if (response.status >= 200 && response.status < 300 && response.data?.success && response.data?.csrfToken) {
      csrfTokenInMemory = response.data.csrfToken; // <-- ALMACENAMOS EL TOKEN EN LA VARIABLE
      console.log('ensureCsrfCookie: Token CSRF recibido y almacenado en memoria:', csrfTokenInMemory);
      return true; // Éxito
    } else {
      console.error('ensureCsrfCookie: La solicitud a /api/csrf-token no fue exitosa o no contenía el token CSRF.', response);
      csrfTokenInMemory = null; // Asegurar que esté nulo si falla
      return false;
    }
  } catch (error) {
    console.error('ensureCsrfCookie: Error durante la solicitud a /api/csrf-token:', error.response || error.message || error);
     if (error.response) {
      console.error('Detalles del error:', { status: error.response.status, data: error.response.data });
    }
    csrfTokenInMemory = null; // Asegurar que esté nulo si falla
    return false;
  }
};


// ... resto de tus exportaciones de API ...
export default api;
