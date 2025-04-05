import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { FaSnowflake, FaTemperatureLow, FaLeaf } from 'react-icons/fa';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { BsBoxSeam } from 'react-icons/bs';
import { FiShoppingCart } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { addProductToWishlist } from '../../services/userService';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/funcionesReutilizables';
import { motion } from 'framer-motion';

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
                icon: <FaSnowflake className="w-full h-full text-blue-500" />,
                text: 'Congelado',
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-700'
            };
        } else if (product.conservacion?.requiereRefrigeracion) {
            return {
                icon: <FaTemperatureLow className="w-full h-full text-cyan-500" />,
                text: 'Refrigerado',
                bgColor: 'bg-cyan-100',
                textColor: 'text-cyan-700'
            };
        }
        return {
            icon: <FaLeaf className="w-full h-full text-green-500" />,
            text: 'Fresco',
            bgColor: 'bg-green-100',
            textColor: 'text-green-700'
        };
    };

    const conservationInfo = getConservationInfo();
    
    return (
        <div className="w-full p-2">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                className="group relative rounded-2xl bg-white dark:bg-gray-800 h-full flex flex-col overflow-hidden
                          transition-all duration-300 cursor-pointer
                          shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-700"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={navigateToProduct}
            >
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-t-2xl aspect-square">
                    <img
                        src={imageError ? fallbackImage : 
                            (product.multimedia?.imagenes?.[0]?.url || fallbackImage)}
                        alt={product.nombre}
                        className="w-full h-full object-cover transition-transform duration-700
                                 group-hover:scale-110 z-0"
                        loading="lazy"
                        onError={handleImageError}
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 
                                  group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    
                    {/* Top badges container */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20">
                        {/* Left badges */}
                        <div className="flex flex-col gap-2">
                            {/* Argentina Flag Badge */}
                            {isArgentinianMeat && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-1.5 bg-white/90 dark:bg-gray-800/90 rounded-full p-1 shadow-md"
                                >
                                    <img
                                        src="/images/flags/argentina-flag.png"
                                        alt="Origen Argentina"
                                        className="w-6 h-6 rounded-full border border-gray-200"
                                        title="Producto de origen argentino"
                                    />
                                </motion.div>
                            )}
                        </div>

                        {/* Right badges */}
                        <div className="flex flex-col gap-2 items-end">
                            {/* Discount Badge */}
                            {variant.descuento > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-1.5 bg-red-500 rounded-full px-3 py-1 shadow-lg"
                                >
                                    <MdOutlineLocalOffer className="w-4 h-4 text-white" />
                                    <span className="text-sm font-bold text-white">
                                        {variant.descuento}% OFF
                                    </span>
                                </motion.div>
                            )}

                            {/* Favorite Button */}
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLikeClick();
                                }}
                                className={`p-2 rounded-full transition-colors duration-300 shadow-md
                                          ${isLiked 
                                            ? 'bg-red-50 dark:bg-red-900/30' 
                                            : 'bg-white/90 dark:bg-gray-800/90'}`}
                                aria-label={isLiked ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
                            >
                                {isLiked ? (
                                    <HiHeart className="w-5 h-5 text-red-500" />
                                ) : (
                                    <HiOutlineHeart className="w-5 h-5 text-gray-600 dark:text-gray-300 
                                                            group-hover:text-red-500 transition-colors" />
                                )}
                            </motion.button>
                        </div>
                    </div>
                    
                    {/* Bottom badges container */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end z-20">
                        {/* Conservation Badge */}
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-center gap-1.5 rounded-full shadow-md
                                      px-2.5 py-1.5 ${conservationInfo.bgColor}`}
                        >
                            <div className="w-4 h-4">
                                {conservationInfo.icon}
                            </div>
                            <span className={`text-xs font-medium ${conservationInfo.textColor}`}>
                                {conservationInfo.text}
                            </span>
                        </motion.div>

                        {/* Weight Badge */}
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-1.5 bg-white/90 dark:bg-gray-800/90 
                                      text-gray-800 dark:text-white rounded-full px-2.5 py-1.5 shadow-md"
                        >
                            <BsBoxSeam className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-semibold">
                                {variant.peso}{variant.unidad}
                            </span>
                        </motion.div>
                    </div>
                </div>

                {/* Content Container */}
                <div className="flex flex-col flex-grow p-4">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white 
                                 mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors">
                        {product.nombre}
                    </h3>
                    
                    {/* Description (if available) */}
                    {product.descripcion?.corta && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                            {product.descripcion.corta}
                        </p>
                    )}
                    
                    {/* Spacer */}
                    <div className="flex-grow min-h-2"></div>

                    {/* Price and CTA */}
                    <div className="mt-auto">
                        {/* Price */}
                        <div className="flex items-end justify-between mb-3">
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {formatCurrency(variant.precioFinal || 0)}
                                </span>
                                {variant.descuento > 0 && (
                                    <span className="text-sm text-gray-500 line-through">
                                        {formatCurrency(variant.precio || 0)}
                                    </span>
                                )}
                            </div>
                            
                            {/* Stock indicator */}
                            {hasAvailableStock ? (
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 
                                               dark:text-green-400 rounded-full font-medium">
                                    En stock
                                </span>
                            ) : (
                                <span className="text-xs px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 
                                               dark:text-red-400 rounded-full font-medium">
                                    Agotado
                                </span>
                            )}
                        </div>

                        {/* Add to cart button */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart();
                            }}
                            disabled={!hasAvailableStock}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium
                                     transition-all duration-300 
                                     bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                                     text-white shadow-md hover:shadow-lg
                                     disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
                        >
                            <FiShoppingCart className="w-5 h-5" />
                            <span>
                                {hasAvailableStock ? 'Agregar al carrito' : 'Agotado'}
                            </span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        nombre: PropTypes.string.isRequired,
        slug: PropTypes.string,
        tipoProducto: PropTypes.string,
        descripcion: PropTypes.shape({
            corta: PropTypes.string,
            completa: PropTypes.string
        }),
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