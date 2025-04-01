import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAddresses, addAddress, deleteAddress, updateAddress } from "../../services/userService";
import { toast } from "react-hot-toast";
import { HiPlus, HiTrash, HiPencil, HiCheck } from "react-icons/hi";
import { regionesComunas } from "../../data/regiones-comunas";

const AddressForm = ({ onSubmit, initialData = null, onCancel = null }) => {
    const [formData, setFormData] = useState({
        street: initialData?.street || "",
        city: initialData?.city || "",
        state: initialData?.state || "",
        country: "Chile",
        zipCode: initialData?.zipCode || "",
        reference: initialData?.reference || "",
        isDefault: initialData?.isDefault || false
    });

    const [selectedRegion, setSelectedRegion] = useState("");

    // Efecto para inicializar la región si hay datos iniciales
    useEffect(() => {
        if (initialData?.state) {
            // Buscar la región que contiene la comuna (state) inicial
            const region = Object.entries(regionesComunas).find(([_, data]) => 
                data.comunas.includes(initialData.state)
            );
            if (region) {
                setSelectedRegion(region[0]);
            }
        }
    }, [initialData]);

    // Función para manejar el cambio de región
    const handleRegionChange = (e) => {
        const region = e.target.value;
        setSelectedRegion(region);
        setFormData(prev => ({
            ...prev,
            state: '', // Limpiar la comuna al cambiar de región
            city: region // La ciudad será la región
        }));
    };

    // Función para manejar el cambio de comuna
    const handleCommuneChange = (e) => {
        const commune = e.target.value;
        setFormData(prev => ({
            ...prev,
            state: commune,
            city: selectedRegion
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Selector de Región */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Región
                    </label>
                    <select
                        value={selectedRegion}
                        onChange={handleRegionChange}
                        required
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">Selecciona una región</option>
                        {Object.keys(regionesComunas).map(region => (
                            <option key={region} value={region}>
                                {region}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Selector de Comuna */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Comuna
                    </label>
                    <select
                        value={formData.state}
                        onChange={handleCommuneChange}
                        required
                        disabled={!selectedRegion}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">Selecciona una comuna</option>
                        {selectedRegion && regionesComunas[selectedRegion].comunas.map(comuna => (
                            <option key={comuna} value={comuna}>
                                {comuna}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Campo de calle */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Calle y número
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.street}
                        onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Ingresa calle y número"
                    />
                </div>

                {/* País (deshabilitado) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        País
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.country}
                        disabled
                        className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300"
                    />
                </div>

                {/* Código Postal */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Código Postal
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.zipCode}
                        onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>

                {/* Referencia */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Referencia
                    </label>
                    <input
                        type="text"
                        value={formData.reference}
                        onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Ej: Casa color azul, cerca del supermercado..."
                    />
                </div>
            </div>

            {/* Checkbox dirección predeterminada */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700 dark:text-gray-300">
                    Establecer como dirección predeterminada
                </label>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4 mt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {initialData ? "Actualizar" : "Agregar"} Dirección
                </button>
            </div>
        </form>
    );
};

const MyAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const { token } = useAuth();

    const fetchAddresses = async () => {
        try {
            const response = await getAddresses(token);
            if (response.success) {
                setAddresses(response.data.addresses || []); // Corregido: accediendo a response.data.addresses
            }
        } catch (error) {
            toast.error("Error al cargar las direcciones");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, [token]);

    const handleAddAddress = async (addressData) => {
        try {
            const response = await addAddress(addressData, token);
            if (response.success && response.data) {
                // La nueva dirección viene directamente en response.data, no en response.data.address
                const newAddress = response.data;
                
                setAddresses(prev => {
                    // Si la nueva dirección es predeterminada, actualizar las demás
                    const updatedAddresses = prev.map(addr => ({
                        ...addr,
                        isDefault: newAddress.isDefault ? false : (addr.isDefault || false)
                    }));
                    // Añadir la nueva dirección
                    return [...updatedAddresses, newAddress];
                });
                
                setShowForm(false);
                toast.success(response.msg || "Dirección agregada correctamente");
            } else {
                throw new Error('Error al agregar la dirección');
            }
        } catch (error) {
            console.error('Error al agregar dirección:', error);
            toast.error(error.message || "Error al agregar la dirección");
        }
    };

    const handleUpdateAddress = async (addressData) => {
        try {
            const response = await updateAddress(editingAddress._id, addressData, token);
            if (response.success && response.data) {
                // La dirección actualizada viene directamente en response.data
                const updatedAddress = response.data;
                
                // Si la dirección actualizada es predeterminada, actualizar todas las direcciones
                setAddresses(prev => prev.map(addr => {
                    if (addr._id === editingAddress._id) {
                        return updatedAddress;
                    }
                    // Si la dirección actualizada es predeterminada, las demás no pueden serlo
                    if (updatedAddress.isDefault) {
                        return {
                            ...addr,
                            isDefault: false
                        };
                    }
                    return addr;
                }));
                
                setEditingAddress(null);
                toast.success(response.msg || "Dirección actualizada correctamente");
            } else {
                throw new Error('Error al actualizar la dirección');
            }
        } catch (error) {
            console.error('Error al actualizar la dirección:', error);
            toast.error(error.message || "Error al actualizar la dirección");
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta dirección?")) {
            try {
                const response = await deleteAddress(addressId, token);
                if (response.success) {
                    setAddresses(prev => prev.filter(addr => addr._id !== addressId));
                    toast.success(response.msg);
                } else {
                    throw new Error(response.msg);
                }
            } catch (error) {
                toast.error(error.message || "Error al eliminar la dirección");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Direcciones</h1>
                {!showForm && !editingAddress && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                        <HiPlus className="w-5 h-5" />
                        Agregar Dirección
                    </button>
                )}
            </div>

            {(showForm || editingAddress) && (
                <AddressForm
                    onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
                    initialData={editingAddress}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingAddress(null);
                    }}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => (
                    <div
                        key={address._id}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow relative"
                    >
                        {address.isDefault && (
                            <span className="absolute top-4 right-4 flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                                <HiCheck className="w-5 h-5" />
                                Predeterminada
                            </span>
                        )}
                        <div className="space-y-2">
                            <p className="text-gray-800 dark:text-gray-200">{address.street}</p>
                            <p className="text-gray-600 dark:text-gray-400">
                                {address.city}, {address.state}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                {address.country}, {address.zipCode}
                            </p>
                            {address.reference && (
                                <p className="text-gray-500 dark:text-gray-500 text-sm">
                                    Referencia: {address.reference}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setEditingAddress(address)}
                                className="p-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                aria-label="Editar dirección"
                            >
                                <HiPencil className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleDeleteAddress(address._id)}
                                className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                aria-label="Eliminar dirección"
                            >
                                <HiTrash className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export { MyAddresses, AddressForm };