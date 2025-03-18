import api from "./api";

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
    // Validate productId before making the request
    if (!productData.productId) {
      return {
        success: false,
        msg: 'ID de producto inválido'
      };
    }

    const response = await api.post("/api/cart", productData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      success: false,
      msg: error.message || 'Error al agregar al carrito'
    };
  }
};

// Remove a product from the cart
const removeFromCart = async (productId, token) => {
  try {
    const response = await api.delete(`/api/cart/${productId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Clear the entire cart
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
        if (item._id) {
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
            quantity: item.quantity
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
  replaceLocalCartWithServer
};