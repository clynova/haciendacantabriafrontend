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

const AdminMetodosDePago = () => {
    const { token } = useAuth();
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        description: '',
        provider: '',
        logo_url: '',
        commission_percentage: 0,
        requires_additional_data: false,
        active: true,
        additional_fields: []
    });
    const [selectedImage, setSelectedImage] = useState(null);

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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : 
                    name === 'commission_percentage' ? parseFloat(value) : 
                    value
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        setFormData({
            name: method.name,
            type: method.type,
            description: method.description,
            provider: method.provider,
            logo_url: method.logo_url,
            commission_percentage: method.commission_percentage,
            requires_additional_data: method.requires_additional_data || false,
            active: method.active || true,
            additional_fields: method.additional_fields || []
        });
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
        setFormData({
            name: '',
            type: '',
            description: '',
            provider: '',
            logo_url: '',
            commission_percentage: 0,
            requires_additional_data: false,
            active: true,
            additional_fields: []
        });
        setSelectedImage(null);
    };

    if (isLoading && !paymentMethods.length) {
        return <div className="p-4">Cargando...</div>;
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Métodos de Pago</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Nuevo Método de Pago
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border">Logo</th>
                            <th className="px-4 py-2 border">Nombre</th>
                            <th className="px-4 py-2 border">Tipo</th>
                            <th className="px-4 py-2 border">Proveedor</th>
                            <th className="px-4 py-2 border">Comisión</th>
                            <th className="px-4 py-2 border">Estado</th>
                            <th className="px-4 py-2 border">Datos Adicionales</th>
                            <th className="px-4 py-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentMethods.map((method) => (
                            <tr key={method._id}>
                                <td className="px-4 py-2 border">
                                    <img 
                                        src={method.logo_url} 
                                        alt={method.name}
                                        className="h-10 w-auto object-contain"
                                    />
                                </td>
                                <td className="px-4 py-2 border">{method.name}</td>
                                <td className="px-4 py-2 border">{method.type}</td>
                                <td className="px-4 py-2 border">{method.provider}</td>
                                <td className="px-4 py-2 border">{method.commission_percentage}%</td>
                                <td className="px-4 py-2 border">
                                    <span className={`px-2 py-1 rounded ${method.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {method.active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-4 py-2 border">
                                    {method.requires_additional_data ? 'Sí' : 'No'}
                                </td>
                                <td className="px-4 py-2 border">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(method)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                        >
                                            Editar
                                        </button>
                                        {!method.active ? (
                                            <button
                                                onClick={() => handleRestore(method._id)}
                                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                            >
                                                Activar
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleDelete(method._id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                            >
                                                Desactivar
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                        <h2 className="text-xl font-bold mb-4">
                            {selectedMethod ? 'Editar' : 'Nuevo'} Método de Pago
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1">Nombre:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Tipo:</label>
                                <input
                                    type="text"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Descripción:</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Proveedor:</label>
                                <input
                                    type="text"
                                    name="provider"
                                    value={formData.provider}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Comisión (%):</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="commission_percentage"
                                    value={formData.commission_percentage}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="requires_additional_data"
                                        checked={formData.requires_additional_data}
                                        onChange={handleInputChange}
                                        className="rounded border-gray-300"
                                    />
                                    <span>Requiere datos adicionales</span>
                                </label>
                            </div>
                            <div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="active"
                                        checked={formData.active}
                                        onChange={handleInputChange}
                                        className="rounded border-gray-300"
                                    />
                                    <span>Activo</span>
                                </label>
                            </div>
                            <div>
                                <label className="block mb-1">Logo:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                                {formData.logo_url && (
                                    <img
                                        src={formData.logo_url}
                                        alt="Preview"
                                        className="mt-2 h-20 w-auto object-contain"
                                    />
                                )}
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                                >
                                    {isLoading ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export { AdminMetodosDePago };