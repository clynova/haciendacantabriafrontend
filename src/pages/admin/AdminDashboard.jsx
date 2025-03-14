import { useEffect, useState } from 'react';
import { FiBox, FiUsers, FiList, FiTag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats } from '../../services/adminService';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalTags: 0,
        uniqueTags: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getDashboardStats(token);
                console.log(response)
                if (response.success) {
                    setStats(response.data);
                }
            } catch (err) {
                setError(err.msg || 'Error al cargar las estadísticas');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
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
            </div>
        </div>
    );
}

export { AdminDashboard };