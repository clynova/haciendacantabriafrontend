import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCart } from '../../services/paymentService';
import { getProductById } from '../../services/productService';
import { getProductsByTags } from '../../services/tagsService';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import CartSummary from '../../components/Cart/CartSummary';
import { getImageUrl, formatCurrency } from '../../utils/funcionesReutilizables';

// Componente para el producto en el carrito
const CartItem = ({ item, updateQuantity, removeFromCart, getValidStock }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-4 border border-gray-100 hover:shadow-md transition-all"
        >
            <div className="flex items-center space-x-4 w-full md:w-auto mb-4 md:mb-0">
                <div className="relative h-24 w-24 overflow-hidden rounded-md">
                    <img 
                        src={getImageUrl(item.images?.[0])} 
                        alt={item.name} 
                        className="h-full w-full object-cover transition-transform hover:scale-110"
                    />
                </div>
                <div>
                    <Link to={`/producto/${item._id}`} className="font-medium text-lg text-gray-800 hover:text-blue-600 transition-colors">
                        {item.name}
                    </Link>
                    <p className="text-blue-600 font-bold">{formatCurrency(item.price)}</p>
                    <p className="text-sm text-gray-500">
                        Stock disponible: {getValidStock(item.stock)}
                    </p>
                </div>
            </div>
            
            <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center">
                    <button 
                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                    >
                        -
                    </button>
                    <input 
                        type="number" 
                        min="1" 
                        max={getValidStock(item.stock)} 
                        value={item.quantity} 
                        onChange={(e) => updateQuantity(item._id, parseInt(e.target.value) || 1)}
                        className="w-12 h-8 border-t border-b border-gray-300 text-center focus:outline-none"
                    />
                    <button 
                        onClick={() => updateQuantity(item._id, Math.min(getValidStock(item.stock), item.quantity + 1))}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                        disabled={item.quantity >= getValidStock(item.stock)}
                    >
                        +
                    </button>
                </div>
                
                <div className="text-right">
                    <p className="font-bold">{formatCurrency(item.price * item.quantity)}</p>
                </div>
                
                <button
                    onClick={() => removeFromCart(item._id)}
                    className="ml-2 text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                    aria-label="Eliminar producto"
                >
                    <FiTrash2 size={18} />
                </button>
            </div>
        </motion.div>
    );
};

