import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getAddresses, addAddress, deleteAddress, updateAddress } from '../../services/userService';
import { HiPlus, HiHome, HiLocationMarker, HiOfficeBuilding, HiCheckCircle } from 'react-icons/hi';
import { FiArrowLeft, FiArrowRight, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { AddressForm } from '../Perfil/MyAddresses';
import { toast } from 'react-hot-toast';
import { getShippingMethods } from '../../services/shippingMethods';
import { getRegionsActive } from '../../services/regionService';
import CartSummary from '../../components/Cart/CartSummary';
import { formatCurrency } from '../../utils/funcionesReutilizables';

const AddressCard = ({ address, selected, onSelect, onEdit, onDelete }) => {
    const getAddressTypeIcon = () => {
        switch (address.addressType) {
            case 'home':
                return <HiHome className="h-5 w-5" />;
            case 'office':
                return <HiOfficeBuilding className="h-5 w-5" />;
            default:
                return <HiLocationMarker className="h-5 w-5" />;
        }
    };

    return (
        <div
            onClick={() => onSelect(address._id)}
            className={`border rounded-lg p-4 cursor-pointer transition-all mb-3 ${selected
                ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2 text-gray-700 mb-2">
                    {getAddressTypeIcon()}
                    <span className="font-medium capitalize">{address.addressType || 'Principal'}</span>
                    {address.isDefault && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">Predeterminada</span>
                    )}
                </div>
                {selected && (
                    <div className="text-blue-600">
                        <HiCheckCircle className="h-5 w-5" />
                    </div>
                )}
            </div>

            <div className="mb-2">
                <p className="font-medium">{address.recipient}</p>
                <p className="text-gray-700">
                    {address.street}, {address.number}
                    {address.interior ? `, Int. ${address.interior}` : ''}
                </p>
                <p className="text-gray-700">
                    {address.suburb}, {address.city}, {address.state}
                </p>
                <p className="text-gray-700">CP: {address.zipCode}</p>
                {address.phoneContact && <p className="text-gray-700">Tel: {address.phoneContact}</p>}
            </div>

            <div className="flex space-x-2 mt-3">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(address);
                    }}
                    className="text-sm flex items-center text-gray-600 hover:text-blue-600 py-1 px-2 rounded hover:bg-gray-100"
                >
                    <FiEdit2 className="mr-1" /> Editar
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(address._id);
                    }}
                    className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    aria-label="Eliminar dirección"
                >
                    <FiTrash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

// Modificando la función de selección de método para recalcular el costo de envío
const ShippingMethodSelect = ({ shippingMethods, selectedCarrier, selectedMethod, onCarrierChange, onMethodChange, subtotal }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4">Método de Envío</h2>

            <div className="space-y-6">
                {shippingMethods.map((carrier) => (
                    <div key={carrier._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-center mb-3">
                            <input
                                type="radio"
                                id={`carrier-${carrier._id}`}
                                name="carrier"
                                value={carrier._id}
                                checked={selectedCarrier === carrier._id}
                                onChange={() => onCarrierChange(carrier._id)}
                                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={`carrier-${carrier._id}`} className="font-medium cursor-pointer flex-grow">
                                {carrier.name}
                            </label>
                        </div>

                        {selectedCarrier === carrier._id && (
                            <div className="ml-7 space-y-3">
                                {carrier.methods.map((method) => (
                                    <div key={method._id} className="bg-gray-50 p-3 rounded-md border border-gray-100">
                                        <div className="flex items-start">
                                            <input
                                                type="radio"
                                                id={`method-${method._id}`}
                                                name="method"
                                                value={method._id}
                                                checked={selectedMethod === method._id}
                                                onChange={() => onMethodChange(method._id)}
                                                className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor={`method-${method._id}`} className="cursor-pointer flex-grow">
                                                <div className="font-medium">{method.name}</div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    Tiempo estimado de entrega: {method.delivery_time}
                                                </div>
                                                <div className="text-blue-600 font-medium mt-1">
                                                    {method.free_shipping_threshold && (
                                                        <div className="text-sm text-green-600">
                                                            {subtotal >= method.free_shipping_threshold 
                                                                ? '¡Envío gratis! Has superado el monto mínimo' 
                                                                : `Envío gratis en compras mayores a ${formatCurrency(method.free_shipping_threshold)}`}
                                                        </div>
                                                    )}
                                                    {subtotal >= (method.free_shipping_threshold || Infinity)
                                                        ? <span className="line-through text-gray-400 mr-2">{formatCurrency(method.base_cost)}</span>
                                                        : formatCurrency(method.base_cost)}
                                                    {subtotal >= (method.free_shipping_threshold || Infinity) && 
                                                        <span className="text-green-600">¡GRATIS!</span>}
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {shippingMethods.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                    No hay métodos de envío disponibles en este momento.
                </div>
            )}
        </div>
    );
};

// Componente para el formulario de información del destinatario
const RecipientInfoForm = ({ recipientInfo, onChange }) => {
    const [errors, setErrors] = useState({
        recipientName: '',
        phoneContact: ''
    });

    const validateName = (name) => {
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        return nameRegex.test(name);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^(\+?56)?(\s?)(0?9)(\s?)[98765432]\d{7}$/;
        return phoneRegex.test(phone);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Validación específica para cada campo
        if (name === 'recipientName') {
            if (value && !validateName(value)) {
                setErrors(prev => ({
                    ...prev,
                    recipientName: 'El nombre solo debe contener letras'
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    recipientName: ''
                }));
            }
        }

        if (name === 'phoneContact') {
            if (value && !validatePhone(value)) {
                setErrors(prev => ({
                    ...prev,
                    phoneContact: 'Ingrese un número de teléfono móvil válido (9 dígitos)'
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    phoneContact: ''
                }));
            }
        }

        onChange(e);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4">Información del Destinatario</h2>

            <div className="space-y-4">
                <div>
                    <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del destinatario*
                    </label>
                    <input
                        type="text"
                        id="recipientName"
                        name="recipientName"
                        value={recipientInfo.recipientName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${errors.recipientName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${errors.recipientName ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                        placeholder="Nombre completo de quien recibirá el paquete"
                        required
                    />
                    {errors.recipientName && (
                        <p className="mt-1 text-sm text-red-600">{errors.recipientName}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="phoneContact" className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono de contacto* (Ejemplo: +56912345678)
                    </label>
                    <input
                        type="tel"
                        id="phoneContact"
                        name="phoneContact"
                        value={recipientInfo.phoneContact}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${errors.phoneContact ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${errors.phoneContact ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                        placeholder="Número telefónico para contacto"
                        required
                    />
                    {errors.phoneContact && (
                        <p className="mt-1 text-sm text-red-600">{errors.phoneContact}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="additionalInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                        Instrucciones adicionales (opcional)
                    </label>
                    <textarea
                        id="additionalInstructions"
                        name="additionalInstructions"
                        value={recipientInfo.additionalInstructions}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Especifica instrucciones para la entrega, referencias, etc."
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

// Barra de progreso para el checkout
const CheckoutProgress = () => (
    <div className="mb-8">
        <div className="flex justify-between">
            <div className="text-gray-400">Carrito</div>
            <div className="text-blue-500 font-medium">Envío</div>
            <div className="text-gray-400">Pago</div>
            <div className="text-gray-400">Confirmación</div>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full">
            <div className="h-full w-2/4 bg-blue-500 rounded-full"></div>
        </div>
    </div>
);

const FormaEnvio = () => {
    const [shippingMethods, setShippingMethods] = useState([]);
    const [selectedCarrier, setSelectedCarrier] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addressesLoaded, setAddressesLoaded] = useState(false);
    const [regionsLoaded, setRegionsLoaded] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressToEdit, setAddressToEdit] = useState(null);
    const [activeRegions, setActiveRegions] = useState([]);
    const [recipientInfo, setRecipientInfo] = useState({
        recipientName: '',
        phoneContact: '',
        additionalInstructions: ''
    });
    const { token } = useAuth();
    const { cartItems, saveShippingInfo } = useCart();
    const [isValparaisoRegion, setIsValparaisoRegion] = useState(true);
    const navigate = useNavigate();

    const fetchAddresses = async () => {
        try {
            const addressResponse = await getAddresses(token);
            if (addressResponse.success) {
                setAddresses(addressResponse.data.addresses || []);
                // Si hay una dirección predeterminada, seleccionarla
                const defaultAddress = addressResponse.data.addresses?.find(addr => addr.isDefault);
                if (defaultAddress) {
                    setSelectedAddressId(defaultAddress._id);
                    // La verificación de región se realizará después de cargar las regiones activas
                }
                setAddressesLoaded(true);
            }
        } catch (error) {
            toast.error("Error al cargar las direcciones");
            setAddressesLoaded(true); // Marcar como cargado aunque haya error
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch active regions first
                const regionsResponse = await getRegionsActive(token);
                if (regionsResponse.success) {
                    setActiveRegions(regionsResponse.data || []);
                }
                setRegionsLoaded(true);
                
                // Fetch addresses
                await fetchAddresses();
                
                // Fetch shipping methods
                const shippingResponse = await getShippingMethods(token);
                if (shippingResponse.success) {
                    setShippingMethods(shippingResponse.data);
                    if (shippingResponse.data.length > 0) {
                        setSelectedCarrier(shippingResponse.data[0]._id);
                        if (shippingResponse.data[0].methods.length > 0) {
                            setSelectedMethod(shippingResponse.data[0].methods[0]._id);
                        }
                    }
                }
            } catch (error) {
                toast.error("Error al cargar los datos");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    // Function to check if a region is active for direct payment
    const isRegionActive = (regionName) => {
        return activeRegions.some(region => region.name === regionName);
    };

    // Verificar la validez de la región seleccionada
    const verifySelectedRegion = () => {
        if (selectedAddressId && addresses.length > 0 && activeRegions.length > 0) {
            const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);
            if (selectedAddress) {
                const isActive = isRegionActive(selectedAddress.city);
                setIsValparaisoRegion(isActive);
            }
        }
    };

    // Efecto para verificar la región cuando las direcciones y regiones están cargadas
    useEffect(() => {
        if (addressesLoaded && regionsLoaded) {
            verifySelectedRegion();
        }
    }, [addressesLoaded, regionsLoaded, selectedAddressId, addresses, activeRegions]);

    // Actualizar la función que maneja la selección de dirección
    const handleAddressSelect = (addressId) => {
        setSelectedAddressId(addressId);
        // La verificación de región se realizará en el efecto que observa selectedAddressId
    };

    // Update region check function for form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedAddressId) {
            toast.error("Por favor selecciona una dirección de envío");
            return;
        }
        if (!selectedMethod) {
            toast.error("Por favor selecciona un método de envío");
            return;
        }
        if (!recipientInfo.recipientName || !recipientInfo.phoneContact) {
            toast.error("Por favor completa la información del destinatario");
            return;
        }

        const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);
        const carrier = shippingMethods.find(c => c._id === selectedCarrier);
        const method = carrier?.methods.find(m => m._id === selectedMethod);

        const shippingData = {
            carrierId: selectedCarrier,
            carrierName: carrier?.name,
            methodId: selectedMethod,
            methodName: method?.name,
            deliveryTime: method?.delivery_time,
            baseCost: method?.base_cost,
            extraCostPerKg: method?.extra_cost_per_kg,
            free_shipping_threshold: method?.free_shipping_threshold,
            address: selectedAddress,
            recipientInfo: recipientInfo
        };

        saveShippingInfo(shippingData);

        // Usar navigate en lugar de window.location.href para preservar el estado
        if (isValparaisoRegion) {
            navigate('/checkout/pago');
        } else {
            navigate('/checkout/cotizacion');
        }
    };

    const handleAddressSubmit = async (addressData) => {
        try {
            // Asegurarnos de que tenemos todos los campos necesarios
            const fullAddressData = {
                ...addressData,
                recipient: recipientInfo.recipientName || addressData.recipientName,
                phoneContact: recipientInfo.phoneContact || addressData.phoneContact,
                additionalInstructions: recipientInfo.additionalInstructions || addressData.additionalInstructions,
                addressType: addressData.addressType || 'home'
            };

            const response = await addAddress(fullAddressData, token);
            if (response.success && response.data) {
                const newAddress = response.data;

                // Actualizar el estado de las direcciones
                setAddresses(prev => {
                    // Si la nueva dirección es predeterminada, actualizar las demás
                    const updatedAddresses = prev.map(addr => ({
                        ...addr,
                        isDefault: newAddress.isDefault ? false : addr.isDefault
                    }));
                    return [...updatedAddresses, newAddress];
                });

                // Seleccionar la nueva dirección
                setSelectedAddressId(newAddress._id);

                // Actualizar la información del destinatario si es necesario
                if (newAddress.recipient && newAddress.phoneContact) {
                    setRecipientInfo(prev => ({
                        ...prev,
                        recipientName: newAddress.recipient,
                        phoneContact: newAddress.phoneContact,
                        additionalInstructions: newAddress.additionalInstructions || ''
                    }));
                }

                setShowAddressForm(false);
                setAddressToEdit(null);
                toast.success("Dirección agregada correctamente");
            }
        } catch (error) {
            console.error('Error al guardar la dirección:', error);
            toast.error(error.message || "Error al guardar la dirección");
        }
    };

    const handleRecipientInfoChange = (e) => {
        const { name, value } = e.target;
        setRecipientInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditAddress = (address) => {
        setAddressToEdit(address);
        setShowAddressForm(true);
    };

    const handleUpdateAddress = async (addressData) => {
        try {
            const response = await updateAddress(addressToEdit._id, addressData, token);
            if (response.success && response.data) {
                const updatedAddress = response.data;
                
                setAddresses(prev => prev.map(addr => {
                    if (addr._id === addressToEdit._id) {
                        return updatedAddress;
                    }
                    if (updatedAddress.isDefault) {
                        return { ...addr, isDefault: false };
                    }
                    return addr;
                }));

                // Actualizar la selección si la dirección editada era la seleccionada
                if (selectedAddressId === addressToEdit._id) {
                    setSelectedAddressId(updatedAddress._id);
                    setRecipientInfo({
                        recipientName: updatedAddress.recipient || '',
                        phoneContact: updatedAddress.phoneContact || '',
                        additionalInstructions: updatedAddress.additionalInstructions || ''
                    });
                }
                
                setShowAddressForm(false);
                setAddressToEdit(null);
                toast.success("Dirección actualizada correctamente");
            }
        } catch (error) {
            console.error('Error al actualizar la dirección:', error);
            toast.error(error.message || "Error al actualizar la dirección");
        }
    };

    // Componente de tarjeta de dirección
    const handleDeleteAddress = async (addressId) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta dirección?")) {
            try {
                const response = await deleteAddress(addressId, token);
                if (response.success) {
                    setAddresses(prev => prev.filter(addr => addr._id !== addressId));
                    // Si la dirección eliminada era la seleccionada, limpiar la selección
                    if (selectedAddressId === addressId) {
                        setSelectedAddressId('');
                        setRecipientInfo({
                            recipientName: '',
                            phoneContact: '',
                            additionalInstructions: ''
                        });
                    }
                    toast.success(response.msg);
                } else {
                    throw new Error(response.msg);
                }
            } catch (error) {
                toast.error(error.message || "Error al eliminar la dirección");
            }
        }
    };

    const handleAddAddress = async (addressData) => {
        try {
            const response = await addAddress(addressData, token);
            if (response.success) {
                const newAddress = response.data;

                // Actualizar el estado de las direcciones
                setAddresses(prev => {
                    const updatedAddresses = prev.map(addr => ({
                        ...addr,
                        isDefault: newAddress.isDefault ? false : addr.isDefault
                    }));
                    return [...updatedAddresses, newAddress];
                });

                // Seleccionar la nueva dirección automáticamente
                setSelectedAddressId(newAddress._id);

                // Actualizar la información del destinatario
                setRecipientInfo({
                    recipientName: newAddress.recipient || '',
                    phoneContact: newAddress.phoneContact || '',
                    additionalInstructions: newAddress.additionalInstructions || ''
                });

                // Cerrar el formulario y mostrar mensaje de éxito
                setShowAddressForm(false);
                toast.success(response.msg || "Dirección agregada correctamente");

                // Refrescar la lista de direcciones
                await fetchAddresses();
            }
        } catch (error) {
            console.error('Error al agregar dirección:', error);
            toast.error(error.message || "Hubo un problema al agregar la dirección");
        }
    };

    const selectedShippingMethod = selectedMethod ? shippingMethods
        .find(c => c._id === selectedCarrier)
        ?.methods.find(m => m._id === selectedMethod) : null;

    // Calcular el subtotal del carrito usando la nueva estructura de datos
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const product = item.productId;
            const variant = item.variant;
            
            // Buscar la información de precio para esta variante
            const variantInfo = product.precioVariantesPorPeso?.find(v => v.pesoId === variant.pesoId);
            
            // Usar el precio final si está disponible, de lo contrario usar el precio normal
            const price = variantInfo?.precioFinal || variant.precio;
            
            return total + (price * item.quantity);
        }, 0);
    };

    // Calcular el peso total del carrito (necesario para calcular costos de envío)
    const calculateTotalWeight = () => {
        return cartItems.reduce((total, item) => {
            const variant = item.variant;
            let weight = variant.peso || 0;
            
            // Convertir a kg si es necesario para uniformidad
            if (variant.unidad === 'g') {
                weight = weight / 1000;
            }
            
            return total + (weight * item.quantity);
        }, 0);
    };

    // Determinar el costo de envío basado en el método seleccionado
    const getShippingCost = () => {
        if (selectedShippingMethod) {
            const subtotal = calculateSubtotal();
            
            // Verificar si aplica envío gratis por monto mínimo
            if (selectedShippingMethod.free_shipping_threshold && 
                subtotal >= selectedShippingMethod.free_shipping_threshold) {
                return 0;
            }
            
            // Cálculo de envío basado en peso
            const totalWeight = calculateTotalWeight();
            const baseCost = selectedShippingMethod.base_cost || 0;
            
            // Si hay costo extra por kg adicional
            if (selectedShippingMethod.extra_cost_per_kg && totalWeight > 1) {
                const extraWeight = Math.max(0, totalWeight - 1); // Peso adicional después del primer kg
                return baseCost + (extraWeight * selectedShippingMethod.extra_cost_per_kg);
            }
            
            return baseCost;
        }
        return 0;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2 text-white">Información de Envío</h1>
            <p className="text-gray-500 mb-6">Selecciona tu dirección y método de envío preferido.</p>

            <CheckoutProgress />

            {loading ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">Cargando información...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {/* Sección de direcciones */}
                        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-600">Dirección de Envío</h2>
                                <button
                                    onClick={() => {
                                        setAddressToEdit(null);
                                        setShowAddressForm(true);
                                    }}
                                    className="flex items-center text-blue-500 hover:text-blue-700"
                                >
                                    <HiPlus className="mr-1" /> Nueva dirección
                                </button>
                            </div>

                            {showAddressForm && (
                                <div className="mb-6">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-medium">{addressToEdit ? 'Editar dirección' : 'Agregar nueva dirección'}</h3>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowAddressForm(false);
                                                    setAddressToEdit(null);
                                                }}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                        <AddressForm
                                            onSubmit={addressToEdit ? handleUpdateAddress : handleAddAddress}
                                            initialData={addressToEdit}
                                            onCancel={() => {
                                                setShowAddressForm(false);
                                                setAddressToEdit(null);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                {addresses.length === 0 ? (
                                    <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                                        <HiLocationMarker className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                                        <p className="text-gray-600 mb-4">No tienes direcciones guardadas</p>
                                        <button
                                            onClick={() => setShowAddressForm(true)}
                                            className="text-blue-600 font-medium hover:text-blue-800"
                                        >
                                            Agrega tu primera dirección
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map((address) => (
                                            <AddressCard
                                                key={address._id}
                                                address={address}
                                                selected={selectedAddressId === address._id}
                                                onSelect={handleAddressSelect}
                                                onEdit={handleEditAddress}
                                                onDelete={handleDeleteAddress}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Sección de métodos de envío */}
                            <ShippingMethodSelect
                                shippingMethods={shippingMethods}
                                selectedCarrier={selectedCarrier}
                                selectedMethod={selectedMethod}
                                onCarrierChange={setSelectedCarrier}
                                onMethodChange={setSelectedMethod}
                                subtotal={calculateSubtotal()}
                            />

                            {/* Información del destinatario */}
                            <RecipientInfoForm
                                recipientInfo={recipientInfo}
                                onChange={handleRecipientInfoChange}
                            />

                            {/* Botones de navegación */}
                            <div className="flex justify-between mt-8">
                                <Link
                                    to="/checkout"
                                    className="flex items-center text-blue-500 hover:text-blue-700 py-2 px-4"
                                >
                                    <FiArrowLeft className="mr-2" /> Volver al carrito
                                </Link>
                                <button
                                    type="submit"
                                    className={`${isValparaisoRegion 
                                        ? 'bg-blue-500 hover:bg-blue-600' 
                                        : 'bg-green-500 hover:bg-green-600'} 
                                        text-white py-3 px-6 rounded-lg flex items-center`}
                                    disabled={!selectedAddressId || !selectedMethod}
                                >
                                    {isValparaisoRegion ? 'Continuar al pago' : 'Solicitar cotización'} <FiArrowRight className="ml-2" />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Resumen del pedido */}
                    <div className="lg:col-span-1">
                        <CartSummary
                            cartItems={cartItems}
                            calculateSubtotal={calculateSubtotal}
                            calculateTotalWeight={calculateTotalWeight}
                            shippingCost={getShippingCost()}
                            showButton={false}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export { FormaEnvio };