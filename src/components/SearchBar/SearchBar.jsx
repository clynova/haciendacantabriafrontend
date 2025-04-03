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
  const inputRef = useRef(null);
  
  // Implementar debounce para evitar búsquedas innecesarias
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    // Ensure products is defined before accessing its length
    if (products && products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products]);

  useEffect(() => {
    // Ensure products is defined before filtering
    if (debouncedSearchTerm.length >= 2 && products) {
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

  // Focus en el input cuando se expande
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isExpanded]);

  // Función para manejar la entrada del usuario sin perder el foco
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div ref={searchRef} className="relative flex-grow max-w-2xl">
      {loading && debouncedSearchTerm.length >= 2 && (
        <div className="flex justify-center py-2 px-4">Cargando...</div>
      )}
      {error && (
        <div className="text-red-500 py-2 px-4">Error: {error}</div>
      )}
      
      {isExpanded ? (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar productos..."
            className="w-full bg-slate-800/50 text-slate-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="flex items-center justify-center w-10 h-10 bg-slate-800/50 rounded-full hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          aria-label="Buscar"
        >
          <HiSearch className="text-slate-400 h-5 w-5" />
        </button>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default SearchBar;
