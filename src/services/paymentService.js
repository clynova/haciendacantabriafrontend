import api from "./api";

/**
 * Cart API Functions
 */


/* example response getCart
{
    "success": true,
    "cart": {
        "_id": "67f0955bddc8c38ace49720c",
        "userId": "67e213b9ef679c056df168a6",
        "products": [
            {
                "variant": {
                    "pesoId": "67f087c0ddc8c38ace4961f2",
                    "peso": 1,
                    "unidad": "kg",
                    "precio": 5000,
                    "sku": "CARNE-001-1KG"
                },
                "productId": {
                    "infoCarne": {
                        "tipoCarne": "VACUNO",
                        "corte": "BIFE_ANGOSTO",
                        "nombreArgentino": "Bife Angosto",
                        "nombreChileno": "Lomo Vetado"
                    },
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
                                "stockDisponible": 20,
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
                            "stockDisponible": 20,
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
                        "stockDisponible": 20,
                        "esPredeterminado": true,
                        "sku": "CARNE-001-1KG"
                    }
                },
                "quantity": 1
            },
            {
                "variant": {
                    "pesoId": "67f087c0ddc8c38ace4961f1",
                    "peso": 500,
                    "unidad": "g",
                    "precio": 2500,
                    "sku": "CARNE-001-500G"
                },
                "productId": {
                    "infoCarne": {
                        "tipoCarne": "VACUNO",
                        "corte": "BIFE_ANGOSTO",
                        "nombreArgentino": "Bife Angosto",
                        "nombreChileno": "Lomo Vetado"
                    },
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
                                "stockDisponible": 20,
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
                            "stockDisponible": 20,
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
                        "stockDisponible": 20,
                        "esPredeterminado": true,
                        "sku": "CARNE-001-1KG"
                    }
                },
                "quantity": 2
            },
            {
                "variant": {
                    "pesoId": "67f087e3ddc8c38ace4961fe",
                    "peso": 1,
                    "unidad": "L",
                    "precio": 3000,
                    "sku": "ACEITE-001-1L"
                },
                "productId": {
                    "infoAceite": {
                        "tipo": "OLIVA",
                        "envase": "BOTELLA"
                    },
                    "multimedia": {
                        "imagenes": [
                            {
                                "url": "https://res-console.cloudinary.com/djgegk8jp/media_explorer_thumbnails/40161b980d1f9033380ccfecd2bf4f23/detailed",
                                "textoAlternativo": "Botella de aceite de oliva",
                                "esPrincipal": true,
                                "_id": "67f087e3ddc8c38ace4961fc",
                                "id": "67f087e3ddc8c38ace4961fc"
                            }
                        ],
                        "video": "https://ejemplo.com/videos/aceite-oliva.mp4"
                    },
                    "opcionesPeso": {
                        "esPesoVariable": false,
                        "pesosEstandar": [
                            {
                                "descuentos": {
                                    "regular": 5
                                },
                                "peso": 500,
                                "unidad": "ml",
                                "esPredeterminado": false,
                                "precio": 1500,
                                "sku": "ACEITE-001-500ML",
                                "stockDisponible": 50,
                                "umbralStockBajo": 10,
                                "ultimaActualizacion": "2023-10-01T10:00:00.000Z",
                                "_id": "67f087e3ddc8c38ace4961fd",
                                "id": "67f087e3ddc8c38ace4961fd"
                            },
                            {
                                "descuentos": {
                                    "regular": 5
                                },
                                "peso": 1,
                                "unidad": "L",
                                "esPredeterminado": true,
                                "precio": 3000,
                                "sku": "ACEITE-001-1L",
                                "stockDisponible": 30,
                                "umbralStockBajo": 10,
                                "ultimaActualizacion": "2023-10-01T10:00:00.000Z",
                                "_id": "67f087e3ddc8c38ace4961fe",
                                "id": "67f087e3ddc8c38ace4961fe"
                            }
                        ],
                        "rangosPreferidos": []
                    },
                    "_id": "67f087e3ddc8c38ace4961fb",
                    "sku": "ACEITE-001",
                    "nombre": "Aceite de Oliva Extra Virgen",
                    "slug": "aceite-de-oliva-extra-virgen",
                    "categoria": "ACEITE",
                    "estado": true,
                    "tipoProducto": "ProductoAceite",
                    "precioVariantesPorPeso": [
                        {
                            "pesoId": "67f087e3ddc8c38ace4961fd",
                            "peso": 500,
                            "unidad": "ml",
                            "precio": 1500,
                            "descuento": 5,
                            "precioFinal": 1425,
                            "stockDisponible": 50,
                            "esPredeterminado": false,
                            "sku": "ACEITE-001-500ML"
                        },
                        {
                            "pesoId": "67f087e3ddc8c38ace4961fe",
                            "peso": 1,
                            "unidad": "L",
                            "precio": 3000,
                            "descuento": 5,
                            "precioFinal": 2850,
                            "stockDisponible": 30,
                            "esPredeterminado": true,
                            "sku": "ACEITE-001-1L"
                        }
                    ],
                    "variantePredeterminada": {
                        "pesoId": "67f087e3ddc8c38ace4961fe",
                        "peso": 1,
                        "unidad": "L",
                        "precio": 3000,
                        "descuento": 5,
                        "precioFinal": 2850,
                        "stockDisponible": 30,
                        "esPredeterminado": true,
                        "sku": "ACEITE-001-1L"
                    }
                },
                "quantity": 1
            }
        ],
        "updatedAt": "2025-04-05T02:30:51.867Z",
        "createdAt": "2025-04-05T02:28:43.277Z",
        "__v": 2
    },
    "msg": "Se envió correctamente el carrito",
    "adjustedItems": false
}

*/

