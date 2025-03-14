import api from "./api";

const getProductById = async (_Id) => {
    try {
        const response = await api.get(`/api/product/${_Id}`);
        if (response.data.success) {
            return response.data;
        }
        throw new Error(response.data.msg || 'Error al obtener el producto');
    }
    catch (error) {
        throw error.response?.data || error.message;
    }
}

export { getProductById }