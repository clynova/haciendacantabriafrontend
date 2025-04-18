import api, { ensureCsrfCookie } from "./api";

/**
 * Cart API Functions
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

// Add a product to the cart
const addToCart = async (productData, token) => {
  try {
    if (!productData.productId) {
      return {
        success: false,
        msg: 'ID de producto inválido'
      };
    }

    // Ensure CSRF token is present before mutation
    await ensureCsrfCookie();

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
    // Validar parámetros de entrada
    if (!productId) {
      console.error("removeFromCart: productId es requerido");
      return {
        success: false,
        msg: "ID de producto es requerido para remover del carrito"
      };
    }

    // Ensure CSRF token is present before mutation
    await ensureCsrfCookie();

    // Construir URL con parámetros
    let url = `/api/cart/product/${productId}`;
    
    // Agregar variantId como query param solo si existe
    if (variantId) {
      url += `?variantId=${variantId}`;
    }
        
    const response = await api.delete(url, {
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
    
    console.error("Error en removeFromCart:", error.response?.data || error);
    
    // Devolvemos un objeto de éxito para no interrumpir el flujo de la aplicación
    // pero con una flag indicando que falló la operación
    return {
      success: false,
      error: error.response?.data || error,
      msg: "Error al eliminar el producto del carrito"
    };
  }
};

// Función unificada para eliminar productos del carrito (reemplaza removeProductFromCart)
// Esta función mantiene la compatibilidad hacia atrás con el nombre removeProductFromCart
const removeProductFromCart = removeFromCart;

const updateProductQuantity = async (productId, variantId, quantity, action, token) => {
  try {
    // Validar que la acción sea una de las permitidas
    const validActions = ['increment', 'decrement', 'set'];
    if (!validActions.includes(action)) {
      action = 'set'; // Por defecto, establecer un valor exacto
    }
    
    // Preparar los datos para la solicitud
    const requestData = {
      variantId,
      quantity,
      action
    };
    
    // Enviar la solicitud al servidor
    const response = await api.put(`/api/cart/update-quantity/${productId}`, requestData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product quantity:", error.response?.data || error);
    return {
      success: false,
      msg: error.response?.data?.msg || "Error al actualizar la cantidad del producto"
    };
  }
};

const clearCart = async (token) => {
  try {
    // Ensure CSRF token is present before mutation
    await ensureCsrfCookie();

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
    // Ensure CSRF token is present before mutations
    await ensureCsrfCookie();

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