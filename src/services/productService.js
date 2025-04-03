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

const searchProducts = async (filters = {}) => {
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

const getTopProducts = async (limit = 10) => {
    try {
        const response = await api.get(`/api/util/top-products?limit=${limit}`);
        
        if (!response.data || !response.data.success) {
            throw new Error('No se recibieron datos del servidor');
        }

        // Get full product details for each top product
        const productDetailsPromises = response.data.data.map(async (item) => {
            try {
                const productResponse = await api.get(`/api/product/${item._id}`);
                if (productResponse.data && productResponse.data.success) {
                    return {
                        ...productResponse.data.product,
                        totalVendido: item.totalVendido,
                        totalIngresos: item.totalIngresos
                    };
                }
                return null;
            } catch (error) {
                return null;
            }
        });

        const products = (await Promise.all(productDetailsPromises))
            .filter(product => product !== null);

        return {
            success: true,
            products: products,
            total: products.length
        };
    } catch (error) {
        return {
            success: false,
            products: [],
            total: 0,
            error: error.response?.data?.message || error.message || 'Error al obtener los productos más vendidos'
        };
    }
};

export { getProductById, searchProducts, getTopProducts };