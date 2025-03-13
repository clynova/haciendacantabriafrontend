import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { 
    getMyPaymentMethods, 
    setDefaultPaymentMethod, 
    togglePaymentMethodStatus, 
    deletePaymentMethod 
} from "../../services/userService";
import { toast } from "react-hot-toast";
import { useGlobal } from "../../context/GlobalContext";
import { HiCreditCard, HiCheck, HiX, HiPlus, HiStar, HiTrash } from "react-icons/hi";

const PaymentMethodItem = ({ method, onSetDefault, onToggleStatus, onDelete, isLoading }) => {
    // Formatea la fecha para mostrarla en formato legible
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Devuelve el ícono y texto según el tipo de método de pago
    const getPaymentMethodInfo = (type) => {
        switch(type) {
            case 'credit_card':
                return { 
                    icon: <HiCreditCard className="w-6 h-6" />,
                    label: 'Tarjeta de crédito'
                };
            case 'debit_card':
                return { 
                    icon: <HiCreditCard className="w-6 h-6" />,
                    label: 'Tarjeta de débito'
                };
            default:
                return { 
                    icon: <HiCreditCard className="w-6 h-6" />,
                    label: 'Método de pago'
                };
        }
    };

    const methodInfo = getPaymentMethodInfo(method.type);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow relative border border-gray-200 dark:border-gray-700">
            {method.isDefault && (
                <span className="absolute top-4 right-4 flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                    <HiCheck className="w-5 h-5" />
                    Predeterminado
                </span>
            )}
            
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full">
                    {methodInfo.icon}
                </div>
                <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-lg">
                        {methodInfo.label}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        **** **** **** {method.last4Digits}
                    </p>
                </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                        Agregado el {formatDate(method.createdAt)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        method.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                        {method.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
                {!method.isDefault && method.isActive && (
                    <button
                        onClick={() => onSetDefault(method._id)}
                        disabled={isLoading}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-900/20"
                    >
                        <HiStar className="w-4 h-4" />
                        <span>Predeterminado</span>
                    </button>
                )}
                
                <button
                    onClick={() => onToggleStatus(method._id, !method.isActive)}
                    disabled={isLoading}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20"
                >
                    {method.isActive ? (
                        <>
                            <HiX className="w-4 h-4" />
                            <span>Desactivar</span>
                        </>
                    ) : (
                        <>
                            <HiCheck className="w-4 h-4" />
                            <span>Activar</span>
                        </>
                    )}
                </button>
                
                <button
                    onClick={() => onDelete(method._id)}
                    disabled={isLoading}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20"
                >
                    <HiTrash className="w-4 h-4" />
                    <span>Eliminar</span>
                </button>
            </div>
        </div>
    );
};

// Componente para agregar un nuevo método de pago
const AddPaymentMethodForm = ({ onAddMethod, onCancel }) => {
    const [formData, setFormData] = useState({
        type: 'credit_card',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        isDefault: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Solo simulamos la adición - la API real procesaría toda la información de la tarjeta
            const simulatedResult = {
                type: formData.type,
                last4Digits: formData.cardNumber.slice(-4),
                isDefault: formData.isDefault
            };
            
            await onAddMethod(simulatedResult);
        } catch (error) {
            toast.error('Error al agregar método de pago');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Agregar Método de Pago
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tipo de Tarjeta
                    </label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="credit_card">Tarjeta de Crédito</option>
                        <option value="debit_card">Tarjeta de Débito</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nombre del Titular
                    </label>
                    <input
                        type="text"
                        name="cardholderName"
                        value={formData.cardholderName}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Nombre como aparece en la tarjeta"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Número de Tarjeta
                    </label>
                    <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="XXXX XXXX XXXX XXXX"
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Fecha de Expiración
                        </label>
                        <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="MM/AA"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            CVV
                        </label>
                        <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="XXX"
                        />
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Establecer como predeterminado
                    </label>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        Cancelar
                    </button>
                    
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                    >
                        {isSubmitting ? 'Procesando...' : 'Guardar Tarjeta'}
                    </button>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                    Nota: Esta es una demostración. En un entorno de producción, la información de la tarjeta debería ser procesada de forma segura por un proveedor de pagos como Stripe o PayPal.
                </div>
            </form>
        </div>
    );
};

const MyPaymentMethods = () => {
    const { token } = useAuth();
    const { setPageTitle } = useGlobal();
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        setPageTitle('Métodos de Pago | LynFront');
        fetchPaymentMethods();
    }, [setPageTitle, token]);

    const fetchPaymentMethods = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getMyPaymentMethods(token);
            // Corregir aquí: acceder a response.data que contiene el array de métodos de pago
            if (response && response.success && Array.isArray(response.data)) {
                setPaymentMethods(response.data);
            } else {
                console.error("Formato de respuesta inesperado:", response);
                setError("La respuesta del servidor tiene un formato inesperado");
                toast.error("Error al procesar los datos recibidos");
            }
        } catch (err) {
            console.error("Error al obtener métodos de pago:", err);
            setError("No se pudieron cargar los métodos de pago. Por favor, intenta de nuevo más tarde.");
            toast.error("Error al cargar los métodos de pago");
        } finally {
            setLoading(false);
        }
    };

    const handleSetDefaultPaymentMethod = async (paymentMethodId) => {
        try {
            setLoading(true);
            const response = await setDefaultPaymentMethod(paymentMethodId, token);
            
            // Verificar si la respuesta tiene el formato esperado
            if (response && response.success) {
                // Actualizar el estado local
                setPaymentMethods(prevMethods => 
                    prevMethods.map(method => ({
                        ...method,
                        isDefault: method._id === paymentMethodId
                    }))
                );
                
                toast.success("Método de pago establecido como predeterminado");
            } else {
                toast.error("Error al establecer método de pago predeterminado");
            }
        } catch (error) {
            console.error("Error al establecer método de pago como predeterminado:", error);
            toast.error("No se pudo establecer como predeterminado");
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePaymentMethodStatus = async (paymentMethodId, newActiveState) => {
        try {
            setLoading(true);
            const response = await togglePaymentMethodStatus(paymentMethodId, token);
            
            // Verificar si la respuesta tiene el formato esperado
            if (response && response.success) {
                // Actualizar el estado local
                setPaymentMethods(prevMethods => 
                    prevMethods.map(method => 
                        method._id === paymentMethodId 
                            ? { ...method, isActive: !method.isActive }
                            : method
                    )
                );
                
                const statusMessage = newActiveState ? "activado" : "desactivado";
                toast.success(`Método de pago ${statusMessage} correctamente`);
            } else {
                toast.error("Error al cambiar el estado del método de pago");
            }
        } catch (error) {
            console.error("Error al cambiar el estado del método de pago:", error);
            toast.error("No se pudo cambiar el estado del método de pago");
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePaymentMethod = async (paymentMethodId) => {
        // Confirmar antes de eliminar
        if (!window.confirm("¿Estás seguro de que deseas eliminar este método de pago?")) {
            return;
        }

        try {
            setLoading(true);
            const response = await deletePaymentMethod(paymentMethodId, token);
            
            // Verificar si la respuesta tiene el formato esperado
            if (response && response.success) {
                // Actualizar el estado local
                setPaymentMethods(prevMethods => 
                    prevMethods.filter(method => method._id !== paymentMethodId)
                );
                
                toast.success("Método de pago eliminado correctamente");
            } else {
                toast.error("Error al eliminar el método de pago");
            }
        } catch (error) {
            console.error("Error al eliminar método de pago:", error);
            toast.error("No se pudo eliminar el método de pago");
        } finally {
            setLoading(false);
        }
    };

    const handleAddPaymentMethod = async (paymentMethodData) => {
        try {
            // En un escenario real, aquí enviaríamos los datos a la API
            // Como esto es una demostración, simularemos la adición con un ID único
            const newMethod = {
                _id: `temp-${Date.now()}`,
                userId: "user-id",
                type: paymentMethodData.type,
                isDefault: paymentMethodData.isDefault,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                last4Digits: paymentMethodData.last4Digits
            };
            
            // Actualizar el estado local
            if (newMethod.isDefault) {
                setPaymentMethods(prevMethods => 
                    [newMethod, ...prevMethods.map(m => ({ ...m, isDefault: false }))]
                );
            } else {
                setPaymentMethods(prevMethods => [newMethod, ...prevMethods]);
            }
            
            setShowAddForm(false);
            toast.success("Método de pago agregado correctamente");
        } catch (error) {
            console.error("Error al agregar método de pago:", error);
            toast.error("No se pudo agregar el método de pago");
        }
    };

    if (loading && paymentMethods.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center justify-center min-h-[300px]">
                <svg className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Métodos de Pago</h1>
                
                {!showAddForm && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                        <HiPlus className="w-5 h-5" />
                        Agregar Método de Pago
                    </button>
                )}
            </div>
            
            {showAddForm && (
                <AddPaymentMethodForm 
                    onAddMethod={handleAddPaymentMethod} 
                    onCancel={() => setShowAddForm(false)}
                />
            )}
            
            {paymentMethods.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
                    <HiCreditCard className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No tienes métodos de pago</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Agrega un método de pago para que puedas realizar compras de manera más sencilla.
                    </p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                        <HiPlus className="w-5 h-5" />
                        Agregar Método de Pago
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paymentMethods.map((method) => (
                        <PaymentMethodItem
                            key={method._id}
                            method={method}
                            onSetDefault={handleSetDefaultPaymentMethod}
                            onToggleStatus={handleTogglePaymentMethodStatus}
                            onDelete={handleDeletePaymentMethod}
                            isLoading={loading}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export { MyPaymentMethods };