import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';
import { logout as logoutService } from '../services/authService';
import { syncCart, getCart, replaceLocalCartWithServer } from '../services/paymentService';
import { getProductById } from '../services/productService';
import LoadingOverlay from '../components/Loading/LoadingOverlay';
import { toast } from 'react-hot-toast';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Componente provider
function AuthProvider({ children }) {
  // Enhanced fix: Ensure robust handling of invalid or undefined JSON
  const getParsedUser = () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      localStorage.removeItem('user'); // Clear invalid data
      return null;
    }
  };

  const [user, setUser] = useState(getParsedUser());
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const response = await api.get(`${import.meta.env.VITE_API_URL}/api/user/validate-token`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (error) {
          console.log(error)
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    validateToken();
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await api.post(`${import.meta.env.VITE_API_URL}/api/user/autenticar`, credentials);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      
      // Get local cart - Add safe parsing with null check
      const storedCart = localStorage.getItem('cart');
      const localCart = storedCart ? JSON.parse(storedCart) : [];
      
      try {
        let serverCartResponse;
        
        // Sincronización del carrito
        if (localCart.length > 0) {
          // Si hay productos en el carrito local, primero verificamos si el usuario tiene un carrito en el servidor
          try {
            serverCartResponse = await getCart(token);
            
            if (serverCartResponse?.cart?.products && serverCartResponse.cart.products.length > 0) {
              // Si hay productos tanto en el carrito local como en el servidor,
              // preferimos el carrito local (asumiendo que son cambios más recientes)
              // pero notificamos al usuario
              toast.success('Se han sincronizado los productos de tu carrito');
            }
          } catch (error) {
            // Si hay un error al obtener el carrito del servidor, continuamos con el carrito local
            console.error('Error al obtener el carrito del servidor:', error);
          }
          
          // En cualquier caso, sincronizamos el carrito local con el servidor
          await syncCart(localCart, token);
          
          // No necesitamos cargar de nuevo el carrito aquí ya que estamos enviando el carrito local al servidor
        } else {
          // Si el carrito local está vacío, cargamos el carrito del servidor
          serverCartResponse = await getCart(token);
          
          if (serverCartResponse?.cart?.products && serverCartResponse.cart.products.length > 0) {
            // Obtener detalles completos de cada producto
            const cartItemsWithDetails = [];
            for (const item of serverCartResponse.cart.products) {
              try {
                // Verificar el formato del productId (puede ser un string o un objeto)
                const productId = typeof item.productId === 'object' ? 
                  item.productId._id : item.productId;
                
                if (!productId) {
                  console.warn('Item sin productId encontrado en el carrito');
                  continue;
                }
                
                // Obtener detalles del producto
                const productDetails = await getProductById(productId);
                
                if (productDetails && productDetails.product) {
                  // Asegurar que tenemos todas las propiedades requeridas
                  const product = productDetails.product;
                  
                  // Verificar que los datos esenciales estén presentes
                  if (!product.nombre || !product.precioFinal) {
                    console.warn(`Producto ${productId} con datos incompletos:`, product);
                    continue; // Saltamos este producto si falta alguna propiedad esencial
                  }

                  // Crear un objeto de producto completo para el carrito
                  const cartItem = {
                    _id: productId,
                    nombre: product.nombre,
                    precioFinal: product.precioFinal,
                    precioTransferencia: product.precioTransferencia || 0,
                    quantity: item.quantity || 1,
                    // Asegurarnos que multimedia e inventario siempre tengan un valor válido
                    multimedia: product.multimedia || { imagenes: [] },
                    inventario: product.inventario || { stockUnidades: 10 },
                    // Añadir cualquier otra propiedad disponible
                    ...product
                  };
                  
                  cartItemsWithDetails.push(cartItem);
                }
              } catch (error) {
                console.error(`Error al obtener detalles del producto ${item.productId}:`, error);
              }
            }
            
            // Guardar en localStorage solo si tenemos productos válidos
            if (cartItemsWithDetails.length > 0) {
              localStorage.setItem('cart', JSON.stringify(cartItemsWithDetails));
              // Forzar un evento para notificar al CartContext del cambio
              window.dispatchEvent(new Event('storage'));
              toast.success('Se ha recuperado tu carrito de compras');
            }
          }
        }
      } catch (error) {
        console.error('Error sincronizando el carrito después del login:', error);
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      // Capturar el token antes de eliminarlo
      const currentToken = localStorage.getItem('token');
      
      // Limpiar localStorage primero para evitar problemas con la sincronización
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // IMPORTANTE: Limpiar el carrito local para evitar duplicaciones en futuros logins
      localStorage.removeItem('cart');
      localStorage.removeItem('shippingInfo');
      localStorage.removeItem('paymentInfo');
      
      // Intentar hacer logout en el servidor si hay un token válido
      if (currentToken) {
        try {
          await logoutService(currentToken);
        } catch (serverError) {
          console.error('Error al cerrar sesión en el servidor:', serverError);
          // Continuamos con el proceso de logout local aunque falle en el servidor
        }
      }
    } catch (error) {
      console.error('Error durante el logout:', error);
    } finally {
      // Actualizamos el estado de la aplicación
      setToken(null);
      setUser(null);
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return <LoadingOverlay message="Verificando autenticación..." />;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      setUser,
      isAuthenticated: !!user,
      isLoggingOut
    }}>
      {isLoggingOut && <LoadingOverlay message="Cerrando sesión..." />}
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Exportar context y provider
export { AuthContext, AuthProvider };
