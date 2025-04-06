import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOrderById } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { formatCurrencyBoletas } from '../../utils/funcionesReutilizables';
import { FiArrowLeft } from 'react-icons/fi';

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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadgeColor = (status) => {
        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
            completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            finalized: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            canceled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    };

    const getStatusLabel = (status) => {
        const statusLabels = {
            pending: 'Pendiente',
            completed: 'En Curso',
            finalized: 'Finalizado',
            canceled: 'Cancelado'
        };
        return statusLabels[status] || status;
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
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/profile/orders')}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Detalles del Pedido #{order._id.slice(-6)}
                    </h1>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                </span>
            </div>

            <div className="space-y-6">
                {/* Fecha y Resumen */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                        <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">Fecha del Pedido</h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            {formatDate(order.orderDate)}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                        <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">Resumen</h2>
                        <div className="flex justify-between">
                            <span className="text-gray-700 dark:text-gray-300">
                                {order.details?.length} {order.details?.length === 1 ? 'Producto' : 'Productos'}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {formatCurrencyBoletas(order.total)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Productos */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
                    <h2 className="font-semibold mb-4 text-gray-900 dark:text-white">Productos</h2>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {order.details?.map((detail) => (
                            <div key={detail._id} className="py-4 flex flex-col sm:flex-row justify-between">
                                <div className="flex space-x-4 mb-3 sm:mb-0">
                                    <img 
                                        src={detail.productSnapshot.imagen}
                                        alt={detail.productSnapshot.nombre}
                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                    />
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">{detail.productSnapshot.nombre}</h3>
                                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            <p>
                                                {detail.variant.peso} {detail.variant.unidad} • SKU: {detail.variant.sku}
                                            </p>
                                            <p>
                                                Categoría: {detail.productSnapshot.categoria}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        <p>Precio unitario: {formatCurrencyBoletas(detail.priceInfo.finalPrice)}</p>
                                        {detail.priceInfo.discountPercentage > 0 && (
                                            <p className="line-through text-xs">
                                                Original: {formatCurrencyBoletas(detail.priceInfo.basePrice)}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mt-1 flex items-center space-x-2">
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {detail.quantity} x
                                        </span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {formatCurrencyBoletas(detail.subtotal)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Información de Envío */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
                    <h2 className="font-semibold mb-4 text-gray-900 dark:text-white">Información de Envío</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    <span className="font-medium">Instrucciones:</span> {order.shippingAddress.additionalInstructions}
                                </p>
                            )}
                            {order.shippingAddress.reference && (
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium">Referencia:</span> {order.shippingAddress.reference}
                                </p>
                            )}
                        </div>
                        <div>
                            <h3 className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Método de Envío</h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p className="font-medium">{order.shipping.carrier.name}</p>
                                <p>Método: {order.shipping.method}</p>
                                <p>Costo de envío: {formatCurrencyBoletas(order.shippingCost)}</p>
                                
                                {order.estimatedDeliveryDate && (
                                    <p className="mt-2">
                                        <span className="font-medium">Entrega estimada:</span>
                                        <br />
                                        {formatDate(order.estimatedDeliveryDate)}
                                    </p>
                                )}
                                
                                {order.shipping.trackingNumber && (
                                    <p className="mt-2">
                                        <span className="font-medium">Número de seguimiento:</span> 
                                        <br />
                                        {order.shipping.trackingNumber}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información de Pago */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
                    <h2 className="font-semibold mb-4 text-gray-900 dark:text-white">Información de Pago</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Detalles del Pago</h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p>
                                    <span className="font-medium">Estado:</span> 
                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                        order.payment.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                    }`}>
                                        {order.payment.status === 'completed' ? 'Completado' : 'Pendiente'}
                                    </span>
                                </p>
                                <p className="mt-2">
                                    <span className="font-medium">Método:</span> {order.paymentMethod.name}
                                </p>
                                <p>
                                    <span className="font-medium">Proveedor:</span> {order.payment.provider}
                                </p>
                                
                                {order.payment.paymentDetails && (
                                    <div className="mt-4 space-y-1 border-t border-gray-200 dark:border-gray-600 pt-4">
                                        {order.payment.paymentDetails.card_detail?.card_number && (
                                            <p>
                                                <span className="font-medium">Número de tarjeta:</span> ****{order.payment.paymentDetails.card_detail.card_number}
                                            </p>
                                        )}
                                        {order.payment.paymentDetails.authorization_code && (
                                            <p>
                                                <span className="font-medium">Código de autorización:</span> {order.payment.paymentDetails.authorization_code}
                                            </p>
                                        )}
                                        {order.payment.paymentDetails.transaction_date && (
                                            <p>
                                                <span className="font-medium">Fecha de transacción:</span> {new Date(order.payment.paymentDetails.transaction_date).toLocaleString('es-ES')}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Resumen del Pago</h3>
                            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                <div className="divide-y divide-gray-200 dark:divide-gray-600">
                                    <div className="pb-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                                            <span className="text-gray-900 dark:text-white">{formatCurrencyBoletas(order.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-gray-600 dark:text-gray-300">Costo de envío:</span>
                                            <span className="text-gray-900 dark:text-white">{formatCurrencyBoletas(order.shippingCost)}</span>
                                        </div>
                                        {order.payment.commissionAmount > 0 && (
                                            <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span>Comisión {order.payment.provider} ({order.payment.commissionPercentage}%):</span>
                                                <span>{formatCurrencyBoletas(order.payment.commissionAmount)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-3">
                                        <div className="flex justify-between items-center font-bold">
                                            <span className="text-gray-900 dark:text-white">Total:</span>
                                            <span className="text-lg text-gray-900 dark:text-white">{formatCurrencyBoletas(order.total)}</span>
                                        </div>
                                    </div>
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