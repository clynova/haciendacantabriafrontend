import api from "./api";

const getProductById = async (_IdOrSlug) => {
    try {
        // Si el ID es un objeto, intentar extraer el _id
        const productId = typeof _IdOrSlug === 'object' ? _IdOrSlug._id : _IdOrSlug;

        if (!productId) {
            throw new Error('ID o slug de producto inválido');
        }

        const response = await api.get(`/api/product/${productId}`);
        if (!response.data) {
            throw new Error('No se recibieron datos del servidor');
        }
        if (!response.data.success) {
            throw new Error(response.data.msg || 'Error al obtener el producto');
        }
        return response.data;
    }
    catch (error) {
        if (error.response?.data) {
            throw error.response.data;
        }
        return {
            success: false,
            msg: error.message || 'Error al obtener el producto',
            product: null
        };
    }
}

export const searchProducts = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        
        // Add filters to query params
        if (filters.categoria) {
            queryParams.append('categoria', filters.categoria);
        }
        
        // Always get active products
        queryParams.append('estado', 'active');

        const response = await api.get(`/api/product/active?${queryParams.toString()}`);
        
        if (!response.data) {
            throw new Error('No se recibieron datos del servidor');
        }

        return {
            success: true,
            products: response.data.products || [],
            total: response.data.total || 0
        };
    } catch (error) {
        return {
            success: false,
            products: [],
            total: 0,
            error: error.response?.data?.message || error.message || 'Error al buscar productos'
        };
    }
};

export { getProductById };