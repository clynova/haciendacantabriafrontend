import { useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useDebounce } from '../hooks/useDebounce';

const ProductList = () => {
  const { fetchProducts, currentPage } = useProducts();
  
  const debouncedFetch = useDebounce((page) => {
    fetchProducts(page);
  }, 300);

  useEffect(() => {
    debouncedFetch(currentPage);
  }, [currentPage, debouncedFetch]);

  // ...resto del componente...
};
