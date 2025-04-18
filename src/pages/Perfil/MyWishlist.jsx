import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist, addProductToWishlist } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/funcionesReutilizables";
import { Link } from "react-router-dom";
import { HiOutlineTrash, HiShoppingCart, HiOutlineRefresh } from "react-icons/hi";
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
            setLoading(true);
            const response = await getWishlist(token);
            if (response.success) {
                setWishlistItems(response.data?.products || []);
            } else {
                setError(response.msg || "No se pudo cargar la lista de deseos");
            }
        } catch (error) {
            setError("No se pudo cargar la lista de deseos");
            console.error("Error al cargar la lista de deseos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchWishlist();
        }
    }, [token]);

    const handleRemoveFromWishlist = async (productId) => {
        try {
            const response = await removeFromWishlist(productId, token);
            if (response.success) {
                setWishlistItems(items => items.filter(item => item._id !== productId));
                toast.success("Producto eliminado de la lista de deseos");
            } else {
                toast.error(response.msg || "Error al eliminar el producto");
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            toast.error("Error al eliminar el producto");
        }
    };

    const handleAddToCart = (product) => {
        // Seleccionar la variante predeterminada o la primera disponible
        const variant = product.variantePredeterminada || (product.precioVariantesPorPeso && product.precioVariantesPorPeso.length > 0 
            ? product.precioVariantesPorPeso.find(v => v.stockDisponible > 0) || product.precioVariantesPorPeso[0]
            : null);
            
        if (!variant) {
            toast.error("No se puede añadir el producto al carrito");
            return;
        }

        const productToAdd = {
            productId: product._id,
            nombre: product.nombre,
            imagen: product.multimedia?.imagenes?.[0]?.url || "",
            variante: {
                id: variant.pesoId,
                peso: variant.peso,
                unidad: variant.unidad,
                sku: variant.sku
            },
            precio: variant.precio,
            precioFinal: variant.precioFinal,
            descuento: variant.descuento,
            cantidad: 1,
            stockDisponible: variant.stockDisponible
        };

        addToCart(productToAdd);
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
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                <button 
                    onClick={fetchWishlist}
                    className="flex items-center justify-center mx-auto gap-2 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                    <HiOutlineRefresh className="w-5 h-5" />
                    <span>Intentar nuevamente</span>
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
                    {wishlistItems.map((product) => {
                        const defaultVariant = product.variantePredeterminada;
                        const hasStock = defaultVariant?.stockDisponible > 0;
                        
                        return (
                            <div 
                                key={product._id} 
                                className="border dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <Link to={`/product/${product.slug || product._id}`}>
                                    <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 relative">
                                        <img 
                                            src={product.multimedia?.imagenes?.[0]?.url}
                                            alt={product.nombre}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/optimized/placeholder-large.webp';
                                            }}
                                        />
                                        {defaultVariant?.descuento > 0 && (
                                            <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs font-bold">
                                                -{defaultVariant.descuento}%
                                            </div>
                                        )}
                                    </div>
                                </Link>
                                <div className="p-4">
                                    <Link to={`/product/${product.slug || product._id}`}>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                                            {product.nombre}
                                        </h3>
                                    </Link>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                        <p>Categoría: {product.categoria}</p>
                                        {defaultVariant && (
                                            <p>{defaultVariant.peso} {defaultVariant.unidad}</p>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        {defaultVariant && (
                                            <div>
                                                <span className="text-lg font-bold text-gray-900 dark:text-white mr-2">
                                                    {formatCurrency(defaultVariant.precioFinal)}
                                                </span>
                                                {defaultVariant.descuento > 0 && (
                                                    <span className="text-sm line-through text-gray-500 dark:text-gray-400">
                                                        {formatCurrency(defaultVariant.precio)}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <span className={`text-sm ${
                                            hasStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                        }`}>
                                            {hasStock ? `${defaultVariant.stockDisponible} disponibles` : 'Agotado'}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={!hasStock}
                                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 
                                                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <HiShoppingCart className="w-5 h-5" />
                                            <span>{hasStock ? 'Añadir al carrito' : 'Agotado'}</span>
                                        </button>
                                        <button
                                            onClick={() => handleRemoveFromWishlist(product._id)}
                                            className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100 
                                                     dark:text-gray-300 dark:hover:text-red-400 dark:hover:bg-gray-700 
                                                     transition-colors"
                                            title="Eliminar de la lista de deseos"
                                        >
                                            <HiOutlineTrash className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export { MyWishlist };