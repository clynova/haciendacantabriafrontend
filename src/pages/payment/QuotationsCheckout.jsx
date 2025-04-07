import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getQuotationById } from '../../services/quotationService';
import { getPaymentMethods } from '../../services/paymentMethods';
import { createOrderFromQuotation, initiatePayment, getPaymentStatus } from '../../services/checkoutService';
import { formatCurrency } from '../../utils/funcionesReutilizables';
import { toast } from 'react-hot-toast';
import { 
    FiArrowLeft, FiLock, FiCreditCard, FiCheckCircle, 
    FiAlertTriangle, FiArrowRight 
} from 'react-icons/fi';
import { BsPaypal, BsBank, BsShieldLock, BsCreditCard2Front } from 'react-icons/bs';
import { HiShieldCheck, HiInformationCircle, HiExclamationCircle } from 'react-icons/hi';

// Componente para la tarjeta de método de pago
const PaymentMethodCard = ({ method, selected, onSelect }) => {
    const getMethodIcon = () => {
        switch (method.type.toLowerCase()) {
            case 'credit_card':
            case 'debit_card':
                return <BsCreditCard2Front size={24} className="text-gray-600 dark:text-gray-400" />;
            case 'paypal':
                return <BsPaypal size={24} className="text-blue-600" />;
            case 'bank_transfer':
                return <BsBank size={24} className="text-green-600" />;
            default:
                return <FiCreditCard size={24} className="text-gray-600 dark:text-gray-400" />;
        }
    };

    return (
        <div
            onClick={() => onSelect(method._id)}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selected
                    ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700 dark:ring-blue-800'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
            }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {getMethodIcon()}
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{method.name}</h3>
                        {method.commission_percentage > 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Comisión: {method.commission_percentage}%
                            </p>
                        )}
                    </div>
                </div>
                {selected && <FiCheckCircle className="text-blue-600 dark:text-blue-400" size={20} />}
            </div>
        </div>
    );
};

// Barra de progreso para el checkout
const CheckoutProgress = () => (
    <div className="mb-8">
        <div className="flex justify-between">
            <div className="text-gray-400 dark:text-gray-500">Cotización</div>
            <div className="text-gray-400 dark:text-gray-500">Revisión</div>
            <div className="text-blue-500 dark:text-blue-400 font-medium">Pago</div>
            <div className="text-gray-400 dark:text-gray-500">Confirmación</div>
        </div>
        <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div className="h-full w-3/4 bg-blue-500 dark:bg-blue-600 rounded-full"></div>
        </div>
    </div>
);

// Componente de garantías y políticas
const GuaranteesAndPolicies = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-lg mb-3 text-gray-600 dark:text-gray-300">Garantías y Políticas</h3>
        <ul className="space-y-3">
            <li className="flex items-start">
                <FiCheckCircle className="text-green-600 dark:text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Garantía de satisfacción de 30 días</span>
            </li>
            <li className="flex items-start">
                <FiCheckCircle className="text-green-600 dark:text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Envíos protegidos contra daños</span>
            </li>
            <li className="flex items-start">
                <FiCheckCircle className="text-green-600 dark:text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Soporte al cliente 24/7</span>
            </li>
            <li className="flex items-start">
                <FiAlertTriangle className="text-amber-600 dark:text-amber-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm text-amber-700 dark:text-amber-400">Al confirmar, aceptas nuestros términos y condiciones</span>
            </li>
        </ul>
    </div>
);

