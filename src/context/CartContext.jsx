import { createContext, useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { 
  addToCart as addToCartAPI, 
  removeFromCart as removeFromCartAPI, 
  getCart as getCartAPI, 
  clearCart as clearCartAPI, 
  updateProductQuantity 
} from '../services/paymentService';
import { getProductById } from '../services/productService';
import { ensureCsrfCookie } from '../services/api';

// Crear el contexto
const CartContext = createContext();

// Hook personalizado para usar el contexto
export const useCart = () => useContext(CartContext);

// Componente provider
function CartProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCsrfReady, setIsCsrfReady] = useState(false);
  const [csrfError, setCsrfError] = useState('');
  const pendingOperations = useRef(new Map());
  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);

  // Effect para asegurar la cookie CSRF al montar el componente
  useEffect(() => {
    console.log("CartContext: Intentando asegurar cookie CSRF...");
    setIsLoading(true);
    setCsrfError('');

    ensureCsrfCookie()
      .then(success => {
        if (success) {
          console.log("CartContext: Cookie CSRF asegurada.");
          setIsCsrfReady(true);
        } else {
          console.error("CartContext: Fallo al asegurar la cookie CSRF.");
          setCsrfError("No se pudo establecer la conexión segura. Las operaciones del carrito podrían fallar.");
        }
      })
      .catch(error => {
        console.error("CartContext: Error inesperado con CSRF:", error);
        setCsrfError("Error inesperado al preparar la seguridad del carrito.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Effect para cargar el carrito desde la API cuando el usuario está autenticado
  useEffect(() => {
    const fetchCartFromAPI = async () => {
      if (isAuthenticated && token) {
        setIsLoading(true);
        try {
          const response = await getCartAPI(token);
          if (response.success && response.cart) {
            await processServerCart(response);
          } else {
            setCartItems([]);
            localStorage.removeItem('cart');
          }
        } catch (error) {
          console.error('Error al cargar el carrito:', error);
          setCartItems([]);
          localStorage.removeItem('cart');
          toast.error('Error al cargar el carrito. Intenta recargar la página.');
        } finally {
          setIsLoading(false);
        }
      } else {
        // Usuario no autenticado: limpiar carrito
        setCartItems([]);
        localStorage.removeItem('cart');
      }
    };

    fetchCartFromAPI();
  }, [isAuthenticated, token]);

  // Procesar y formatear el carrito recibido del servidor
  const processServerCart = async (serverResponse) => {
    if (!serverResponse?.cart?.products || !Array.isArray(serverResponse.cart.products)) {
      setCartItems([]);
      return false;
    }

    try {
      const processedItems = [];
      const productsToFetch = [];

      // Primera pasada: procesar productos que ya vienen poblados
      for (const item of serverResponse.cart.products) {
        if (typeof item.productId === 'object' && item.productId._id) {
          // El producto viene poblado del backend
          const processedItem = {
            productId: item.productId,
            variant: item.variant,
            quantity: item.quantity || 1
          };
          processedItems.push(processedItem);
        } else if (typeof item.productId === 'string') {
          // Necesitamos obtener los detalles del producto
          productsToFetch.push({
            id: item.productId,
            variant: item.variant,
            quantity: item.quantity || 1
          });
        }
      }

      // Segunda pasada: obtener detalles de productos no poblados
      if (productsToFetch.length > 0) {
        const fetchPromises = productsToFetch.map(item => 
          getProductById(item.id)
            .then(res => {
              if (res?.success && res?.product) {
                return {
                  productId: res.product,
                  variant: item.variant,
                  quantity: item.quantity
                };
              }
              return null;
            })
            .catch(err => {
              console.error(`Error al obtener producto ${item.id}:`, err);
              return null;
            })
        );

        const fetchedItems = await Promise.all(fetchPromises);
        // Filtrar items nulos (fetches fallidos) y añadir al array de items procesados
        fetchedItems.filter(Boolean).forEach(item => processedItems.push(item));
      }

      setCartItems(processedItems);
      localStorage.setItem('cart', JSON.stringify(processedItems));
      return true;
    } catch (error) {
      console.error('Error al procesar el carrito:', error);
      setCartItems([]);
      localStorage.removeItem('cart');
      return false;
    }
  };

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    if (!isLoading && isAuthenticated && cartItems.length >= 0) {
      try {
        if (cartItems.length > 0) {
          localStorage.setItem('cart', JSON.stringify(cartItems));
        } else {
          localStorage.removeItem('cart');
        }
      } catch (error) {
        console.error('Error al guardar carrito en localStorage:', error);
      }
    }
  }, [cartItems, isLoading, isAuthenticated]);

  // Validar el stock disponible antes de agregar/actualizar
  const validateStock = (product, variant, requestedQuantity) => {
    if (!product || !variant) return true;

    // Buscar la variante en el producto
    const variantDetails = product.opcionesPeso?.pesosEstandar?.find(
      opt => opt._id === variant.pesoId || opt.pesoId === variant.pesoId
    );

    if (variantDetails && variantDetails.stockDisponible !== undefined) {
      if (requestedQuantity > variantDetails.stockDisponible) {
        toast.error(
          `Solo hay ${variantDetails.stockDisponible} unidades disponibles de ${product.nombre} (${variant.peso}${variant.unidad})`
        );
        return false;
      }
    }
    
    return true;
  };

  // Agregar producto al carrito
  const addToCart = async (product, variant, quantity = 1, showNotification = true) => {
    if (!product) {
      toast.error('Error: Producto inválido');
      return;
    }

    // Manejar el caso donde la variante viene en selectedVariant (nuevo modelo)
    if (product.selectedVariant && !variant) {
      variant = product.selectedVariant;
    }

    const productId = typeof product === 'string' ? product : product._id;
    const variantId = variant?.pesoId || variant?._id;

    if (!productId) {
      toast.error('Error: ID de producto inválido');
      return;
    }

    // Clave única para esta operación
    const operationKey = variantId ? `${productId}-${variantId}` : productId;
    
    // Verificar si ya hay una operación pendiente
    if (pendingOperations.current.has(operationKey)) {
      return;
    }

    // Marcar operación como pendiente
    pendingOperations.current.set(operationKey, true);
    
    try {
      // Siempre agregamos exactamente la cantidad especificada (generalmente 1)
      const addedQuantity = quantity;
      
      // Verificar si el producto ya existe en el carrito
      const existingItemIndex = cartItems.findIndex(item => {
        const itemProductId = typeof item.productId === 'object' ? item.productId._id : item.productId;
        const itemVariantId = item.variant?.pesoId;
        return itemProductId === productId && itemVariantId === variantId;
      });

      // Validar stock si tenemos toda la información
      if (typeof product === 'object' && variant) {
        // Si el producto ya existe, validamos con la nueva cantidad total
        const currentQuantity = existingItemIndex >= 0 ? cartItems[existingItemIndex].quantity : 0;
        if (!validateStock(product, variant, currentQuantity + addedQuantity)) {
          pendingOperations.current.delete(operationKey);
          return;
        }
      }

      // Actualización optimista del estado local antes de la llamada a la API
      // Esto hace que la UI sea más responsiva
      setCartItems(current => {
        const updatedCart = [...current];
        
        if (existingItemIndex >= 0) {
          // Actualizar item existente
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: updatedCart[existingItemIndex].quantity + addedQuantity
          };
        } else {
          // Agregar nuevo item
          const newItem = {
            productId: typeof product === 'object' ? product : productId,
            variant,
            quantity: addedQuantity
          };
          updatedCart.push(newItem);
        }
        
        return updatedCart;
      });

      // Mostrar notificación y abrir carrito inmediatamente
      if (showNotification && !product.selectedVariant) {
        const productName = typeof product === 'object' ? product.nombre : 'Producto';
        const variantInfo = variant ? ` (${variant.peso}${variant.unidad})` : '';
        toast.success(`${productName}${variantInfo} agregado al carrito`);
      }
      
      // Abrir el carrito si se agregó correctamente
      setIsCartOpen(true);

      // Sincronizar con el servidor de forma asíncrona (sin bloquear la UI)
      if (isAuthenticated && token) {
        const apiData = {
          productId: productId,
          variantId: variantId,
          quantity: addedQuantity
        };

        const response = await addToCartAPI(apiData, token);
        
        if (!response.success) {
          // Si falla, revertimos el cambio local (optimistic update rollback)
          const serverCart = await getCartAPI(token);
          await processServerCart(serverCart);
          throw new Error(response.msg || 'Error al agregar al carrito');
        }
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      toast.error(error.msg || 'Error al agregar al carrito');
      
      // En caso de error, sincronizar con el servidor solo si el usuario está autenticado
      if (isAuthenticated && token) {
        try {
          const serverCart = await getCartAPI(token);
          await processServerCart(serverCart);
        } catch (reloadError) {
          console.error('Error al recargar el carrito después de error:', reloadError);
        }
      }
    } finally {
      // Liberar la operación pendiente después de un pequeño retraso
      // para evitar múltiples clics rápidos
      setTimeout(() => {
        pendingOperations.current.delete(operationKey);
      }, 300);
    }
  };

  // Remover producto del carrito
  const removeFromCart = async (productId, variantId = null) => {
    if (!productId) {
      console.warn('Intento de eliminar producto sin ID');
      return;
    }

    // Normalizar el productId (podría ser un objeto o un string)
    const normalizedProductId = typeof productId === 'object' ? productId._id : productId;
    
    // Clave única para identificar la operación
    const operationKey = variantId ? `${normalizedProductId}-${variantId}` : normalizedProductId;
    
    // Verificar si ya hay una operación pendiente para este producto
    if (pendingOperations.current.has(operationKey)) {
      console.log('Operación de eliminación ya en curso para este producto');
      return;
    }
    
    // Marcar la operación como pendiente
    pendingOperations.current.set(operationKey, true);
    
    try {
      // Encontrar el item en el carrito antes de eliminarlo (para verificación)
      const itemToRemove = cartItems.find(item => {
        const itemProductId = typeof item.productId === 'object' ? item.productId._id : item.productId;
        const itemVariantId = item.variant?.pesoId;
        
        return (itemProductId === normalizedProductId && itemVariantId === variantId);
      });
      
      if (!itemToRemove) {
        console.warn(`Producto/variante no encontrado en el carrito local: ${normalizedProductId}/${variantId}`);
      }
      
      // Actualizar estado local inmediatamente para mejor UX (actualización optimista)
      setCartItems(current => 
        current.filter(item => {
          const itemProductId = typeof item.productId === 'object' ? item.productId._id : item.productId;
          const itemVariantId = item.variant?.pesoId;
          
          // Devolver true si NO coincide con el item a eliminar
          return !(itemProductId === normalizedProductId && itemVariantId === variantId);
        })
      );
      
      // Si está autenticado, sincronizar con el servidor
      if (isAuthenticated && token) {
        const serverResponse = await removeFromCartAPI(normalizedProductId, variantId, token);
        
        if (!serverResponse.success) {
          console.error('Error del servidor al eliminar producto:', serverResponse.msg);
          throw new Error(serverResponse.msg || 'Error al eliminar producto del carrito');
        }
        
        // Recargar el carrito desde el servidor para asegurar consistencia
        const updatedCart = await getCartAPI(token);
        await processServerCart(updatedCart);
      }
      
      toast.success('Producto eliminado del carrito');
    } catch (error) {
      console.error('Error al eliminar producto del carrito:', error);
      toast.error('Error al eliminar producto del carrito');
      
      // Recargar el carrito desde el servidor en caso de error para restaurar el estado correcto
      if (isAuthenticated && token) {
        try {
          const serverCart = await getCartAPI(token);
          await processServerCart(serverCart);
        } catch (reloadError) {
          console.error('Error al recargar el carrito después de error:', reloadError);
        }
      }
    } finally {
      // Liberamos la operación pendiente con un pequeño retraso para prevenir múltiples clics
      setTimeout(() => {
        pendingOperations.current.delete(operationKey);
      }, 300);
    }
  };

  // Actualizar cantidad de un producto en el carrito
  const updateItemQuantity = async (productId, variantId, quantity, action = 'increment') => {
    if (!productId || quantity < 1) return;
    
    // Si la acción es decrementar y la cantidad resultaría en 0, eliminar el producto
    if (action === 'decrement') {
      const item = cartItems.find(item => {
        const itemProductId = typeof item.productId === 'object' ? item.productId._id : item.productId;
        const itemVariantId = item.variant?.pesoId;
        return itemProductId === productId && itemVariantId === variantId;
      });
      
      if (item && item.quantity <= quantity) {
        return removeFromCart(productId, variantId);
      }
    }
    
    const operationKey = variantId ? `${productId}-${variantId}` : productId;
    
    if (pendingOperations.current.has(operationKey)) {
      return;
    }
    
    pendingOperations.current.set(operationKey, true);
    
    try {
      // Actualización optimista del estado local para una UI más responsiva
      setCartItems(current => {
        return current.map(item => {
          const itemProductId = typeof item.productId === 'object' ? item.productId._id : item.productId;
          const itemVariantId = item.variant?.pesoId;
          
          if (itemProductId === productId && itemVariantId === variantId) {
            let newQuantity;
            
            if (action === 'set') {
              newQuantity = quantity;
            } else if (action === 'increment') {
              newQuantity = item.quantity + quantity;
            } else { // decrement
              newQuantity = Math.max(1, item.quantity - quantity);
            }
            
            // Validar que no exceda el stock si tenemos acceso a esa información
            if (typeof item.productId === 'object') {
              const product = item.productId;
              const variantDetails = product.precioVariantesPorPeso?.find(
                opt => opt.pesoId === variantId
              );
              
              if (variantDetails && variantDetails.stockDisponible !== undefined) {
                if (newQuantity > variantDetails.stockDisponible) {
                  newQuantity = variantDetails.stockDisponible;
                  toast.error(`Solo hay ${variantDetails.stockDisponible} unidades disponibles`);
                }
              }
            }
            
            return { ...item, quantity: newQuantity };
          }
          
          return item;
        });
      });
      
      // Mostrar notificación inmediata de éxito
      toast.success('Cantidad actualizada');
      
      // Si está autenticado, sincronizar con el servidor de forma asíncrona
      if (isAuthenticated && token) {
        const response = await updateProductQuantity(productId, variantId, quantity, action, token);
        
        if (!response.success) {
          // Si falla, revertir al estado del servidor
          const serverCart = await getCartAPI(token);
          await processServerCart(serverCart);
          throw new Error(response.msg || 'Error al actualizar cantidad');
        }
      }
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      toast.error('Error al actualizar cantidad');
      
      // Recargar el carrito desde el servidor en caso de error
      if (isAuthenticated && token) {
        try {
          const serverCart = await getCartAPI(token);
          await processServerCart(serverCart);
        } catch (reloadError) {
          console.error('Error al recargar el carrito después de error:', reloadError);
        }
      }
    } finally {
      // Liberar la operación pendiente con un pequeño retraso
      // para evitar actualizaciones rápidas consecutivas
      setTimeout(() => {
        pendingOperations.current.delete(operationKey);
      }, 300);
    }
  };

  // Limpiar el carrito
  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    
    if (isAuthenticated && token) {
      setIsLoading(true);
      try {
        await clearCartAPI(token);
        toast.success('Carrito vaciado con éxito');
      } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        toast.error('Error al vaciar el carrito');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.success('Carrito vaciado');
    }
  };

  // Guardar información de envío
  const saveShippingInfo = (info) => {
    setShippingInfo(info);
  };

  // Guardar información de pago
  const savePaymentInfo = (info) => {
    setPaymentInfo(info);
  };

  // Calcular total del carrito
  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => {
      // Determinar el precio correcto con descuento si existe
      let price = 0;
      
      if (item.variant) {
        // Buscamos si existe información de precio con descuento en las variantes
        if (typeof item.productId === 'object' && item.productId.precioVariantesPorPeso) {
          const variantInfo = item.productId.precioVariantesPorPeso.find(
            v => v.pesoId === item.variant.pesoId
          );
          
          if (variantInfo && variantInfo.precioFinal !== undefined) {
            price = variantInfo.precioFinal; // Usamos el precio con descuento
          } else {
            price = item.variant.precio; // Usamos el precio regular si no hay información de descuento
          }
        } else {
          price = item.variant.precio; // Si no hay información de variantes con precios, usamos el precio base
        }
      } else if (typeof item.productId === 'object') {
        // Fallback a la variante predeterminada si no hay variante específica
        price = item.productId.variantePredeterminada?.precioFinal || 
                item.productId.variantePredeterminada?.precio || 0;
      }
      
      return total + (price * (item.quantity || 1));
    }, 0);
  };

  // Contar items en el carrito
  const calculateCartCount = () => {
    return cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  // Validar stock de todo el carrito
  const validateCartStock = () => {
    let isValid = true;
    
    for (const item of cartItems) {
      const product = typeof item.productId === 'object' ? item.productId : null;
      const variant = item.variant;
      
      if (product && variant) {
        if (!validateStock(product, variant, item.quantity)) {
          isValid = false;
        }
      }
    }
    
    return isValid;
  };

  // Calcular subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      // Determinar el precio correcto con descuento si existe
      let price = 0;
      
      if (item.variant) {
        // Buscamos si existe información de precio con descuento en las variantes
        if (typeof item.productId === 'object' && item.productId.precioVariantesPorPeso) {
          const variantInfo = item.productId.precioVariantesPorPeso.find(
            v => v.pesoId === item.variant.pesoId
          );
          
          if (variantInfo && variantInfo.precioFinal !== undefined) {
            price = variantInfo.precioFinal; // Usamos el precio con descuento
          } else {
            price = item.variant.precio; // Usamos el precio regular si no hay información de descuento
          }
        } else {
          price = item.variant.precio; // Si no hay información de variantes con precios, usamos el precio base
        }
      } else if (typeof item.productId === 'object') {
        // Fallback a la variante predeterminada si no hay variante específica
        price = item.productId.variantePredeterminada?.precioFinal || 
                item.productId.variantePredeterminada?.precio || 0;
      }
      
      return total + (price * (item.quantity || 1));
    }, 0);
  };
  
  // Calcular impuestos
  const calculateTax = (subtotal) => {
    return subtotal * 0.16; // 16% de impuesto
  };
  
  // Calcular peso total
  const calculateTotalWeight = () => {
    return cartItems.reduce((total, item) => {
      const peso = item.variant?.peso || 0;
      return total + (peso * (item.quantity || 1));
    }, 0);
  };
  
  // Calcular costo de envío
  const calculateShippingCost = () => {
    if (shippingInfo?.baseCost && shippingInfo?.extraCostPerKg !== undefined) {
      const totalWeight = calculateTotalWeight();
      const extraWeight = Math.max(0, totalWeight - 1);
      const baseCost = parseFloat(shippingInfo.baseCost);
      const extraCostPerKg = parseFloat(shippingInfo.extraCostPerKg);

      return baseCost + (extraWeight * extraCostPerKg);
    }
    return 0;
  };
  
  // Obtener resumen de la orden
  const getOrderSummary = (selectedPaymentMethod, includeVAT = false) => {
    const subtotal = calculateSubtotal();
    const tax = includeVAT ? calculateTax(subtotal) : 0;
    const shipping = shippingInfo?.baseCost ? parseFloat(shippingInfo.baseCost) : 0;
    
    let paymentCommission = 0;
    if (selectedPaymentMethod?.commission_percentage) {
      paymentCommission = ((subtotal + shipping) * selectedPaymentMethod.commission_percentage) / 100;
    }
    
    const total = subtotal + tax + shipping + paymentCommission;
    
    return {
      subtotal,
      tax,
      shipping,
      paymentCommission,
      total,
      items: cartItems,
      shippingInfo
    };
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity: updateItemQuantity, // Renamed for backward compatibility
      updateItemQuantityAction: updateItemQuantity, // For backward compatibility
      clearCart,
      cartTotal: calculateCartTotal(),
      cartCount: calculateCartCount(),
      isCartOpen,
      setIsCartOpen,
      shippingInfo,
      saveShippingInfo,
      paymentInfo,
      savePaymentInfo,
      getCartTotal: calculateCartTotal, // For backward compatibility
      validateCartStock,
      isLoading,
      calculateSubtotal,
      calculateTax,
      calculateShippingCost,
      calculateTotalWeight,
      getOrderSummary,
      isCsrfReady,
      csrfError
    }}>
      {children}
    </CartContext.Provider>
  );
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { CartContext, CartProvider };