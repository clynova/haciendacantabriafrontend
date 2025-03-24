import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllOrders, updateOrderStatus } from '../../services/adminService';
import { FiSearch, FiDownload, FiFilter, FiRefreshCcw } from 'react-icons/fi';
import { formatCurrency } from '../../utils/funcionesReutilizables';
import { toast } from 'react-hot-toast';

const AdminOrders = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [showModal, setShowModal] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getAllOrders(token);
            if (response.success) {
                setOrders(response.orders);
            } else {
                setError(response.msg || 'Error al cargar los pedidos');
            }
        } catch (error) {
            setError(error.msg || 'Error al cargar los pedidos');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        if (!window.confirm(`¿Estás seguro de cambiar el estado a ${newStatus}?`)) {
            return;
        }

        try {
            setIsUpdatingStatus(true);
            const response = await updateOrderStatus(orderId, newStatus, token);
            if (response.success) {
                toast.success('Estado actualizado correctamente');
                fetchOrders(); // Recargar órdenes
            }
        } catch (error) {
            toast.error(error.msg || 'Error al actualizar el estado');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const formatDate = useCallback((dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    const getStatusBadgeColor = useCallback((status) => {
        const statusColors = {
            'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'completed': 'bg-green-100 text-green-800 border-green-200',
            'canceled': 'bg-red-100 text-red-800 border-red-200',
            'finalized': 'bg-blue-100 text-blue-800 border-blue-200'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    }, []);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            const matchesSearch = searchTerm === '' || 
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.userId.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.userId.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.userId.email.toLowerCase().includes(searchTerm.toLowerCase());
            const orderDate = new Date(order.orderDate);
            const matchesDate = (!dateRange.start || orderDate >= new Date(dateRange.start)) &&
                              (!dateRange.end || orderDate <= new Date(dateRange.end));
            
            return matchesStatus && matchesSearch && matchesDate;
        });
    }, [orders, statusFilter, searchTerm, dateRange]);

    const exportToCSV = () => {
        const headers = ['ID', 'Cliente', 'Estado', 'Fecha', 'Total', 'Método de Pago', 'Estado de Pago'];
        const data = filteredOrders.map(order => [
            order._id,
            `${order.userId.firstName} ${order.userId.lastName}`,
            order.status,
            formatDate(order.orderDate),
            order.total,
            order.payment.provider,
            order.payment.status
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + 
            [headers.join(','), ...data.map(row => row.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `ordenes_${new Date().toISOString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const OrderModal = ({ order, onClose }) => {
        if (!order) return null;
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            Detalles del Pedido #{order._id.slice(-6)}
                        </h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            ×
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Información del Cliente */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Información del Cliente</h4>
                            <p>Nombre: {order.userId.firstName} {order.userId.lastName}</p>
                            <p>Email: {order.userId.email}</p>
                        </div>

                        {/* Dirección de Envío */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Dirección de Envío</h4>
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                            <p>Tel: {order.shippingAddress.phoneContact}</p>
                            <p>Referencia: {order.shippingAddress.reference}</p>
                        </div>

                        {/* Información de Pago */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Información de Pago</h4>
                            <p>Método: {order.payment.provider}</p>
                            <p>Estado: {order.payment.status}</p>
                            <p>Monto: {formatCurrency(order.payment.amount)}</p>
                        </div>

                        {/* Información de Envío */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Información de Envío</h4>
                            <p>Método: {order.shipping.method}</p>
                            <p>Transportista: {order.shipping.carrier.name}</p>
                            <p>Costo: {formatCurrency(order.shipping.cost)}</p>
                            {order.shipping.trackingNumber && (
                                <p>Tracking: {order.shipping.trackingNumber}</p>
                            )}
                        </div>
                    </div>

                    {/* Productos */}
                    <div className="mt-8">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Productos</h4>
                        <div className="space-y-4">
                            {order.products.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 border-b pb-4">
                                    <img 
                                        src={item.product.multimedia.imagenes[0].url}
                                        alt={item.product.nombre}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h5 className="font-medium">{item.product.nombre}</h5>
                                        <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                                        <p className="text-sm text-gray-600">Precio: {formatCurrency(item.price)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totales y Estado */}
                    <div className="mt-6 border-t pt-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p>Subtotal: {formatCurrency(order.subtotal)}</p>
                                <p>Envío: {formatCurrency(order.shipping.cost)}</p>
                                <p className="font-bold">Total: {formatCurrency(order.total)}</p>
                            </div>
                            <div className="space-x-2">
                                {['pending', 'completed', 'canceled', 'finalized'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusUpdate(order._id, status)}
                                        disabled={order.status === status || isUpdatingStatus}
                                        className={`px-4 py-2 rounded-lg ${
                                            order.status === status
                                                ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
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
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header y Filtros */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Administración de Órdenes</h1>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            <FiDownload />
                            Exportar CSV
                        </button>
                        <button
                            onClick={fetchOrders}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            <FiRefreshCcw />
                            Actualizar
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por ID, cliente o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="pending">Pendiente</option>
                            <option value="completed">Completado</option>
                            <option value="canceled">Cancelado</option>
                            <option value="finalized">Finalizado</option>
                        </select>
                    </div>

                    <div>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Tabla de Órdenes */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Método de Pago
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Estado de Pago
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        #{order._id.slice(-6)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            {order.userId.firstName} {order.userId.lastName}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {order.userId.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 text-xs rounded-full border ${getStatusBadgeColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(order.orderDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {formatCurrency(order.total)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {order.payment.provider}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 text-xs rounded-full ${
                                            order.payment.status === 'completed'
                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                        }`}>
                                            {order.payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setShowModal(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            Ver Detalles
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Detalles */}
            {showModal && (
                <OrderModal
                    order={selectedOrder}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedOrder(null);
                    }}
                />
            )}
        </div>
    );
};

export { AdminOrders };