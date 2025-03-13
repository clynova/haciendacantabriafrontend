import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Reemplaza con la URL de tu API
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;