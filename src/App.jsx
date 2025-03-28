import { BrowserRouter, Routes } from "react-router-dom";
import { GlobalProvider } from "./context/GlobalContext";
import { PageTitle } from "./components/PageTitle";
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider } from "./context/AuthContext";

// Importar rutas modulares
import appRoutes from './routes';

const App = () => {
  const { authRoutes, homeRoutes, profileRoutes, adminRoutes, checkoutRoutes, publicRoutes } = appRoutes;
  
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <HelmetProvider>
            <GlobalProvider>
              <PageTitle />
              <BrowserRouter>
                <Routes>
                  {/* Rutas de Home */}
                  {homeRoutes}
                  
                  {/* Rutas de autenticación */}
                  {authRoutes}
                  
                  {/* Rutas de perfil */}
                  {profileRoutes}
                  
                  {/* Rutas de administración */}
                  {adminRoutes}
                  
                  {/* Rutas de checkout */}
                  {checkoutRoutes}
                  
                  {/* Rutas públicas */}
                  {publicRoutes}
                </Routes>
              </BrowserRouter>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#333',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    style: {
                      background: '#1db954',
                    },
                  },
                  error: {
                    duration: 4000,
                    style: {
                      background: '#d32f2f',
                    },
                  },
                }}
              />
            </GlobalProvider>
          </HelmetProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

export { App };
