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
        const url = `/api/product/admin/all${queryString ? `?${queryString}` : ''}`;

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
        // Remove calculated fields before sending
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

        // Remove calculated fields that shouldn't be sent to the backend
        delete cleanedData.precioFinal;
        delete cleanedData.precioTransferencia;
        delete cleanedData.precioPorKgFinal;
        delete cleanedData.precioPorKgTransferencia;
        delete cleanedData.__v;
        delete cleanedData.fechaActualizacion;

        console.log('Cleaned data for update:', JSON.stringify(cleanedData, null, 2));

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
        console.error('Update error details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            originalData: data
        });

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
        console.error('Update status error:', error);
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