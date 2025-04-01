import api from './api';

const register = async (formData) => {
  try {
    const response = await api.post('/api/user/registrar', formData);
    return response.data;
  } catch (error) {
    const errorData = {
      status: error.response?.status,
      data: error.response?.data || {},
      msg: error.response?.data?.message || 'Error en el servidor'
    };
    throw errorData;
  }
};

const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const validarToken = async (token, email) => {
  try {
    const response = await api.post('/api/user/confirmar', { token, email });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const reenviarToken = async (email) => {
  try {
    const response = await api.post('/api/user/reenviar', { email });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const logout = async (token) => {
  try {
    const response = await api.get(`/api/user/logout`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/api/user/reset-password', { email });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}


export { register, login, validarToken, reenviarToken, logout, requestPasswordReset };