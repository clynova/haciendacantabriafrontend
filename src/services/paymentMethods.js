import api from "./api";

const getPaymentMethods = async () => {
    try {
        const response = await api.get("/api/payment-methods");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

const getPaymentMethodsById = async (_id) => {
    try {
        const response = await api.get(`/api/payment-methods/${_id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export { getPaymentMethods, getPaymentMethodsById };