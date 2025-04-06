import api from "./api";

const updateProfile = async (formData, token) => {
    try {
        const response = await api.put("/api/user/perfil", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}


/*


{
    "success": true,
    "orders": [
        {
            "shippingAddress": {
                "street": "Pasaje Malvilla",
                "city": "Región Metropolitana",
                "state": "San Bernardo",
                "country": "Chile",
                "zipCode": "8059001",
                "reference": "Casa linda",
                "phoneContact": "+56952230120",
                "recipientName": "Pedro Sanchez",
                "additionalInstructions": "casa bonita"
            },
            "payment": {
                "status": "completed",
                "provider": "webpay",
                "amount": 12100,
                "currency": "CLP",
                "commissionPercentage": 0,
                "commissionAmount": 0,
                "token": "01ab207d0ebf6acdfa5df1d3b342e4d043582cea0d4ef1df24e0e987f1aac685",
                "paymentDate": "2025-04-06T01:07:45.110Z",
                "paymentDetails": {
                    "vci": "TSY",
                    "amount": 12100,
                    "status": "AUTHORIZED",
                    "buy_order": "OC922b9d10e619",
                    "session_id": "67e213b9ef679c056df168a6",
                    "card_detail": {
                        "card_number": "6623"
                    },
                    "accounting_date": "0405",
                    "transaction_date": "2025-04-06T01:07:10.714Z",
                    "authorization_code": "1213",
                    "payment_type_code": "VN",
                    "response_code": 0,
                    "installments_number": 0
                }
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
                "cost": 5000,
                "trackingNumber": null
            },
            "_id": "67f1d3be96ea922b9d10e619",
            "userId": "67e213b9ef679c056df168a6",
            "orderDate": "2025-04-06T01:07:10.465Z",
            "status": "completed",
            "subtotal": 7100,
            "shippingCost": 5000,
            "paymentCommission": 0,
            "total": 12100,
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
            "estimatedDeliveryDate": "2025-04-13T02:07:10.218Z",
            "quotationId": null,
            "createdAt": "2025-04-06T01:07:10.467Z",
            "updatedAt": "2025-04-06T01:07:45.110Z",
            "__v": 0,
            "details": [
                {
                    "variant": {
                        "pesoId": "67f087e3ddc8c38ace4961fe",
                        "peso": 1,
                        "unidad": "L",
                        "sku": "ACEITE-001-1L"
                    },
                    "priceInfo": {
                        "basePrice": 3000,
                        "discountPercentage": 5,
                        "finalPrice": 2850
                    },
                    "productSnapshot": {
                        "nombre": "Aceite de Oliva Extra Virgen",
                        "categoria": "ACEITE",
                        "tipoProducto": "ProductoAceite",
                        "imagen": "https://res-console.cloudinary.com/djgegk8jp/media_explorer_thumbnails/40161b980d1f9033380ccfecd2bf4f23/detailed"
                    },
                    "_id": "67f1d3be96ea922b9d10e61b",
                    "orderId": "67f1d3be96ea922b9d10e619",
                    "productId": "67f087e3ddc8c38ace4961fb",
                    "quantity": 1,
                    "subtotal": 2850,
                    "createdAt": "2025-04-06T01:07:10.533Z",
                    "updatedAt": "2025-04-06T01:07:10.533Z",
                    "__v": 0,
                    "currentProduct": {
                        "nombre": "Aceite de Oliva Extra Virgen",
                        "disponible": true,
                        "imagen": "https://res-console.cloudinary.com/djgegk8jp/media_explorer_thumbnails/40161b980d1f9033380ccfecd2bf4f23/detailed"
                    }
                },
                {
                    "variant": {
                        "pesoId": "67f087c0ddc8c38ace4961f2",
                        "peso": 1,
                        "unidad": "kg",
                        "sku": "CARNE-001-1KG"
                    },
                    "priceInfo": {
                        "basePrice": 5000,
                        "discountPercentage": 15,
                        "finalPrice": 4250
                    },
                    "productSnapshot": {
                        "nombre": "Bife Angosto",
                        "categoria": "CARNE",
                        "tipoProducto": "ProductoCarne",
                        "imagen": "https://res-console.cloudinary.com/djgegk8jp/media_explorer_thumbnails/cedbe657dafb02e19fffa457d73437d0/detailed"
                    },
                    "_id": "67f1d3be96ea922b9d10e621",
                    "orderId": "67f1d3be96ea922b9d10e619",
                    "productId": "67f087c0ddc8c38ace4961ef",
                    "quantity": 1,
                    "subtotal": 4250,
                    "createdAt": "2025-04-06T01:07:10.665Z",
                    "updatedAt": "2025-04-06T01:07:10.665Z",
                    "__v": 0,
                    "currentProduct": {
                        "nombre": "Bife Angosto",
                        "disponible": true,
                        "imagen": "https://res-console.cloudinary.com/djgegk8jp/media_explorer_thumbnails/cedbe657dafb02e19fffa457d73437d0/detailed"
                    }
                }
            ],
            "id": "67f1d3be96ea922b9d10e619"
        },
        {
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
            "_id": "67f1d19596ea922b9d10e4b2",
            "userId": "67e213b9ef679c056df168a6",
            "orderDate": "2025-04-06T00:57:57.908Z",
            "status": "pending",
            "subtotal": 59550,
            "shippingCost": 0,
            "paymentCommission": 0,
            "total": 59550,
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
            "estimatedDeliveryDate": "2025-04-13T01:57:57.649Z",
            "quotationId": null,
            "createdAt": "2025-04-06T00:57:57.910Z",
            "updatedAt": "2025-04-06T00:57:57.910Z",
            "__v": 0,
            "details": [
                {
                    "variant": {
                        "pesoId": "67f087e3ddc8c38ace4961fe",
                        "peso": 1,
                        "unidad": "L",
                        "sku": "ACEITE-001-1L"
                    },
                    "priceInfo": {
                        "basePrice": 3000,
                        "discountPercentage": 5,
                        "finalPrice": 2850
                    },
                    "productSnapshot": {
                        "nombre": "Aceite de Oliva Extra Virgen",
                        "categoria": "ACEITE",
                        "tipoProducto": "ProductoAceite",
                        "imagen": "https://res-console.cloudinary.com/djgegk8jp/media_explorer_thumbnails/40161b980d1f9033380ccfecd2bf4f23/detailed"
                    },
                    "_id": "67f1d19596ea922b9d10e4b4",
                    "orderId": "67f1d19596ea922b9d10e4b2",
                    "productId": "67f087e3ddc8c38ace4961fb",
                    "quantity": 3,
                    "subtotal": 8550,
                    "createdAt": "2025-04-06T00:57:57.988Z",
                    "updatedAt": "2025-04-06T00:57:57.988Z",
                    "__v": 0,
                    "currentProduct": {
                        "nombre": "Aceite de Oliva Extra Virgen",
                        "disponible": true,
                        "imagen": "https://res-console.cloudinary.com/djgegk8jp/media_explorer_thumbnails/40161b980d1f9033380ccfecd2bf4f23/detailed"
                    }
                },
                {
                    "variant": {
                        "pesoId": "67f087c0ddc8c38ace4961f2",
                        "peso": 1,
                        "unidad": "kg",
                        "sku": "CARNE-001-1KG"
                    },
                    "priceInfo": {
                        "basePrice": 5000,
                        "discountPercentage": 15,
                        "finalPrice": 4250
                    },
                    "productSnapshot": {
                        "nombre": "Bife Angosto",
                        "categoria": "CARNE",
                        "tipoProducto": "ProductoCarne",
                        "imagen": "https://res-console.cloudinary.com/djgegk8jp/media_explorer_thumbnails/cedbe657dafb02e19fffa457d73437d0/detailed"
                    },
                    "_id": "67f1d19696ea922b9d10e4ba",
                    "orderId": "67f1d19596ea922b9d10e4b2",
                    "productId": "67f087c0ddc8c38ace4961ef",
                    "quantity": 12,
                    "subtotal": 51000,
                    "createdAt": "2025-04-06T00:57:58.135Z",
                    "updatedAt": "2025-04-06T00:57:58.135Z",
                    "__v": 0,
                    "currentProduct": {
                        "nombre": "Bife Angosto",
                        "disponible": true,
                        "imagen": "https://res-console.cloudinary.com/djgegk8jp/media_explorer_thumbnails/cedbe657dafb02e19fffa457d73437d0/detailed"
                    }
                }
            ],
            "id": "67f1d19596ea922b9d10e4b2"
        }
    ]
}

*/

const getOrders = async (token) => {
    try {
        const response = await api.get("/api/order/user", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}


/* example response getWishlist
{
    "success": true,
    "msg": "Wishlist recuperada exitosamente",
    "data": {
        "_id": "67f1e41466fa9c6d7924df20",
        "userId": "67e213b9ef679c056df168a6",
        "products": [
            {
                "multimedia": {
                    "imagenes": [
                        {
                            "url": "https://res-console.cloudinary.com/djgegk8jp/media_explorer_thumbnails/cedbe657dafb02e19fffa457d73437d0/detailed",
                            "textoAlternativo": "Bife angosto fresco",
                            "esPrincipal": true,
                            "_id": "67f087c0ddc8c38ace4961f0",
                            "id": "67f087c0ddc8c38ace4961f0"
                        }
                    ],
                    "video": "https://ejemplo.com/videos/bife-angosto.mp4"
                },
                "opcionesPeso": {
                    "esPesoVariable": true,
                    "pesoPromedio": 1.2,
                    "pesoMinimo": 1,
                    "pesoMaximo": 2,
                    "pesosEstandar": [
                        {
                            "descuentos": {
                                "regular": 10
                            },
                            "peso": 500,
                            "unidad": "g",
                            "esPredeterminado": false,
                            "precio": 2500,
                            "sku": "CARNE-001-500G",
                            "stockDisponible": 30,
                            "umbralStockBajo": 5,
                            "ultimaActualizacion": "2023-10-01T10:00:00.000Z",
                            "_id": "67f087c0ddc8c38ace4961f1",
                            "id": "67f087c0ddc8c38ace4961f1"
                        },
                        {
                            "descuentos": {
                                "regular": 15
                            },
                            "peso": 1,
                            "unidad": "kg",
                            "esPredeterminado": true,
                            "precio": 5000,
                            "sku": "CARNE-001-1KG",
                            "stockDisponible": 0,
                            "umbralStockBajo": 5,
                            "ultimaActualizacion": "2023-10-01T10:00:00.000Z",
                            "_id": "67f087c0ddc8c38ace4961f2",
                            "id": "67f087c0ddc8c38ace4961f2"
                        }
                    ],
                    "rangosPreferidos": []
                },
                "_id": "67f087c0ddc8c38ace4961ef",
                "sku": "CARNE-001",
                "nombre": "Bife Angosto",
                "slug": "bife-angosto",
                "categoria": "CARNE",
                "estado": true,
                "tipoProducto": "ProductoCarne",
                "precioVariantesPorPeso": [
                    {
                        "pesoId": "67f087c0ddc8c38ace4961f1",
                        "peso": 500,
                        "unidad": "g",
                        "precio": 2500,
                        "descuento": 10,
                        "precioFinal": 2250,
                        "stockDisponible": 30,
                        "esPredeterminado": false,
                        "sku": "CARNE-001-500G"
                    },
                    {
                        "pesoId": "67f087c0ddc8c38ace4961f2",
                        "peso": 1,
                        "unidad": "kg",
                        "precio": 5000,
                        "descuento": 15,
                        "precioFinal": 4250,
                        "stockDisponible": 0,
                        "esPredeterminado": true,
                        "sku": "CARNE-001-1KG"
                    }
                ],
                "variantePredeterminada": {
                    "pesoId": "67f087c0ddc8c38ace4961f2",
                    "peso": 1,
                    "unidad": "kg",
                    "precio": 5000,
                    "descuento": 15,
                    "precioFinal": 4250,
                    "stockDisponible": 0,
                    "esPredeterminado": true,
                    "sku": "CARNE-001-1KG"
                }
            }
        ],
        "createdAt": "2025-04-06T02:16:52.382Z",
        "updatedAt": "2025-04-06T02:16:52.382Z",
        "__v": 0
    }
}

*/


const getWishlist = async (token) => {
    try {
        const response = await api.get("/api/wishlist", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

const addProductToWishlist = async (productId, token) => {
    try {
        const response = await api.post("/api/wishlist/add", { productId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

const removeFromWishlist = async (productId, token) => {
    try {
        const response = await api.delete(`/api/wishlist/remove/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

const getAddresses = async (token) => {
    try {
        const response = await api.get("/api/user/addresses", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

export const addAddress = async (addressData, token) => {
    try {
        const response = await api.post("/api/user/addresses", addressData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Devolver la respuesta exactamente como viene de la API
        return {
            success: response.data.success,
            msg: response.data.msg,
            data: response.data.data
        };
    } catch (error) {
        console.error('Error en addAddress:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Error al agregar la dirección'
        };
    }
};

const updateAddress = async (addressId, addressData, token) => {
    try {
        const response = await api.put(`/api/user/addresses/${addressId}`, addressData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

const deleteAddress = async (addressId, token) => {
    try {
        const response = await api.delete(`/api/user/addresses/${addressId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Devolver la respuesta con la misma estructura que las otras funciones
        return {
            success: response.data.success || true,
            msg: response.data.msg || "Dirección eliminada correctamente",
            data: response.data.data
        };
    }
    catch (error) {
        console.error('Error en deleteAddress:', error);
        return {
            success: false,
            msg: error.response?.data?.message || 'Error al eliminar la dirección'
        };
    }
}

const getMyPaymentMethods = async (token) => {
    try {
        const response = await api.get("/api/payment-methods", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

const setDefaultPaymentMethod = async (paymentMethodId, token) => {
    try {
        const response = await api.put(`/api/payment-methods/${paymentMethodId}/default`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

const togglePaymentMethodStatus = async (paymentMethodId, token) => {
    try {
        const response = await api.put(`/api/payment-methods/${paymentMethodId}/toggle-status`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

const deletePaymentMethod = async (paymentMethodId, token) => {
    try {
        const response = await api.delete(`/api/payment-methods/${paymentMethodId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

const addPaymentMethod = async (paymentMethodData, token) => {
    try {
        const response = await api.post("/api/payment-methods", paymentMethodData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}

const changePassword = async (passwordData, token) => {
    try {
        const response = await api.put("/api/user/change-password", passwordData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data;
    }
}


/* example response getOrderById

{
    "success": true,
    "order": {
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
        "_id": "67f1d19596ea922b9d10e4b2",
        "userId": {
            "_id": "67e213b9ef679c056df168a6",
            "firstName": "cly",
            "lastName": "nova",
            "email": "clynova.dev@gmail.com"
        },
        "orderDate": "2025-04-06T00:57:57.908Z",
        "status": "pending",
        "subtotal": 59550,
        "shippingCost": 0,
        "paymentCommission": 0,
        "total": 59550,
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
        "estimatedDeliveryDate": "2025-04-13T01:57:57.649Z",
        "quotationId": null,
        "createdAt": "2025-04-06T00:57:57.910Z",
        "updatedAt": "2025-04-06T00:57:57.910Z",
        "__v": 0,
        "id": "67f1d19596ea922b9d10e4b2",
        "details": [
            {
                "variant": {
                    "pesoId": "67f087e3ddc8c38ace4961fe",
                    "peso": 1,
                    "unidad": "L",
                    "sku": "ACEITE-001-1L"
                },
                "priceInfo": {
                    "basePrice": 3000,
                    "discountPercentage": 5,
                    "finalPrice": 2850
                },
                "productSnapshot": {
                    "nombre": "Aceite de Oliva Extra Virgen",
                    "categoria": "ACEITE",
                    "tipoProducto": "ProductoAceite",
                    "imagen": "https://res-console.cloudinary.com/djgegk8jp/media_explorer_thumbnails/40161b980d1f9033380ccfecd2bf4f23/detailed"
                },
                "_id": "67f1d19596ea922b9d10e4b4",
                "orderId": "67f1d19596ea922b9d10e4b2",
                "productId": "67f087e3ddc8c38ace4961fb",
                "quantity": 3,
                "subtotal": 8550,
                "createdAt": "2025-04-06T00:57:57.988Z",
                "updatedAt": "2025-04-06T00:57:57.988Z",
                "__v": 0,
                "currentProductInfo": {
                    "nombre": "Aceite de Oliva Extra Virgen",
                    "disponible": true
                }
            },
            {
                "variant": {
                    "pesoId": "67f087c0ddc8c38ace4961f2",
                    "peso": 1,
                    "unidad": "kg",
                    "sku": "CARNE-001-1KG"
                },
                "priceInfo": {
                    "basePrice": 5000,
                    "discountPercentage": 15,
                    "finalPrice": 4250
                },
                "productSnapshot": {
                    "nombre": "Bife Angosto",
                    "categoria": "CARNE",
                    "tipoProducto": "ProductoCarne",
                    "imagen": "https://res-console.cloudinary.com/djgegk8jp/media_explorer_thumbnails/cedbe657dafb02e19fffa457d73437d0/detailed"
                },
                "_id": "67f1d19696ea922b9d10e4ba",
                "orderId": "67f1d19596ea922b9d10e4b2",
                "productId": "67f087c0ddc8c38ace4961ef",
                "quantity": 12,
                "subtotal": 51000,
                "createdAt": "2025-04-06T00:57:58.135Z",
                "updatedAt": "2025-04-06T00:57:58.135Z",
                "__v": 0,
                "currentProductInfo": {
                    "nombre": "Bife Angosto",
                    "disponible": true
                }
            }
        ]
    }
}

*/

export const getOrderById = async (orderId, token) => {
    try {
        const response = await api.get(`/api/order/user/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data || { success: false, message: 'Error al obtener los detalles del pedido' };
    }
};

export {
    updateProfile,
    getOrders,
    getWishlist,
    addProductToWishlist,
    removeFromWishlist,
    getAddresses,
    updateAddress,
    deleteAddress,
    getMyPaymentMethods,
    setDefaultPaymentMethod,
    togglePaymentMethodStatus,
    deletePaymentMethod,
    addPaymentMethod,
    changePassword
}