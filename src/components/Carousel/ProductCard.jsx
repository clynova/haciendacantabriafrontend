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
        addToCart(product);
        toast.success('Producto agregado al carrito');
    };

    return (
        <div className="px-2">
            <div 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl 
                          transition-all duration-300 overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative aspect-square">
                    <img
                        src={imageError || !product.images?.[0] ? fallbackImage : product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300
                                 group-hover:scale-105"
                        loading="lazy"
                        onError={handleImageError}
                    />
                    <button
                        onClick={handleLikeClick}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 
                                 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 
                                 transition-colors duration-200 group"
                        aria-label={isLiked ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
                    >
                        {isLiked ? (
                            <HiHeart className="w-5 h-5 text-red-500" />
                        ) : (
                            <HiOutlineHeart className="w-5 h-5 text-gray-600 dark:text-gray-300 
                                                     group-hover:text-red-500" />
                        )}
                    </button>
                    {isHovered && (
                        <div className="absolute inset-0 bg-black/40 flex items-center 
                                      justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <Link
                                to={`/product/${product._id}`}
                                className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium
                                         hover:bg-gray-100 transition-colors duration-200"
                            >
                                Ver detalles
                            </Link>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <Link to={`/product/${product._id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white 
                                     mb-2 hover:text-blue-500 dark:hover:text-blue-400 
                                     transition-colors duration-200 line-clamp-2">
                            {product.name}
                        </h3>
                    </Link>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(product.price)}
                        </span>
                        {product.oldPrice && (
                            <span className="text-sm text-gray-500 line-through">
                                {formatCurrency(product.oldPrice)}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={!product.stock}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium
                                 hover:bg-blue-700 transition-colors duration-200 
                                 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {product.stock ? 'Agregar al carrito' : 'Agotado'}
                    </button>
                </div>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        oldPrice: PropTypes.number,
        stock: PropTypes.number,
        images: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
};

export default ProductCard;