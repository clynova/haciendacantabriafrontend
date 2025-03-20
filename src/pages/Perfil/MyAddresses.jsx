import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAddresses, addAddress, deleteAddress, updateAddress } from "../../services/userService";
import { toast } from "react-hot-toast";
import { HiPlus, HiTrash, HiPencil, HiCheck } from "react-icons/hi";

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
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Función para buscar direcciones usando OpenStreetMap
    const searchAddresses = async (query) => {
        if (!query || query.length < 3) {
            setAddressSuggestions([]);
            return;
        }

        setIsSearching(true);
        try {
            // Agregar "Chile" a la búsqueda si no está presente
            const searchQuery = query.toLowerCase().includes('chile') ? query : `${query}, Chile`;
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=cl&limit=5&addressdetails=1&accept-language=es`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'HaciendaCantabria Frontend'
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error('Error en la búsqueda de direcciones');
            }
            
            const results = await response.json();
            
            // Procesar y estructurar mejor los resultados
            const formattedResults = results.map(result => {
                // Extraer información específica de la dirección
                const addr = result.address;
                
                // Construir la calle con número si está disponible
                const street = [
                    addr?.road || addr?.pedestrian || addr?.street || addr?.path || addr?.footway,
                    addr?.house_number
                ].filter(Boolean).join(' ');

                // Identificar la comuna (generalmente en city_district o suburb)
                const commune = addr?.city_district || addr?.suburb || addr?.municipality || addr?.county || '';

                
                // Identificar la ciudad
                const city = addr?.city || addr?.town || addr?.municipality || commune;

                
                // Identificar la región
                const region = addr?.state || '';

                // Construir nombre para mostrar
                const display_name = `${street}, ${commune}, ${city}${region ? `, ${region}` : ''}`;
               

                return {
                    display_name,
                    structured: {
                        street,
                        commune,
                        city,
                        region,
                        postal_code: addr?.postcode || ''
                    },
                    original: result
                };
            }).filter(result => result.structured.street && result.structured.commune); // Solo mostrar resultados con calle y comuna

            setAddressSuggestions(formattedResults);
        } catch (error) {
            console.error('Error al buscar direcciones:', error);
            toast.error("Error al buscar direcciones");
        } finally {
            setIsSearching(false);
        }
    };

    // Función para manejar la selección de una dirección sugerida
    const handleAddressSelection = (address) => {
        try {
            const { structured } = address;
            
            setFormData(prev => ({
                ...prev,
                street: structured.street.trim(),
                city: structured.region.trim(),
                state: structured.commune.trim(), // Usando la comuna en el campo state
                zipCode: structured.postal_code || '',
                country: "Chile"
            }));
            
            setSearchQuery(address.display_name);
            setAddressSuggestions([]);
        } catch (error) {
            console.error('Error al procesar la dirección:', error);
            toast.error('Error al procesar la dirección seleccionada');
        }
    };

    // Efecto para debounce de la búsqueda
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            searchAddresses(searchQuery);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Buscar dirección
                    </label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Comienza a escribir para buscar una dirección..."
                    />
                    {isSearching && (
                        <div className="mt-2 text-sm text-gray-500">Buscando...</div>
                    )}
                    {addressSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border rounded-md shadow-lg max-h-60 overflow-auto">
                            {addressSuggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleAddressSelection(suggestion)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-white"
                                >
                                    {suggestion.display_name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Calle
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.street}
                        onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ciudad
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Estado/Provincia
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>

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
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Referencia
                    </label>
                    <input
                        type="text"
                        value={formData.reference}
                        onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
            </div>
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