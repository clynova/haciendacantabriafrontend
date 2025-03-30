import api from "./api";

const getDashboardStats = async (token) => {
    try {
        const response = await api.get('api/util/getdashboardstats', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al obtener las estadísticas del dashboard'
        };
    }
};

// /api/util/top-tags
const getTopTags = async (token) => {
    try {
        const response = await api.get('api/util/top-tags', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al obtener las etiquetas más populares'
        };
    }
};

const getTotalSales = async (token) => {
    try {
        const response = await api.get('api/util/total-sales', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al obtener las ventas totales'
        };
    }
};


const deleteUser = async (userId, token) => {
    try {
        const response = await api.delete(`/api/user/delete-account/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al eliminar el usuario'
        };
    }
};

const getAllUsers = async (token) => {
    try {
        const response = await api.get('/api/user/all', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al obtener los usuarios'
        };
    }
};

const getUserById = async (userId, token) => {
    try {
        const response = await api.post('/api/user/perfil',
            { userId }, // Enviar userId en el body
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al obtener los detalles del usuario'
        };
    }
};

const updateUser = async (userId, userData, token) => {
    try {
        const response = await api.put(`/api/user/perfil/${userId}`, userData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al actualizar el usuario'
        };
    }
};

const createUser = async (userData, token) => {
    try {
        const response = await api.post('/api/user/registrar',
            {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email.toLowerCase(),
                password: userData.password,
                repPassword: userData.repPassword,
                roles: userData.roles,
                confirmado: true,
                addresses: []
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al crear el usuario'
        };
    }
};

const getOrderStats = async (token) => {
    try {
        const response = await api.get('/api/util/order-stats', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al obtener las estadísticas de pedidos'
        };
    }
};


export const getAllProducts = async (token, filters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) queryParams.append(key, value);
        });

        const queryString = queryParams.toString();
        const url = `/api/product/admin/all${queryString ? `?${queryString}` : ''}`;

        const response = await api.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al obtener los productos'
        };
    }
};

export const deleteProduct = async (productId, token) => {
    try {
        const response = await api.delete(`/api/product/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al eliminar el producto'
        };
    }
};

export const getProductById = async (productId, token) => {
    try {
        const response = await api.get(`/api/product/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al obtener el producto'
        };
    }
};

export const createProduct = async (productData, token) => {
    try {
        const response = await api.post('/api/product', productData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw {
            success: false,
            msg: error.response?.data?.msg || 'Error al crear el producto',
            error: error.response?.data || error
        };
    }
};

export const updateProduct = async (productId, data, token) => {
    try {
        const cleanedData = {
            ...data,
            estado: Boolean(data.estado),
            destacado: Boolean(data.destacado),
            conservacion: data.conservacion ? {
                ...data.conservacion,
                requiereRefrigeracion: Boolean(data.conservacion.requiereRefrigeracion),
                requiereCongelacion: Boolean(data.conservacion.requiereCongelacion)
            } : undefined
        };

        delete cleanedData.precioFinal;
        delete cleanedData.precioTransferencia;
        delete cleanedData.precioPorKgFinal;
        delete cleanedData.precioPorKgTransferencia;
        delete cleanedData.__v;
        delete cleanedData.fechaActualizacion;

        const response = await api.put(`/api/product/${productId}`, cleanedData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.data.success) {
            throw new Error(response.data.msg || 'Error en la respuesta del servidor');
        }

        return response.data;
    } catch (error) {
        throw {
            success: false,
            msg: error.response?.data?.msg || error.message || 'Error al actualizar el producto',
            error: error.response?.data || error
        };
    }
};

export const updateProductStatus = async (productId, estado, token) => {
    try {
        const response = await api.put(
            `/api/product/${productId}/status`,
            { estado },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al actualizar el estado del producto'
        };
    }
};

const getPaymentMethodById = async (methodId, token) => {
    try {
        const response = await api.get(`/api/payment-methods/${methodId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al obtener el método de pago'
        };
    }
};

// Get all orders with optional status filter
const getAllOrders = async (token, status = '') => {
    try {
        const url = status ? `/api/order/all?status=${status}` : '/api/order/all';
        const response = await api.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al obtener los pedidos'
        };
    }
};

