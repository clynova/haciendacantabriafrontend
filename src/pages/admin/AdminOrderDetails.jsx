import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getOrderById, updateOrderStatus } from '../../services/adminService';
import { HiArrowLeft, HiUser, HiLocationMarker, HiCreditCard } from 'react-icons/hi';
import { formatCurrency } from '../../utils/funcionesReutilizables';
import { toast } from 'react-hot-toast';

const AdminOrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const response = await getOrderById(orderId, token);
                if (response.success) {
                    setOrder(response.order);
                } else {
                    setError('No se pudo cargar la orden');
                }
            } catch (error) {
                setError(error.msg || 'Error al cargar los detalles de la orden');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId, token]);

    const handleStatusUpdate = async (newStatus) => {
        if (!window.confirm(`¿Estás seguro de cambiar el estado a ${newStatus}?`)) {
            return;
        }

        try {
            setIsUpdatingStatus(true);
            const response = await updateOrderStatus(orderId, newStatus, token);
            if (response.success) {
                toast.success('Estado actualizado correctamente');
                // Actualizar el estado de la orden en el estado local
                setOrder(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            toast.error(error.msg || 'Error al actualizar el estado');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'canceled':
                return 'bg-red-100 text-red-800';
            case 'finalized':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error || 'Orden no encontrada'}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="flex items-center text-slate-300 hover:text-white"
                >
                    <HiArrowLeft className="h-5 w-5 mr-2" />
                    Volver a pedidos
                </button>
            </div>

            <div className="bg-slate-800 rounded-xl shadow-xl">
                {/* Encabezado */}
                <div className="p-6 border-b border-slate-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-2">
                                Pedido #{order._id.slice(-6)}
                            </h1>
                            <p className="text-slate-400">
                                Creado el {formatDate(order.orderDate)}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Información del Cliente */}
                    <div className="bg-slate-700/30 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <HiUser className="h-5 w-5 text-blue-400" />
                            Información del Cliente
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-slate-400 text-sm">Nombre</p>
                                <p className="text-white">{order.userId.firstName} {order.userId.lastName}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Email</p>
                                <p className="text-white">{order.userId.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Información de Envío */}
                    <div className="bg-slate-700/30 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <HiLocationMarker className="h-5 w-5 text-blue-400" />
                            Información de Envío
                        </h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-slate-400 mb-2">Dirección de Entrega</h3>
                                <div className="space-y-1">
                                    <p className="text-white">{order.shippingAddress.street}</p>
                                    <p className="text-slate-300">
                                        {order.shippingAddress.city}, {order.shippingAddress.state}
                                    </p>
                                    <p className="text-slate-300">Tel: {order.shippingAddress.phoneContact}</p>
                                    {order.shippingAddress.reference && (
                                        <p className="text-slate-300">Referencia: {order.shippingAddress.reference}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-slate-400 mb-2">Método de Envío</h3>
                                <div className="space-y-1">
                                    <p className="text-white">{order.shipping.carrier.name}</p>
                                    <p className="text-slate-300">{order.shipping.method}</p>
                                    <p className="text-slate-300">Costo: {formatCurrency(order.shipping.cost)}</p>
                                    {order.shipping.trackingNumber && (
                                        <p className="text-slate-300">Tracking: {order.shipping.trackingNumber}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información de Pago */}
                    <div className="bg-slate-700/30 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <HiCreditCard className="h-5 w-5 text-blue-400" />
                            Información de Pago
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-slate-400 text-sm">Método</p>
                                <p className="text-white">{order.payment.provider}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Estado</p>
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    order.payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {order.payment.status}
                                </span>
                            </div>
                            <div className="col-span-2">
                                <p className="text-slate-400 text-sm">Monto</p>
                                <p className="text-white">{formatCurrency(order.payment.amount)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Productos */}
                    <div className="bg-slate-700/30 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Productos</h2>
                        <div className="divide-y divide-slate-600">
                            {order.products.map((item, index) => (
                                <div key={index} className="py-4 first:pt-0 last:pb-0">
                                    <div className="flex items-start gap-4">
                                        <img 
                                            src={item.product.multimedia.imagenes[0].url}
                                            alt={item.product.nombre}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="text-white font-medium">{item.product.nombre}</h3>
                                            <p className="text-slate-400 text-sm">
                                                {item.quantity} x {formatCurrency(item.price)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-medium">
                                                {formatCurrency(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totales y Estado */}
                    <div className="bg-slate-700/30 rounded-lg p-6">
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <div className="flex justify-between gap-8">
                                    <span className="text-slate-400">Subtotal:</span>
                                    <span className="text-white">{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between gap-8">
                                    <span className="text-slate-400">Envío:</span>
                                    <span className="text-white">{formatCurrency(order.shipping.cost)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-slate-600 gap-8">
                                    <span className="font-medium text-white">Total:</span>
                                    <span className="font-medium text-white">{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                            <div className="space-x-2">
                                {['pending', 'completed', 'canceled', 'finalized'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusUpdate(status)}
                                        disabled={order.status === status || isUpdatingStatus}
                                        className={`px-4 py-2 rounded-lg ${
                                            order.status === status
                                                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { AdminOrderDetails };