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
        console.error('Error creating user:', error.response?.data);
        throw error.response?.data || {
            success: false,
            msg: 'Error al crear el usuario'
        };
    }
};

export const getAllProducts = async (token, filters = {}) => {
    try {
        // Convert filters object to query string
        const queryParams = new URLSearchParams();
        
        // Add any filters that are provided
        Object.entries(filters).forEach(([key, value]) => {
            if (value) queryParams.append(key, value);
        });

        const queryString = queryParams.toString();
        const url = `/api/product${queryString ? `?${queryString}` : ''}`;

        const response = await api.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error.response?.data);
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
        console.log('Creating product with data:', productData);
        
        const response = await api.post('/api/product', productData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw {
            success: false,
            msg: error.response?.data?.msg || 'Error al crear el producto',
            error: error.response?.data || error
        };
    }
};

// Update the updateProduct function
export const updateProduct = async (productId, data, token) => {
    try {
        const response = await api.put(
            `/api/product/${productId}`, 
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.msg || 'Error al actualizar el producto');
        }

        return response.data;
    } catch (error) {
        console.error('Update error:', error);
        throw error.response?.data || error;
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
        const url = status ? `/api/order?status=${status}` : '/api/order';
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
    console.log('getOrderById called with:', { orderId, token });
    try {
        const response = await api.get(`/api/order/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('API response:', response);
        return response.data;
    } catch (error) {
        console.error('getOrderById error:', error.response || error);
        throw {
            success: false,
            msg: error.response?.data?.msg || 'Error al obtener la orden'
        };
    }
};

// Update order status
const updateOrderStatus = async (orderId, status, token) => {
    try {
        console.log('Updating order status:', { orderId, status, token });
        
        const response = await api.put(
            `/api/order/${orderId}/status`,
            { status: status.toUpperCase() }, // Ensure status is uppercase
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        
        console.log('Update status response:', response.data);
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
        console.log('Attempting to delete order:', { orderId, hasToken: !!token });
        
        const response = await api.delete(`/api/order/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Delete order response:', response.data);
        return {
            success: true,
            msg: 'Pedido cancelado correctamente'
        };
    } catch (error) {
        console.error('Delete order error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
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
    updateOrderShipping
};