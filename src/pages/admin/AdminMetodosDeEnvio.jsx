import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HiSearch, HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '../../components/Loading/LoadingSpinner';
import { ShippingMethodForm } from '../../components/ShippingMethods/ShippingMethodForm';
import { getShippingMethods, createShippingMethod, updateShippingMethod, deleteShippingMethod } from '../../services/shippingMethods';
import { cortarTexto } from '../../utils/funcionesReutilizables';

const AdminMetodosDeEnvio = () => {
    const { token } = useAuth();
    const [shippingMethods, setShippingMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMethod, setEditingMethod] = useState(null);

    useEffect(() => {
        fetchShippingMethods();
    }, []);

    const fetchShippingMethods = async () => {
        try {
            setLoading(true);
            const response = await getShippingMethods(token);
            if (response.success) {
                setShippingMethods(response.data || []);
            } else {
                toast.error('Error al cargar los métodos de envío');
            }
        } catch (error) {
            toast.error('Error al cargar los métodos de envío');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            setLoading(true);
            const response = editingMethod
                ? await updateShippingMethod({ ...formData, _id: editingMethod._id }, token)
                : await createShippingMethod(formData, token);

            if (response.success) {
                toast.success(editingMethod ? 'Método de envío actualizado' : 'Método de envío creado');
                setIsFormOpen(false);
                setEditingMethod(null);
                await fetchShippingMethods();
            } else {
                toast.error('Error al guardar el método de envío');
            }
        } catch (error) {
            toast.error('Error al guardar el método de envío');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (methodId) => {
        if (window.confirm('¿Está seguro de eliminar este método de envío?')) {
            try {
                setLoading(true);
                const response = await deleteShippingMethod(methodId, token);

                if (response.success) {
                    toast.success('Método de envío eliminado exitosamente');
                    await fetchShippingMethods();
                } else {
                    toast.error('Error al eliminar el método de envío');
                }
            } catch (error) {
                toast.error('Error al eliminar el método de envío');
            } finally {
                setLoading(false);
            }
        }
    };

    const filteredMethods = shippingMethods.filter(method =>
        method.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Métodos de Envío</h1>
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
                        {editingMethod ? 'Editar' : 'Crear'} Método de Envío
                    </h2>
                    <ShippingMethodForm
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
                            placeholder="Buscar método de envío..."
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
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                    Método
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                    Tiempo de Entrega
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                    Costo Base
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
                                    <td colSpan="6">
                                        <LoadingSpinner />
                                    </td>
                                </tr>
                            ) : filteredMethods.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-slate-400">
                                        No se encontraron métodos de envío
                                    </td>
                                </tr>
                            ) : (
                                filteredMethods.map((method) => (
                                    <tr key={method._id} className="hover:bg-slate-700/30">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                            {method.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                            {cortarTexto(method.methods[0]?.name, 20)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                            {method.methods[0]?.delivery_time}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                            ${method.methods[0]?.base_cost?.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${method.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                                                    onClick={() => handleDelete(method._id)}
                                                    className="text-red-400 hover:text-red-300"
                                                    title="Eliminar"
                                                >
                                                    <HiTrash className="h-5 w-5" />
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
    );
};

export { AdminMetodosDeEnvio };