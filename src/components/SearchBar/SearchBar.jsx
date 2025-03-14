import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from 'prop-types';
import { HiSearch } from "react-icons/hi";
import { useProducts } from "../../context/ProductContext";
import { SearchResults } from "./SearchResults";
import { useDebounce } from "../../hooks/useDebounce";

const SearchBar = ({ isExpanded, onToggle }) => {
  const { products, loading, error, fetchProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const searchRef = useRef(null);
  
  // Implementar debounce para evitar búsquedas innecesarias
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    // Solo cargar productos una vez
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);
  
  useEffect(() => {
    // Solo ejecutar búsqueda cuando el término ha sido "debounced"
    if (debouncedSearchTerm.length >= 2) {
      const filtered = products.filter(product =>
        product.nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
        (product.descripcion?.completa && product.descripcion.completa.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm, products]);

  // Usar useCallback para evitar recrear esta función en cada renderizado
  const handleCloseSearch = useCallback(() => {
    setSearchTerm("");
    setResults([]);
    // Solo llamar a onToggle si es necesario cambiar el estado
    if (isExpanded) {
      onToggle(false);
    }
  }, [isExpanded, onToggle]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        handleCloseSearch();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleCloseSearch]);

  // Evitar renderizado condicional completo basado en loading/error
  // para prevenir remontaje del componente
  const renderContent = () => {
    if (loading && !debouncedSearchTerm) {
      return <div className="flex justify-center py-2 px-4">Cargando...</div>;
    }
    if (error) {
      return <div className="text-red-500 py-2 px-4">Error: {error}</div>;
    }
    return null;
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return (
    <div ref={searchRef} className="relative flex-grow max-w-2xl">
      {renderContent()}
      
      {isExpanded ? (
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full bg-slate-800/50 text-slate-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
          
          {/* Añadir indicador de carga durante la búsqueda */}
          {loading && debouncedSearchTerm.length >= 2 && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          )}
          
          <SearchResults
            results={results}
            isLoading={loading && debouncedSearchTerm.length >= 2}
            onClose={handleCloseSearch}
          />
        </div>
      ) : (
        <button
          onClick={() => onToggle(true)}
          className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors duration-200"
          aria-label="Buscar productos"
        >
          <HiSearch className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export { SearchBar };
