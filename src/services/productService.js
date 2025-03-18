import api from "./api";

const getProductById = async (_Id) => {
    try {
        // Si el ID es un objeto, intentar extraer el _id
        const productId = typeof _Id === 'object' ? _Id._id : _Id;
        
        if (!productId) {
            throw new Error('ID de producto inválido');
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

export { getProductById }