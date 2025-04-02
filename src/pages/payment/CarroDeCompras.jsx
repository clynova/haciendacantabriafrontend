import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCart } from '../../services/paymentService';
import { getProductById } from '../../services/productService';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import CartSummary from '../../components/Cart/CartSummary';
import { getImageUrl, formatCurrency } from '../../utils/funcionesReutilizables';

// Componente para el producto en el carrito
const CartItem = ({ item, updateQuantity, removeFromCart, getValidStock }) => {
    // Referencia para controlar las operaciones pendientes por ID de producto
    const pendingOperation = useRef(false);
    // Estado para controlar la edición manual de cantidad
    const [isEditing, setIsEditing] = useState(false);
    const [inputQuantity, setInputQuantity] = useState(item.quantity);
    // Referencia para el input de cantidad
    const inputRef = useRef(null);

    // Efecto para enfocar el input cuando se activa la edición
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    // Actualizar el inputQuantity cuando cambia la cantidad del item
    useEffect(() => {
        setInputQuantity(item.quantity);
    }, [item.quantity]);

    // Función para manejar el incremento/decremento con mecanismo de bloqueo
    const handleQuantityUpdate = (productId, newQuantity) => {
        // Si hay una operación pendiente, ignorar el clic adicional
        if (pendingOperation.current) {
            console.log(`Operación en curso para el producto ${productId}, ignorando clic adicional`);
            return;
        }

        // Validar que la cantidad no exceda el stock
        if (newQuantity > item.inventario.stockUnidades) {
            toast.error(`Solo hay ${item.inventario.stockUnidades} unidades disponibles`);
            return;
        }

        // Validar que la cantidad sea al menos 1
        if (newQuantity < 1) {
            newQuantity = 1;
        }

        // Establecer el bloqueo
        pendingOperation.current = true;

        // Actualizar la cantidad
        updateQuantity(productId, newQuantity)
            .finally(() => {
                // Asegurar que el bloqueo siempre se libera cuando termina la operación
                setTimeout(() => {
                    pendingOperation.current = false;
                }, 300); // Pequeño retraso para prevenir doble clic muy rápido
            });
    };

    // Función para manejar el cambio en el input
    const handleInputChange = (e) => {
        // Permitir solo números
        const value = e.target.value.replace(/[^0-9]/g, '');
        setInputQuantity(value === '' ? '' : parseInt(value, 10) || 0);
    };

    // Función para confirmar la cantidad ingresada
    const handleQuantityConfirm = () => {
        let newQuantity = inputQuantity;
        
        // Si está vacío o es 0, establecer a 1
        if (newQuantity === '' || newQuantity < 1) {
            newQuantity = 1;
        }
        
        // Si excede el stock, limitar al stock disponible
        if (newQuantity > item.inventario.stockUnidades) {
            newQuantity = item.inventario.stockUnidades;
            toast.error(`La cantidad ha sido ajustada al stock disponible: ${item.inventario.stockUnidades}`);
        }
        
        // Actualizar solo si la cantidad cambió
        if (newQuantity !== item.quantity) {
            handleQuantityUpdate(item._id, newQuantity);
        }
        
        setInputQuantity(newQuantity);
        setIsEditing(false);
    };

    // Manejar la tecla Enter para confirmar y Escape para cancelar
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleQuantityConfirm();
        } else if (e.key === 'Escape') {
            setInputQuantity(item.quantity);
            setIsEditing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-4 border border-gray-100 hover:shadow-md transition-all"
        >
            <div className="flex items-center space-x-4 w-full md:w-auto mb-4 md:mb-0">
                <div className="relative h-24 w-24 overflow-hidden rounded-md">
                    <img
                        src={getImageUrl(item.multimedia.imagenes[0].url)}
                        alt={item.nombre}
                        className="h-full w-full object-cover transition-transform hover:scale-110"
                    />
                </div>
                <div>
                    <Link to={`/product/${item.slug}`} className="font-medium text-lg text-gray-800 hover:text-blue-600 transition-colors">
                        {item.nombre}
                    </Link>
                    <p className="text-blue-600 font-bold">{formatCurrency(item.precioFinal)}</p>
                    <p className="text-sm text-gray-500">
                        Stock disponible: {item.inventario.stockUnidades}
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleQuantityUpdate(item._id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                        disabled={item.quantity <= 1 || pendingOperation.current}
                    >
                        -
                    </button>
                    
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputQuantity}
                            onChange={handleInputChange}
                            onBlur={handleQuantityConfirm}
                            onKeyDown={handleKeyDown}
                            className="w-12 text-center border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                            disabled={pendingOperation.current}
                        />
                    ) : (
                        <span 
                            className="w-12 text-center cursor-pointer hover:bg-gray-100 py-1 rounded-md"
                            onClick={() => !pendingOperation.current && setIsEditing(true)}
                        >
                            {item.quantity}
                        </span>
                    )}
                    
                    <button
                        onClick={() => handleQuantityUpdate(item._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                        disabled={item.quantity >= item.inventario.stockUnidades || pendingOperation.current}
                    >
                        +
                    </button>
                </div>

                <div className="text-right">
                    <p className="font-bold">{formatCurrency(item.precioFinal * item.quantity)}</p>
                </div>

                <button
                    onClick={() => removeFromCart(item._id)}
                    className="ml-2 text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                    aria-label="Eliminar producto"
                    disabled={pendingOperation.current}
                >
                    <FiTrash2 size={18} />
                </button>
            </div>
        </motion.div>
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
                const lastRefreshTime = localStorage.getItem('lastCartRefresh');
                const now = Date.now();

                if (lastRefreshTime && (now - parseInt(lastRefreshTime)) < 3000) {
                    console.log('Recarga reciente detectada, omitiendo actualización');
                    return;
                }

                setIsRefreshing(true);
                localStorage.setItem('lastCartRefresh', now.toString());

                try {
                    const serverCartResponse = await getCart(token);

                    if (!serverCartResponse?.cart?.products?.length) {
                        setIsRefreshing(false);
                        return;
                    }

                    const serverCartItems = [];

                    for (const item of serverCartResponse.cart.products) {
                        try {
                            // Verificar si tenemos el ID del producto, ya sea como string o como objeto
                            const productId = typeof item.productId === 'object' ? item.productId._id : item.productId;
                            
                            if (!productId) {
                                console.warn('Item sin productId encontrado en el carrito');
                                continue;
                            }

                            const productResponse = await getProductById(productId);
                            
                            if (!productResponse.success || !productResponse.product) {
                                console.warn(`No se pudo obtener el producto ${productId}: ${productResponse.msg}`);
                                continue;
                            }

                            const product = productResponse.product;

                            if (!product.nombre || !product.multimedia?.imagenes || !product.precioFinal) {
                                console.warn(`Producto ${productId} con datos incompletos:`, product);
                                continue;
                            }

                            serverCartItems.push({
                                _id: productId,
                                nombre: product.nombre,
                                precioFinal: product.precioFinal,
                                precioTransferencia: product.precioTransferencia,
                                multimedia: product.multimedia,
                                quantity: item.quantity || 1,
                                inventario: product.inventario || { stockUnidades: 0 },
                                ...product
                            });
                        } catch (error) {
                            console.error(`Error al obtener detalles del producto ${item.productId}:`, error);
                            toast.error(`No se pudo cargar un producto del carrito`);
                        }
                    }

                    if (serverCartItems.length > 0) {
                        setLocalCartItems(serverCartItems);
                        localStorage.setItem('cart', JSON.stringify(serverCartItems));
                    } else if (serverCartResponse.cart.products.length > 0) {
                        toast.error('Hubo problemas al cargar algunos productos del carrito');
                    }
                } catch (error) {
                    console.error('Error al obtener el carrito del servidor:', error);
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
        return cartItems.reduce((total, item) => total + (item.precioFinal * item.quantity), 0);
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
        </div>
    );
}

export { CarroDeCompras };