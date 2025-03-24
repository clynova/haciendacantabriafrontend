import api from "./api";

const updateProfile = async (formData, token) => {
    try {
        const response = await api.put("/api/user/perfil", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

const getOrders = async (token) => {
    try {
        const response = await api.get("/api/order/user", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

const getWishlist = async (token) => {
    try {
        const response = await api.get("/api/wishlist", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

const addProductToWishlist = async (productId, token) => {
    try {
        const response = await api.post("/api/wishlist/add", { productId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

const removeFromWishlist = async (productId, token) => {
    try {
        const response = await api.delete(`/api/wishlist/remove/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

const getAddresses = async (token) => {
    try {
        const response = await api.get("/api/user/addresses", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

export const addAddress = async (addressData, token) => {
    try {
        const response = await api.post("/api/user/addresses", addressData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        // Devolver la respuesta exactamente como viene de la API
        return {
            success: response.data.success,
            msg: response.data.msg,
            data: response.data.data
        };
    } catch (error) {
        console.error('Error en addAddress:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Error al agregar la dirección'
        };
    }
};

const updateAddress = async (addressId, addressData, token) => {
    try {
        const response = await api.put(`/api/user/addresses/${addressId}`, addressData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

const deleteAddress = async (addressId, token) => {
    try {
        const response = await api.delete(`/api/user/addresses/${addressId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        // Devolver la respuesta con la misma estructura que las otras funciones
        return {
            success: response.data.success || true,
            msg: response.data.msg || "Dirección eliminada correctamente",
            data: response.data.data
        };
    }
    catch (error) {
        console.error('Error en deleteAddress:', error);
        return {
            success: false,
            msg: error.response?.data?.message || 'Error al eliminar la dirección'
        };
    }
}

const getMyPaymentMethods = async (token) => {
    try {
        const response = await api.get("/api/payment-methods", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

const setDefaultPaymentMethod = async (paymentMethodId, token) => {
    try {
        const response = await api.put(`/api/payment-methods/${paymentMethodId}/default`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

const togglePaymentMethodStatus = async (paymentMethodId, token) => {
    try {
        const response = await api.put(`/api/payment-methods/${paymentMethodId}/toggle-status`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

const deletePaymentMethod = async (paymentMethodId, token) => {
    try {
        const response = await api.delete(`/api/payment-methods/${paymentMethodId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

const addPaymentMethod = async (paymentMethodData, token) => {
    try {
        const response = await api.post("/api/payment-methods", paymentMethodData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

const changePassword = async (passwordData, token) => {
    try {
        const response = await api.put("/api/user/change-password", passwordData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

export const getOrderById = async (orderId, token) => {
    try {
        const response = await api.get(`/api/order/user/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data || { success: false, message: 'Error al obtener los detalles del pedido' };
    }
};

export {
    updateProfile,
    getOrders,
    getWishlist,
    addProductToWishlist,
    removeFromWishlist,
    getAddresses,
    updateAddress,
    deleteAddress,
    getMyPaymentMethods,
    setDefaultPaymentMethod,
    togglePaymentMethodStatus,
    deletePaymentMethod,
    addPaymentMethod,
    changePassword
}