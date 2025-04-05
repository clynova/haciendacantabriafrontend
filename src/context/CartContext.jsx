import { createContext, useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { addToCart as addToCartAPI, removeFromCart as removeFromCartAPI, 
         getCart, syncCart, clearCart as clearCartAPI, removeProductFromCart, updateProductQuantity } from '../services/paymentService';
import { getProductById } from '../services/productService';

// Crear el contexto
const CartContext = createContext();

// Hook personalizado para usar el contexto
export const useCart = () => useContext(CartContext);

// Componente provider
function CartProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  // 1. Inicializar el carrito vacío por defecto. Se poblará desde la API.
  const [cartItems, setCartItems] = useState([]); 

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Mapa para rastrear operaciones en curso por ID de producto
  const pendingOperations = useRef(new Map());

  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);

  // Listener para eventos de storage (cuando el AuthContext actualiza el carrito)
  // Este listener puede ser problemático si otras pestañas modifican localStorage 
  // sin sincronizar con el backend. Considerar si es realmente necesario o si
  // la sincronización en carga/autenticación es suficiente.
  // Por ahora, lo mantenemos pero la lógica principal estará en fetchCartFromAPI.
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'cart' || event.type === 'storage') {
        try {
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            const newCart = JSON.parse(savedCart);
            setCartItems(newCart);
          }
        } catch (error) {
          console.error('Error handling storage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Effect to load/sync cart from API when user is authenticated or auth state changes
  useEffect(() => {
    const fetchCartFromAPI = async () => {
      // 2. Limpiar el estado local antes de cualquier operación de carga/sincronización
      //    Esto evita mostrar datos potencialmente obsoletos de localStorage brevemente.
      // setCartItems([]); // Movido dentro del bloque if/else para evitar limpieza innecesaria
      
      if (isAuthenticated && token) {
        setIsLoading(true);
        setCartItems([]); // Limpiar al inicio de la carga autenticada
        localStorage.removeItem('cart'); // También limpiar localStorage al inicio
        
        try {
          let serverCartResponse;
          try {
            // 3. Priorizar obtener el carrito del servidor
            serverCartResponse = await getCart(token);
          } catch (error) {
            // Si getCart falla (ej. 404 Not Found, que puede ser normal si es carrito nuevo)
            console.log('No se pudo obtener el carrito del servidor (puede ser nuevo): ', error.response?.data || error.message);
            // Asumimos carrito vacío en el servidor si hay error al obtener
            serverCartResponse = { cart: { products: [] } }; 
          }

          // Intentar sincronizar el carrito local si el servidor está vacío
          const storedCart = localStorage.getItem('cart_temp_sync'); // Usar una clave temporal para evitar conflictos
          const localCartToSync = storedCart ? JSON.parse(storedCart) : [];
          localStorage.removeItem('cart_temp_sync'); // Limpiar la clave temporal

          // Si el servidor tiene productos, usar esos.
          if (serverCartResponse?.cart?.products && serverCartResponse.cart.products.length > 0) {
            console.log("Cargando carrito desde el servidor.");
            await loadServerCart(serverCartResponse);
          } 
          // Si el servidor está vacío PERO teníamos algo en local (clave temporal) para sincronizar
          else if (localCartToSync.length > 0) {
            console.log("Servidor vacío, intentando sincronizar carrito local previo.");
            try {
              const syncResponse = await syncCart(localCartToSync, token);
              if (syncResponse?.success && syncResponse?.cart?.products) {
                console.log("Sincronización exitosa, cargando carrito sincronizado.");
                await loadServerCart({ cart: { products: syncResponse.cart.products } });
              } else {
                // Si syncCart falla o no devuelve productos, el carrito queda vacío (ya limpiado antes)
                console.warn("La sincronización del carrito local no fue exitosa o devolvió vacío.");
                setCartItems([]); // Asegurar que esté vacío
                localStorage.removeItem('cart'); // Asegurar limpieza de localStorage final
              }
            } catch(syncError) {
               console.error('Error durante syncCart:', syncError);
               toast.error('Error al sincronizar tu carrito anterior. Se iniciará un carrito vacío.');
               setCartItems([]);
               localStorage.removeItem('cart');
            }
          } 
          // Si el servidor está vacío y no había nada local para sincronizar, el carrito simplemente está vacío.
          else {
            console.log("Carrito del servidor y local (para sincronizar) están vacíos.");
            setCartItems([]); // Asegurar que esté vacío
            localStorage.removeItem('cart'); // Asegurar limpieza de localStorage
          }

        } catch (error) {
          // Error general en el proceso (inesperado, no el fallo de getCart manejado antes)
          console.error('Error general en fetchCartFromAPI:', error);
          toast.error('Hubo un problema al cargar tu carrito. Intenta recargar la página.');
          // 4. NO recargar desde localStorage en caso de error. Mantener vacío.
          setCartItems([]);
          localStorage.removeItem('cart');
        } finally {
          setIsLoading(false);
        }
      } else {
        // 5. Usuario no autenticado: Limpiar carrito local y estado
        console.log("Usuario no autenticado, limpiando carrito local.");
        // Guardar carrito actual en una clave temporal por si inicia sesión inmediatamente
        const currentCart = localStorage.getItem('cart');
        if (currentCart) {
          localStorage.setItem('cart_temp_sync', currentCart);
        }
        setCartItems([]);
        localStorage.removeItem('cart'); // Limpiar la clave principal
        setIsLoading(false);
      }
    };

    fetchCartFromAPI();
    // Las dependencias son correctas: se ejecuta cuando cambia el estado de autenticación/token.
  }, [isAuthenticated, token]);

  // Helper function to construct a cart item from backend item and product data
  const constructCartItem = (backendItem, productData) => {
    const baseProductId = productData._id;

    // Basic structure from product data
    const cartItem = {
      _id: baseProductId, // Use the actual product ID
      productId: baseProductId, // Keep reference to base product ID string
      nombre: productData.nombre,
      slug: productData.slug,
      multimedia: productData.multimedia || { imagenes: [] },
      // Get quantity from the backend cart item
      quantity: backendItem.quantity || 1,
      // Include all product data for potential use in UI
      ...productData,
      // Explicitly set price later based on variant or base product
      precioFinal: productData.precioFinal, // Default to product's final price
      precioTransferencia: productData.precioTransferencia, // Default
    };

    // 3. Handle Variant - Prioritize backendItem.variant object
    if (backendItem.variant && (backendItem.variant.pesoId || backendItem.variant._id)) { // Check for variant object and its ID
      const variantData = backendItem.variant;
      const variantId = variantData.pesoId || variantData._id; // Use available ID field

      // Find the full variant details within productData.opcionesPeso to ensure consistency
      const fullVariantDetails = productData.opcionesPeso?.pesosEstandar?.find(
          opt => opt._id === variantId || opt.pesoId === variantId // Match by _id or pesoId
      );

      if (fullVariantDetails) {
        cartItem.selectedWeightOption = { // Store selected variant info consistently
           pesoId: fullVariantDetails._id || fullVariantDetails.pesoId, // Use the definitive ID
           peso: fullVariantDetails.peso,
           unidad: fullVariantDetails.unidad,
           precio: fullVariantDetails.precio,
           stockDisponible: fullVariantDetails.stockDisponible, // Important for stock checks later
           sku: fullVariantDetails.sku,
        };
         // Override price with variant price
        cartItem.precioFinal = fullVariantDetails.precio;
        // Store the ID used for lookup
        cartItem.variantId = variantId;

      } else {
          // Fallback if full details not found in productData (should be rare if data is consistent)
           console.warn(`Variant details for ID ${variantId} not found in productData for ${productData.nombre}. Using basic info from cart item.`);
           cartItem.selectedWeightOption = { // Use data directly from backendItem.variant
              pesoId: variantId,
              peso: variantData.peso,
              unidad: variantData.unidad,
              precio: variantData.precio,
              sku: variantData.sku,
              stockDisponible: undefined // Mark stock as unknown
           };
           cartItem.precioFinal = variantData.precio; // Use price from backendItem.variant
           cartItem.variantId = variantId;
      }
    } else {
      // Ensure selectedWeightOption is null if no variant in backend item
      cartItem.selectedWeightOption = null;
      cartItem.variantId = null;
    }

    // Stock validation is removed from here. Handle separately.

    return cartItem;
  };

  // Helper para cargar y procesar el carrito desde la respuesta de la API
  const loadServerCart = async (serverCartResponse) => {
    setIsLoading(true);
    try {
      const serverCartItems = [];
      const productDetailPromises = []; // To fetch details if needed (fallback)

      for (const item of serverCartResponse.cart.products) {
        let productData;
        let baseProductId; // The actual ID string

        // 1. Get Product Data and ID
        if (typeof item.productId === 'object' && item.productId._id) {
          productData = item.productId; // Backend provides populated product
          baseProductId = item.productId._id;
        } else if (typeof item.productId === 'string') {
          baseProductId = item.productId;
          // Need to fetch details - add to promises
          productDetailPromises.push(
            getProductById(baseProductId).then(res => {
              if (res?.success && res?.product) {
                return { id: baseProductId, data: res.product };
              }
              console.error(`Failed to fetch details for product ${baseProductId}`);
              return { id: baseProductId, data: null }; // Handle fetch failure
            })
          );
          productData = null; // Mark as needing fetch
        } else {
          console.warn('Item with invalid productId format found in cart:', item);
          continue; // Skip this item
        }

        // If productData is already available (populated from backend)
        if (productData) {
          // 2. Construct Cart Item using helper
          const constructedItem = constructCartItem(item, productData);
          if (constructedItem) {
            serverCartItems.push(constructedItem);
          }
        }
        // Otherwise, we'll handle it after fetching details
      }

      // Fetch details for products that only had IDs
      if (productDetailPromises.length > 0) {
          const fetchedDetails = await Promise.all(productDetailPromises);
          const productDataMap = new Map(fetchedDetails.map(p => [p.id, p.data]));

          // Re-iterate over original items to find those needing fetched data
          for (const item of serverCartResponse.cart.products) {
              let baseProductId;
              if (typeof item.productId === 'string') {
                 baseProductId = item.productId;
                 const fetchedData = productDataMap.get(baseProductId);
                 if (fetchedData) {
                    const constructedItem = constructCartItem(item, fetchedData);
                    if (constructedItem) {
                        serverCartItems.push(constructedItem);
                    }
                 } else {
                      console.warn(`Skipping item ${baseProductId} due to failed detail fetch.`);
                 }
              } else if (typeof item.productId === 'object' && item.productId._id) {
                 // Already processed if productData was available initially
              } else {
                 // Already warned about invalid format
              }
          }
      }

      // Stock validation removed from load. Handle elsewhere.

      setCartItems(serverCartItems);
      localStorage.setItem('cart', JSON.stringify(serverCartItems));
      return true; // Indicate success

    } catch (error) {
      console.error("Error procesando el carrito del servidor:", error);
      toast.error("Error al cargar los productos del carrito desde el servidor.");
      // Si hay error procesando, mejor limpiar para evitar estado inconsistente
      setCartItems([]);
      localStorage.removeItem('cart');
      return false; // Indicate failure
    } finally {
      setIsLoading(false);
    }
  };

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
    if (!isLoading) { // Solo guardar si no estamos en medio de una carga/sincronización API
      try {
        // No guardar un array vacío si isAuthenticated es falso (ya se limpió)
        // O si el array está vacío y estamos autenticados (podría ser el estado final después de sync)
        if ((isAuthenticated && cartItems.length >= 0) || (!isAuthenticated && cartItems.length > 0)) {
             if (cartItems.length > 0) {
               localStorage.setItem('cart', JSON.stringify(cartItems));
             } else {
               // Si el carrito está vacío, nos aseguramos de removerlo de localStorage
               localStorage.removeItem('cart');
             }
        }
         // Si no estamos autenticados y cartItems está vacío, no hacemos nada (ya se limpió antes)

      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cartItems, isLoading, isAuthenticated]); // Depender también de isLoading y isAuthenticated

  const validateStock = (product, requestedQuantity) => {
    // Verificar stock según el formato del producto
    if (product.variant && product.productId && product.productId.opcionesPeso) {
      // Formato nuevo - buscar la variante en las opciones de peso
      const variantStock = product.productId.opcionesPeso.pesosEstandar?.find(
        opt => opt.peso === product.variant.peso && opt.unidad === product.variant.unidad
      )?.stockDisponible;
      
      if (variantStock !== undefined && requestedQuantity > variantStock) {
        toast.error(
          `Solo hay ${variantStock} unidades disponibles de ${product.productId.nombre} (${product.variant.peso}${product.variant.unidad})`
        );
        return false;
      }
      
      return true;
    } 
    // Formato transitorio con selectedWeightOption
    else if (product.selectedWeightOption) {
      const stockDisponible = product.selectedWeightOption.stockDisponible;
      
      if (stockDisponible !== undefined && requestedQuantity > stockDisponible) {
        toast.error(
          `Solo hay ${stockDisponible} unidades disponibles de ${product.nombre} (${product.selectedWeightOption.peso}${product.selectedWeightOption.unidad})`
        );
        return false;
      }
      
      return true;
    }
    // Formato antiguo con opcionesPeso.pesosEstandar
    else if (product.opcionesPeso?.pesosEstandar?.length > 0) {
      // Sumar el stock total de todas las variantes
      const totalStock = product.opcionesPeso.pesosEstandar.reduce(
        (sum, option) => sum + (option.stockDisponible || 0), 0
      );
      
      if (totalStock !== undefined && requestedQuantity > totalStock) {
        toast.error(`Solo hay ${totalStock} unidades disponibles de ${product.nombre}`);
        return false;
      }
      
      return true;
    }
    // Formato antiguo con inventario
    else if (product.inventario) {
      const stockUnidades = product.inventario.stockUnidades !== undefined
        ? product.inventario.stockUnidades
        : (product.inventario.stock || 250);
      
      if (requestedQuantity > stockUnidades) {
        toast.error(`Solo hay ${stockUnidades} unidades disponibles de ${product.nombre}`);
        return false;
      }
      
      return true;
    }
    
    // Fallback seguro
    return true;
  };

  const addToCart = async (product, showNotification = true) => {
    // Obtener el ID del producto
    const productId = product.productId?._id || product._id;
    
    // CORREGIDO: Obtener correctamente el ID de la variante
    const variantId = product.variant?.pesoId || 
                     product.selectedWeightOption?._id || // Ahora usa _id directamente
                     null;
    
    // Verificar si ya existe una operación pendiente para este producto+variante
    const operationKey = variantId ? `${productId}-${variantId}` : productId;
    
    if (pendingOperations.current.has(operationKey)) {
      console.log(`Operación en curso para el producto ${operationKey}, ignorando clic adicional`);
      return;
    }

    // Marcar que hay una operación en curso para este producto+variante
    pendingOperations.current.set(operationKey, true);
    
    try {
      // Determinar si el producto ya existe en el carrito (considerando variantes)
      let existingItem;
      
      if (variantId) {
        // Buscar por producto y variante específica - CORREGIDO
        existingItem = cartItems.find(item => {
          const itemProductId = item.productId?._id || item._id;
          const itemVariantId = item.variant?.pesoId || 
                               item.selectedWeightOption?._id; // Actualizado para usar _id
          return itemProductId === productId && itemVariantId === variantId;
        });
      } else {
        // Buscar solo por ID de producto (formato antiguo)
        existingItem = cartItems.find(item => (item.productId?._id || item._id) === productId);
      }
      
      // Calcular la nueva cantidad
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

      // Validar el stock disponible
      if (!validateStock(product, newQuantity)) {
        pendingOperations.current.delete(operationKey);
        return;
      }
      
      // Actualizar el estado local inmediatamente para mejor UX
      setCartItems(curr => {
        // Primero convertimos el array a un objeto para facilitar la deduplicación
        const uniqueItems = {};
        
        // Añadimos todos los items existentes al objeto (excepto el que estamos modificando)
        curr.forEach(item => {
          const itemProductId = item.productId?._id || item._id;
          const itemVariantId = item.variant?.pesoId || 
                               item.selectedWeightOption?._id; // Actualizado para usar _id
          
          const itemKey = itemVariantId ? `${itemProductId}-${itemVariantId}` : itemProductId;
          
          // Solo guardamos el item si no es el que estamos actualizando
          if (itemKey !== operationKey) {
            uniqueItems[itemKey] = item;
          }
        });
        
        // Agregamos el item actualizado o nuevo
        if (existingItem) {
          uniqueItems[operationKey] = { ...existingItem, quantity: newQuantity };
        } else {
          // Agregar nuevo item, asegurando que tiene todas las propiedades necesarias
          let newItem;
          
          if (product.variant && product.productId) {
            // Formato nuevo con variant y productId
            newItem = { ...product, quantity: 1 };
          } else {
            // Formato antiguo o transitorio
            newItem = {
              ...product,
              quantity: 1,
              multimedia: product.multimedia || { imagenes: [] }
            };
          }
          
          uniqueItems[operationKey] = newItem;
        }
        
        // Convertimos el objeto de vuelta a un array
        return Object.values(uniqueItems);
      });
      
      // Si el usuario está autenticado, sincronizar con el servidor
      if (isAuthenticated && token) {
        try {
          // Preparar datos para la API
          const apiData = {
            productId: productId, // ID del producto base
            quantity: newQuantity, // Nueva cantidad
            variantId: variantId // Incluir siempre, será null si no hay variante
          };
          
          // Antes de agregar, eliminar el producto existente para evitar duplicados
          if (existingItem) {
            try {
              await removeFromCart(productId, variantId, token) ;
            } catch (error) {
              console.error("Error al eliminar producto existente:", error);
            }
          }
          
          // Agregar el producto
          const response = await addToCartAPI(apiData, token);

          if (!response.success) {
            throw new Error(response.msg || 'Error al agregar al carrito');
          }
          
        } catch (error) {
          // Revertir el estado local si la llamada a la API falla
          setCartItems(curr => curr.filter(item => {
            if (variantId) {
              const itemProductId = item.productId?._id || item._id;
              const itemVariantId = item.variant?.pesoId || 
                                   item.selectedWeightOption?._id; // Actualizado para usar _id
              
              return !(itemProductId === productId && itemVariantId === variantId);
            }
            return (item.productId?._id || item._id) !== productId;
          }));
          
          console.error("Error al sincronizar con el servidor:", error);
          toast.error(error.msg || 'Error al sincronizar con el servidor');
          pendingOperations.current.delete(operationKey);
          return;
        }
      }
      
      // Mostrar el carrito
      setIsCartOpen(true);
      
      // Mostrar notificación de éxito
      if (showNotification) {
        // Personalizar el mensaje según la variante
        if (product.variant) {
          toast.success(`${product.productId.nombre} (${product.variant.peso}${product.variant.unidad}) agregado al carrito`);
        } else if (product.selectedWeightOption) {
          toast.success(`${product.nombre} (${product.selectedWeightOption.peso}${product.selectedWeightOption.unidad}) agregado al carrito`);
        } else {
          toast.success('Producto agregado al carrito');
        }
      }
      
    } catch (error) {
      toast.error('Error al agregar al carrito');
      console.error('Error in addToCart:', error);
    } finally {
      // Siempre liberar el bloqueo al finalizar
      pendingOperations.current.delete(operationKey);
    }
  };

  const removeFromCart = async (productId, variantId = null) => {
    try {
      // Clave de operación para bloquear acciones duplicadas
      const operationKey = variantId ? `${productId}-${variantId}` : productId;
      
      // Si ya hay una operación en curso para este producto, ignorar
      if (pendingOperations.current.has(operationKey)) {
        console.log(`Operación en curso para el producto ${operationKey}, ignorando solicitud adicional`);
        return;
      }
      
      // Marcar operación como pendiente
      pendingOperations.current.set(operationKey, true);
      
      try {
        // Store the item before removing it (for potential rollback)
        const itemToRemove = variantId 
          ? cartItems.find(item => {
              const itemProductId = item.productId?._id || item._id;
              const itemVariantId = item.variant?.pesoId || item.variantId ||
                                 (item.selectedWeightOption && item.selectedWeightOption._id);
              return itemProductId === productId && itemVariantId === variantId;
            })
          : cartItems.find(item => (item.productId?._id || item._id) === productId);
        
        if (!itemToRemove) {
          console.warn(`Producto ${productId} ${variantId ? `con variante ${variantId}` : ''} no encontrado en el carrito local`);
          pendingOperations.current.delete(operationKey);
          return;
        }
        
        // Actualizar el estado local inmediatamente para mejor UX
        setCartItems(curr => {
          if (variantId) {
            // Eliminar variante específica del producto
            return curr.filter(item => {
              const itemProductId = item.productId?._id || item._id;
              const itemVariantId = item.variant?.pesoId || 
                                 (item.selectedWeightOption && item.selectedWeightOption._id);
              return !(itemProductId === productId && itemVariantId === variantId);
            });
          }
          // Eliminar por ID de producto
          return curr.filter(item => (item.productId?._id || item._id) !== productId);
        });
        
        // Si está autenticado, sincronizar con el servidor
        if (isAuthenticated && token) {
          try {
            console.log("Eliminando producto del carrito en el servidor:", productId, variantId ? `con variante ${variantId}` : '');
            
            // Usar la API removeFromCartAPI (la función interna)
            const response = await removeFromCartAPI(productId, variantId, token) ;
            
            if (!response.success && response.msg !== "No hay producto para eliminar o ya está vacío") {
              // Si la eliminación falla y no es porque el producto ya no existe
              throw new Error(response.msg || 'Error al eliminar del carrito');
            }
            
            // IMPORTANTE: Obtener el carrito actualizado desde el servidor
            const updatedCartResponse = await getCart(token);
            
            if (updatedCartResponse?.success && updatedCartResponse?.cart) {
              // Procesar el carrito actualizado utilizando la función loadServerCart
              await loadServerCart(updatedCartResponse);
              toast.success('Producto eliminado del carrito');
            } else {
              console.warn('No se pudo obtener el carrito actualizado desde el servidor');
              toast.success('Producto eliminado del carrito');
            }
          } catch (error) {
            // Si el error es 400, puede ser un problema con el carrito, pero ya eliminamos el item localmente
            if (error?.response?.status !== 400) {
              // Revertir estado local si la API falla
              setCartItems(curr => [...curr, itemToRemove]);
              toast.error('Error al eliminar el producto del carrito');
              console.error('Error al eliminar del carrito:', error);
            }
          }
        } else {
          // Si no está autenticado, actualizar localStorage
          localStorage.setItem('cart', JSON.stringify(cartItems.filter(item => {
            if (variantId) {
              const itemProductId = item.productId?._id || item._id;
              const itemVariantId = item.variant?.pesoId || 
                                 (item.selectedWeightOption && item.selectedWeightOption._id);
              return !(itemProductId === productId && itemVariantId === variantId);
            }
            return (item.productId?._id || item._id) !== productId;
          })));
          toast.success('Producto eliminado del carrito');
        }
      } finally {
        // Asegurar que siempre se libere el bloqueo de operación pendiente
        setTimeout(() => {
          pendingOperations.current.delete(operationKey);
        }, 300); // Pequeño retraso para prevenir acciones muy rápidas
      }
    } catch (error) {
      toast.error('Error al eliminar el producto del carrito');
      console.error('Error en removeFromCart:', error);
    }
  };

  //updateProductQuantity 
  const updateQuantity = async (productId, quantity, variantId = null) => {
    try {
      if (quantity < 1) {
        removeFromCart(productId, variantId);
        return;
      }
      
      // Clave de operación considerando variante
      const operationKey = variantId ? `${productId}-${variantId}` : productId;
      
      // Buscar el ítem considerando variantes
      const currentItem = variantId
        ? cartItems.find(item => {
            const itemProductId = item.productId?._id || item._id;
            const itemVariantId = item.variant?.pesoId || item.selectedWeightOption?._id;
            return itemProductId === productId && itemVariantId === variantId;
          })
        : cartItems.find(item => (item.productId?._id || item._id) === productId);
      
      if (!currentItem) return;
      
      // Validar stock disponible
      if (!validateStock(currentItem, quantity)) {
        return;
      }
      
      // Actualizar estado local inmediatamente
      setCartItems(curr => curr.map(item => {
        if (variantId) {
          // Comparar por producto+variante
          const itemProductId = item.productId?._id || item._id;
          const itemVariantId = item.variant?.pesoId || item.selectedWeightOption?._id;
          
          if (itemProductId === productId && itemVariantId === variantId) {
            return { ...item, quantity };
          }
        } else if ((item.productId?._id || item._id) === productId) {
          // Comparar solo por producto
          return { ...item, quantity };
        }
        return item;
      }));
      
      // Si está autenticado, sincronizar con el servidor
      if (isAuthenticated && token) {
        try {
          // Preparar datos para la API
          const apiData = {
            productId,
            quantity
          };
          
          // Agregar variantId si existe
          if (variantId) {
            apiData.variantId = variantId;
          }
          
          // Eliminar primero para evitar duplicados
          await removeFromCart(productId, token, variantId);
          
          // Agregar con la nueva cantidad
          await addToCartAPI(apiData, token);
        } catch (error) {
          // Revertir estado local si falla
          setCartItems(curr => curr.map(item => {
            if (variantId) {
              const itemProductId = item.productId?._id || item._id;
              const itemVariantId = item.variant?.pesoId || item.selectedWeightOption?._id;
              
              if (itemProductId === productId && itemVariantId === variantId) {
                return { ...currentItem };
              }
            } else if ((item.productId?._id || item._id) === productId) {
              return { ...currentItem };
            }
            return item;
          }));
          
          toast.error('Error al actualizar cantidad');
          console.error('Error updating quantity:', error);
        }
      }
    } catch (error) {
      toast.error('Error al actualizar cantidad');
      console.error('Error in updateQuantity:', error);
    }
  };

  // Nueva función para incrementar/decrementar la cantidad utilizando updateProductQuantity
  const updateItemQuantityAction = async (productId, variantId, quantity, action = 'increment') => {
    try {
      // Si no está autenticado, no podemos usar la API, usamos la función local updateQuantity
      if (!isAuthenticated || !token) {
        const currentItem = variantId
          ? cartItems.find(item => {
              const itemProductId = item.productId?._id || item._id;
              const itemVariantId = item.variant?.pesoId || item.selectedWeightOption?._id;
              return itemProductId === productId && itemVariantId === variantId;
            })
          : cartItems.find(item => (item.productId?._id || item._id) === productId);
        
        if (!currentItem) return;
        
        // Calcular la nueva cantidad según la acción
        const newQuantity = action === 'increment' 
          ? (currentItem.quantity || 0) + quantity
          : Math.max(1, (currentItem.quantity || 0) - quantity);
        
        // Usar la función updateQuantity existente
        await updateQuantity(productId, newQuantity, variantId);
        return;
      }
      
      // Clave de operación para bloquear acciones duplicadas
      const operationKey = variantId ? `${productId}-${variantId}` : productId;
      
      // Si ya hay una operación en curso para este producto, ignorar
      if (pendingOperations.current.has(operationKey)) {
        console.log(`Operación en curso para el producto ${operationKey}, ignorando solicitud adicional`);
        return;
      }
      
      // Marcar operación como pendiente
      pendingOperations.current.set(operationKey, true);
      
      try {
        // Si está autenticado, usar la API updateProductQuantity
        const response = await updateProductQuantity(productId, variantId, quantity, action, token);
        
        if (!response.success) {
          throw new Error(response.msg || 'Error al actualizar la cantidad del producto');
        }
        
        // SOLUCIÓN: Obtener el carrito actualizado desde el servidor
        const updatedCartResponse = await getCart(token);
        
        if (updatedCartResponse?.success && updatedCartResponse?.cart) {
          // Procesar el carrito actualizado utilizando la función loadServerCart que ya existe
          await loadServerCart(updatedCartResponse);
          
          // Notificar al usuario que la cantidad ha sido actualizada correctamente
          toast.success('Cantidad actualizada correctamente');
        } else {
          // Si no se pudo obtener el carrito actualizado, hacemos una actualización local aproximada
          // pero solo como fallback en caso de error de red
          console.warn('No se pudo obtener el carrito actualizado desde el servidor, utilizando actualización local como fallback');
          
          setCartItems(curr => curr.map(item => {
            const itemProductId = item.productId?._id || item._id;
            const itemVariantId = item.variant?.pesoId || item.selectedWeightOption?._id;
            
            if ((variantId && itemProductId === productId && itemVariantId === variantId) || 
                (!variantId && itemProductId === productId)) {
              // Calcular la nueva cantidad según la acción y respuesta del servidor
              const newQuantity = action === 'increment' 
                ? (item.quantity || 0) + quantity
                : Math.max(1, (item.quantity || 0) - quantity);
              
              return { ...item, quantity: newQuantity };
            }
            return item;
          }));
        }
      } finally {
        // Asegurar que siempre se libere el bloqueo de operación pendiente
        setTimeout(() => {
          pendingOperations.current.delete(operationKey);
        }, 300); // Pequeño retraso para prevenir acciones muy rápidas
      }
    } catch (error) {
      console.error('Error en updateItemQuantityAction:', error);
      toast.error('Error al actualizar la cantidad del producto');
    }
  };

  const clearCart = async () => {
    const currentCart = [...cartItems]; // Copia por si la llamada API falla
    setCartItems([]);
    localStorage.removeItem('cart'); // Limpiar local inmediatamente

    if (isAuthenticated && token) {
      setIsLoading(true);
      try {
        await clearCartAPI(token);
        toast.success('Carrito vaciado con éxito');
      } catch (error) {
        console.error('Error al vaciar el carrito en el servidor:', error);
        toast.error('Error al vaciar el carrito en el servidor. Revisa tu conexión.');
        // Restaurar el carrito local si falla la API?
        // setCartItems(currentCart);
        // localStorage.setItem('cart', JSON.stringify(currentCart));
        // O mantenerlo vacío localmente y que el usuario reintente?
        // Por ahora, mantenemos vacío localmente para consistencia con la acción del usuario.
      } finally {
        setIsLoading(false);
      }
    } else {
      // Si no está autenticado, la limpieza local ya se hizo.
      toast.success('Carrito vaciado');
    }
  };

  const saveShippingInfo = (info) => {
    setShippingInfo(info);
  };

  const savePaymentInfo = (info) => {
    setPaymentInfo(info);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => {
      const price = item.variant ? item.variant.precio : item.precioFinal;
      return total + (price * (item.quantity || 0));
    },
    0
  );

  const cartCount = cartItems.reduce(
    (count, item) => count + (item.quantity || 0),
    0
  );

  const getCartTotal = () => {
    const subtotal = cartItems.reduce((total, item) => total + ((item.price || item.precioFinal || 0) * (item.quantity || 0)), 0);
    const shipping = shippingInfo?.method === 'express' ? 99 : 0;
    return subtotal + shipping;
  };

  const validateCartStock = () => {
    let isValid = true;
    cartItems.forEach(item => {
      // Check which stock structure to use
      if (item.selectedWeightOption) {
        // Use new stock structure with weight options
        const stockDisponible = item.selectedWeightOption.stockDisponible || 0;
        if ((item.quantity || 0) > stockDisponible) {
          toast.error(`No hay suficiente stock de ${item.nombre} (${item.selectedWeightOption.peso}${item.selectedWeightOption.unidad}). Stock disponible: ${stockDisponible}`);
          isValid = false;
        }
      } else if (item.opcionesPeso?.pesosEstandar) {
        // Use total stock across all weight options
        const totalStock = item.opcionesPeso.pesosEstandar.reduce(
          (sum, option) => sum + option.stockDisponible, 0
        );
        
        if ((item.quantity || 0) > totalStock) {
          toast.error(`No hay suficiente stock de ${item.nombre}. Stock disponible: ${totalStock}`);
          isValid = false;
        }
      } else {
        // Fallback to old structure
        const stockUnidades = item.inventario?.stockUnidades || 0;
        if ((item.quantity || 0) > stockUnidades) {
          toast.error(`No hay suficiente stock de ${item.nombre}. Stock disponible: ${stockUnidades}`);
          isValid = false;
        }
      }
    });
    return isValid;
  };

  // Funciones de cálculo compartidas para el resumen de orden
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + ((item.precioFinal || 0) * (item.quantity || 0)), 0);
  };
  
  const calculateTax = (subtotal) => {
    return subtotal * 0.16; // 16% de impuesto
  };
  
  const calculateTotalWeight = () => {
    return cartItems.reduce((total, item) => {
      // Get weight based on structure
      let peso = 0;
      if (item.selectedWeightOption) {
        peso = item.selectedWeightOption.peso || 0;
      } else if (item.opcionesPeso?.pesoPromedio) {
        peso = item.opcionesPeso.pesoPromedio || 0;
      }
      
      return total + (peso * (item.quantity || 0));
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
      updateItemQuantityAction,
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
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { CartContext, CartProvider };