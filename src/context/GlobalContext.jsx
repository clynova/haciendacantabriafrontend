import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [pageName, setPageName] = useState('');
  const [pageTitle, setPageTitle] = useState('Cohesa');

  // Actualizar el título del documento cuando cambie pageTitle
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const value = {
    pageName,
    setPageName,
    pageTitle,
    setPageTitle
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};
GlobalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook personalizado para usar el contexto
// Hook personalizado para usar el contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal debe ser usado dentro de un GlobalProvider');
  }
  return context;
};
