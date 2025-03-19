import { useState, useEffect } from 'react';
import { 
    getPaymentMethodsAdmin, 
    createPaymentMethod, 
    updatePaymentMethod, 
    deletePaymentMethod,
    restorePaymentMethod 
} from "../../services/paymentMethods";
import { uploadImageToCloudinary } from "../../services/utilService";
import { useAuth } from '../../context/AuthContext';
import PaymentMethodForm from '../../components/dashboard/PaymentMethodForm';
import { HiSearch, HiPlus, HiPencil, HiTrash, HiEye } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const AdminMetodosDePago = () => {
    const { token } = useAuth();
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);

    useEffect(() => {
        loadPaymentMethods();
    }, [token]); // Add token as dependency

    const loadPaymentMethods = async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const data = await getPaymentMethodsAdmin(token);
            setPaymentMethods(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (formData, selectedImage) => {
        if (!token) return;
        setIsLoading(true);
        setError(null);

        try {
            let imageUrl = formData.logo_url;
            if (selectedImage) {
                imageUrl = await uploadImageToCloudinary(selectedImage);
                if (!imageUrl) throw new Error('Error al subir la imagen');
            }

            const paymentMethodData = {
                ...formData,
                logo_url: imageUrl
            };

            if (selectedMethod) {
                await updatePaymentMethod(selectedMethod._id, paymentMethodData, token);
            } else {
                await createPaymentMethod(paymentMethodData, token);
            }

            await loadPaymentMethods();
            handleCloseModal();
        } catch (err) {
            setError(err.message || 'Error al procesar el método de pago');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (method) => {
        setSelectedMethod(method);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!token || !window.confirm('¿Estás seguro de que deseas eliminar este método de pago?')) return;
        
        setIsLoading(true);
        try {
            await deletePaymentMethod(id, token);
            await loadPaymentMethods();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestore = async (id) => {
        if (!token) return;
        setIsLoading(true);
        try {
            await restorePaymentMethod(id, token);
            await loadPaymentMethods();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMethod(null);
    };

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Métodos de Pago</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        <HiPlus className="h-5 w-5" />
                        Nuevo Método de Pago
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-900/50 border border-red-800">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-700">
                        <div className="relative">
                            <HiSearch className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o proveedor..."
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
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-slate-400">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paymentMethods.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-slate-400">
                                            No se encontraron métodos de pago
                                        </td>
                                    </tr>
                                ) : (
                                    paymentMethods.map((method) => (
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
                                                        onClick={() => handleEdit(method)}
                                                        className="text-yellow-400 hover:text-yellow-300"
                                                        title="Editar"
                                                    >
                                                        <HiPencil className="h-5 w-5" />
                                                    </button>
                                                    {method.active ? (
                                                        <button
                                                            onClick={() => handleDelete(method._id)}
                                                            className="text-red-400 hover:text-red-300"
                                                            title="Desactivar"
                                                        >
                                                            <HiTrash className="h-5 w-5" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleRestore(method._id)}
                                                            className="text-green-400 hover:text-green-300"
                                                            title="Activar"
                                                        >
                                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    )}
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50">
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-slate-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                    <button
                                        type="button"
                                        className="rounded-md bg-slate-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        onClick={handleCloseModal}
                                    >
                                        <span className="sr-only">Cerrar</span>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div>
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                        <h3 className="text-xl font-semibold leading-6 text-white mb-6">
                                            {selectedMethod ? 'Editar' : 'Nuevo'} Método de Pago
                                        </h3>
                                        <PaymentMethodForm
                                            initialData={selectedMethod || {
                                                name: '',
                                                type: '',
                                                description: '',
                                                provider: '',
                                                logo_url: '',
                                                commission_percentage: 0,
                                                requires_additional_data: false,
                                                active: true,
                                                additional_fields: []
                                            }}
                                            onSubmit={handleSubmit}
                                            onClose={handleCloseModal}
                                            isLoading={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export { AdminMetodosDePago };