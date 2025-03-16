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

export { getDashboardStats, deleteUser, getAllUsers, getUserById, updateUser, createUser };