import { BrowserRouter, Routes } from "react-router-dom";
import { PageTitle } from "./components/PageTitle";
import { Toaster } from 'react-hot-toast';
import { toasterConfig } from './config/toasterConfig';
import { AppProviders } from './components/Providers/AppProviders';
import { ScrollToTop } from './components/ScrollToTop';
import appRoutes from './routes/index.jsx';

const App = () => {
  const { authRoutes, homeRoutes, profileRoutes, adminRoutes, checkoutRoutes, publicRoutes } = appRoutes;
  
  return (
    <AppProviders>
      <PageTitle />
      <BrowserRouter>
        <ScrollToTop />
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
      <Toaster {...toasterConfig} />
    </AppProviders>
  );
};

export { App };
