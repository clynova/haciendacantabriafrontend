import { useState, useEffect } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { LoadingSpinner } from '../components/Loading/LoadingSpinner';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/funcionesReutilizables';
import { getTopProducts } from '../services/productService';

const TopProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { setPageTitle } = useGlobal();
    const { addToCart } = useCart();

    useEffect(() => {
        setPageTitle('Productos Más Vendidos | Hacienda Cantabria');
        const fetchTopProducts = async () => {
            try {
                setLoading(true);
                const response = await getTopProducts(10);

                if (response.success) {
                    setProducts(response.products);
                } else {
                    throw new Error(response.error);
                }
            } catch (err) {
                setError(err.message || 'Error al cargar los productos');
            } finally {
                setLoading(false);
            }
        };

        fetchTopProducts();
    }, [setPageTitle]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 
                             dark:hover:text-blue-300 transition-colors"
                >
                    Intentar nuevamente
                </button>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                    No hay productos disponibles en este momento.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 mt-[64px] sm:mt-[80px]">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 
                             dark:text-gray-100 mb-4">
                    Productos Más Vendidos
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Los productos favoritos de nuestros clientes
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md 
                                 hover:shadow-lg transition-shadow duration-200"
                    >
                        <Link
                            to={`/product/${product.slug || product._id}`}
                            className="block"
                        >
                            <div className="relative aspect-square">
                                <img
                                    src={product.multimedia?.imagenes[0]?.url || '/placeholder-image.jpg'}
                                    alt={product.nombre}
                                    className="w-full h-full object-cover rounded-t-lg"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-image.jpg';
                                    }}
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-gray-900 
                                           dark:text-white mb-1 line-clamp-2">
                                    {product.nombre}
                                </h3>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(product.precioFinal)}
                                    </span>
                                    {product.precioAnterior && product.precioAnterior > product.precioFinal && (
                                        <span className="text-sm text-gray-500 line-through">
                                            {formatCurrency(product.precioAnterior)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                        <div className="px-4 pb-4">
                            <button
                                onClick={() => addToCart(product)}
                                disabled={!product.inventario?.stockUnidades}
                                className="w-full px-3 py-1.5 text-sm font-medium 
                                         bg-blue-600 text-white rounded-md 
                                         hover:bg-blue-700 transition-colors duration-200 
                                         disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {product.inventario?.stockUnidades ? 'Agregar al carrito' : 'Agotado'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopProducts;