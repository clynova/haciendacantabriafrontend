import { AuthProvider } from "../../context/AuthContext";
import { ProductProvider } from "../../context/ProductContext";
import { CartProvider } from "../../context/CartContext";
import { HelmetProvider } from 'react-helmet-async';
import { GlobalProvider } from "../../context/GlobalContext";

export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <HelmetProvider>
            <GlobalProvider>
              {children}
            </GlobalProvider>
          </HelmetProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};