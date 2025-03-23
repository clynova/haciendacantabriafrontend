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
    console.error('Error creating order:', error);
    throw error.response?.data || error;
  }
};

export const createOrderFromQuotation = async (quotationId, paymentMethodId, token) => {
  try {
    console.log('Creating order from quotation:', { quotationId, paymentMethodId });
    const response = await api.post('/api/order/from-quotation', 
      { 
        quotationId, 
        paymentMethodId 
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating order from quotation:', error);
    throw error.response?.data || error;
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
    console.error('Error initiating payment:', error);
    throw error.response?.data || error;
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
    console.error('Error checking payment status:', error);
    throw error.response?.data || error;
  }
};