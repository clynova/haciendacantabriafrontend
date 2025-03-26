import api from "./api";

const getRegionsActive = async (token) => {
    try {
        const response = await api.get("/api/regions")
        return response.data;
    }
    catch (error) {
        throw error.response?.data || { success: false, message: 'Error al obtener las regiones' };
    }
}

const createRegion = async (regionData, token) => {
    try {
        const response = await api.post("/api/regions", regionData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Error al crear la región' };
    }
}

export { getRegionsActive, createRegion }