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
        return {
            success: true,
            data: response.data.data.map(user => ({
                ...user,
                estado: user.estado !== false // Default to true if undefined
            }))
        };
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
        throw error.response?.data || {
            success: false,
            msg: 'Error al crear el usuario'
        };
    }
};

const getOrderStats = async (token) => {
    try {
        const response = await api.get('/api/util/order-stats', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al obtener las estadísticas de pedidos'
        };
    }
};


export const getAllProducts = async (token, filters = {}) => {
    try {
        const queryParams = new URLSearchParams();
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

export const createProduct = async (token, productData) => {
    try {
        // Asegurarse de que las fechas estén en formato ISO
        if (productData.opcionesPeso?.pesosEstandar) {
            productData.opcionesPeso.pesosEstandar = productData.opcionesPeso.pesosEstandar.map(peso => ({
                ...peso,
                ultimaActualizacion: new Date(peso.ultimaActualizacion).toISOString()
            }));
        }

        // Si hay fechas en producción, convertirlas a ISO
        if (productData.produccion) {
            if (productData.produccion.fechaEnvasado) {
                productData.produccion.fechaEnvasado = new Date(productData.produccion.fechaEnvasado).toISOString();
            }
            if (productData.produccion.fechaVencimiento) {
                productData.produccion.fechaVencimiento = new Date(productData.produccion.fechaVencimiento).toISOString();
            }
        }
        const response = await api.post('/api/product', productData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const updateProduct = async (productId, data, token) => {
    try {
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

        delete cleanedData.precioFinal;
        delete cleanedData.precioTransferencia;
        delete cleanedData.precioPorKgFinal;
        delete cleanedData.precioPorKgTransferencia;
        delete cleanedData.__v;
        delete cleanedData.fechaActualizacion;

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

/* example response getAllOrders

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
                "additionalInstructions": "otra pruebita"
            },
            "payment": {
                "status": "completed",
                "provider": "webpay",
                "amount": 82500,
                "currency": "CLP",
                "commissionPercentage": 0,
                "commissionAmount": 0,
                "paymentDate": "2025-04-06T01:47:35.240Z",
                "paymentDetails": {
                    "vci": "TSY",
                    "amount": 82500,
                    "status": "AUTHORIZED",
                    "buy_order": "OC441bbebe800a",
                    "session_id": "67e213b9ef679c056df168a6",
                    "card_detail": {
                        "card_number": "6623"
                    },
                    "accounting_date": "0405",
                    "transaction_date": "2025-04-06T01:47:13.671Z",
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
                "cost": 0,
                "trackingNumber": null
            },
            "_id": "67f1dd212e01441bbebe800a",
            "userId": {
                "_id": "67e213b9ef679c056df168a6",
                "firstName": "cly",
                "lastName": "nova",
                "email": "clynova.dev@gmail.com"
            },
            "orderDate": "2025-04-06T01:47:13.262Z",
            "status": "completed",
            "subtotal": 82500,
            "shippingCost": 0,
            "paymentCommission": 0,
            "total": 82500,
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
            "estimatedDeliveryDate": "2025-04-13T02:47:12.998Z",
            "quotationId": null,
            "createdAt": "2025-04-06T01:47:13.264Z",
            "updatedAt": "2025-04-06T01:47:35.240Z",
            "__v": 0,
            "id": "67f1dd212e01441bbebe800a",
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
                    "_id": "67f1dd212e01441bbebe800c",
                    "orderId": "67f1dd212e01441bbebe800a",
                    "productId": "67f087c0ddc8c38ace4961ef",
                    "quantity": 6,
                    "subtotal": 25500,
                    "createdAt": "2025-04-06T01:47:13.333Z",
                    "updatedAt": "2025-04-06T01:47:13.333Z",
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
                    "_id": "67f1dd212e01441bbebe8013",
                    "orderId": "67f1dd212e01441bbebe800a",
                    "productId": "67f087e3ddc8c38ace4961fb",
                    "quantity": 20,
                    "subtotal": 57000,
                    "createdAt": "2025-04-06T01:47:13.474Z",
                    "updatedAt": "2025-04-06T01:47:13.474Z",
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
                "recipientName": "Pepito arnoldo",
                "additionalInstructions": "una probadita por aqui"
            },
            "payment": {
                "status": "failed",
                "provider": "webpay",
                "amount": 12100,
                "currency": "CLP",
                "commissionPercentage": 0,
                "commissionAmount": 0,
                "paymentDetails": {
                    "vci": "TSN",
                    "amount": 12100,
                    "status": "FAILED",
                    "buy_order": "OC80d782076ff0",
                    "session_id": "67e213b9ef679c056df168a6",
                    "card_detail": {
                        "card_number": "6623"
                    },
                    "accounting_date": "0405",
                    "transaction_date": "2025-04-06T01:27:26.194Z",
                    "authorization_code": "000000",
                    "payment_type_code": "VN",
                    "response_code": -1,
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
            "_id": "67f1d87d4dad80d782076ff0",
            "userId": {
                "_id": "67e213b9ef679c056df168a6",
                "firstName": "cly",
                "lastName": "nova",
                "email": "clynova.dev@gmail.com"
            },
            "orderDate": "2025-04-06T01:27:25.750Z",
            "status": "canceled",
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
            "estimatedDeliveryDate": "2025-04-13T02:27:25.483Z",
            "quotationId": null,
            "createdAt": "2025-04-06T01:27:25.751Z",
            "updatedAt": "2025-04-06T01:27:48.350Z",
            "__v": 0,
            "id": "67f1d87d4dad80d782076ff0",
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
                    "_id": "67f1d87d4dad80d782076ff2",
                    "orderId": "67f1d87d4dad80d782076ff0",
                    "productId": "67f087c0ddc8c38ace4961ef",
                    "quantity": 1,
                    "subtotal": 4250,
                    "createdAt": "2025-04-06T01:27:25.819Z",
                    "updatedAt": "2025-04-06T01:27:25.819Z",
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
                    "_id": "67f1d87d4dad80d782076ff9",
                    "orderId": "67f1d87d4dad80d782076ff0",
                    "productId": "67f087e3ddc8c38ace4961fb",
                    "quantity": 1,
                    "subtotal": 2850,
                    "createdAt": "2025-04-06T01:27:25.958Z",
                    "updatedAt": "2025-04-06T01:27:25.958Z",
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
            "userId": {
                "_id": "67e213b9ef679c056df168a6",
                "firstName": "cly",
                "lastName": "nova",
                "email": "clynova.dev@gmail.com"
            },
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
            "id": "67f1d3be96ea922b9d10e619",
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
                    "__v": 0
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
                    "__v": 0
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
                    "__v": 0
                }
            ]
        }
    ],
    "pagination": {
        "total": 4,
        "page": 1,
        "limit": 10,
        "pages": 1
    }
}

*/

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
            "facturacion": {
                "status": false,
                "comprobanteTipo": "factura",
                "razonSocial": "Razon socialss",
                "rut": "18597046-9",
                "giro": "Girosss",
                "direccionFacturacion": "DirreccionFacturacion",
                "status": false
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
        const response = await api.get(`/api/order/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw {
            success: false,
            msg: error.response?.data?.msg || 'Error al obtener la orden'
        };
    }
};

// Update order status
const updateOrderStatus = async (orderId, status, token) => {
    try {
        console.log(token)
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
        const response = await api.delete(`/api/order/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return {
            success: true,
            msg: 'Pedido cancelado correctamente'
        };
    } catch (error) {
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

const notificarProductoFavorito = async (_id, token) => {
    try {
        const response = await api.post(
            `/api/product/${_id}/notificar-favoritos`,
            {},
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
            msg: 'Error al notificar el producto favorito'
        };
    }
}

// Add these new functions for tag management

export const getAllTags = async (token) => {
    try {
        const response = await api.get('/api/tags', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al obtener las categorías'
        };
    }
};

export const createTag = async (tag, token) => {
    try {
        const response = await api.post('/api/tags',
            { tag },
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
            msg: 'Error al crear la categoría'
        };
    }
};

export const deleteTag = async (tag, token) => {
    try {
        const response = await api.delete(`/api/tags/${tag}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al eliminar la categoría'
        };
    }
};

export const renameTag = async (oldTag, newTag, token) => {
    try {
        const response = await api.put('/api/tags/rename',
            { oldTag, newTag },
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
            msg: 'Error al renombrar la categoría'
        };
    }
};

export const findProductsByTags = async (tags, matchAll = true, page = 1, limit = 10, exact = false, token) => {
    try {
        const queryParams = new URLSearchParams({
            tags: Array.isArray(tags) ? tags.join(',') : tags,
            matchAll: String(matchAll),
            page: String(page),
            limit: String(limit),
            exact: String(exact)
        });

        const response = await api.get(`/api/tags/products?${queryParams}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al buscar productos por categorías'
        };
    }
};

export const removeTagFromProduct = async (productId, tag, token) => {
    try {
        const response = await api.delete(`/api/tags/product/${productId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: { tags: [tag] }  // Send data with DELETE request
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            msg: 'Error al eliminar la categoría del producto'
        };
    }
};

export const updateUserStatus = async (userId, status, token) => {
    try {
        const response = await api.put(
            `/api/user/status/${userId}`,
            { estado: status },
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
            msg: 'Error al actualizar el estado del usuario'
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
    createUser,
    getAllOrders,
    updateOrderStatus,
    updateOrder,
    updateOrderShipping,
    notificarProductoFavorito,
    getOrderStats
};