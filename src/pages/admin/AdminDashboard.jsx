import { useEffect, useState } from 'react';
import { FiBox, FiUsers, FiList, FiTag, FiDollarSign, FiCheckCircle, FiXCircle, FiClock, FiFlag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats, getTopTags, getTotalSales, getPaymentMethodById, getOrderStats } from '../../services/adminService';
import { formatCurrencyBoletas } from '../../utils/funcionesReutilizables';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalTags: 0,
        uniqueTags: []
    });
    const [topTags, setTopTags] = useState([]);
    const [salesData, setSalesData] = useState({
        totalSales: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        paymentMethods: [],
        monthlySales: []
    });
    const [orderStats, setOrderStats] = useState({
        pending: { count: 0, total: 0 },
        completed: { count: 0, total: 0 },
        finalized: { count: 0, total: 0 },
        canceled: { count: 0, total: 0 },
        totalOrders: 0,
        totalAmount: 0
    });
    const [paymentMethodsData, setPaymentMethodsData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Obtener estadísticas generales
                const response = await getDashboardStats(token);
                if (response.success) {
                    setStats(response.data);
                }
                
                // Obtener los top tags
                const topTagsResponse = await getTopTags(token);
                if (topTagsResponse.success) {
                    setTopTags(topTagsResponse.data);
                }
                
                // Obtener estadísticas de ventas
                const salesResponse = await getTotalSales(token);
                if (salesResponse.success) {
                    setSalesData(salesResponse.data);
                    
                    // Obtener los detalles de los métodos de pago
                    const methodsData = {};
                    const methodsPromises = salesResponse.data.paymentMethods.map(async method => {
                        try {
                            const methodResponse = await getPaymentMethodById(method.metodo, token);
                            if (methodResponse.success) {
                                methodsData[method.metodo] = methodResponse.data;
                            }
                        } catch (err) {
                            console.error(`Error obteniendo el método de pago ${method.metodo}:`, err);
                        }
                    });
                    
                    await Promise.all(methodsPromises);
                    setPaymentMethodsData(methodsData);
                }

                // Obtener estadísticas de órdenes
                const orderStatsResponse = await getOrderStats(token);
                if (orderStatsResponse.success) {
                    const { byStatus, totalOrders, totalAmount } = orderStatsResponse.data;
                    setOrderStats({
                        ...byStatus,
                        totalOrders,
                        totalAmount
                    });
                }
            } catch (err) {
                setError(err.msg || 'Error al cargar las estadísticas');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const statsCards = [
        {
            name: 'Productos',
            icon: FiBox,
            value: stats.totalProducts,
            to: '/admin/products',
            bgColor: 'bg-blue-500',
        },
        {
            name: 'Pedidos',
            icon: FiList,
            value: stats.totalOrders,
            to: '/admin/orders',
            bgColor: 'bg-green-500',
        },
        {
            name: 'Usuarios',
            icon: FiUsers,
            value: stats.totalUsers,
            to: '/admin/users',
            bgColor: 'bg-purple-500',
        },
        {
            name: 'Categorías',
            icon: FiTag,
            value: stats.totalTags,
            to: '/admin/categories',
            bgColor: 'bg-orange-500',
        },
    ];

    // Función para obtener el nombre del mes
    const getMonthName = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('es-ES', { month: 'long' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Última actualización: {new Date().toLocaleString()}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat) => (
                    <Link
                        key={stat.name}
                        to={stat.to}
                        className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {stat.name}
                                </p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Sección de estadísticas de ventas */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Estadísticas de Ventas
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Total de ventas */}
                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-4 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium opacity-80">Total de Ventas</p>
                                    <p className="text-2xl font-bold mt-1">{formatCurrencyBoletas(salesData.totalSales)}</p>
                                </div>
                                <FiDollarSign className="w-10 h-10 opacity-80" />
                            </div>
                        </div>
                        
                        {/* Total de órdenes */}
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium opacity-80">Total de Pedidos Finalizados</p>
                                    <p className="text-2xl font-bold mt-1">{salesData.totalOrders}</p>
                                </div>
                                <FiList className="w-10 h-10 opacity-80" />
                            </div>
                        </div>
                        
                        {/* Valor promedio de orden */}
                        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-4 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium opacity-80">Valor Promedio por Pedido</p>
                                    <p className="text-2xl font-bold mt-1">{formatCurrencyBoletas(salesData.avgOrderValue)}</p>
                                </div>
                                <FiDollarSign className="w-10 h-10 opacity-80" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Ventas mensuales - Convertido a tabla */}
                    {salesData.monthlySales.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                Ventas Mensuales
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                        <tr>
                                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Mes
                                            </th>
                                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Año
                                            </th>
                                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Ventas
                                            </th>
                                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Porcentaje
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {salesData.monthlySales.map((month, index) => {
                                            const maxTotal = Math.max(...salesData.monthlySales.map(m => m.total));
                                            const percentage = (month.total / maxTotal) * 100;
                                            
                                            return (
                                                <tr key={index}>
                                                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                                                        {getMonthName(month.month)}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                                                        {month.year}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                                                        {formatCurrencyBoletas(month.total)}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center">
                                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                                                                <div 
                                                                    className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full" 
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                                {percentage.toFixed(1)}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    
                    {/* Métodos de pago */}
                    {salesData.paymentMethods.length > 0 && (
                        <div>
                            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                Métodos de Pago
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                        <tr>
                                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Método
                                            </th>
                                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Monto
                                            </th>
                                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Porcentaje
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {salesData.paymentMethods.map((method, index) => {
                                            const percentage = (method.monto / salesData.totalSales) * 100;
                                            const methodName = paymentMethodsData[method.metodo]?.name || method.metodo;
                                            
                                            return (
                                                <tr key={index}>
                                                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                                                        <div className="flex items-center">
                                                            {methodName}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                                                        {formatCurrencyBoletas(method.monto)}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center">
                                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                                                                <div 
                                                                    className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full" 
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                                {percentage.toFixed(1)}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sección de estadísticas de órdenes */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Estadísticas de Órdenes
                    </h2>
                    
                    {/* Resumen general */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium opacity-80">Resumen General</p>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2">
                                    <div>
                                        <p className="text-xs opacity-70">Total de Órdenes</p>
                                        <p className="text-2xl font-bold">{orderStats.totalOrders}</p>
                                    </div>
                                </div>
                            </div>
                            <FiList className="w-12 h-12 opacity-80" />
                        </div>
                    </div>

                    {/* Estadísticas de órdenes por estado */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                        {/* Estadísticas de órdenes pendientes */}
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg p-4 text-white shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <FiClock className="h-5 w-5" />
                                        <h3 className="font-medium">Pendientes</h3>
                                    </div>
                                    <p className="text-3xl font-bold mt-2">{orderStats.pending.count}</p>
                                    <p className="text-sm mt-1 opacity-90">{formatCurrencyBoletas(orderStats.pending.total)}</p>
                                </div>
                                <div className="bg-white/20 rounded-full h-12 w-12 flex items-center justify-center">
                                    <span className="text-lg font-semibold">
                                        {orderStats.totalOrders ? 
                                            Math.round(orderStats.pending.count / orderStats.totalOrders * 100) : 0}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Estadísticas de órdenes completadas */}
                        <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-lg p-4 text-white shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <FiCheckCircle className="h-5 w-5" />
                                        <h3 className="font-medium">En Curso</h3>
                                    </div>
                                    <p className="text-3xl font-bold mt-2">{orderStats.completed.count}</p>
                                    <p className="text-sm mt-1 opacity-90">{formatCurrencyBoletas(orderStats.completed.total)}</p>
                                </div>
                                <div className="bg-white/20 rounded-full h-12 w-12 flex items-center justify-center">
                                    <span className="text-lg font-semibold">
                                        {orderStats.totalOrders ? 
                                            Math.round(orderStats.completed.count / orderStats.totalOrders * 100) : 0}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Estadísticas de órdenes finalizadas */}
                        <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg p-4 text-white shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <FiFlag className="h-5 w-5" />
                                        <h3 className="font-medium">Finalizadas</h3>
                                    </div>
                                    <p className="text-3xl font-bold mt-2">{orderStats.finalized.count}</p>
                                    <p className="text-sm mt-1 opacity-90">{formatCurrencyBoletas(orderStats.finalized.total)}</p>
                                </div>
                                <div className="bg-white/20 rounded-full h-12 w-12 flex items-center justify-center">
                                    <span className="text-lg font-semibold">
                                        {orderStats.totalOrders ? 
                                            Math.round(orderStats.finalized.count / orderStats.totalOrders * 100) : 0}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Estadísticas de órdenes canceladas */}
                        <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-lg p-4 text-white shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <FiXCircle className="h-5 w-5" />
                                        <h3 className="font-medium">Canceladas</h3>
                                    </div>
                                    <p className="text-3xl font-bold mt-2">{orderStats.canceled.count}</p>
                                    <p className="text-sm mt-1 opacity-90">{formatCurrencyBoletas(orderStats.canceled.total)}</p>
                                </div>
                                <div className="bg-white/20 rounded-full h-12 w-12 flex items-center justify-center">
                                    <span className="text-lg font-semibold">
                                        {orderStats.totalOrders ? 
                                            Math.round(orderStats.canceled.count / orderStats.totalOrders * 100) : 0}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visualización gráfica de la distribución de órdenes */}
                    <div>
                        <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            Distribución de Órdenes
                        </h3>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex">
                            {orderStats.totalOrders > 0 && (
                                <>
                                    <div 
                                        className="h-full bg-yellow-400" 
                                        style={{ width: `${(orderStats.pending.count / orderStats.totalOrders) * 100}%` }}
                                        title={`Pendientes: ${orderStats.pending.count} órdenes`}
                                    />
                                    <div 
                                        className="h-full bg-green-400" 
                                        style={{ width: `${(orderStats.completed.count / orderStats.totalOrders) * 100}%` }}
                                        title={`Completadas: ${orderStats.completed.count} órdenes`}
                                    />
                                    <div 
                                        className="h-full bg-blue-400" 
                                        style={{ width: `${(orderStats.finalized.count / orderStats.totalOrders) * 100}%` }}
                                        title={`Finalizadas: ${orderStats.finalized.count} órdenes`}
                                    />
                                    <div 
                                        className="h-full bg-red-400" 
                                        style={{ width: `${(orderStats.canceled.count / orderStats.totalOrders) * 100}%` }}
                                        title={`Canceladas: ${orderStats.canceled.count} órdenes`}
                                    />
                                </>
                            )}
                        </div>
                        <div className="flex justify-center mt-4 flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                <span className="text-xs text-gray-600 dark:text-gray-400">Pendientes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                <span className="text-xs text-gray-600 dark:text-gray-400">En Curso</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                <span className="text-xs text-gray-600 dark:text-gray-400">Finalizadas</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                <span className="text-xs text-gray-600 dark:text-gray-400">Canceladas</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Etiquetas Disponibles
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {stats.uniqueTags?.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 rounded-full text-sm"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Top 5 Etiquetas Más Utilizadas
                    </h2>
                    {topTags.length > 0 ? (
                        <div className="space-y-4">
                            {topTags.map((tag) => (
                                <div key={tag.nombre} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {tag.nombre}
                                    </span>
                                    <div className="flex items-center">
                                        <div className="w-36 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                                            <div 
                                                className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full" 
                                                style={{ width: `${(tag.frecuencia / Math.max(...topTags.map(t => t.frecuencia))) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                            {tag.frecuencia}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export { AdminDashboard };