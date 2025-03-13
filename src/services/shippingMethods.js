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

export { getShippingMethods };

