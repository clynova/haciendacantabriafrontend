import api, { ensureCsrfCookie } from './api';

/* example response createOrder
{
    "success": true,
    "msg": "Orden creada exitosamente",
    "order": {
        "userId": "67e213b9ef679c056df168a6",
        "orderDate": "2025-04-06T00:57:57.908Z",
        "status": "pending",
        "subtotal": 59550,
        "shippingCost": 0,
        "paymentCommission": 0,
        "total": 59550,
        "shippingAddress": {
            "street": "Pasaje Malvilla",
            "city": "Región Metropolitana",
            "state": "San Bernardo",
            "country": "Chile",
            "zipCode": "8059001",
            "reference": "Casa linda",
            "phoneContact": "+56912345678",
            "recipientName": "María González",
            "additionalInstructions": "El portón es azul, por favor tocar el timbre"
        },
        "paymentMethod": {
            "_id": "67e22eaa10b78bad52fdb7d4",
            "name": "webpay",
            "type": "webpay",
            "description": "Pago con tarjetas de crédito/débito vía WebPay",
            "provider": "Transbank",
            "logo_url": "https://ejemplo.com/logos/webpay.png",
            "requires_additional_data": false,
            "commission_percentage": 0,
            "active": true,
            "additional_fields": [],
            "createdAt": "2025-03-25T04:18:50.995Z",
            "updatedAt": "2025-03-25T04:18:50.995Z",
            "__v": 0
        },
        "payment": {
            "status": "pending",
            "provider": "Transbank",
            "amount": 59550,
            "currency": "CLP",
            "commissionPercentage": 0,
            "commissionAmount": 0
        },
        "shipping": {
            "carrier": {
                "_id": "67e22e9710b78bad52fdb7d0",
                "name": "Transporte Propio",
                "tracking_url": "https://www.miempresa.com/track?order={tracking_number}",
                "methods": [
                    {
                        "name": "Envío Estándar",
                        "delivery_time": "5-7 días hábiles",
                        "base_cost": 5000,
                        "extra_cost_per_kg": 0,
                        "free_shipping_threshold": 50000,
                        "_id": "67e3578834045724bcc42e08"
                    }
                ],
                "active": true,
                "createdAt": "2025-03-25T04:18:31.845Z",
                "updatedAt": "2025-03-26T01:25:28.524Z",
                "__v": 1
            },
            "method": "Envío Estándar",
            "cost": 0,
            "trackingNumber": null
        },
        "estimatedDeliveryDate": "2025-04-13T01:57:57.649Z",
        "quotationId": null,
        "_id": "67f1d19596ea922b9d10e4b2",
        "createdAt": "2025-04-06T00:57:57.910Z",
        "updatedAt": "2025-04-06T00:57:57.910Z",
        "__v": 0,
        "id": "67f1d19596ea922b9d10e4b2"
    },
    "costBreakdown": {
        "subtotal": 59550,
        "shippingCost": 0,
        "paymentCommission": 0,
        "total": 59550
    }
}
    */

export const createOrder = async (orderData, token) => {
  try {
    // Asegurar que tengamos el token CSRF antes de la operación
    await ensureCsrfCookie();
    
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
    // Asegurar que tengamos el token CSRF antes de la operación
    await ensureCsrfCookie();
    
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
    // Asegurar que tengamos el token CSRF antes de la operación
    await ensureCsrfCookie();
    
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