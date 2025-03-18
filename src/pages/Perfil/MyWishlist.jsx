import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { getImageUrl, formatCurrency } from "../../utils/funcionesReutilizables";
import { Link } from "react-router-dom";
import { HiOutlineTrash, HiShoppingCart } from "react-icons/hi";
import { toast } from "react-hot-toast";

const MyWishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const { addToCart } = useCart();

    const fetchWishlist = async () => {
        try {
            setError(null);
            const response = await getWishlist(token);
            if (response.success) {
                setWishlistItems(response.data.products || []);
            }
        } catch (error) {
            setError("No se pudo cargar la lista de deseos");
            toast.error("Error al cargar la lista de deseos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [token]);

    const handleRemoveFromWishlist = async (productId) => {
        try {
            await removeFromWishlist(productId, token);
            setWishlistItems(items => items.filter(item => item._id !== productId));
            toast.success("Producto eliminado de la lista de deseos");
        } catch (error) {
            toast.error("Error al eliminar el producto");
        }
    };

    const handleAddToCart = (product) => {
        addToCart(product);
        toast.success("Producto añadido al carrito");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                <button 
                    onClick={fetchWishlist}
                    className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                    Intentar nuevamente
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lista de Deseos</h1>
            </div>

            {wishlistItems.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Tu lista de deseos está vacía</p>
                    <Link 
                        to="/products" 
                        className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        Explorar productos
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((product) => (
                        <div 
                            key={product._id} 
                            className="border dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <Link to={`/product/${product._id}`}>
                                <img 
                                    src={getImageUrl(product.multimedia?.imagenes?.[0]?.url)}
                                    alt={product.nombre}
                                    className="w-full h-48 object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/images/placeholder.png';
                                    }}
                                />
                            </Link>
                            <div className="p-4">
                                <Link to={`/product/${product._id}`}>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        {product.nombre}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                                        {product.descripcion.corta}
                                    </p>
                                </Link>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(product.precioFinal)}
                                    </span>
                                    <span className={`text-sm ${
                                        product.inventario.stockUnidades > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                    }`}>
                                        {product.inventario.stockUnidades > 0 ? `${product.inventario.stockUnidades} disponibles` : 'Agotado'}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.inventario.stockUnidades === 0}
                                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 
                                                 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {product.inventario.stockUnidades === 0 ? 'Agotado' : 'Agregar al carrito'}
                                    </button>
                                    <button
                                        onClick={() => handleRemoveFromWishlist(product._id)}
                                        className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100 
                                                 dark:text-gray-300 dark:hover:text-red-400 dark:hover:bg-gray-700 
                                                 transition-colors"
                                    >
                                        <HiOutlineTrash className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export { MyWishlist };