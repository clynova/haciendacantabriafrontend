import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';
import { logout as logoutService } from '../services/authService';
import { syncCart, getCart } from '../services/paymentService';
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
      
      // Sincronización del carrito
      try {
        // Get local cart with safe parsing
        const storedCart = localStorage.getItem('cart');
        const localCart = storedCart ? JSON.parse(storedCart) : [];
        
        if (localCart.length > 0) {
          // Si hay productos en el carrito local, los sincronizamos con el servidor
          await syncCart(localCart, token);
          toast.success('Se ha sincronizado tu carrito de compras');
        } else {
          // Si el carrito local está vacío, obtenemos el carrito del servidor
          const serverCartResponse = await getCart(token);
          
          if (serverCartResponse?.cart?.products && serverCartResponse.cart.products.length > 0) {
            // Si hay productos en el carrito del servidor, actualizamos el localStorage
            localStorage.setItem('cart', JSON.stringify(serverCartResponse.cart.products));
            // Notificar al CartContext del cambio
            window.dispatchEvent(new Event('storage'));
            toast.success('Se ha recuperado tu carrito de compras');
          }
        }
      } catch (error) {
        console.error('Error sincronizando el carrito después del login:', error);
        // Incluso si falla la sincronización, el login debe considerarse exitoso
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
