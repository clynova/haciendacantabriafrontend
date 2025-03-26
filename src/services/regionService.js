import api from "./api";

/**
 * Obtiene las regiones activas para envío
 * @param {string} token - Token de autenticación del usuario
 * @returns {Promise<Object>} - Respuesta de la API
 */
const getRegionsActive = async (token) => {
    try {
        const response = await api.get("/api/regions", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener regiones activas:", error);
        return { success: false, data: [] };
    }
};

const getRegionsAll = async (token) => {
    try {
        const response = await api.get("/api/regions/all", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener regiones activas:", error);
        return { success: false, data: [] };
    }
};

/**
 * Crea una nueva región para envío
 * @param {Object} regionData - Datos de la región (name, code, isActive)
 * @param {string} token - Token de autenticación del usuario
 * @returns {Promise<Object>} - Respuesta de la API
 */
const createRegion = async (regionData, token) => {
    try {
        const response = await api.post("/api/regions", regionData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear región:", error);
        return { success: false, msg: error.response?.data?.msg || 'Error al crear la región' };
    }
};

/**
 * Actualiza el estado de una región (activa/inactiva)
 * @param {string} regionId - ID de la región a actualizar
 * @param {boolean} isActive - Nuevo estado de la región
 * @param {string} token - Token de autenticación del usuario
 * @returns {Promise<Object>} - Respuesta de la API
 */
const updateRegionStatus = async (regionId, isActive, token) => {
    try {
        const response = await api.put(`/api/regions/${regionId}/status`, { isActive }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar estado de la región:", error);
        return { success: false, msg: error.response?.data?.msg || 'Error al actualizar la región' };
    }
};

export { getRegionsActive, createRegion, updateRegionStatus, getRegionsAll };