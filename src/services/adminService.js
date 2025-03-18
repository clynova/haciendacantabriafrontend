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

// Add this new function for image uploads
export const uploadProductImages = async (productId, imageFiles, token) => {
    try {
        const formData = new FormData();
        imageFiles.forEach(file => {
            formData.append('images', file);
        });

        const response = await api.post(`/api/product/${productId}/images`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading images:', error);
        throw error.response?.data || {
            success: false,
            msg: 'Error al subir las imágenes'
        };
    }
};

// Update the updateProduct function
export const updateProduct = async (productId, productData, token) => {
    try {
        const response = await api.put(`/api/product/${productId}`, productData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw {
            success: false,
            msg: error.response?.data?.msg || 'Error al actualizar el producto',
            error: error.response?.data || error
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

export { 
    getDashboardStats, 
    getTotalSales, 
    getTopTags, 
    getPaymentMethodById,
    deleteUser, 
    getAllUsers, 
    getUserById, 
    updateUser, 
    createUser 
};