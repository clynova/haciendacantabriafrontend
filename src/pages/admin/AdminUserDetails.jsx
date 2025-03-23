import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiArrowLeft, HiUser, HiMail, HiKey, HiLocationMarker, HiShieldCheck, HiUserGroup } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { getUserById } from '../../services/adminService';

const AdminUserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const profileImage = user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName || 'User'}`;

    useEffect(() => {
        fetchUserDetails();
    }, [userId, token]);

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            const response = await getUserById(userId, token);

            if (response.success) {
                setUser(response.data);
            } else {
                toast.error('Error al cargar los detalles del usuario');
            }
        } catch (error) {
            toast.error(error.msg || 'Error al cargar los detalles del usuario');
        } finally {
            setLoading(false);
        }
    };

    const renderAddresses = (user) => {
        if (!user.addresses || user.addresses.length === 0) {
            return (
                <p className="text-slate-400 italic">No hay direcciones registradas</p>
            );
        }

        return user.addresses.map((address, addressIndex) => {
            const addressDetails = [
                { label: 'Calle y número', value: address.street || address.streetAddress },
                { label: 'Ciudad', value: address.city },
                { label: 'Región', value: address.region || address.state },
                { label: 'País', value: address.country },
                { label: 'Código Postal', value: address.zipCode || address.postalCode }
            ];

            return (
                <div key={addressIndex} className="space-y-2 border-b border-slate-600 last:border-0 pb-4 last:pb-0">
                    {addressDetails.map((detail, index) => (
                        detail.value && (
                            <div key={index} className="grid grid-cols-2 gap-2">
                                <span className="text-slate-400">{detail.label}:</span>
                                <span className="text-slate-200">{detail.value}</span>
                            </div>
                        )
                    ))}
                </div>
            );
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    

    if (!user) {
        return (
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="flex items-center gap-2 text-slate-300 hover:text-white mb-6"
                    >
                        <HiArrowLeft className="h-5 w-5" />
                        <span>Volver</span>
                    </button>
                    <div className="bg-red-500/10 text-red-400 p-4 rounded-lg">
                        No se pudo cargar la información del usuario
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="flex items-center gap-2 text-slate-300 hover:text-white"
                    >
                        <HiArrowLeft className="h-5 w-5" />
                        <span>Volver a la lista</span>
                    </button>
                </div>

                <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-slate-700">
                        <div className="flex items-center gap-6">
                            <img
                                src={profileImage}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover shadow-lg"
                                onError={(e) => {
                                    e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Fallback";
                                }}
                            />
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    {`${user.firstName || ''} ${user.lastName || ''}`}
                                </h1>
                                <p className="text-slate-400 text-sm">ID: {user._id}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                                    <HiUser className="h-5 w-5 text-blue-400" />
                                    Información Personal
                                </h2>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Nombre completo</label>
                                    <p className="text-slate-200 bg-slate-700/50 p-2 rounded-lg">
                                        {`${user.firstName || ''} ${user.lastName || ''}`}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                        <HiMail className="h-4 w-4 text-blue-400" />
                                        Correo electrónico
                                    </label>
                                    <p className="text-slate-200 bg-slate-700/50 p-2 rounded-lg">
                                        {user.email}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Estado de cuenta</label>
                                    <p className="text-slate-200 bg-slate-700/50 p-2 rounded-lg">
                                        {user.confirmado ? 'Confirmada' : 'Pendiente de confirmación'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                                    <HiKey className="h-5 w-5 text-blue-400" />
                                    Detalles de cuenta
                                </h2>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                        <HiLocationMarker className="h-4 w-4 text-blue-400" />
                                        Direcciones
                                    </label>
                                    <div className="bg-slate-700/50 p-4 rounded-lg">
                                        {renderAddresses(user)}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Rol del usuario</label>
                                    <div className="flex items-center gap-4 bg-slate-700/50 p-4 rounded-lg">
                                        {user.roles?.includes('admin') ? (
                                            <>
                                                <div className="flex-shrink-0">
                                                    <div className="p-3 bg-purple-500/20 rounded-full">
                                                        <HiShieldCheck className="h-7 w-7 text-purple-400" />
                                                    </div>
                                                </div>
                                                <div className="flex-grow">
                                                    <span className="block text-lg font-medium text-purple-400 mb-0.5">
                                                        Administrador
                                                    </span>
                                                    <span className="text-sm text-slate-400">
                                                        Acceso completo a la gestión del sistema
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex-shrink-0">
                                                    <div className="p-3 bg-blue-500/20 rounded-full">
                                                        <HiUserGroup className="h-7 w-7 text-blue-400" />
                                                    </div>
                                                </div>
                                                <div className="flex-grow">
                                                    <span className="block text-lg font-medium text-blue-400 mb-0.5">
                                                        Cliente
                                                    </span>
                                                    <span className="text-sm text-slate-400">
                                                        Acceso a funciones básicas del sistema
                                                    </span>
                                                </div>
                                            </>
                                        )}
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

export { AdminUserDetails };