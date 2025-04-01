import { useEffect, useState, useMemo, useCallback } from "react";
import { getOrders } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import { Pagination } from "../../components/Pagination";
import { OrderItem } from "../../components/Orders/OrderItem";
import { enviarEmailConfirmacionOrden } from "../../services/utilService";
import { HiMail } from "react-icons/hi";
import { toast } from "react-hot-toast";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(5);
    const { token } = useAuth();
    const [sortOrder, setSortOrder] = useState('desc');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sendingEmail, setSendingEmail] = useState(false);

    const statusOptions = {
        all: 'Todos',
        pending: 'Pendiente',
        completed: 'En Curso',
        finalized: 'Finalizado',
        canceled: 'Cancelado'
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setError(null);
                const response = await getOrders(token);
                if (response.success) {
                    setOrders(response.orders);
                } else {
                    setError(response.message || 'Error al cargar los pedidos');
                }
            } catch (error) {
                setError(error.message || 'Error al cargar los pedidos');
                console.error('Error al cargar órdenes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    const formatDate = useCallback((dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }, []);

    const getStatusBadgeColor = useCallback((status) => {
        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            finalized: 'bg-blue-100 text-blue-800',
            canceled: 'bg-red-100 text-red-800'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    }, []);

    const filteredAndSortedOrders = useMemo(() => {
        let result = [...orders];
        
        if (statusFilter !== 'all') {
            result = result.filter(order => order.status === statusFilter);
        }

        return result.sort((a, b) => {
            return sortOrder === 'desc' 
                ? new Date(b.orderDate) - new Date(a.orderDate)
                : new Date(a.orderDate) - new Date(b.orderDate);
        });
    }, [orders, statusFilter, sortOrder]);

    const currentOrders = useMemo(() => {
        const indexOfLastOrder = currentPage * ordersPerPage;
        const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
        return filteredAndSortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    }, [currentPage, ordersPerPage, filteredAndSortedOrders]);

    const totalPages = Math.ceil(filteredAndSortedOrders.length / ordersPerPage);

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

    const handleSendEmail = async (orderId) => {
        if (!window.confirm('¿Deseas recibir los detalles de esta orden por correo electrónico?')) {
            return;
        }

        try {
            setSendingEmail(true);
            await enviarEmailConfirmacionOrden(orderId, token);
            toast.success('Correo enviado correctamente');
        } catch (error) {
            toast.error('Error al enviar el correo');
            console.error('Error al enviar correo:', error);
        } finally {
            setSendingEmail(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Pedidos</h1>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600 dark:text-gray-300">Estado:</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        >
                            {Object.entries(statusOptions).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600 dark:text-gray-300">Ordenar por fecha:</label>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        >
                            <option value="desc">Más recientes primero</option>
                            <option value="asc">Más antiguos primero</option>
                        </select>
                    </div>
                </div>
            </div>

            {filteredAndSortedOrders.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No tienes pedidos realizados.</p>
            ) : (
                <div className="space-y-4">
                    {currentOrders.map((order) => (
                        <div key={order._id} className="relative">
                            <OrderItem
                                order={order}
                                formatDate={formatDate}
                                getStatusBadgeColor={getStatusBadgeColor}
                            />
                            <button
                                onClick={() => handleSendEmail(order._id)}
                                disabled={sendingEmail}
                                className="absolute bottom-4 right-4 p-2 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors duration-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                title="Enviar detalles por correo"
                            >
                                <HiMail className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            {filteredAndSortedOrders.length > ordersPerPage && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};

export { MyOrders };