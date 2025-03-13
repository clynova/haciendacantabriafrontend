import api from "./api";

const getPaymentMethods = async () => {
    try {
        const response = await api.get("/api/payment-methods");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export { getPaymentMethods };