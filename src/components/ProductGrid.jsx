import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { CiHeart } from "react-icons/ci";
import { HiHeart } from "react-icons/hi";
import { cortarTexto, formatCurrency } from '../utils/funcionesReutilizables';
import { useProducts } from '../context/ProductContext';
import { addProductToWishlist } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from './Loading/LoadingSpinner';
import { Link } from 'react-router-dom';

const ProductGrid = () => {
  const { addToCart } = useCart();
  const { products, loading, error, fetchProducts } = useProducts();
  const { token } = useAuth();
  const [loadingStates, setLoadingStates] = useState({});
  const [likedProducts, setLikedProducts] = useState({});

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleImageError = (e) => {
    e.target.src = '/images/placeholder.png';
  };

  const handleAddToWishlist = async (productId) => {
    if (!token) {
      toast.error('Debes iniciar sesión para guardar productos');
      return;
    }

    setLoadingStates(prev => ({ ...prev, [productId]: true }));
    try {
      await addProductToWishlist(productId, token);
      setLikedProducts(prev => ({ ...prev, [productId]: !prev[productId] }));
      toast.success(likedProducts[productId] ? 'Producto eliminado de favoritos' : 'Producto agregado a favoritos');
    } catch (error) {
      toast.error('Error al actualizar favoritos');
    } finally {
      setLoadingStates(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleAddToCart = (product) => {
    if (product.inventario.stockUnidades === 0) {
      toast.error('Producto sin stock disponible');
      return;
    }
    addToCart(product);
    toast.success('Producto agregado al carrito');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="text-center py-8">
      <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
      <button 
        onClick={fetchProducts}
        className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        Intentar nuevamente
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map(product => (
        <div key={product._id}
          className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl 
                   transition-all duration-300 relative">
          <Link 
            to={`/product/${product._id}`}
            className="block relative overflow-hidden cursor-pointer"
            aria-label={`Ver detalles de ${product.nombre}`}
          >
            <div className="relative overflow-hidden">
              <img
                src={product.multimedia.imagenes[0]?.url}
                alt={product.nombre}
                className="w-full h-64 object-cover transform group-hover:scale-110 
                         transition-all duration-500 ease-in-out"
                onError={handleImageError}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 
                           transition-opacity duration-300"></div>
              {product.inventario.stockUnidades === 0 && (
                <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 
                             rounded-full text-sm transform transition-transform duration-300 
                             group-hover:scale-105">
                  Agotado
                </div>
              )}
            </div>
          </Link>
          
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => handleAddToWishlist(product._id)}
              disabled={loadingStates[product._id]}
              aria-label={`${likedProducts[product._id] ? 'Eliminar de' : 'Agregar a'} favoritos ${product.nombre}`}
              className="bg-white/90 p-2.5 rounded-full hover:bg-white active:scale-95
                       transition-all duration-200 transform hover:scale-105
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:shadow-lg">
              {loadingStates[product._id] ? (
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent 
                             rounded-full animate-spin" />
              ) : likedProducts[product._id] ? (
                <HiHeart className="w-5 h-5 text-red-500" />
              ) : (
                <CiHeart className="w-5 h-5 text-gray-600 hover:text-red-500 
                                transition-colors duration-200" />
              )}
            </button>
          </div>

          <div className="p-6">
            <Link 
              to={`/product/${product._id}`}
              className="block group/link"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white
                           group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 
                           transition-colors duration-200">{product.nombre}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 
                         group-hover/link:text-gray-900 dark:group-hover/link:text-gray-200 
                         transition-colors duration-200">
                {cortarTexto(product.descripcion.corta, 20)}
              </p>
            </Link>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white 
                             group-hover:text-blue-600 dark:group-hover:text-blue-400 
                             transition-colors duration-200">
                  {formatCurrency(product.precioFinal)}
                </span>
                {product.inventario.stockUnidades > 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    Stock: {product.inventario.stockUnidades}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.inventario.stockUnidades === 0}
                aria-label={`Agregar ${product.nombre} al carrito`}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium
                         hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
                         transform transition-all duration-200 hover:scale-105
                         active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                         hover:shadow-md disabled:hover:scale-100 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:ring-offset-2 dark:focus:ring-offset-gray-800 bg-indigo-600  focus:ring-indigo-500 ">
                {product.inventario.stockUnidades === 0 ? 'Agotado' : 'Agregar al carrito'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;