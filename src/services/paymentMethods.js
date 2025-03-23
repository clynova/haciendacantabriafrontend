import api from "./api";

const getPaymentMethods = async (token) => {
    try {
        const response = await api.get("/api/payment-methods", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data || [];
    } catch (error) {
        throw error.response?.data || error;
    }
}

const getPaymentMethodsById = async (_id, token) => {
    try {
        const response = await api.get(`/api/payment-methods/${_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

const getPaymentMethodsAdmin = async (token) => {
    try {
        const response = await api.get("/api/payment-methods/admin/all", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data || [];
    } catch (error) {
        throw error.response?.data || error;
    }
}

const createPaymentMethod = async (paymentMethod, token) => {
    try {
        const response = await api.post("/api/payment-methods", paymentMethod, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear método de pago:', error);
        return { success: false, msg: error.response?.data?.msg || 'Error al crear método de pago' };
    }
}

const updatePaymentMethod = async (_id, paymentMethod, token) => {
    try {
        const response = await api.put(`/api/payment-methods/${_id}`, paymentMethod, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar método de pago:', error);
        return { success: false, msg: error.response?.data?.msg || 'Error al actualizar método de pago' };
    }
}

const deletePaymentMethod = async (_id, token) => {
    try {
        const response = await api.delete(`/api/payment-methods/${_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al eliminar método de pago:', error);
        return { success: false, msg: error.response?.data?.msg || 'Error al eliminar método de pago' };
    }
}

const restorePaymentMethod = async (_id, token) => {
    try {
        const response = await api.put(`/api/payment-methods/restore/${_id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export {
    getPaymentMethods,
    getPaymentMethodsById,
    getPaymentMethodsAdmin,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    restorePaymentMethod
};