import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HiSearch, HiPlus, HiPencil, HiRefresh } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '../../components/Loading/LoadingSpinner';
import { PaymentMethodForm } from '../../components/PaymentMethods/PaymentMethodForm';
import { uploadImageToCloudinary } from '../../services/utilService';
import { 
    getPaymentMethodsAdmin, 
    createPaymentMethod, 
    updatePaymentMethod, 
    deletePaymentMethod 
} from "../../services/paymentMethods";

const AdminMetodosDePago = () => {
    const { token } = useAuth();
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMethod, setEditingMethod] = useState(null);

    useEffect(() => {
        fetchPaymentMethods();
    }, [token]);

    const fetchPaymentMethods = async () => {
        try {
            setLoading(true);
            const data = await getPaymentMethodsAdmin(token);
            setPaymentMethods(data || []);
        } catch (error) {
            toast.error('Error al cargar los métodos de pago');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData, selectedImage) => {
        try {
            setLoading(true);
            let imageUrl = formData.logo_url;
            
            if (selectedImage) {
                imageUrl = await uploadImageToCloudinary(selectedImage);
                if (!imageUrl) {
                    toast.error('Error al subir la imagen');
                    return;
                }
            }

            const paymentMethodData = {
                ...formData,
                logo_url: imageUrl
            };

            let response;
            if (editingMethod) {
                response = await updatePaymentMethod(editingMethod._id, paymentMethodData, token);
            } else {
                response = await createPaymentMethod(paymentMethodData, token);
            }

            if (response && response.success) {
                toast.success(editingMethod ? 'Método de pago actualizado' : 'Método de pago creado');
                setIsFormOpen(false);
                setEditingMethod(null);
                await fetchPaymentMethods(); // Recargar los métodos de pago
            } else {
                toast.error(editingMethod ? 'Error al actualizar el método de pago' : 'Error al crear el método de pago');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al guardar el método de pago');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (methodId, currentStatus) => {
        const action = currentStatus ? 'desactivar' : 'activar';
        if (window.confirm(`¿Está seguro de ${action} este método de pago?`)) {
            try {
                setLoading(true);
                const response = await updatePaymentMethod(methodId, { active: !currentStatus }, token);
                
                if (response && response.success) {
                    toast.success(`Método de pago ${action}do exitosamente`);
                    await fetchPaymentMethods();
                } else {
                    toast.error(`Error al ${action} el método de pago`);
                }
            } catch (error) {
                toast.error(`Error al ${action} el método de pago`);
            } finally {
                setLoading(false);
            }
        }
    };

    const filteredMethods = paymentMethods.filter(method =>
        method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.provider.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Métodos de Pago</h1>
                    <button
                        onClick={() => {
                            setEditingMethod(null);
                            setIsFormOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        <HiPlus className="h-5 w-5" />
                        Nuevo Método
                    </button>
                </div>

                {isFormOpen && (
                    <div className="mb-6 bg-slate-800 rounded-xl shadow-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            {editingMethod ? 'Editar' : 'Crear'} Método de Pago
                        </h2>
                        <PaymentMethodForm
                            initialData={editingMethod}
                            onSubmit={handleSubmit}
                            onCancel={() => {
                                setIsFormOpen(false);
                                setEditingMethod(null);
                            }}
                        />
                    </div>
                )}

                <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-700">
                        <div className="relative">
                            <HiSearch className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o proveedor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Logo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Tipo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Proveedor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Comisión
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7">
                                            <LoadingSpinner />
                                        </td>
                                    </tr>
                                ) : filteredMethods.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-slate-400">
                                            No se encontraron métodos de pago
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMethods.map((method) => (
                                        <tr key={method._id} className="hover:bg-slate-700/30">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <img 
                                                    src={method.logo_url} 
                                                    alt={method.name}
                                                    className="h-10 w-auto object-contain"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                                {method.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                                {method.type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                                {method.provider}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                                {method.commission_percentage}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    method.active 
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {method.active ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingMethod(method);
                                                            setIsFormOpen(true);
                                                        }}
                                                        className="text-yellow-400 hover:text-yellow-300"
                                                        title="Editar"
                                                    >
                                                        <HiPencil className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(method._id, method.active)}
                                                        className={`${method.active ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'}`}
                                                        title={method.active ? 'Desactivar' : 'Activar'}
                                                    >
                                                        <HiRefresh className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { AdminMetodosDePago };