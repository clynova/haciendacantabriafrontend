import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { CiHeart } from "react-icons/ci";
import { HiHeart, HiShoppingCart } from "react-icons/hi";
import { FaSnowflake, FaTemperatureLow, FaLeaf, FaEye } from 'react-icons/fa';
import { cortarTexto, formatCurrency } from '../utils/funcionesReutilizables';
import { addProductToWishlist } from '../services/userService';
import { getProductsByTags } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from './Loading/LoadingSpinner';
import { Link } from 'react-router-dom';

const ProductGrid = ({ tags = "MasVendidos", limit = 6 }) => {
  const { addToCart } = useCart();
  const { token } = useAuth();
  const [loadingStates, setLoadingStates] = useState({});
  const [likedProducts, setLikedProducts] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProductsByTags(tags, limit);
        if (response.success) {
          setProducts(response.products);
          setError(null);
        } else {
          setError(response.msg || 'Error al cargar los productos');
          setProducts([]);
        }
      } catch (err) {
        setError('Error al cargar los productos: ' + (err.message || 'Error desconocido'));
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [tags, limit]);

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
    if (!product.variantePredeterminada) {
      toast.error('Producto sin variante disponible');
      return;
    }

    if (product.variantePredeterminada.stockDisponible === 0) {
      toast.error('Producto sin stock disponible');
      return;
    }
    
    addToCart(product, product.variantePredeterminada, 1, true);
  };

  const getDiscountBadgeColor = (discountPercentage) => {
    if (discountPercentage >= 50) {
      return 'bg-red-600';
    } else if (discountPercentage >= 30) {
      return 'bg-orange-500';
    } else if (discountPercentage >= 20) {
      return 'bg-yellow-500';
    } else if (discountPercentage >= 10) {
      return 'bg-green-500';
    } else {
      return 'bg-blue-500';
    }
  };

  const getConservationInfo = (product) => {
    if (product.conservacion?.requiereCongelacion) {
      return {
        icon: <FaSnowflake className="w-4 h-4" />,
        text: 'Congelado',
        bgColor: 'bg-blue-500',
        textColor: 'text-white'
      };
    } else if (product.conservacion?.requiereRefrigeracion) {
      return {
        icon: <FaTemperatureLow className="w-4 h-4" />,
        text: 'Refrigerado',
        bgColor: 'bg-cyan-500',
        textColor: 'text-white'
      };
    }
    return {
      icon: <FaLeaf className="w-4 h-4" />,
      text: 'Fresco',
      bgColor: 'bg-green-500',
      textColor: 'text-white'
    };
  };

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="text-center py-8">
      <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
      <button 
        onClick={() => {
          setLoading(true);
          getProductsByTags(tags, limit)
            .then(response => {
              if (response.success) {
                setProducts(response.products);
                setError(null);
              } else {
                setError(response.msg || 'Error al cargar los productos');
                setProducts([]);
              }
            })
            .catch(err => {
              setError('Error al cargar los productos: ' + (err.message || 'Error desconocido'));
              setProducts([]);
            })
            .finally(() => setLoading(false));
        }}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <div 
          key={product._id}
          className="group relative h-[420px] overflow-hidden rounded-xl shadow-md hover:shadow-2xl
                   transition-all duration-300"
          onMouseEnter={() => setHoveredProduct(product._id)}
          onMouseLeave={() => setHoveredProduct(null)}
        >
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={product.multimedia.imagenes[0]?.url}
              alt={product.nombre}
              className={`w-full h-full object-cover transition-all duration-700 
                        ${hoveredProduct === product._id ? 'scale-110 brightness-[0.90]' : 'brightness-[0.95]'}`}
              onError={handleImageError}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80"></div>
          </div>
          
          <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between">
            <div className="flex flex-col gap-2">
              {product.tipoProducto === 'ProductoCarne' && 
              product.origen?.pais?.toLowerCase() === 'argentina' && (
                <div className="relative group/tooltip">
                  <img
                    src="/images/flags/argentina-flag.png"
                    alt="Origen Argentina"
                    className="w-8 h-8 rounded-full shadow-md ring-2 ring-white"
                  />
                  <div className="absolute -bottom-1 -right-1 opacity-0 group-hover/tooltip:opacity-100 transition-opacity p-1 bg-white rounded-md text-xs whitespace-nowrap shadow-md">
                    Producto Argentino
                  </div>
                </div>
              )}
              
              {product.variantePredeterminada?.stockDisponible === 0 && (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md mt-2">
                  Agotado
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWishlist(product._id);
                }}
                disabled={loadingStates[product._id]}
                aria-label={`${likedProducts[product._id] ? 'Eliminar de' : 'Agregar a'} favoritos ${product.nombre}`}
                className="bg-white/90 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transform 
                         transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
              >
                {loadingStates[product._id] ? (
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                ) : likedProducts[product._id] ? (
                  <HiHeart className="w-6 h-6 text-red-500" />
                ) : (
                  <CiHeart className="w-6 h-6 text-gray-700" />
                )}
              </button>
              
              {product.variantePredeterminada && (
                <div className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-md">
                  {product.variantePredeterminada.peso} {product.variantePredeterminada.unidad}
                </div>
              )}
              
              {product.variantePredeterminada?.descuento > 0 && (
                <div className={`${getDiscountBadgeColor(product.variantePredeterminada.descuento)} 
                              text-white px-3 py-1 rounded-full text-sm font-bold shadow-md flex items-center`}>
                  {product.variantePredeterminada.descuento}% OFF
                </div>
              )}
            </div>
          </div>
          
          <div className={`absolute inset-0 flex items-center justify-center gap-4 
                       transition-opacity duration-300 ${hoveredProduct === product._id ? 'opacity-100' : 'opacity-0'}
                       pointer-events-none z-20`}>
            <div className="flex gap-3 pointer-events-auto">
              <Link
                to={`/product/${product.slug || product._id}`}
                className="bg-white text-gray-800 p-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                aria-label={`Ver detalles de ${product.nombre}`}
              >
                <FaEye className="w-5 h-5" />
              </Link>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                disabled={!product.variantePredeterminada || product.variantePredeterminada.stockDisponible === 0}
                aria-label={`Agregar ${product.nombre} al carrito`}
                className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors 
                         shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <HiShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {(() => {
            const conservationInfo = getConservationInfo(product);
            return (
              <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-1.5 
                            px-3 py-1 rounded-full ${conservationInfo.bgColor} ${conservationInfo.textColor} shadow-md`}>
                {conservationInfo.icon}
                <span className="text-xs font-medium">{conservationInfo.text}</span>
              </div>
            );
          })()}
          
          <div className="absolute inset-x-0 bottom-0 p-5 z-10">
            <Link to={`/product/${product.slug || product._id}`} className="block">
              <h3 className="text-xl font-bold text-white line-clamp-1 drop-shadow-md">
                {product.nombre}
              </h3>
            </Link>
            
            <p className="text-gray-200 text-sm line-clamp-2 mt-1 drop-shadow-md mb-4">
              {cortarTexto(product.descripcion.corta, 20)}
            </p>
            
            <div className="flex justify-between items-center mt-3">
              <div>
                {product.variantePredeterminada?.descuento > 0 && (
                  <span className="block text-sm text-gray-300 line-through drop-shadow-md">
                    {formatCurrency(product.variantePredeterminada.precio)}
                  </span>
                )}
                <span className="text-2xl font-bold text-white drop-shadow-md">
                  {formatCurrency(product.variantePredeterminada?.precioFinal || product.variantePredeterminada?.precio || 0)}
                </span>
                {product.variantePredeterminada?.stockDisponible > 0 && (
                  <div className="text-xs text-gray-300 mt-1 drop-shadow-md">
                    Stock: {product.variantePredeterminada.stockDisponible} unidades
                  </div>
                )}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                disabled={!product.variantePredeterminada || product.variantePredeterminada.stockDisponible === 0}
                aria-label={`Agregar ${product.nombre} al carrito`}
                className={`px-4 py-2 rounded-lg font-medium shadow-md transition-all duration-200
                          flex items-center gap-2 ${!product.variantePredeterminada || product.variantePredeterminada.stockDisponible === 0 
                          ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
              >
                <HiShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline-block">
                  {!product.variantePredeterminada || product.variantePredeterminada.stockDisponible === 0 
                    ? 'Agotado' 
                    : 'Agregar'}
                </span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;