// Componente para productos recomendados
const RecommendedProducts = () => {
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendedProducts = async () => {
            try {
                const response = await getProductsByTags('oferta', false);
                if (response?.success && response.products) {
                    setRecommendedProducts(response.products);
                }
            } catch (error) {
                console.error('Error al cargar productos recomendados:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendedProducts();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md mt-8">
                <h2 className="text-xl font-bold mb-4">Recomendados para ti</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array(4).fill(0).map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-gray-200 h-40 rounded-md mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (recommendedProducts.length === 0) {
        return null;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-xl font-bold mb-4">Recomendados para ti</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recommendedProducts.map((product) => (
                    <Link 
                        to={`/producto/${product._id}`} 
                        key={product._id}
                        className="group border rounded-lg p-4 hover:shadow-md transition-all"
                    >
                        <div className="relative aspect-square overflow-hidden rounded-md mb-2">
                            <img 
                                src={getImageUrl(product.images?.[0])} 
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                            />
                        </div>
                        <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
                        <p className="text-blue-600 font-bold">{formatCurrency(product.price)}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const CarroDeCompras = () => {
    const { cartItems, removeFromCart, updateQuantity, validateCartStock } = useCart();
    const { token, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [localCartItems, setLocalCartItems] = useState([]);

    // Efecto para recargar los datos del carrito desde la base de datos
    useEffect(() => {
        const refreshCartFromServer = async () => {
            if (isAuthenticated && token && !isRefreshing) {
                // Verificamos si ya se realizó una recarga reciente para evitar duplicaciones con F5
                const lastRefreshTime = localStorage.getItem('lastCartRefresh');
                const now = Date.now();
                
                // Si se ha refrescado en los últimos 3 segundos, omitimos esta actualización
                if (lastRefreshTime && (now - parseInt(lastRefreshTime)) < 3000) {
                    console.log('Recarga reciente detectada, omitiendo actualización');
                    return;
                }
                
                // Marcamos el inicio de la actualización
                setIsRefreshing(true);
                localStorage.setItem('lastCartRefresh', now.toString());
                
                try {
                    // Obtenemos el carrito actualizado del servidor
                    const serverCartResponse = await getCart(token);
                    
                    if (serverCartResponse?.cart?.products && serverCartResponse.cart.products.length > 0) {
                        // Cargar los detalles completos de cada producto
                        const serverCartItems = [];
                        
                        for (const item of serverCartResponse.cart.products) {
                            try {
                                // Obtener detalles del producto
                                const productDetails = await getProductById(item.productId);
                                
                                if (productDetails && productDetails.product) {
                                    const product = productDetails.product;
                                    
                                    // Asegurar que el producto tiene todos los datos necesarios
                                    if (!product.name || !product.images || product.price === undefined) {
                                        console.warn(`Producto ${item.productId} con datos incompletos:`, product);
                                        continue;
                                    }
                                    
                                    // Crear un objeto de carrito completo con todas las propiedades necesarias
                                    serverCartItems.push({
                                        _id: item.productId,
                                        name: product.name,
                                        price: product.price,
                                        images: Array.isArray(product.images) ? product.images : ['placeholder.png'],
                                        quantity: item.quantity,
                                        stock: product.stock || 1,
                                        ...product
                                    });
                                }
                            } catch (error) {
                                console.error(`Error al obtener detalles del producto ${item.productId}:`, error);
                            }
                        }
                        
                        if (serverCartItems.length > 0) {
                            // Modificado: En lugar de setCartItems, guardamos los productos en el estado local
                            setLocalCartItems(serverCartItems);
                            localStorage.setItem('cart', JSON.stringify(serverCartItems));
                        }
                    }
                } catch (error) {
                    console.error('Error al obtener el carrito del servidor:', error);
                    // Solo mostramos un error si no es un 400 (que suele indicar "carrito vacío")
                    if (error?.response?.status !== 400) {
                        toast.error('Error al cargar el carrito');
                    }
                } finally {
                    setIsRefreshing(false);
                }
            }
        };
        
        refreshCartFromServer();
    }, [isAuthenticated, token]);

    // Sincronizamos localCartItems con cartItems del contexto
    useEffect(() => {
        if (localCartItems.length > 0) {
            setLocalCartItems([]); // Limpiamos después de actualizar localStorage
        }
    }, [localCartItems]);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleContinue = () => {
        if (!validateCartStock()) {
            return;
        }
        navigate('/checkout/envio');
    };

    // Función auxiliar para asegurar que el stock es un número válido y positivo
    const getValidStock = (stock) => {
        // Si stock es undefined, null o NaN, devolvemos 1 como valor por defecto
        if (stock === undefined || stock === null || isNaN(stock) || stock < 1) {
            return 1;
        }
        // Aseguramos que el valor es un entero
        return Math.floor(stock);
    };

    // Barra de progreso para el checkout
    const CheckoutProgress = () => (
        <div className="mb-8">
            <div className="flex justify-between">
                <div className="text-blue-500 font-medium">Carrito</div>
                <div className="text-gray-400">Envío</div>
                <div className="text-gray-400">Pago</div>
                <div className="text-gray-400">Confirmación</div>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div className="h-full w-1/4 bg-blue-500 rounded-full"></div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2 text-white">Tu Carrito de Compras</h1>
            <p className="text-gray-500 mb-6">Revisa tus productos y procede al pago.</p>
            
            <CheckoutProgress />
            
            {cartItems.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <div className="text-gray-400 mb-4">
                        <FiShoppingBag size={64} className="mx-auto" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
                    <p className="text-gray-600 mb-6">Parece que aún no has añadido productos a tu carrito.</p>
                    <Link 
                        to="/" 
                        className="inline-block bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Continuar comprando
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="mb-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-600">Productos ({cartItems.length})</h2>
                            <Link to="/" className="text-blue-500 hover:underline text-sm">
                                Seguir comprando
                            </Link>
                        </div>
                        
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <CartItem 
                                    key={item._id} 
                                    item={item} 
                                    updateQuantity={updateQuantity} 
                                    removeFromCart={removeFromCart}
                                    getValidStock={getValidStock}
                                />
                            ))}
                        </div>
                    </div>
                    
                    <div className="lg:col-span-1">
                        <CartSummary 
                            cartItems={cartItems}
                            onContinue={handleContinue}
                            buttonText="Continuar con el envío"
                        />
                    </div>
                </div>
            )}
            
            {cartItems.length > 0 && <RecommendedProducts />}
        </div>
    );
}

export { CarroDeCompras };