// Get user's cart from the server
const getCart = async (token) => {
  try {
    const response = await api.get("/api/cart", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    // Si recibimos cualquier error 400, asumimos que el carrito está vacío o que hay un problema de autenticación
    // Este manejo es más general para cubrir todos los casos posibles
    if (error.response?.status === 400) {
      console.log("Error 400 al obtener carrito: ", error.response?.data?.msg || "Carrito no disponible");
      return {
        success: true,
        cart: {
          products: []
        }
      };
    }
    throw error.response?.data || error;
  }
};



/* example response addToCart
{
    "success": true,
    "cart": {
        "_id": "67f0955bddc8c38ace49720c",
        "userId": "67e213b9ef679c056df168a6",
        "products": [
            {
                "variant": {
                    "pesoId": "67f087c0ddc8c38ace4961f2",
                    "peso": 1,
                    "unidad": "kg",
                    "precio": 5000,
                    "sku": "CARNE-001-1KG"
                },
                "productId": "67f087c0ddc8c38ace4961ef",
                "quantity": 2
            },
            {
                "variant": {
                    "pesoId": "67f087c0ddc8c38ace4961f1",
                    "peso": 500,
                    "unidad": "g",
                    "precio": 2500,
                    "sku": "CARNE-001-500G"
                },
                "productId": "67f087c0ddc8c38ace4961ef",
                "quantity": 2
            },
            {
                "variant": {
                    "pesoId": "67f087e3ddc8c38ace4961fe",
                    "peso": 1,
                    "unidad": "L",
                    "precio": 3000,
                    "sku": "ACEITE-001-1L"
                },
                "productId": "67f087e3ddc8c38ace4961fb",
                "quantity": 1
            }
        ],
        "updatedAt": "2025-04-05T10:24:48.041Z",
        "createdAt": "2025-04-05T02:28:43.277Z",
        "__v": 2
    }
}
*/

// Add a product to the cart
const addToCart = async (productData, token) => {
  try {
    if (!productData.productId) {
      return {
        success: false,
        msg: 'ID de producto inválido'
      };
    }

    // Asegurar que los datos enviados a la API siguen el formato esperado
    const cartItemData = {
      productId: productData.productId,
      quantity: productData.quantity || 1,
    };

    // Agregar variantId solo si está presente (obligatorio para productos con variantes)
    if (productData.variantId) {
      cartItemData.variantId = productData.variantId;
    }

    const response = await api.post("/api/cart/add", cartItemData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    console.log(error)
    if (error.response?.data) {
      return error.response.data.message || error.response.data.msg || error.response.data;
    }
    return {
      success: false,
      msg: error.response?.data?.message || error.response?.data?.msg || "Error al agregar al carrito"
    };
  }
};

// Remove a product from the cart
const removeFromCart = async (productId, variantId, token) => {
  try {
    console.log("variantId", variantId)
    const response = await api.delete(`/api/cart/product/${productId}?variantId=${variantId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    // Si recibimos un 404, probablemente es porque el producto no existe en el carrito
    // En este caso, no es realmente un error, ya que el objetivo era eliminar el producto
    if (error.response?.status === 404 ||
      (error.response?.data?.msg && (
        error.response?.data?.msg.toLowerCase().includes('no existe') ||
        error.response?.data?.msg.toLowerCase().includes('no encontrado') ||
        error.response?.data?.msg.toLowerCase().includes('no hay') ||
        error.response?.data?.msg.toLowerCase().includes('vacío')
      ))
    ) {
      return {
        success: true,
        msg: "No hay producto para eliminar o ya está vacío"
      };
    }
    // Devolvemos un objeto de éxito para no interrumpir el flujo de la aplicación
    // pero con una flag indicando que falló la operación
    return {
      success: false,
      error: error.response?.data || error,
      msg: "Error al eliminar el producto del carrito"
    };
  };
}


/* example response removeProductFromCart
{
    "success": true,
    "cart": {
        "_id": "67f0955bddc8c38ace49720c",
        "userId": "67e213b9ef679c056df168a6",
        "products": [
            {
                "variant": {
                    "pesoId": "67f087c0ddc8c38ace4961f1",
                    "peso": 500,
                    "unidad": "g",
                    "precio": 2500,
                    "sku": "CARNE-001-500G"
                },
                "productId": "67f087c0ddc8c38ace4961ef",
                "quantity": 2
            },
            {
                "variant": {
                    "pesoId": "67f087e3ddc8c38ace4961fe",
                    "peso": 1,
                    "unidad": "L",
                    "precio": 3000,
                    "sku": "ACEITE-001-1L"
                },
                "productId": "67f087e3ddc8c38ace4961fb",
                "quantity": 1
            }
        ],
        "updatedAt": "2025-04-05T10:28:10.785Z",
        "createdAt": "2025-04-05T02:28:43.277Z",
        "__v": 3
    },
    "msg": "Producto eliminado del carrito exitosamente"
}
*/
const removeProductFromCart = async (productId, variantId, token) => {
  try {
    console.log("variantId", variantId)
    const response = await api.delete(`/api/cart/product/${productId}?variantId=${variantId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    // Si recibimos un 404, probablemente es porque el producto no existe en el carrito
    // En este caso, no es realmente un error, ya que el objetivo era eliminar el producto
    if (error.response?.status === 404 ||
      (error.response?.data?.msg && (
        error.response?.data?.msg.toLowerCase().includes('no existe') ||
        error.response?.data?.msg.toLowerCase().includes('no encontrado') ||
        error.response?.data?.msg.toLowerCase().includes('no hay') ||
        error.response?.data?.msg.toLowerCase().includes('vacío')
      ))
    ) {
      return {
        success: true,
        msg: "No hay producto para eliminar o ya está vacío"
      };
    }
    // Devolvemos un objeto de éxito para no interrumpir el flujo de la aplicación
    // pero con una flag indicando que falló la operación
    return {
      success: false,
      error: error.response?.data || error,
      msg: "Error al eliminar el producto del carrito"
    };
  }
};

/* example response updateProductQuantity
{
    "success": true,
    "cart": {
        "_id": "67f0955bddc8c38ace49720c",
        "userId": "67e213b9ef679c056df168a6",
        "products": [
            {
                "variant": {
                    "pesoId": "67f087c0ddc8c38ace4961f2",
                    "peso": 1,
                    "unidad": "kg",
                    "precio": 5000,
                    "sku": "CARNE-001-1KG"
                },
                "productId": "67f087c0ddc8c38ace4961ef",
                "quantity": 1
            },
            {
                "variant": {
                    "pesoId": "67f087c0ddc8c38ace4961f1",
                    "peso": 500,
                    "unidad": "g",
                    "precio": 2500,
                    "sku": "CARNE-001-500G"
                },
                "productId": "67f087c0ddc8c38ace4961ef",
                "quantity": 2
            },
            {
                "variant": {
                    "pesoId": "67f087e3ddc8c38ace4961fe",
                    "peso": 1,
                    "unidad": "L",
                    "precio": 3000,
                    "sku": "ACEITE-001-1L"
                },
                "productId": "67f087e3ddc8c38ace4961fb",
                "quantity": 1
            }
        ],
        "updatedAt": "2025-04-05T10:25:48.042Z",
        "createdAt": "2025-04-05T02:28:43.277Z",
        "__v": 2
    },
    "msg": "Cantidad disminuida exitosamente"
}*/
const updateProductQuantity = async (productId, variantId, quantity, action, token) => {
  try {
    // action puede ser 'increment' o 'decrement'
    // quantity, variantId, action
    const response = await api.put(`/api/cart/update-quantity/${productId}`, {
      variantId,
      quantity,
      action
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}



/* example response clearCart
{
    "success": true,
    "msg": "Carrito vaciado exitosamente"
}
*/
const clearCart = async (token) => {
  try {
    // Usando la ruta correcta según los comentarios de la API
    const response = await api.delete("/api/cart", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    // Si recibimos un 404, probablemente es porque el carrito no existe aún
    // En este caso, no es realmente un error, ya que el objetivo era limpiar el carrito
    if (error.response?.status === 404 ||
      (error.response?.data?.msg && (
        error.response?.data?.msg.toLowerCase().includes('no existe') ||
        error.response?.data?.msg.toLowerCase().includes('no encontrado') ||
        error.response?.data?.msg.toLowerCase().includes('no hay') ||
        error.response?.data?.msg.toLowerCase().includes('vacío')
      ))
    ) {
      return {
        success: true,
        msg: "No hay carrito para limpiar o ya está vacío"
      };
    }
    // Devolvemos un objeto de éxito para no interrumpir el flujo de la aplicación
    // pero con una flag indicando que falló la operación
    return {
      success: false,
      error: error.response?.data || error,
      msg: "Error al limpiar el carrito"
    };
  }
};

// Sync local cart with server cart (used when user logs in)
const syncCart = async (cartItems, token, preferServerCart = false) => {
  if (!token) return null;

  try {
    // Si preferimos el carrito del servidor y no hay items locales, simplemente devolvemos el carrito del servidor
    if (preferServerCart && (!cartItems || cartItems.length === 0)) {
      return await getCart(token);
    }

    // Si preferimos el carrito local o tenemos items locales a sincronizar
    let serverCart;

    try {
      // Obtener el carrito del servidor
      serverCart = await getCart(token);
    } catch (error) {
      // Si no se puede obtener el carrito del servidor porque está vacío o no existe,
      // inicializamos una estructura vacía y continuamos
      serverCart = { success: true, cart: { products: [] } };
      console.log("Inicializando carrito vacío para sincronización");
    }

    // Verificar si debemos preferir el carrito del servidor o el local
    if (preferServerCart) {
      // Si preferimos el carrito del servidor y este ya tiene productos, lo devolvemos directamente
      if (serverCart?.cart?.products && serverCart.cart.products.length > 0) {
        return serverCart;
      }
    }

    // Si llegamos aquí, vamos a sincronizar el carrito local con el servidor

    // Crear un mapa para combinar elementos duplicados y sumar sus cantidades
    const combinedCart = new Map();

    // Primero, agregamos los productos del servidor al mapa (si no preferimos el carrito local)
    if (!preferServerCart && serverCart?.cart?.products && serverCart.cart.products.length > 0) {
      for (const item of serverCart.cart.products) {
        if (item.productId) {
          combinedCart.set(item.productId, {
            productId: item.productId,
            quantity: item.quantity || 1,
            fromServer: true
          });
        }
      }
    }

    // Luego agregamos o actualizamos con los productos del carrito local
    if (cartItems && cartItems.length > 0) {
      for (const item of cartItems) {
        // Manejar tanto el formato nuevo como el antiguo
        if (item.productId && item.variant) {
          // Nuevo formato con variantes
          const existingItem = combinedCart.get(`${item.productId._id}-${item.variant.pesoId}`);

          if (existingItem) {
            // Si el producto ya existe, sumamos las cantidades
            existingItem.quantity = Math.max(existingItem.quantity, item.quantity || 1);
            combinedCart.set(`${item.productId._id}-${item.variant.pesoId}`, existingItem);
          } else {
            // Si el producto no existe, lo agregamos
            combinedCart.set(`${item.productId._id}-${item.variant.pesoId}`, {
              productId: item.productId._id,
              quantity: item.quantity || 1,
              variantId: item.variant.pesoId,
              fromServer: false
            });
          }
        } else if (item._id) {
          // Formato antiguo
          const existingItem = combinedCart.get(item._id);

          if (existingItem) {
            // Si el producto ya existe, sumamos las cantidades
            existingItem.quantity = Math.max(existingItem.quantity, item.quantity || 1);
            combinedCart.set(item._id, existingItem);
          } else {
            // Si el producto no existe, lo agregamos
            combinedCart.set(item._id, {
              productId: item._id,
              quantity: item.quantity || 1,
              // Incluir variantId si existe (caso de selectedWeightOption)
              ...(item.selectedWeightOption?.pesoId && { variantId: item.selectedWeightOption.pesoId }),
              fromServer: false
            });
          }
        }
      }
    }

    // Ahora limpiamos el carrito del servidor y agregamos los productos combinados
    try {
      // Solo intentamos limpiar si hay un carrito existente en el servidor
      if (serverCart?.cart?.products && serverCart.cart.products.length > 0) {
        const clearResult = await clearCart(token);
        if (!clearResult.success) {
          console.warn("Advertencia al limpiar el carrito:", clearResult.msg);
        }
      }

      // Agregamos cada producto combinado al servidor
      for (const item of combinedCart.values()) {
        try {
          await addToCart({
            productId: item.productId,
            quantity: item.quantity,
            ...(item.variantId && { variantId: item.variantId })
          }, token);
        } catch (error) {
          console.error(`Error al añadir producto ${item.productId} al carrito:`, error);
        }
      }
    } catch (error) {
      console.warn("Error al sincronizar el carrito:", error);
    }

    // Devolvemos el carrito actualizado
    try {
      return await getCart(token);
    } catch (error) {
      console.error("Error obteniendo carrito actualizado:", error);
      // Si hay error al obtener el carrito actualizado, devolvemos al menos los items del mapa combinado
      return {
        success: true,
        cart: {
          products: Array.from(combinedCart.values())
        }
      };
    }
  } catch (error) {
    console.error("Error syncing cart:", error);
    // No lanzamos el error, solo lo registramos y devolvemos un valor por defecto
    return {
      success: false,
      error: error,
      cart: { products: [] }
    };
  }
};

// Función para reemplazar completamente el carrito local con el del servidor
const replaceLocalCartWithServer = async (token) => {
  try {
    return await getCart(token);
  } catch (error) {
    console.error("Error fetching server cart:", error);
    return { success: false, cart: { products: [] } };
  }
};

export {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  syncCart,
  replaceLocalCartWithServer,
  removeProductFromCart,
  updateProductQuantity
};