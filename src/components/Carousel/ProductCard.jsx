import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { FaSnowflake, FaTemperatureLow, FaLeaf } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { addProductToWishlist } from '../../services/userService';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/funcionesReutilizables';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { token } = useAuth();
    const { addToCart } = useCart();
    const fallbackImage = '/images/placeholder.png';

    // Usar siempre la variante predeterminada para todos los datos
    const variant = product.variantePredeterminada || {};
    
    // Comprobamos el stock disponible
    const hasAvailableStock = variant.stockDisponible > 0;

    const handleImageError = () => {
        setImageError(true);
    };

    const handleLikeClick = async () => {
        if (!token) {
            toast.error('Debes iniciar sesión para guardar productos');
            return;
        }
        try {
            await addProductToWishlist(product._id, token);
            setIsLiked(!isLiked);
            toast.success(isLiked ? 'Producto eliminado de favoritos' : 'Producto agregado a favoritos');
        } catch (error) {
            toast.error('Error al actualizar favoritos');
        }
    };

    const handleAddToCart = () => {
        // Pasar el producto completo con su variante predeterminada
        addToCart({
            ...product,
            selectedVariant: variant
        });
        
        toast.success(`${product.nombre} (${variant.peso}${variant.unidad}) agregado al carrito`);
    };

    const navigateToProduct = (e) => {
        // Don't navigate if clicking on buttons
        if (e.target.closest('button')) {
            return;
        }
        navigate(`/product/${product.slug || product._id}`);
    };

    // Verificamos si es carne argentina basado en el tipo de producto y origen
    const isArgentinianMeat = product.tipoProducto === 'ProductoCarne' && 
                             product.origen?.pais?.toLowerCase() === 'argentina';

    const getConservationInfo = () => {
        if (product.conservacion?.requiereCongelacion) {
            return {
                icon: <FaSnowflake className="w-5 h-5 text-blue-500" />,
                text: 'Congelado',
                bgColor: 'bg-blue-100 dark:bg-blue-900/30'
            };
        } else if (product.conservacion?.requiereRefrigeracion) {
            return {
                icon: <FaTemperatureLow className="w-5 h-5 text-cyan-500" />,
                text: 'Refrigerado',
                bgColor: 'bg-cyan-100 dark:bg-cyan-900/30'
            };
        }
        return {
            icon: <FaLeaf className="w-5 h-5 text-green-500" />,
            text: 'Fresco',
            bgColor: 'bg-green-100 dark:bg-green-900/30'
        };
    };

    const conservationInfo = getConservationInfo();
    
    return (
        <div className="px-2">
            <div 
                className="group relative bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl 
                          transition-all duration-300 overflow-hidden hover:cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={navigateToProduct}
            >
                {/* Product Image with enhanced zoom */}
                <div className="relative aspect-square overflow-hidden">
                    <img
                        src={imageError ? fallbackImage : 
                            (product.multimedia?.imagenes?.[0]?.url || fallbackImage)}
                        alt={product.nombre}
                        className="w-full h-full object-cover transition-transform duration-500
                                 group-hover:scale-110"
                        loading="lazy"
                        onError={handleImageError}
                    />
                    
                    {/* Discount Badge - Only shown if there's a discount */}
                    {variant.descuento > 0 && (
                        <div className="absolute top-3 right-15 z-30 bg-red-500 text-white 
                                      px-2 py-1 rounded-lg font-bold shadow-md">
                            -{variant.descuento}%
                        </div>
                    )}
                    
                    {/* Argentina Flag Badge */}
                    {isArgentinianMeat && (
                        <div className="absolute top-3 left-3 z-30">
                            <img
                                src="/images/flags/argentina-flag.png"
                                alt="Origen Argentina"
                                className="w-8 h-8 rounded-full shadow-md"
                                title="Producto de origen argentino"
                            />
                        </div>
                    )}

                    {/* Conservation Badge */}
                    <div className={`absolute bottom-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1 
                                   rounded-full ${conservationInfo.bgColor} shadow-md`}>
                        {conservationInfo.icon}
                        <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                            {conservationInfo.text}
                        </span>
                    </div>

                    {/* Weight Badge */}
                    <div className="absolute bottom-3 right-3 z-30 bg-blue-600 text-white
                                  px-2 py-1 rounded-lg shadow-md text-sm font-medium">
                        {variant.peso}{variant.unidad}
                    </div>

                    {/* Favorite Button - Always visible and above zoom */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleLikeClick();
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-md
                                 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 
                                 transition-colors duration-200 z-30"
                        aria-label={isLiked ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
                    >
                        {isLiked ? (
                            <HiHeart className="w-5 h-5 text-red-500" />
                        ) : (
                            <HiOutlineHeart className="w-5 h-5 text-gray-600 dark:text-gray-300 
                                                     hover:text-red-500" />
                        )}
                    </button>

                    {/* Hover Overlay */}
                    <div className={`absolute inset-0 bg-black/40 flex items-center 
                                   justify-center transition-opacity duration-300 z-20
                                   ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium
                                     hover:bg-gray-100 transition-colors duration-200">
                            Ver detalles
                        </span>
                    </div>
                </div>

                {/* Product Info - Static section */}
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white 
                                 mb-2 transition-colors duration-200 line-clamp-2
                                 hover:text-blue-500">
                        {product.nombre}
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(variant.precioFinal || 0)}
                        </span>
                        {variant.descuento > 0 && (
                            <span className="text-sm text-gray-500 line-through">
                                {formatCurrency(variant.precio || 0)}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart();
                        }}
                        disabled={!hasAvailableStock}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium
                                 hover:bg-blue-700 transition-colors duration-200 
                                 disabled:bg-gray-400 disabled:cursor-not-allowed
                                 hover:shadow-lg z-10"
                    >
                        {hasAvailableStock ? 'Agregar al carrito' : 'Agotado'}
                    </button>
                </div>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        nombre: PropTypes.string.isRequired,
        slug: PropTypes.string,
        tipoProducto: PropTypes.string,
        multimedia: PropTypes.shape({
            imagenes: PropTypes.arrayOf(PropTypes.shape({
                url: PropTypes.string,
                textoAlternativo: PropTypes.string,
                esPrincipal: PropTypes.bool,
                _id: PropTypes.string,
            })),
        }),
        conservacion: PropTypes.shape({
            requiereRefrigeracion: PropTypes.bool,
            requiereCongelacion: PropTypes.bool,
        }),
        origen: PropTypes.shape({
            pais: PropTypes.string,
        }),
        variantePredeterminada: PropTypes.shape({
            pesoId: PropTypes.string,
            peso: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            unidad: PropTypes.string,
            precio: PropTypes.number,
            descuento: PropTypes.number,
            precioFinal: PropTypes.number,
            stockDisponible: PropTypes.number,
            esPredeterminado: PropTypes.bool,
            sku: PropTypes.string,
        }),
        precioVariantesPorPeso: PropTypes.arrayOf(PropTypes.shape({
            pesoId: PropTypes.string,
            peso: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            unidad: PropTypes.string,
            precio: PropTypes.number,
            descuento: PropTypes.number,
            precioFinal: PropTypes.number,
            stockDisponible: PropTypes.number,
            esPredeterminado: PropTypes.bool,
            sku: PropTypes.string,
        })),
    }).isRequired,
};

export default ProductCard;