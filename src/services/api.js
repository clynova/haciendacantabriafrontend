// En tu archivo de servicios (ej: src/services/api.js)

import axios from 'axios';
import Cookies from 'js-cookie'; // Aún lo usamos para comparar

// ... (tu configuración de 'api' con Axios create) ...
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// --- NUEVO: Función para leer cookie manualmente ---
function getCookieValue(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let [cookieName, ...cookieParts] = cookies[i].split('=');
    cookieName = cookieName?.trim();
    if (cookieName === name) {
      return decodeURIComponent(cookieParts.join('=').trim());
    }
  }
  return null; // O undefined, para ser consistente
}
// --- FIN NUEVO ---


// Interceptor Modificado para Diagnóstico
api.interceptors.request.use(
  (config) => {
    const methodsRequiringCsrf = ['POST', 'PUT', 'DELETE', 'PATCH'];
    if (config.method && methodsRequiringCsrf.includes(config.method.toUpperCase())) {

        console.log("--- Interceptor Debug ---");
        // 1. Loguear document.cookie completo
        console.log("Interceptor: document.cookie:", document.cookie || "(vacío)");

        // 2. Intentar leer con js-cookie (como antes)
        const csrfTokenFromJsCookie = Cookies.get('XSRF-TOKEN');
        console.log('Interceptor: Valor desde Cookies.get("XSRF-TOKEN"):', csrfTokenFromJsCookie);

        // 3. Intentar leer manualmente
        const csrfTokenManual = getCookieValue('XSRF-TOKEN');
        console.log('Interceptor: Valor desde lectura manual de document.cookie:', csrfTokenManual);

        // Usar el valor manual si existe y el de js-cookie no
        const csrfTokenToUse = csrfTokenFromJsCookie || csrfTokenManual;
        console.log('Interceptor: Token que se intentará usar:', csrfTokenToUse);
        console.log("--- Fin Interceptor Debug ---");


        if (csrfTokenToUse) {
            if (!config.headers) { config.headers = {}; }
            config.headers['X-CSRF-TOKEN'] = csrfTokenToUse;
            console.log('Interceptor: Añadiendo X-CSRF-TOKEN header:', csrfTokenToUse);
        } else {
            console.warn('Interceptor: No se pudo obtener la cookie XSRF-TOKEN ni con js-cookie ni manualmente.');
            // ¡IMPORTANTE! Si el token no se encuentra, la solicitud irá sin él y fallará en el backend.
        }
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


// --- ensureCsrfCookie (simplificada, como la dejamos antes) ---
export const ensureCsrfCookie = async () => {
  if (Cookies.get('XSRF-TOKEN')) {
    console.log('ensureCsrfCookie: La cookie XSRF-TOKEN ya existe (según js-cookie).');
    return true;
  }
  console.log('ensureCsrfCookie: Cookie XSRF-TOKEN no encontrada por js-cookie. Solicitando al backend...');
  try {
    const response = await api.get('/api/csrf-token');
    if (response.status >= 200 && response.status < 300 && response.data?.success) {
      console.log('ensureCsrfCookie: Solicitud a /api/csrf-token exitosa. Asumiendo que el navegador almacenó la cookie.');
      return true;
    } else {
      console.error('ensureCsrfCookie: La solicitud a /api/csrf-token no fue exitosa.', response);
      return false;
    }
  } catch (error) {
    console.error('ensureCsrfCookie: Error durante la solicitud a /api/csrf-token:', error.response || error.message || error);
    return false;
  }
};


// ... resto de tus exportaciones de API ...
export default api;
