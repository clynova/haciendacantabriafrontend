import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllOrders, updateOrderStatus } from '../../services/adminService';
import { HiSearch, HiDownload, HiRefresh, HiEye, HiCheckCircle, HiXCircle, HiMail } from 'react-icons/hi';
import { formatCurrency } from '../../utils/funcionesReutilizables';
import { toast } from 'react-hot-toast';
import { enviarEmailConfirmacionOrden } from '../../services/utilService';

const AdminOrders = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);

    const handleSendEmail = async (orderId) => {
        if (!window.confirm('¿Deseas enviar los detalles de esta orden por correo electrónico al cliente?')) {
            return;
        }

        try {
            setSendingEmail(true);
            await enviarEmailConfirmacionOrden(orderId, token);
            toast.success('Correo enviado correctamente al cliente');
        } catch (error) {
            toast.error('Error al enviar el correo');
            console.error('Error al enviar correo:', error);
        } finally {
            setSendingEmail(false);
        }
    };

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
                fetchOrders();
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
    }, []);

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending':
                return 'Pendiente';
            case 'completed':
                return 'En curso';
            case 'canceled':
                return 'Cancelado';
            case 'finalized':
                return 'Finalizado';
            default:
                return status;
        }
    };

    const filteredOrders = orders.filter(order => {
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Gestión de Pedidos</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    >
                        <HiDownload className="h-5 w-5" />
                        Exportar CSV
                    </button>
                    <button
                        onClick={fetchOrders}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                        <HiRefresh className="h-5 w-5" />
                        Actualizar
                    </button>
                </div>
            </div>

            <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
                {/* Filtros */}
                <div className="p-4 border-b border-slate-700 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <HiSearch className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar por ID o cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="pending">Pendientes</option>
                        <option value="completed">En Curso</option>
                        <option value="canceled">Cancelados</option>
                        <option value="finalized">Finalizados</option>
                    </select>

                    <div className="relative">
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                    Método de Pago
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                    Estado de Pago
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-slate-700/30">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-200">
                                                {order.userId.firstName} {order.userId.lastName}
                                            </span>
                                            <span className="text-sm text-slate-400">{order.userId.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                        {formatDate(order.orderDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                        {formatCurrency(order.total)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                        {order.payment.provider}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            order.payment.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {order.payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end space-x-2">
                                            {order.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(order._id, 'completed')}
                                                        className="text-green-400 hover:text-green-300"
                                                        title="En Curso"
                                                    >
                                                        <HiCheckCircle className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(order._id, 'canceled')}
                                                        className="text-red-400 hover:text-red-300"
                                                        title="Cancelar"
                                                    >
                                                        <HiXCircle className="h-5 w-5" />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleSendEmail(order._id)}
                                                disabled={sendingEmail}
                                                className="text-blue-400 hover:text-blue-300"
                                                title="Enviar detalles por correo al cliente"
                                            >
                                                <HiMail className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/orders/${order._id}`)}
                                                className="text-blue-400 hover:text-blue-300"
                                                title="Ver detalles"
                                            >
                                                <HiEye className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export { AdminOrders };