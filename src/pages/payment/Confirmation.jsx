import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
//import { getOrderDetails, getPaymentStatus } from '../../services/checkoutService';
import { getPaymentStatus } from '../../services/checkoutService';
import { formatCurrency } from '../../utils/funcionesReutilizables';
import { HiCheck, HiOutlineShoppingBag, HiOutlineClock, HiOutlineUser, HiOutlineLocationMarker, HiOutlineTruck } from 'react-icons/hi';

// Barra de progreso para el checkout
const CheckoutProgress = () => (
    <div className="mb-8">
        <div className="flex justify-between">
            <div className="text-gray-400">Carrito</div>
            <div className="text-gray-400">Envío</div>
            <div className="text-gray-400">Pago</div>
            <div className="text-blue-500 font-medium">Confirmación</div>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full">
            <div className="h-full w-full bg-blue-500 rounded-full"></div>
        </div>
    </div>
);

const OrderSummaryItem = ({ item }) => {
    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-start space-x-3">
                <div className="font-medium text-gray-700">{item.quantity}x</div>
                <div>
                    <div className="text-gray-800">{item.product.nombre}</div>
                    <div className="text-sm text-gray-500">
                        {item.variant.peso} {item.variant.unidad} - {item.variant.sku}
                    </div>
                </div>
            </div>
            <div className="font-medium">{formatCurrency(item.totalPrice)}</div>
        </div>
    );
};

const Confirmation = () => {
    const { clearCart } = useCart();
    const { token } = useAuth();
    const [orderStatus, setOrderStatus] = useState('processing');
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const orderId = params.get('order_id') || location.state?.orderId;

        if (!orderId) {
            toast.error('No se encontró la orden');
            navigate('/');
            return;
        }

        // Limpiar el carrito
        clearCart();

        // Obtener los detalles de la orden
        const fetchOrderDetails = async () => {
            setLoading(true);
            try {
                // Primero verificar el estado del pago
                const paymentStatusResponse = await getPaymentStatus(orderId, token);
                if (paymentStatusResponse.success) {
                    setOrderStatus(paymentStatusResponse.paymentStatus || 'completed');
                }
                
                // Luego obtener los detalles completos de la orden
           /*     const orderResponse = await getOrderDetails(orderId, token);
                if (orderResponse.success && orderResponse.order) {
                    setOrderDetails(orderResponse.order);
                } else {
                    toast.error('Error al obtener detalles de la orden');
                }
*/

            } catch (error) {
                console.error('Error obteniendo detalles de la orden:', error);
                setOrderStatus('completed'); // Asumimos éxito por defecto
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [location, navigate, clearCart, token]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <CheckoutProgress />
                <div className="text-center py-12">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-700">Procesando tu orden...</h2>
                    <p className="text-gray-600 mt-2">Estamos confirmando los detalles de tu pedido</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <CheckoutProgress />
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 bg-green-50 border-b border-green-100">
                    <div className="flex items-center space-x-4">
                        <div className="bg-green-500 p-3 rounded-full">
                            <HiCheck className="text-white text-xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">¡Pedido Confirmado!</h2>
                            <p className="text-gray-600">
                                Gracias por tu compra. Recibirás un correo electrónico con los detalles de tu pedido.
                            </p>
                        </div>
                    </div>
                </div>
                
                {orderDetails && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                                    <HiOutlineShoppingBag className="mr-2" /> Detalles del Pedido
                                </h3>
                                <p className="text-sm text-gray-600">Pedido #{orderDetails._id}</p>
                                <p className="text-sm text-gray-600">Fecha: {new Date(orderDetails.createdAt).toLocaleDateString()}</p>
                                <div className="mt-2">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                        orderStatus === 'completed' ? 'bg-green-100 text-green-800' : 
                                        orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {orderStatus === 'completed' ? 'Completado' : 
                                         orderStatus === 'processing' ? 'En proceso' : 
                                         'Pendiente'}
                                    </span>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                                    <HiOutlineUser className="mr-2" /> Información del Cliente
                                </h3>
                                <p className="text-sm text-gray-600">{orderDetails.shipping?.recipientName}</p>
                                <p className="text-sm text-gray-600">{orderDetails.shipping?.phoneContact}</p>
                            </div>
                            
                            <div>
                                <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                                    <HiOutlineLocationMarker className="mr-2" /> Dirección de Envío
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {orderDetails.shipping?.address?.street} {orderDetails.shipping?.address?.number},
                                    {orderDetails.shipping?.address?.interior && ` Int. ${orderDetails.shipping?.address?.interior},`}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {orderDetails.shipping?.address?.suburb}, {orderDetails.shipping?.address?.city}, {orderDetails.shipping?.address?.state}
                                </p>
                                <p className="text-sm text-gray-600">CP: {orderDetails.shipping?.address?.zipCode}</p>
                            </div>
                            
                            <div>
                                <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                                    <HiOutlineTruck className="mr-2" /> Método de Envío
                                </h3>
                                <p className="text-sm text-gray-600">{orderDetails.shipping?.method?.name}</p>
                                <p className="text-sm text-gray-600">Tiempo estimado: {orderDetails.shipping?.method?.delivery_time}</p>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="font-medium text-gray-800 mb-4">Resumen del Pedido</h3>
                            
                            <div className="space-y-2 mb-6">
                                {orderDetails.products?.map((item, index) => (
                                    <OrderSummaryItem key={index} item={item} />
                                ))}
                            </div>
                            
                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">{formatCurrency(orderDetails.summary?.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Envío</span>
                                    <span className="font-medium">{formatCurrency(orderDetails.summary?.shippingCost)}</span>
                                </div>
                                {orderDetails.summary?.paymentFee > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Comisión de pago</span>
                                        <span className="font-medium">{formatCurrency(orderDetails.summary?.paymentFee)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                                    <span className="font-bold">Total</span>
                                    <span className="font-bold">{formatCurrency(orderDetails.summary?.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <div className="flex justify-between">
                        <button 
                            onClick={() => navigate('/')}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Volver a la tienda
                        </button>
                        <button 
                            onClick={() => navigate('/profile/orders')}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                            Ver mis pedidos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Confirmation };