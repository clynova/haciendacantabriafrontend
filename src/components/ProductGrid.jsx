import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { CiHeart } from "react-icons/ci";
import { HiHeart } from "react-icons/hi";
import { FaSnowflake, FaTemperatureLow, FaLeaf } from 'react-icons/fa';
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
  };

  const getConservationInfo = (product) => {
    if (product.conservacion?.requiereCongelacion) {
      return {
        icon: <FaSnowflake className="w-4 h-4 text-blue-500" />,
        text: 'Congelado',
        bgColor: 'bg-blue-100/90'
      };
    } else if (product.conservacion?.requiereRefrigeracion) {
      return {
        icon: <FaTemperatureLow className="w-4 h-4 text-cyan-500" />,
        text: 'Refrigerado',
        bgColor: 'bg-cyan-100/90'
      };
    }
    return {
      icon: <FaLeaf className="w-4 h-4 text-green-500" />,
      text: 'Fresco',
      bgColor: 'bg-green-100/90'
    };
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

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No hay productos disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.slice(0, 6).map(product => (
        <div key={product._id}
          className="group relative h-[400px] overflow-hidden shadow-lg hover:shadow-2xl 
                   transition-all duration-300">
          <Link to={`/product/${product.slug || product._id}`} className="block h-full">
            {/* Image Background with Zoom Effect */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={product.multimedia.imagenes[0]?.url}
                alt={product.nombre}
                className="w-full h-full object-cover transition-transform duration-500 
                         group-hover:scale-110"
                onError={handleImageError}
                loading="lazy"
              />
            </div>

            {/* Conservation Badge - Moved to right side */}
            {(() => {
              const conservationInfo = getConservationInfo(product);
              return (
                <div className={`absolute bottom-20 right-4 z-20 flex items-center gap-1.5 
                              px-2.5 py-1 rounded-full ${conservationInfo.bgColor} shadow-md`}>
                  {conservationInfo.icon}
                  <span className="text-xs font-medium text-gray-800">
                    {conservationInfo.text}
                  </span>
                </div>
              );
            })()}

            {/* Argentina Flag Badge */}
            {product.tipoProducto === 'ProductoCarne' && 
             product.origen?.pais?.toLowerCase() === 'argentina' && (
              <div className="absolute top-4 left-4 z-20">
                <img
                  src="/images/flags/argentina-flag.png"
                  alt="Origen Argentina"
                  className="w-8 h-8 rounded-full shadow-md"
                  title="Producto de origen argentino"
                />
              </div>
            )}

            {/* Out of Stock Badge - Move it slightly if Argentina flag is present */}
            {product.inventario.stockUnidades === 0 && (
              <div className={`absolute z-20 bg-red-500 text-white px-3 py-1 
                           rounded-full text-sm ${product.tipoProducto === 'ProductoCarne' && 
                           product.origen?.pais?.toLowerCase() === 'argentina' 
                           ? 'top-16 left-4' : 'top-4 left-4'}`}>
                Agotado
              </div>
            )}

            {/* Content - Always visible */}
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white line-clamp-1 drop-shadow-md">
                  {product.nombre}
                </h3>
                <p className="text-gray-200 text-sm line-clamp-2 drop-shadow-md">
                  {cortarTexto(product.descripcion.corta, 20)}
                </p>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="space-y-1">
                  <span className="text-2xl font-bold text-white drop-shadow-md">
                    {formatCurrency(product.precioFinal)}
                  </span>
                  {product.inventario.stockUnidades > 0 && (
                    <div className="text-sm text-gray-200 drop-shadow-md">
                      Stock: {product.inventario.stockUnidades}
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(product);
                  }}
                  disabled={product.inventario.stockUnidades === 0}
                  aria-label={`Agregar ${product.nombre} al carrito`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium
                           hover:bg-blue-700 transform transition-all duration-200 
                           hover:scale-105 active:scale-95 disabled:opacity-50 
                           disabled:cursor-not-allowed hover:shadow-md"
                >
                  {product.inventario.stockUnidades === 0 ? 'Agotado' : 'Agregar al carrito'}
                </button>
              </div>
            </div>
          </Link>

          {/* Favorite Button */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToWishlist(product._id);
              }}
              disabled={loadingStates[product._id]}
              aria-label={`${likedProducts[product._id] ? 'Eliminar de' : 'Agregar a'} favoritos ${product.nombre}`}
              className="bg-white/90 p-2.5 rounded-full hover:bg-white active:scale-95
                       transition-all duration-200 transform hover:scale-105
                       disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
            >
              {loadingStates[product._id] ? (
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent 
                             rounded-full animate-spin" />
              ) : likedProducts[product._id] ? (
                <HiHeart className="w-5 h-5 text-red-500" />
              ) : (
                <CiHeart className="w-5 h-5 text-gray-600 hover:text-red-500" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;