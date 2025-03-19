import api from "./api";

const getShippingMethods = async (token) => {
    try {
        const response = await api.get("/api/shipping-methods", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching shipping methods:", error);
        return { success: false, shippingMethods: [] };
    }
}

const getShippingMethodById = async (_id, token) => {
    try {
        const response = await api.get(`/api/shipping-methods/${_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching shipping method by ID:", error);
        return { success: false, shippingMethod: null };
    }
}

const createShippingMethod = async (shippingMethod, token) => {
    try {
        const response = await api.post("/api/shipping-methods", shippingMethod, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating shipping method:", error);
        return { success: false };
    }
}

const updateShippingMethod = async (shippingMethod, token) => {
    try {
        const response = await api.put(`/api/shipping-methods/${shippingMethod._id}`, shippingMethod, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating shipping method:", error);
        return { success: false };
    }
}

const deleteShippingMethod = async (_id, token) => {
    try {
        const response = await api.delete(`/api/shipping-methods/${_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting shipping method:", error);
        return { success: false };
    }
}


export { getShippingMethods, getShippingMethodById, createShippingMethod, updateShippingMethod, deleteShippingMethod };

