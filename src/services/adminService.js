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

export { getDashboardStats, deleteUser, getAllUsers };