// Get order by ID
export const getOrderById = async (orderId, token) => {
    try {
        const response = await api.get(`/api/order/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw {
            success: false,
            msg: error.response?.data?.msg || 'Error al obtener la orden'
        };
    }
};

// Update order status
const updateOrderStatus = async (orderId, status, token) => {
    try {
        const response = await api.put(
            `/api/order/${orderId}/status`,
            { status: status.toLowerCase() }, // Ensure status is uppercase
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Update status error:', error.response?.data || error);
        throw {
            success: false,
            msg: error.response?.data?.msg || 'Error al actualizar el estado del pedido'
        };
    }
};

// Delete/Cancel order
export const deleteOrder = async (orderId, token) => {
    try {
        const response = await api.delete(`/api/order/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return {
            success: true,
            msg: 'Pedido cancelado correctamente'
        };
    } catch (error) {
        throw {
            success: false,
            msg: error.response?.data?.message || 'Error al cancelar el pedido'
        };
    }
};

// Update order details
const updateOrder = async (orderId, orderData, token) => {
    try {
        const response = await api.put(`/api/order/${orderId}`,
            orderData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al actualizar el pedido'
        };
    }
};

const updateOrderShipping = async (orderId, shippingData, token) => {
    try {
        const response = await api.put(`/api/order/${orderId}/shipping`,
            shippingData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al actualizar la información de envío'
        };
    }
};

export const createOrder = async (orderData, token) => {
    try {
        const response = await api.post('/api/order', orderData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al crear el pedido'
        };
    }
};

export const getCustomerAddresses = async (token) => {
    try {
        const response = await api.get('/api/addresses', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, msg: 'Error al obtener las direcciones' };
    }
};

export const getPaymentMethods = async (token) => {
    try {
        const response = await api.get('/api/payment-methods', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, msg: 'Error al obtener los métodos de pago' };
    }
};

export const getShippingMethods = async (token) => {
    try {
        const response = await api.get('/api/shipping-methods', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, msg: 'Error al obtener los métodos de envío' };
    }
};

const notificarProductoFavorito = async (_id, token) => {
    try {
        const response = await api.post(
            `/api/product/${_id}/notificar-favoritos`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al notificar el producto favorito'
        };
    }
}

// Add these new functions for tag management

export const getAllTags = async (token) => {
    try {
        const response = await api.get('/api/tags', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al obtener las categorías'
        };
    }
};

export const createTag = async (tag, token) => {
    try {
        const response = await api.post('/api/tags', 
            { tag },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al crear la categoría'
        };
    }
};

export const deleteTag = async (tag, token) => {
    try {
        const response = await api.delete(`/api/tags/${tag}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al eliminar la categoría'
        };
    }
};

export const renameTag = async (oldTag, newTag, token) => {
    try {
        const response = await api.put('/api/tags/rename', 
            { oldTag, newTag },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al renombrar la categoría'
        };
    }
};

export const findProductsByTags = async (tags, matchAll = true, page = 1, limit = 10, exact = false, token) => {
    try {
        const queryParams = new URLSearchParams({
            tags: Array.isArray(tags) ? tags.join(',') : tags,
            matchAll: String(matchAll),
            page: String(page),
            limit: String(limit),
            exact: String(exact)
        });

        const response = await api.get(`/api/tags/products?${queryParams}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al buscar productos por categorías'
        };
    }
};

export const removeTagFromProduct = async (productId, tag, token) => {
    try {
        const response = await api.delete(`/api/tags/product/${productId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: { tags: [tag] }  // Send data with DELETE request
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al eliminar la categoría del producto'
        };
    }
};

export {
    getDashboardStats,
    getTotalSales,
    getTopTags,
    getPaymentMethodById,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser,
    createUser,
    getAllOrders,
    updateOrderStatus,
    updateOrder,
    updateOrderShipping,
    notificarProductoFavorito, 
    getOrderStats
};