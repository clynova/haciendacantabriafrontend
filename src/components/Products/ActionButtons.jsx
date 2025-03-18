import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaShoppingCart, FaHeart, FaShare } from 'react-icons/fa';
import { ShareMenu } from './ShareMenu';
import { addProductToWishlist } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const ActionButtons = ({ product, addToCart }) => {
    const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState({
        cart: false,
        wishlist: false
    });
    const { token } = useAuth();

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = product.nombre;

    const handleAddToCart = () => {
        setIsLoading(prev => ({ ...prev, cart: true }));
        try {
            addToCart(product);
            toast.success('Producto agregado al carrito');
        } catch (error) {
            toast.error('Error al agregar al carrito');
        } finally {
            setIsLoading(prev => ({ ...prev, cart: false }));
        }
    };

    const handleAddToWishlist = async () => {
        if (!token) {
            toast.error('Debes iniciar sesión para guardar productos');
            return;
        }

        setIsLoading(prev => ({ ...prev, wishlist: true }));
        try {
            await addProductToWishlist(product._id, token);
            toast.success('Producto guardado en tu lista de deseos');
        } catch (error) {
            toast.error('Error al guardar el producto');
        } finally {
            setIsLoading(prev => ({ ...prev, wishlist: false }));
        }
    };

    return (
        <div className="mt-10 flex flex-col space-y-4">
            <button
                onClick={handleAddToCart}
                disabled={product.inventario.stockUnidades === 0}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white 
                         font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 
                         disabled:cursor-not-allowed"
            >
                <span className={isLoading.cart ? 'opacity-0' : ''}>
                    <svg className={`w-5 h-5 ${isLoading.cart ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                </span>
                <FaShoppingCart className="w-5 h-5" />
                <span>{product.inventario.stockUnidades === 0 ? 'Agotado' : 'Agregar al carrito'}</span>
            </button>

            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <button
                        onClick={handleAddToWishlist}
                        disabled={isLoading.wishlist}
                        className="w-full flex items-center justify-center space-x-2 px-6 py-3 
                                 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
                                 border border-gray-300 dark:border-gray-600 rounded-lg
                                 hover:bg-gray-50 dark:hover:bg-gray-700
                                 transition-colors duration-200"
                    >
                        {isLoading.wishlist ? (
                            <div className="w-5 h-5 border-2 border-gray-600 dark:border-gray-300 
                                          border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <FaHeart className={`w-5 h-5 ${isLoading.wishlist ? 'animate-pulse' : ''}`} />
                                <span>Guardar</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="relative">
                    <button
                        aria-label="Compartir producto"
                        onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                        className="w-full flex items-center justify-center space-x-2 px-6 py-3 
                                 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
                                 border border-gray-300 dark:border-gray-600 rounded-lg
                                 hover:bg-green-50 dark:hover:bg-green-900/30
                                 hover:border-green-500 hover:text-green-500 dark:hover:border-green-400 
                                 dark:hover:text-green-400 transition-all duration-200
                                 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <FaShare className="w-5 h-5" />
                        <span>Compartir</span>
                    </button>
                    <ShareMenu
                        url={shareUrl}
                        title={shareTitle}
                        isOpen={isShareMenuOpen}
                        onClose={() => setIsShareMenuOpen(false)}
                    />
                </div>
            </div>
        </div>
    );
}

ActionButtons.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        nombre: PropTypes.string.isRequired,
        inventario: PropTypes.shape({
            stockUnidades: PropTypes.number.isRequired,
        }).isRequired,
    }).isRequired,
    addToCart: PropTypes.func.isRequired,
};

export { ActionButtons };