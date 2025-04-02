import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineSearch, HiChevronLeft, HiChevronRight, HiUserAdd, HiEye, HiStatusOnline, HiStatusOffline } from 'react-icons/hi';
import { getAllUsers, updateUserStatus } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const AdminUsers = () => {
    // Estado local para la gestión de usuarios y UI
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRole, setSelectedRole] = useState('all');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 8; // Número de usuarios por página

    // Obtener token de autenticación
    const { token } = useAuth();

    // Cargar usuarios al montar el componente
    useEffect(() => {
        fetchUsers();
    }, [token]);

    // Función para obtener usuarios desde la API
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers(token);

            if (response.success) {
                setUsers(response.data || []);
            } else {
                toast.error('Error al cargar usuarios');
            }
        } catch (error) {
            toast.error(error.msg || 'Error al cargar usuarios');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // Función para activar/desactivar usuario
    const handleToggleUserStatus = async (userId, currentStatus) => {
        if (!userId) return;

        const action = currentStatus ? 'desactivar' : 'activar';
        if (window.confirm(`¿Estás seguro de que deseas ${action} este usuario?`)) {
            try {
                const response = await updateUserStatus(userId, !currentStatus, token);
                if (response.success) {
                    setUsers(prev => prev.map(user => 
                        user._id === userId ? { ...user, estado: !currentStatus } : user
                    ));
                    toast.success(`Usuario ${action}do correctamente`);
                }
            } catch (error) {
                toast.error(error.msg || `Error al ${action} el usuario`);
            }
        }
    };

    // Filtrar usuarios según búsqueda y rol seleccionado
    const filteredUsers = users?.filter(user => {
        const matchesSearch =
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = selectedRole === 'all' || 
            (Array.isArray(user.roles) 
                ? user.roles.includes(selectedRole)
                : user.roles === selectedRole);
        
        return matchesSearch && matchesRole;
    }) || [];

    // Calcular paginación
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    // Manejar cambio de página
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Mostrar spinner mientras carga
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 h-screen flex flex-col">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-slate-200">Gestión de Usuarios</h1>
                    <Link
                        to="/admin/users/new"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                    >
                        <HiUserAdd className="h-5 w-5" />
                        <span>Nuevo Usuario</span>
                    </Link>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 md:max-w-md">
                        <input
                            type="text"
                            placeholder="Buscar usuarios..."
                            className="w-full px-4 py-2 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <HiOutlineSearch className="absolute left-3 top-2.5 text-slate-400 h-5 w-5" />
                    </div>
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                        <option value="all">Todos los roles</option>
                        <option value="admin">Administrador</option>
                        <option value="customer">Cliente</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
                <div className="overflow-x-auto flex-1">
                    <div className="h-full overflow-y-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-800">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Nombre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Rol</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {paginatedUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-200">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-200">
                                            {`${user.firstName} ${user.lastName}` || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                user.role === 'admin' // Changed from user.roles to user.role
                                                    ? 'bg-purple-500/20 text-purple-400'
                                                    : 'bg-blue-500/20 text-blue-400'
                                            }`}>
                                                {user.roles}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                                            <Link
                                                to={`/admin/users/${user._id}`}
                                                className="inline-flex p-1.5 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors duration-200"
                                                title="Ver detalles"
                                            >
                                                <HiEye className="h-5 w-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleToggleUserStatus(user._id, user.estado)}
                                                className={`p-1.5 rounded-lg transition-colors duration-200 ${
                                                    user.estado 
                                                        ? 'text-green-400 hover:bg-green-500/20' 
                                                        : 'text-red-400 hover:bg-red-500/20'
                                                }`}
                                                title={user.estado ? 'Desactivar usuario' : 'Activar usuario'}
                                            >
                                                {user.estado ? (
                                                    <HiStatusOnline className="h-5 w-5" />
                                                ) : (
                                                    <HiStatusOffline className="h-5 w-5" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-700 pt-4">
                    <div className="text-sm text-slate-400">
                        Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredUsers.length)} de {filteredUsers.length} usuarios
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-lg transition-colors duration-200 
                                ${currentPage === 1
                                    ? 'text-slate-600 cursor-not-allowed'
                                    : 'text-slate-400 hover:bg-slate-800'}`}
                        >
                            <HiChevronLeft className="h-5 w-5" />
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-3 py-1 rounded-lg transition-colors duration-200
                                    ${currentPage === index + 1
                                        ? 'bg-blue-500 text-white'
                                        : 'text-slate-400 hover:bg-slate-800'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-lg transition-colors duration-200 
                                ${currentPage === totalPages
                                    ? 'text-slate-600 cursor-not-allowed'
                                    : 'text-slate-400 hover:bg-slate-800'}`}
                        >
                            <HiChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { AdminUsers };