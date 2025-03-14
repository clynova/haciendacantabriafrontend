import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { addToCart as addToCartAPI, removeFromCart as removeFromCartAPI, 
         getCart, syncCart, clearCart as clearCartAPI } from '../services/paymentService';
import { getProductById } from '../services/productService';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [shippingInfo, setShippingInfo] = useState(() => {
    const savedInfo = localStorage.getItem('shippingInfo');
    return savedInfo ? JSON.parse(savedInfo) : null;
  });

  const [paymentInfo, setPaymentInfo] = useState(() => {
    const savedInfo = localStorage.getItem('paymentInfo');
    return savedInfo ? JSON.parse(savedInfo) : null;
  });

  // Effect to load cart from API when user is authenticated
  useEffect(() => {
    const fetchCartFromAPI = async () => {
      if (isAuthenticated && token) {
        setIsLoading(true);
        try {
          // Primero obtenemos el carrito del servidor para verificar el estado actual
          let serverCartResponse;
          try {
            serverCartResponse = await getCart(token);
          } catch (error) {
            console.log('No se pudo obtener el carrito del servidor:', error);
            serverCartResponse = { cart: { products: [] } };
          }

          // Obtenemos el carrito local
          const localCart = JSON.parse(localStorage.getItem('cart')) || [];
          
          // Verificamos si ya hay una sincronización en progreso (para evitar múltiples en recargas)
          const lastSyncTime = localStorage.getItem('lastCartSync');
          const now = Date.now();
          
          // Si se ha sincronizado en los últimos 2 segundos, no volvemos a sincronizar
          // Esto evita sincronizaciones múltiples en recargas rápidas (F5)
          if (lastSyncTime && (now - parseInt(lastSyncTime)) < 2000) {
            console.log('Sincronización reciente detectada, usando carrito del servidor');
            
            // Si hay un carrito en el servidor, lo cargamos
            if (serverCartResponse?.cart?.products && serverCartResponse.cart.products.length > 0) {
              await loadServerCart(serverCartResponse);
            }
            
            setIsLoading(false);
            return;
          }
          
          // Marcamos el tiempo de sincronización
          localStorage.setItem('lastCartSync', now.toString());
          
          // Continuamos con la lógica existente
          if (localCart.length > 0) {
            await syncCart(localCart, token);
          } else {
            try {
              // Si el carrito local está vacío pero hay productos en el servidor, los cargamos
              if (serverCartResponse?.cart?.products && serverCartResponse.cart.products.length > 0) {
                await loadServerCart(serverCartResponse);
              }
            } catch (getCartError) {
              console.log('No se pudo cargar el carrito, posiblemente sea un usuario nuevo:', getCartError);
            }
          }
        } catch (error) {
          console.error('Error fetchCartFromAPI:', error);
          if (error?.response?.status !== 400) {
            toast.error('Error al cargar tu carrito');
          }
        } finally {
          setIsLoading(false);
        }
      } else if (!isAuthenticated) {
        const savedCart = localStorage.getItem('cart');
        if (savedCart && cartItems.length === 0) {
          setCartItems(JSON.parse(savedCart));
        }
      }
    };

    // Función auxiliar para cargar el carrito del servidor
    const loadServerCart = async (serverCartResponse) => {
      const serverCartItems = [];
      
      for (const item of serverCartResponse.cart.products) {
        try {
          // La información del producto ya viene en la respuesta
          const product = item.productId;
          
          if (product) {
            // Crear objeto de carrito completo con la nueva estructura
            serverCartItems.push({
              _id: product._id,
              nombre: product.nombre,
              precioFinal: product.precioFinal,
              precioTransferencia: product.precioTransferencia,
              multimedia: {
                imagenes: product.multimedia.imagenes.map(img => img.url)
              },
              quantity: item.quantity,
              inventario: {
                stockUnidades: 10 // Por defecto mientras se implementa el stock real
              },
              ...product
            });
          }
        } catch (error) {
          console.error(`Error al procesar el producto ${item.productId}:`, error);
          try {
            await removeFromCartAPI(item.productId._id, token);
            console.log(`Producto problemático ${item.productId._id} eliminado del carrito`);
          } catch (removeError) {
            console.error(`Error al eliminar producto problemático ${item.productId._id}:`, removeError);
          }
        }
      }
      
      if (serverCartItems.length > 0) {
        setCartItems(serverCartItems);
        localStorage.setItem('cart', JSON.stringify(serverCartItems));
        toast.success('Se ha cargado tu carrito guardado');
      } else if (serverCartResponse.cart.products.length > 0) {
        await clearCartAPI(token);
        toast.error('Hubo un problema con los productos en tu carrito y ha sido limpiado');
      }
    };

    fetchCartFromAPI();
  }, [isAuthenticated, token]);

  // Efecto para limpiar el estado del carrito cuando el usuario cierra sesión
  useEffect(() => {
    if (!isAuthenticated) {
      // Si el usuario no está autenticado, nos aseguramos que el estado del carrito
      // refleja solo lo que hay en localStorage (que se limpia en el logout del AuthContext)
      const savedCart = localStorage.getItem('cart');
      setCartItems(savedCart ? JSON.parse(savedCart) : []);
    }
  }, [isAuthenticated]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (shippingInfo) {
      localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
    }
  }, [shippingInfo]);

  useEffect(() => {
    if (paymentInfo) {
      localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
    }
  }, [paymentInfo]);

  const validateStock = (product, requestedQuantity) => {
    if (requestedQuantity > product.inventario.stockUnidades) {
      toast.error(`Solo hay ${product.inventario.stockUnidades} unidades disponibles de ${product.nombre}`);
      return false;
    }
    return true;
  };

  const addToCart = async (product) => {
    try {
      const existingItem = cartItems.find(item => item._id === product._id);
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

      if (!validateStock(product, newQuantity)) {
        return;
      }
      
      // Update local state immediately for better UX
      setCartItems(curr => {
        if (existingItem) {
          return curr.map(item =>
            item._id === product._id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }
        return [...curr, { ...product, quantity: 1 }];
      });
      
      // If authenticated, sync with server
      if (isAuthenticated && token) {
        try {
          // Verificar si el producto ya existe en el carrito del servidor
          let serverCart;
          try {
            serverCart = await getCart(token);
          } catch (error) {
            console.log("No se pudo obtener el carrito del servidor:", error);
            serverCart = { cart: { products: [] } };
          }
          
          // Buscar si el producto ya existe en el carrito del servidor
          const existingServerItem = serverCart?.cart?.products?.find(item => 
            item.productId?._id === product._id || item.productId === product._id
          );
          
          // Si el producto ya existe en el servidor, primero lo eliminamos para evitar duplicados
          if (existingServerItem) {
            try {
              await removeFromCartAPI(product._id, token);
            } catch (error) {
              console.error("Error al eliminar producto existente:", error);
            }
          }
          
          // Agregar el producto con la nueva cantidad
          const response = await addToCartAPI({
            productId: product._id,
            quantity: newQuantity
          }, token);

          if (!response.success) {
            throw new Error(response.msg || 'Error al agregar al carrito');
          }
          
        } catch (error) {
          // Revert local state if API call fails
          setCartItems(curr => curr.filter(item => item._id !== product._id));
          console.error("Error al sincronizar con el servidor:", error);
          toast.error(error.msg || 'Error al sincronizar con el servidor');
          return;
        }
      }
      
      setIsCartOpen(true);
      toast.success('Producto agregado al carrito');
    } catch (error) {
      toast.error('Error al agregar al carrito');
      console.error('Error in addToCart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      // Store the item before removing it (for potential rollback)
      const itemToRemove = cartItems.find(item => item._id === productId);
      
      // Update local state immediately
      setCartItems(curr => curr.filter(item => item._id !== productId));
      
      // If authenticated, sync with server
      if (isAuthenticated && token && itemToRemove) {
        try {
          await removeFromCartAPI(productId, token);
        } catch (error) {
          // Si el error es 400, puede ser un problema con el carrito, pero ya eliminamos el item localmente
          // así que no revertimos el estado local a menos que sea un error diferente
          if (error?.response?.status !== 400) {
            // Revert local state if API call fails
            setCartItems(curr => [...curr, itemToRemove]);
            toast.error('Error al eliminar del carrito');
          }
          console.error('Error removing from cart:', error);
        }
      }
    } catch (error) {
      toast.error('Error al eliminar del carrito');
      console.error('Error in removeFromCart:', error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity < 1) {
        removeFromCart(productId);
        return;
      }
      
      // Store current item state for potential rollback
      const currentItem = cartItems.find(item => item._id === productId);
      if (!currentItem) return;
      
      if (!validateStock(currentItem, quantity)) {
        return;
      }
      
      // Update local state immediately
      setCartItems(curr => curr.map(item =>
        item._id === productId ? { ...item, quantity } : item
      ));
      
      // If authenticated, sync with server
      if (isAuthenticated && token) {
        try {
          // Verificar si el producto ya existe en el carrito del servidor
          let serverCart;
          try {
            serverCart = await getCart(token);
          } catch (error) {
            console.log("No se pudo obtener el carrito del servidor:", error);
            serverCart = { cart: { products: [] } };
          }
          
          // Buscar si el producto ya existe en el carrito del servidor
          const existingServerItem = serverCart?.cart?.products?.find(item => 
            item.productId._id === productId
          );
          
          // Si el producto ya existe en el servidor, primero lo eliminamos para evitar duplicados
          if (existingServerItem) {
            try {
              await removeFromCartAPI(productId, token);
            } catch (removeError) {
              console.error("Error al eliminar producto existente durante actualización:", removeError);
            }
          }
          
          // Ahora agregamos el producto con la cantidad actualizada
          await addToCartAPI({ 
            productId: productId,
            quantity: quantity 
          }, token);
        } catch (error) {
          // Revert local state if API call fails
          setCartItems(curr => curr.map(item =>
            item._id === productId ? { ...currentItem } : item
          ));
          toast.error('Error al actualizar cantidad');
          console.error('Error updating quantity:', error);
        }
      }
    } catch (error) {
      toast.error('Error al actualizar cantidad');
      console.error('Error in updateQuantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      // Store current cart for potential rollback
      const currentCart = [...cartItems];
      
      // Clear local state immediately
      setCartItems([]);
      
      // Clear localStorage
      localStorage.removeItem('cart');
      localStorage.removeItem('shippingInfo');
      localStorage.removeItem('paymentInfo');
      
      // If authenticated, sync with server
      if (isAuthenticated && token) {
        try {
          await clearCartAPI(token);
        } catch (error) {
          // Revert local state if API call fails
          setCartItems(currentCart);
          toast.error('Error al vaciar el carrito');
          console.error('Error clearing cart:', error);
        }
      }
    } catch (error) {
      toast.error('Error al vaciar el carrito');
      console.error('Error in clearCart:', error);
    }
  };

  const saveShippingInfo = (info) => {
    setShippingInfo(info);
  };

  const savePaymentInfo = (info) => {
    setPaymentInfo(info);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.precioFinal * item.quantity,
    0
  );

  const cartCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  const getCartTotal = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = shippingInfo?.method === 'express' ? 99 : 0;
    return subtotal + shipping;
  };

  const validateCartStock = () => {
    let isValid = true;
    cartItems.forEach(item => {
      if (item.quantity > item.inventario.stockUnidades) {
        toast.error(`No hay suficiente stock de ${item.nombre}. Stock disponible: ${item.inventario.stockUnidades}`);
        isValid = false;
      }
    });
    return isValid;
  };

  // Funciones de cálculo compartidas para el resumen de orden
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.precioFinal * item.quantity), 0);
  };
  
  const calculateTax = (subtotal) => {
    return subtotal * 0.16; // 16% de impuesto
  };
  
  const calculateTotalWeight = () => {
    return cartItems.reduce((total, item) => {
      const peso = item.opcionesPeso?.pesoPromedio || 0;
      return total + (peso * item.quantity);
    }, 0);
  };
  
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
  
  const getOrderSummary = (selectedPaymentMethod, includeVAT = false) => {
    const subtotal = calculateSubtotal();
    const tax = includeVAT ? calculateTax(subtotal) : 0; // Solo aplicar impuestos si se solicita explícitamente
    
    // Asegurarse de que el costo de envío sea un número
    let shipping = 0;
    if (shippingInfo?.baseCost) {
        shipping = parseFloat(shippingInfo.baseCost);
    }
    
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
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen,
      shippingInfo,
      saveShippingInfo,
      paymentInfo,
      savePaymentInfo,
      getCartTotal,
      validateCartStock,
      isLoading,
      calculateSubtotal,
      calculateTax,
      calculateShippingCost,
      calculateTotalWeight,
      getOrderSummary
    }}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};