// Componente de resumen de la cotización
const QuotationSummary = ({ quotation, paymentMethod }) => {
    const paymentCommission = paymentMethod?.commission_percentage 
        ? (quotation.total * paymentMethod.commission_percentage) / 100
        : 0;

    const total = quotation.total + paymentCommission;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-bold text-xl mb-4 text-gray-800 dark:text-white">Resumen de la Cotización</h2>
                
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Cotización #:</span>
                        <span className="text-gray-800 dark:text-white font-medium">{quotation._id.slice(-6)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Fecha:</span>
                        <span className="text-gray-800 dark:text-white">{new Date(quotation.quotationDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Válida hasta:</span>
                        <span className="text-gray-800 dark:text-white">{new Date(quotation.validUntil).toLocaleDateString()}</span>
                    </div>
                </div>
                
                <div className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Productos</h3>
                    <div className="space-y-3">
                        {quotation.products.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <div className="flex-1">
                                    <span className="text-gray-800 dark:text-white">{item.product.nombre}</span>
                                    <span className="text-gray-500 dark:text-gray-400 block">
                                        {item.quantity} x {formatCurrency(item.price)}
                                    </span>
                                </div>
                                <span className="text-gray-800 dark:text-white">
                                    {formatCurrency(item.price * item.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="p-6 bg-gray-50 dark:bg-gray-800">
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="text-gray-800 dark:text-white">{formatCurrency(quotation.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Envío</span>
                        <span className="text-gray-800 dark:text-white">{formatCurrency(quotation.shipping?.cost || 0)}</span>
                    </div>
                    {paymentCommission > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                                Comisión de pago ({paymentMethod.commission_percentage}%)
                            </span>
                            <span className="text-gray-800 dark:text-white">{formatCurrency(paymentCommission)}</span>
                        </div>
                    )}
                    <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3 font-bold">
                        <span className="text-gray-800 dark:text-white">Total</span>
                        <span className="text-gray-800 dark:text-white">{formatCurrency(total)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente principal
const QuotationsCheckout = () => {
    const { quotationId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    
    const [quotation, setQuotation] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [facturacion, setFacturacion] = useState({
        comprobanteTipo: "boleta",
        razonSocial: "",
        rut: "",
        giro: "",
        direccionFacturacion: ""
    });
    const [facturacionErrors, setFacturacionErrors] = useState({
        razonSocial: "",
        rut: "",
        giro: "",
        direccionFacturacion: ""
    });

    const selectedPaymentMethod = selectedMethod
        ? paymentMethods.find(method => method._id === selectedMethod)
        : null;

    // Verificar si la cotización es válida
    const isQuotationValid = (quotation) => {
        if (!quotation?.validUntil) return false;
        return new Date(quotation.validUntil) > new Date();
    };

    // Validar el formulario de facturación
    const isFormValid = () => {
        if (facturacion.comprobanteTipo === "Boleta") {
            return true; // No se requieren campos adicionales para boleta
        } else if (facturacion.comprobanteTipo === "factura") {
            // Verificar que todos los campos requeridos para factura estén completos
            return (
                facturacion.rut.trim() !== "" &&
                facturacion.razonSocial.trim() !== "" &&
                facturacion.giro.trim() !== "" &&
                facturacion.direccionFacturacion.trim() !== ""
            );
        }
        return false;
    };

    // Cargar la cotización y los métodos de pago
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Obtener detalles de la cotización
                const quotationResponse = await getQuotationById(quotationId, token);
                if (!quotationResponse.success) {
                    throw new Error(quotationResponse.message || 'Error al cargar la cotización');
                }
                
                const quotationData = quotationResponse.quotation;
                setQuotation(quotationData);
                
                // Verificar que la cotización existe y está aprobada
                if (!quotationData) {
                    throw new Error('No se encontró la cotización');
                }
                
                if (quotationData.status !== 'approved') {
                    throw new Error(`La cotización no está aprobada. Estado actual: ${quotationData.status}`);
                }
                
                // Verificar que la cotización no ha expirado
                if (!isQuotationValid(quotationData)) {
                    throw new Error('La cotización ha expirado');
                }
                
                // Obtener métodos de pago disponibles
                const methodsResponse = await getPaymentMethods();
                if (methodsResponse.success) {
                    // Filtrar métodos de pago válidos
                    const validMethods = methodsResponse.data.filter(method => method.active);
                    setPaymentMethods(validMethods);
                    
                    if (validMethods.length > 0) {
                        setSelectedMethod(validMethods[0]._id);
                    }
                } else {
                    throw new Error('Error al cargar los métodos de pago');
                }
            } catch (error) {
                console.error('Error:', error);
                setError(error.message || 'Error al cargar la información');
                toast.error(error.message || 'Error al cargar la información');
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [quotationId, token]);

    const checkPaymentStatus = async (orderId) => {
        try {
            const response = await getPaymentStatus(orderId, token);
            console.log('Payment status:', response);

            if (response.paymentStatus === 'completed') {
                navigate('/checkout/confirmation/success', {
                    state: { orderId: orderId }
                });
            } else if (response.paymentStatus === 'failed') {
                toast.error('El pago ha fallado. Por favor intenta nuevamente.');
                navigate('/checkout/confirmation/failure', {
                    state: { orderId: orderId }
                });
            } else if (response.paymentStatus === 'processing') {
                toast.info('El pago está siendo procesado. Te notificaremos cuando se complete.');
                navigate('/profile/orders');
            } else {
                navigate('/checkout/confirmation/failure', {
                    state: {
                        orderId: orderId,
                        reason: response.statusReason || 'rejected'
                    }
                });
            }

            setIsProcessing(false);

        } catch (error) {
            console.error('Error verificando estado del pago:', error);
            toast.error('No pudimos verificar el estado de tu pago. Por favor revisa tus órdenes.');
            setIsProcessing(false);
            navigate('/profile/orders');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedMethod) {
            toast.error('Por favor selecciona un método de pago');
            return;
        }

        // Validar todos los campos si se seleccionó Factura
        if (facturacion.comprobanteTipo === "factura") {
            let hasErrors = false;
            const newErrors = { ...facturacionErrors };

            if (!facturacion.rut.trim()) {
                newErrors.rut = "El RUT es obligatorio para factura";
                hasErrors = true;
            }

            if (!facturacion.razonSocial.trim()) {
                newErrors.razonSocial = "La razón social es obligatoria para factura";
                hasErrors = true;
            }

            if (!facturacion.giro.trim()) {
                newErrors.giro = "El giro es obligatorio para factura";
                hasErrors = true;
            }

            if (!facturacion.direccionFacturacion.trim()) {
                newErrors.direccionFacturacion = "La dirección de facturación es obligatoria";
                hasErrors = true;
            }

            if (hasErrors) {
                setFacturacionErrors(newErrors);
                toast.error("Por favor completa todos los campos requeridos para la factura");
                return;
            }
        }

        setIsProcessing(true);
        toast.loading('Procesando tu pago...', { id: 'payment' });

        try {
            // Crear orden a partir de la cotización con datos de facturación
            const orderResponse = await createOrderFromQuotation(
                quotationId, 
                selectedMethod, 
                token,
                facturacion
            );

            if (!orderResponse.success) {
                throw new Error(orderResponse.message || 'Error al crear la orden');
            }

            localStorage.setItem('currentOrderId', orderResponse.order._id);

            // Iniciar el proceso de pago
            const paymentResponse = await initiatePayment(orderResponse.order._id, token);

            const paymentUrl = new URL(paymentResponse.redirectUrl);
            paymentUrl.searchParams.set(
                paymentResponse.payment_type === 'webpay' ? 'token_ws' : 'token',
                paymentResponse.token
            );

            const width = 800;
            const height = 600;
            const left = (window.screen.width - width) / 2;
            const top = (window.screen.height - height) / 2;

            toast.dismiss('payment');

            const paymentWindow = window.open(
                paymentUrl.toString(),
                'Pago',
                `width=${width},height=${height},left=${left},top=${top},location=no,menubar=no,toolbar=no,status=no,scrollbars=yes,resizable=yes`
            );

            const checkWindowClosed = setInterval(() => {
                if (paymentWindow.closed) {
                    clearInterval(checkWindowClosed);
                    checkPaymentStatus(orderResponse.order._id);
                }
            }, 5000);

        } catch (error) {
            console.error('Error en el proceso de pago:', error);
            toast.dismiss('payment');
            toast.error(error.message || 'Error al procesar el pago');
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-white">Procesando...</h1>
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Cargando información de pago...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
                    <HiExclamationCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Error</h2>
                    <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
                    <div className="flex justify-center">
                        <Link
                            to="/profile/quotations"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Volver a mis cotizaciones
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2 text-white">Pago de Cotización</h1>
            <p className="text-gray-400 mb-6">Complete los detalles de pago para finalizar su compra.</p>

            <CheckoutProgress />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center mb-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                                <HiInformationCircle className="h-5 w-5 text-blue-500 mr-2" />
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                    Estás realizando el pago para la cotización #{quotation?._id.slice(-6)}. 
                                    Los detalles no pueden ser modificados.
                                </p>
                            </div>

                            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Método de Pago</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {paymentMethods.map(method => (
                                    <PaymentMethodCard
                                        key={method._id}
                                        method={method}
                                        selected={selectedMethod === method._id}
                                        onSelect={setSelectedMethod}
                                    />
                                ))}
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                                    <FiLock className="text-green-600 dark:text-green-500 mr-2" size={20} />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Pago Seguro</span>
                                </div>
                                <div className="flex items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                                    <BsShieldLock className="text-green-600 dark:text-green-500 mr-2" size={20} />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Datos Encriptados</span>
                                </div>
                                <div className="flex items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                                    <HiShieldCheck className="text-green-600 dark:text-green-500 mr-2" size={20} />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Transacción Protegida</span>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="font-medium mb-4 text-gray-700 dark:text-gray-300">Datos de Facturación</h3>
                                
                                <div className="mb-4">
                                    <label htmlFor="comprobanteTipo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Tipo de Comprobante*
                                    </label>
                                    <select
                                        id="comprobanteTipo"
                                        name="comprobanteTipo"
                                        value={facturacion.comprobanteTipo}
                                        onChange={(e) => setFacturacion(prevFacturacion => ({
                                            ...prevFacturacion,
                                            comprobanteTipo: e.target.value
                                        }))}
                                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="Boleta">Boleta</option>
                                        <option value="Factura">Factura</option>
                                    </select>
                                </div>

                                {facturacion.comprobanteTipo === "factura" && (
                                    <>
                                        <div className="mb-4">
                                            <label htmlFor="rut" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                RUT*
                                            </label>
                                            <input
                                                type="text"
                                                id="rut"
                                                name="rut"
                                                value={facturacion.rut}
                                                onChange={(e) => {
                                                    const newRut = e.target.value;
                                                    setFacturacion(prevFacturacion => ({
                                                        ...prevFacturacion,
                                                        rut: newRut
                                                    }));
                                                    if (!newRut.trim() && facturacion.comprobanteTipo === "factura") {
                                                        setFacturacionErrors(prevErrors => ({
                                                            ...prevErrors,
                                                            rut: "El RUT es obligatorio para factura"
                                                        }));
                                                    } else {
                                                        setFacturacionErrors(prevErrors => ({
                                                            ...prevErrors,
                                                            rut: ""
                                                        }));
                                                    }
                                                }}
                                                className={`mt-1 block w-full rounded-md border ${
                                                    facturacionErrors.rut ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                } py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                                placeholder="Ingrese el RUT para la factura"
                                                required={facturacion.comprobanteTipo === "factura"}
                                            />
                                            {facturacionErrors.rut && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{facturacionErrors.rut}</p>
                                            )}
                                        </div>
                                        
                                        <div className="mb-4">
                                            <label htmlFor="razonSocial" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Razón Social*
                                            </label>
                                            <input
                                                type="text"
                                                id="razonSocial"
                                                name="razonSocial"
                                                value={facturacion.razonSocial}
                                                onChange={(e) => {
                                                    const newRazonSocial = e.target.value;
                                                    setFacturacion(prevFacturacion => ({
                                                        ...prevFacturacion,
                                                        razonSocial: newRazonSocial
                                                    }));
                                                    if (!newRazonSocial.trim() && facturacion.comprobanteTipo === "factura") {
                                                        setFacturacionErrors(prevErrors => ({
                                                            ...prevErrors,
                                                            razonSocial: "La razón social es obligatoria para factura"
                                                        }));
                                                    } else {
                                                        setFacturacionErrors(prevErrors => ({
                                                            ...prevErrors,
                                                            razonSocial: ""
                                                        }));
                                                    }
                                                }}
                                                className={`mt-1 block w-full rounded-md border ${
                                                    facturacionErrors.razonSocial ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                } py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                                placeholder="Ingrese la razón social"
                                                required={facturacion.comprobanteTipo === "factura"}
                                            />
                                            {facturacionErrors.razonSocial && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{facturacionErrors.razonSocial}</p>
                                            )}
                                        </div>
                                        
                                        <div className="mb-4">
                                            <label htmlFor="giro" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Giro*
                                            </label>
                                            <input
                                                type="text"
                                                id="giro"
                                                name="giro"
                                                value={facturacion.giro}
                                                onChange={(e) => {
                                                    const newGiro = e.target.value;
                                                    setFacturacion(prevFacturacion => ({
                                                        ...prevFacturacion,
                                                        giro: newGiro
                                                    }));
                                                    if (!newGiro.trim() && facturacion.comprobanteTipo === "factura") {
                                                        setFacturacionErrors(prevErrors => ({
                                                            ...prevErrors,
                                                            giro: "El giro es obligatorio para factura"
                                                        }));
                                                    } else {
                                                        setFacturacionErrors(prevErrors => ({
                                                            ...prevErrors,
                                                            giro: ""
                                                        }));
                                                    }
                                                }}
                                                className={`mt-1 block w-full rounded-md border ${
                                                    facturacionErrors.giro ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                } py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                                placeholder="Ingrese el giro"
                                                required={facturacion.comprobanteTipo === "factura"}
                                            />
                                            {facturacionErrors.giro && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{facturacionErrors.giro}</p>
                                            )}
                                        </div>
                                        
                                        <div className="mb-4">
                                            <label htmlFor="direccionFacturacion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Dirección de Facturación*
                                            </label>
                                            <input
                                                type="text"
                                                id="direccionFacturacion"
                                                name="direccionFacturacion"
                                                value={facturacion.direccionFacturacion}
                                                onChange={(e) => {
                                                    const newDireccion = e.target.value;
                                                    setFacturacion(prevFacturacion => ({
                                                        ...prevFacturacion,
                                                        direccionFacturacion: newDireccion
                                                    }));
                                                    if (!newDireccion.trim() && facturacion.comprobanteTipo === "factura") {
                                                        setFacturacionErrors(prevErrors => ({
                                                            ...prevErrors,
                                                            direccionFacturacion: "La dirección de facturación es obligatoria"
                                                        }));
                                                    } else {
                                                        setFacturacionErrors(prevErrors => ({
                                                            ...prevErrors,
                                                            direccionFacturacion: ""
                                                        }));
                                                    }
                                                }}
                                                className={`mt-1 block w-full rounded-md border ${
                                                    facturacionErrors.direccionFacturacion ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                } py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                                placeholder="Ingrese la dirección de facturación"
                                                required={facturacion.comprobanteTipo === "factura"}
                                            />
                                            {facturacionErrors.direccionFacturacion && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{facturacionErrors.direccionFacturacion}</p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between mt-8">
                            <Link
                                to={`/profile/quotations/${quotationId}`}
                                className="flex items-center text-blue-500 hover:text-blue-700 py-2 px-4"
                            >
                                <FiArrowLeft className="mr-2" /> Volver a la cotización
                            </Link>
                            <button
                                type="submit"
                                disabled={isProcessing || !selectedMethod || (facturacion.comprobanteTipo === "factura" && !isFormValid())}
                                className={`py-3 px-6 rounded-lg flex items-center ${
                                    isProcessing || (facturacion.comprobanteTipo === "factura" && !isFormValid())
                                        ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                            >
                                {isProcessing ? (
                                    <>Procesando<span className="ml-2 animate-pulse">...</span></>
                                ) : (
                                    <>Confirmar y Pagar <FiArrowRight className="ml-2" /></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    {quotation && (
                        <QuotationSummary 
                            quotation={quotation} 
                            paymentMethod={selectedPaymentMethod} 
                        />
                    )}

                    <GuaranteesAndPolicies />
                </div>
            </div>
        </div>
    );
};

export { QuotationsCheckout };