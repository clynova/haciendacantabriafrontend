import api from './api';

export const createOrder = async (orderData, token) => {
  try {
    const response = await api.post('/api/order', orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error al crear la orden' };
  }
};

export const initiatePayment = async (orderId, token) => {
  try {
    const response = await api.post(`/api/payments/initiate/${orderId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error al iniciar el pago' };
  }
};

export const getPaymentStatus = async (orderId, token) => {
  try {
    const response = await api.get(`/api/payments/status/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error al obtener el estado del pago' };
  }
}