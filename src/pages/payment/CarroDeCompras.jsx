import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCart, removeProductFromCart } from '../../services/paymentService';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import CartSummary from '../../components/Cart/CartSummary';
import { formatCurrency } from '../../utils/funcionesReutilizables';

// Componente para el producto en el carrito con nueva estructura de datos
const CartItem = ({ item, updateQuantity, removeFromCart, validateStock, addToCart }) => {
    // Referencia para controlar las operaciones pendientes por ID de producto
    const pendingOperation = useRef(false);
    // Estado para controlar la edición manual de cantidad
    const [isEditing, setIsEditing] = useState(false);
    const [inputQuantity, setInputQuantity] = useState(item.quantity);
    // Referencia para el input de cantidad
    const inputRef = useRef(null);

    // Obtener información del producto y la variante
    const product = item.productId;
    const variant = item.variant;
    
    // Buscar la información de precio y stock para esta variante
    const variantInfo = product.precioVariantesPorPeso?.find(v => v.pesoId === variant.pesoId);
    
    // Usar el precio final si está disponible, de lo contrario usar el precio normal
    const price = variantInfo?.precioFinal || variant.precio;
    const availableStock = variantInfo?.stockDisponible || 0;
    
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
    const handleQuantityUpdate = (change) => {
        // Si hay una operación pendiente, ignorar el clic adicional
        if (pendingOperation.current) {
            console.log(`Operación en curso para el producto ${product._id}, ignorando clic adicional`);
            return;
        }

        const newQuantity = change > 0 ? item.quantity + 1 : item.quantity - 1;

        // Validar que la cantidad no exceda el stock
        if (newQuantity > availableStock) {
            toast.error(`Solo hay ${availableStock} unidades disponibles`);
            return;
        }

        // Validar que la cantidad sea al menos 1
        if (newQuantity < 1) {
            return;
        }

        // Establecer el bloqueo
        pendingOperation.current = true;

        // Actualizar la cantidad - enviamos solo +1 o -1 como cantidad, no la cantidad total
        // Esto soluciona el problema de multiplicación exponencial de cantidades
        updateQuantity(product._id, variant.pesoId, 1, change > 0 ? 'increment' : 'decrement')
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
        if (newQuantity > availableStock) {
            newQuantity = availableStock;
            toast.error(`La cantidad ha sido ajustada al stock disponible: ${availableStock}`);
        }
        
        // Actualizar solo si la cantidad cambió
        if (newQuantity !== item.quantity) {
            // Establecer el bloqueo para evitar múltiples operaciones
            pendingOperation.current = true;
            
            // Usar updateQuantity con action="set" para actualizar la cantidad directamente
            updateQuantity(product._id, variant.pesoId, newQuantity, 'set')
                .finally(() => {
                    setTimeout(() => {
                        pendingOperation.current = false;
                    }, 300);
                });
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

    // Función para obtener la URL de la imagen principal
    const getImageUrl = () => {
        if (product && product.multimedia && product.multimedia.imagenes && product.multimedia.imagenes.length > 0) {
            return product.multimedia.imagenes[0].url;
        }
        return '/images/optimized/placeholder-large.webp'; // Imagen por defecto
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
                        src={getImageUrl()}
                        alt={product.nombre}
                        className="h-full w-full object-cover transition-transform hover:scale-110"
                    />
                </div>
                <div>
                    <Link to={`/product/${product.slug}`} className="font-medium text-lg text-gray-800 hover:text-blue-600 transition-colors">
                        {product.nombre}
                    </Link>
                    <p className="text-sm text-gray-600">{variant.peso} {variant.unidad}</p>
                    <p className="text-blue-600 font-bold">{formatCurrency(price)}</p>
                    <p className="text-sm text-gray-500">
                        Stock disponible: {availableStock}
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleQuantityUpdate(-1)}
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
                        onClick={() => handleQuantityUpdate(1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                        disabled={item.quantity >= availableStock || pendingOperation.current}
                    >
                        +
                    </button>
                </div>

                <div className="text-right">
                    <p className="font-bold">{formatCurrency(price * item.quantity)}</p>
                </div>

                <button
                    onClick={() => removeFromCart(product._id, variant.pesoId)}
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
    const { cartItems, removeFromCart, updateQuantity, validateCartStock, addToCart } = useCart();
    const { token, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Efecto para mantener actualizado el carrito local desde el servidor
    useEffect(() => {
        const refreshCartFromServer = async () => {
            if (isAuthenticated && token && !isRefreshing) {
                setIsRefreshing(true);
                try {
                    await getCart(token);
                } catch (error) {
                    console.error('Error al obtener el carrito del servidor:', error);
                } finally {
                    setIsRefreshing(false);
                }
            }
        };

        refreshCartFromServer();
    }, [isAuthenticated, token, isRefreshing]);

    // Función para actualizar la cantidad de un producto con la nueva estructura
    const handleUpdateQuantity = async (productId, variantId, quantity, action) => {
        return updateQuantity(productId, variantId, quantity, action);
    };

    // Función para eliminar un producto del carrito con la nueva estructura
    const handleRemoveFromCart = async (productId, variantId) => {
        return removeFromCart(productId, variantId);
    };
    
    // Función para agregar un producto al carrito (usada en la edición manual de cantidades)
    const handleAddToCart = async (product, variant, quantity, showNotification) => {
        return addToCart(product, variant, quantity, showNotification);
    };

    const handleContinue = () => {
        if (!validateCartStock()) {
            return;
        }
        navigate('/checkout/envio');
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

    // Calcular el subtotal del carrito usando la nueva estructura
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const product = item.productId;
            const variant = item.variant;
            
            // Buscar la información de precio para esta variante
            const variantInfo = product.precioVariantesPorPeso?.find(v => v.pesoId === variant.pesoId);
            
            // Usar el precio final si está disponible, de lo contrario usar el precio normal
            const price = variantInfo?.precioFinal || variant.precio;
            
            return total + (price * item.quantity);
        }, 0);
    };

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
                            {cartItems.map((item, index) => (
                                <CartItem
                                    key={`${item.productId._id}-${item.variant.pesoId}-${index}`}
                                    item={item}
                                    updateQuantity={handleUpdateQuantity}
                                    removeFromCart={handleRemoveFromCart}
                                    validateStock={validateCartStock}
                                    addToCart={handleAddToCart}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <CartSummary
                            cartItems={cartItems}
                            onContinue={handleContinue}
                            calculateSubtotal={calculateSubtotal}
                            buttonText="Continuar con el envío"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export { CarroDeCompras };