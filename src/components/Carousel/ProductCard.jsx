import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { addProductToWishlist } from '../../services/userService';
import toast from 'react-hot-toast';
import { getImageUrl, formatCurrency } from '../../utils/funcionesReutilizables';

const ProductCard = ({ product }) => {
    const [imageError, setImageError] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { token } = useAuth();
    const { addToCart } = useCart();
    const fallbackImage = '/images/placeholder.png';

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
        // Ya no mostramos el toast aquí, la función addToCart se encarga de mostrarlo
        addToCart(product);
    };

    const navigateToProduct = (e) => {
        // Don't navigate if clicking on buttons
        if (e.target.closest('button')) {
            return;
        }
        window.location.href = `/product/${product._id}`;
    };

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
                            {formatCurrency(product.precioFinal)}
                        </span>
                        {product.precios?.base && product.precioFinal < product.precios.base && (
                            <span className="text-sm text-gray-500 line-through">
                                {formatCurrency(product.precios.base)}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart();
                        }}
                        disabled={!product.inventario.stockUnidades}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium
                                 hover:bg-blue-700 transition-colors duration-200 
                                 disabled:bg-gray-400 disabled:cursor-not-allowed
                                 hover:shadow-lg z-10"
                    >
                        {product.inventario.stockUnidades ? 'Agregar al carrito' : 'Agotado'}
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
        precioFinal: PropTypes.number.isRequired,
        precios: PropTypes.shape({
            base: PropTypes.number,
        }),
        inventario: PropTypes.shape({
            stockUnidades: PropTypes.number.isRequired,
        }).isRequired,
        multimedia: PropTypes.shape({
            imagenes: PropTypes.arrayOf(PropTypes.shape({
                url: PropTypes.string,
                textoAlternativo: PropTypes.string,
                esPrincipal: PropTypes.bool,
                _id: PropTypes.string,
            })).isRequired,
        }).isRequired,
    }).isRequired,
};

export default ProductCard;