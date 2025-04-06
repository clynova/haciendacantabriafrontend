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


/* example response getOrders

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
                "recipientName": "pedro sanchez",
                "additionalInstructions": "sadasdasdas"
            },
            "payment": {
                "status": "completed",
                "provider": "webpay",
                "amount": 9250,
                "currency": "CLP",
                "commissionPercentage": 0,
                "commissionAmount": 0,
                "paymentDate": "2025-04-06T21:38:26.331Z",
                "paymentDetails": {
                    "vci": "TSY",
                    "amount": 9250,
                    "status": "AUTHORIZED",
                    "buy_order": "OC5b8ba47a576f",
                    "session_id": "67e213b9ef679c056df168a6",
                    "card_detail": {
                        "card_number": "6623"
                    },
                    "accounting_date": "0406",
                    "transaction_date": "2025-04-06T21:38:02.129Z",
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
            "_id": "67f2f4391db25b8ba47a576f",
            "userId": {
                "_id": "67e213b9ef679c056df168a6",
                "firstName": "cly",
                "lastName": "nova",
                "email": "clynova.dev@gmail.com"
            },
            "orderDate": "2025-04-06T21:38:01.256Z",
            "status": "completed",
            "subtotal": 4250,
            "shippingCost": 5000,
            "paymentCommission": 0,
            "total": 9250,
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
            "estimatedDeliveryDate": "2025-04-13T21:38:01.065Z",
            "quotationId": null,
            "comprobanteTipo": "factura",
            "rut": "18597046-9",
            "createdAt": "2025-04-06T21:38:01.256Z",
            "updatedAt": "2025-04-06T21:38:26.331Z",
            "__v": 0,
            "id": "67f2f4391db25b8ba47a576f",
            "details": [
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
                    "_id": "67f2f4391db25b8ba47a5771",
                    "orderId": "67f2f4391db25b8ba47a576f",
                    "productId": "67f087c0ddc8c38ace4961ef",
                    "quantity": 1,
                    "subtotal": 4250,
                    "createdAt": "2025-04-06T21:38:01.324Z",
                    "updatedAt": "2025-04-06T21:38:01.324Z",
                    "__v": 0
                }
            ]
        },
        {
            "shippingAddress": {
                "street": "Pasaje Malvilla",
                "city": "Región Metropolitana",
                "state": "San Bernardo",
                "country": "Chile",
                "zipCode": "8059001",
                "reference": "Casa linda",
                "phoneContact": "+56952230120",
                "recipientName": "pedro sanchez",
                "additionalInstructions": "sadasdasd"
            },
            "payment": {
                "status": "processing",
                "provider": "webpay",
                "amount": 14550,
                "currency": "CLP",
                "commissionPercentage": 0,
                "commissionAmount": 0,
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
            "_id": "67f2f3c81db25b8ba47a562a",
            "userId": {
                "_id": "67e213b9ef679c056df168a6",
                "firstName": "cly",
                "lastName": "nova",
                "email": "clynova.dev@gmail.com"
            },
            "orderDate": "2025-04-06T21:36:08.230Z",
            "status": "pending",
            "subtotal": 9550,
            "shippingCost": 5000,
            "paymentCommission": 0,
            "total": 14550,
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
            "estimatedDeliveryDate": "2025-04-13T21:36:07.990Z",
            "quotationId": null,
            "comprobanteTipo": "factura",
            "rut": null,
            "createdAt": "2025-04-06T21:36:08.231Z",
            "updatedAt": "2025-04-06T21:36:09.229Z",
            "__v": 0,
            "id": "67f2f3c81db25b8ba47a562a",
            "details": [
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
                    "_id": "67f2f3c81db25b8ba47a562c",
                    "orderId": "67f2f3c81db25b8ba47a562a",
                    "productId": "67f087c0ddc8c38ace4961ef",
                    "quantity": 2,
                    "subtotal": 8500,
                    "createdAt": "2025-04-06T21:36:08.316Z",
                    "updatedAt": "2025-04-06T21:36:08.316Z",
                    "__v": 0
                },
                {
                    "variant": {
                        "pesoId": "67f087e3ddc8c38ace4961fe",
                        "peso": 1,
                        "unidad": "L",
                        "sku": "ACEITE-001-1L"
                    },
                    "priceInfo": {
                        "basePrice": 3500,
                        "discountPercentage": 70,
                        "finalPrice": 1050.0000000000002
                    },
                    "productSnapshot": {
                        "nombre": "Aceite de Oliva Extra Virgen",
                        "categoria": "ACEITE",
                        "tipoProducto": "ProductoAceite",
                        "imagen": "https://res-console.cloudinary.com/djgegk8jp/media_explorer_thumbnails/40161b980d1f9033380ccfecd2bf4f23/detailed"
                    },
                    "_id": "67f2f3c81db25b8ba47a5633",
                    "orderId": "67f2f3c81db25b8ba47a562a",
                    "productId": "67f087e3ddc8c38ace4961fb",
                    "quantity": 1,
                    "subtotal": 1050.0000000000002,
                    "createdAt": "2025-04-06T21:36:08.464Z",
                    "updatedAt": "2025-04-06T21:36:08.464Z",
                    "__v": 0
                }
            ]
        }
    ],
    "pagination": {
        "total": 2,
        "page": 1,
        "limit": 10,
        "pages": 1
    }
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