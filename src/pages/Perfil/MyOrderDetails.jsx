import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOrderById } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl, formatCurrency } from '../../utils/funcionesReutilizables';

const MyOrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getOrderById(orderId, token);
                if (response.success) {
                    setOrder(response.order);
                } else {
                    setError(response.message || 'Error al cargar los detalles del pedido');
                }
            } catch (error) {
                setError(error.message || 'Error al cargar los detalles del pedido');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId, token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Detalles del Pedido #{order._id.slice(-6)}
                </h1>
                <button
                    onClick={() => navigate('/profile/orders')}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                >
                    Volver a Pedidos
                </button>
            </div>

            <div className="space-y-6">
                {/* Estado y Fecha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                        <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">Estado del Pedido</h2>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                            order.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' :
                            order.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400' :
                            'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                        }`}>
                            {order.status === 'completed' ? 'Completado' :
                             order.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                        </span>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                        <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">Fecha del Pedido</h2>
                        <p className="text-gray-700 dark:text-gray-300">{new Date(order.orderDate).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                    </div>
                </div>

                {/* Productos */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
                    <h2 className="font-semibold mb-4 text-gray-900 dark:text-white">Productos</h2>
                    <div className="space-y-4">
                        {order.products.map((item) => (
                            <div key={item.product._id} className="flex justify-between items-center border-b dark:border-gray-600/50 pb-2">
                                <div className="flex items-center space-x-4">
                                    <img 
                                        src={getImageUrl(item.product.multimedia.imagenes[0])} 
                                        alt={item.product.nombre}
                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{item.product.nombre}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Cantidad: {item.quantity}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Precio unitario: {formatCurrency(item.product.precioFinal)}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {formatCurrency(item.product.precioFinal * item.quantity)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Información de Envío */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
                    <h2 className="font-semibold mb-4 text-gray-900 dark:text-white">Información de Envío</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Dirección de Envío</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {order.shippingAddress.recipientName}<br />
                                {order.shippingAddress.street}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                                {order.shippingAddress.country}, {order.shippingAddress.zipCode}<br />
                                Tel: {order.shippingAddress.phoneContact}
                            </p>
                            {order.shippingAddress.additionalInstructions && (
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    Instrucciones: {order.shippingAddress.additionalInstructions}
                                </p>
                            )}
                        </div>
                        <div>
                            <h3 className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Método de Envío</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {order.shipping.carrier.name} - {order.shipping.method}<br />
                                Costo de envío: {formatCurrency(order.shipping.cost)}
                            </p>
                            {order.shipping.trackingNumber && (
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Número de seguimiento: {order.shipping.trackingNumber}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Información de Pago */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
                    <h2 className="font-semibold mb-4 text-gray-900 dark:text-white">Información de Pago</h2>
                    <div className="space-y-2">
                        <p className="text-gray-700 dark:text-gray-300">Estado: {order.payment.status === 'completed' ? 'Completado' : 'Pendiente'}</p>
                        <p className="text-gray-700 dark:text-gray-300">Método: {order.payment.provider}</p>
                        {order.payment.paymentDetails && (
                            <>
                                <p className="text-gray-700 dark:text-gray-300">Número de tarjeta: ****{order.payment.paymentDetails.card_detail?.card_number}</p>
                                <p className="text-gray-700 dark:text-gray-300">Código de autorización: {order.payment.paymentDetails.authorization_code}</p>
                                <p className="text-gray-700 dark:text-gray-300">Fecha de transacción: {new Date(order.payment.paymentDetails.transaction_date).toLocaleString('es-ES')}</p>
                            </>
                        )}
                        <div className="mt-4 pt-4 border-t dark:border-gray-600/50">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
                                    <span className="text-gray-900 dark:text-white">{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700 dark:text-gray-300">Costo de envío:</span>
                                    <span className="text-gray-900 dark:text-white">{formatCurrency(order.shipping.cost)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                                    <span>Comisión {order.payment.provider} ({order.payment.commissionPercentage}%):</span>
                                    <span>{formatCurrency(order.payment.commissionAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-lg pt-2 border-t dark:border-gray-600/50">
                                    <span className="text-gray-900 dark:text-white">Total con comisión:</span>
                                    <span className="text-gray-900 dark:text-white">{formatCurrency(order.payment.amount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { MyOrderDetails };