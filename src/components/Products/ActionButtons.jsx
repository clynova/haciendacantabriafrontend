import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaShoppingCart, FaHeart, FaShare } from 'react-icons/fa';
import { ShareMenu } from './ShareMenu';
import { addProductToWishlist } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const ActionButtons = ({ product, addToCart, selectedWeightOption }) => {
    const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState({
        cart: false,
        wishlist: false
    });
    const { token } = useAuth();

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = product.nombre;

    const hasAvailableStock = selectedWeightOption && selectedWeightOption.stockDisponible > 0;

    const handleAddToCart = () => {
        // Evitar operaciones si ya está cargando o no hay stock
        if (isLoading.cart || !hasAvailableStock) {
            if (!hasAvailableStock) {
                toast.error('Este producto está agotado en el peso seleccionado');
            }
            return;
        }

        // Activar el estado de carga inmediatamente para evitar clics múltiples
        setIsLoading(prev => ({ ...prev, cart: true }));
        
        try {
            // Convertir selectedWeightOption al formato de variant que espera el nuevo CartContext
            const variant = {
                pesoId: selectedWeightOption._id || selectedWeightOption.pesoId,
                peso: selectedWeightOption.peso,
                unidad: selectedWeightOption.unidad,
                precio: selectedWeightOption.precio || selectedWeightOption.precioFinal,
                stockDisponible: selectedWeightOption.stockDisponible,
                sku: selectedWeightOption.sku || ''
            };
            
            // Pasar producto y variante como parámetros separados
            addToCart(product, variant, 1, true);
            
            // Mantener el botón deshabilitado por un breve momento después de completar
            // para evitar doble clic accidental
            setTimeout(() => {
                setIsLoading(prev => ({ ...prev, cart: false }));
            }, 500);
        } catch (error) {
            toast.error('Error al agregar al carrito');
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

    const hasActiveOptions = product.opcionesPeso?.pesosEstandar?.some(
        option => option.estado !== false
    );

    return (
        <div className="mt-10 flex flex-col space-y-4">
            <button
                onClick={handleAddToCart}
                disabled={isLoading.cart || !hasAvailableStock}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white 
                         font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 
                         disabled:cursor-not-allowed disabled:bg-gray-400"
            >
                {isLoading.cart ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <FaShoppingCart className="w-5 h-5" />
                )}
                <span>{!hasAvailableStock ? 'Agotado' : isLoading.cart ? 'Agregando...' : 'Agregar al carrito'}</span>
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
                        onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                        className="w-full flex items-center justify-center space-x-2 px-6 py-3 
                                 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
                                 border border-gray-300 dark:border-gray-600 rounded-lg
                                 hover:bg-gray-50 dark:hover:bg-gray-700
                                 transition-colors duration-200"
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
                        onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                        className="w-full flex items-center justify-center space-x-2 px-6 py-3 
                                 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
                                 border border-gray-300 dark:border-gray-600 rounded-lg
                                 hover:bg-gray-50 dark:hover:bg-gray-700
                                 transition-colors duration-200"
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
};

ActionButtons.propTypes = {
    product: PropTypes.object.isRequired,
    addToCart: PropTypes.func.isRequired,
    selectedWeightOption: PropTypes.shape({
        peso: PropTypes.number.isRequired,
        unidad: PropTypes.string.isRequired,
        stockDisponible: PropTypes.number.isRequired
    })
};

export { ActionButtons };