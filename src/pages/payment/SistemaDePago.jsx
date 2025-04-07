import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getPaymentMethods } from '../../services/paymentMethods';
import { createOrder, initiatePayment, getPaymentStatus } from '../../services/checkoutService';
import { FiArrowLeft, FiArrowRight, FiLock, FiCreditCard, FiCheckCircle, FiAlertTriangle, FiMapPin, FiUser, FiPackage, FiTruck } from 'react-icons/fi';
import { BsPaypal, BsBank, BsShieldLock, BsCreditCard2Front } from 'react-icons/bs';
import { HiShieldCheck } from 'react-icons/hi';
import CartSummary from '../../components/Cart/CartSummary';
import { formatCurrency } from '../../utils/funcionesReutilizables';

// Componente para mostrar la información de envío no editable
const ShippingInfoDisplay = ({ shippingInfo }) => {
    if (!shippingInfo || !shippingInfo.address) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-600 flex items-center">
                <FiMapPin className="mr-2" /> Información de Envío
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-medium text-gray-700 mb-2">Dirección de Entrega</h3>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                        <p className="text-gray-700">{shippingInfo.address.recipient}</p>
                        <p className="text-gray-700">
                            {shippingInfo.address.street} {shippingInfo.address.number}
                            {shippingInfo.address.interior && `, Int. ${shippingInfo.address.interior}`}
                        </p>
                        <p className="text-gray-700">
                            {shippingInfo.address.suburb}, {shippingInfo.address.city}
                        </p>
                        <p className="text-gray-700">{shippingInfo.address.state}</p>
                        <p className="text-gray-700">CP: {shippingInfo.address.zipCode}</p>
                    </div>
                </div>

                <div>
                    <h3 className="font-medium text-gray-700 mb-2">Datos del Destinatario</h3>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                        <div className="flex items-start">
                            <FiUser className="text-blue-500 mr-2 mt-1" />
                            <p className="text-gray-700">{shippingInfo.recipientInfo.recipientName}</p>
                        </div>
                        <div className="flex items-start mt-2">
                            <FiPackage className="text-blue-500 mr-2 mt-1" />
                            <p className="text-gray-700">Teléfono: {shippingInfo.recipientInfo.phoneContact}</p>
                        </div>
                        {shippingInfo.recipientInfo.additionalInstructions && (
                            <div className="flex items-start mt-2">
                                <FiAlertTriangle className="text-amber-500 mr-2 mt-1" />
                                <p className="text-gray-700">{shippingInfo.recipientInfo.additionalInstructions}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-2">Método de Envío</h3>
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100 flex items-center">
                    <FiTruck className="text-blue-500 mr-3" size={20} />
                    <div>
                        <p className="text-blue-700 font-medium">{shippingInfo.carrierName}</p>
                        <p className="text-blue-600">{shippingInfo.methodName}</p>
                        <p className="text-blue-600 text-sm">Tiempo estimado: {shippingInfo.deliveryTime}</p>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-right">
                <Link
                    to="/checkout/envio"
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                    Editar información de envío
                </Link>
            </div>
        </div>
    );
};

// Componente para la tarjeta de método de pago
const PaymentMethodCard = ({ method, selected, onSelect }) => {
    const getMethodIcon = () => {
        switch (method.type.toLowerCase()) {
            case 'credit_card':
            case 'debit_card':
                return <BsCreditCard2Front size={24} className="text-gray-600" />;
            case 'paypal':
                return <BsPaypal size={24} className="text-blue-600" />;
            case 'bank_transfer':
                return <BsBank size={24} className="text-green-600" />;
            default:
                return <FiCreditCard size={24} className="text-gray-600" />;
        }
    };

    return (
        <div
            onClick={() => onSelect(method._id)}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${selected
                ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {getMethodIcon()}
                    <div>
                        <h3 className="font-medium">{method.name}</h3>
                        {method.commission_percentage > 0 && (
                            <p className="text-sm text-gray-500">
                                Comisión: {method.commission_percentage}%
                            </p>
                        )}
                    </div>
                </div>
                {selected && <FiCheckCircle className="text-blue-600" size={20} />}
            </div>
        </div>
    );
};

// Barra de progreso para el checkout
const CheckoutProgress = () => (
    <div className="mb-8">
        <div className="flex justify-between">
            <div className="text-gray-400">Carrito</div>
            <div className="text-gray-400">Envío</div>
            <div className="text-blue-500 font-medium">Pago</div>
            <div className="text-gray-400">Confirmación</div>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full">
            <div className="h-full w-3/4 bg-blue-500 rounded-full"></div>
        </div>
    </div>
);

// Componente de garantías y políticas
const GuaranteesAndPolicies = () => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <h3 className="font-bold text-lg mb-3 text-gray-600">Garantías y Políticas</h3>
        <ul className="space-y-3">
            <li className="flex items-start">
                <FiCheckCircle className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-500">Garantía de satisfacción de 30 días</span>
            </li>
            <li className="flex items-start">
                <FiCheckCircle className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-500">Envíos protegidos contra daños</span>
            </li>
            <li className="flex items-start">
                <FiCheckCircle className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-500">Soporte al cliente 24/7</span>
            </li>
            <li className="flex items-start">
                <FiAlertTriangle className="text-amber-600 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm text-amber-700">Al confirmar, aceptas nuestros términos y condiciones</span>
            </li>
        </ul>
    </div>
);

// Componente principal
const SistemaDePago = () => {
    const { cartItems, clearCart, shippingInfo, validateCartStock } = useCart();
    const { token } = useAuth();
    const navigate = useNavigate();

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
        if (shippingInfo && shippingInfo.baseCost) {
            // Verificar si aplica envío gratis por monto mínimo
            if (shippingInfo.free_shipping_threshold) {
                const subtotal = calculateSubtotal();
                if (subtotal >= shippingInfo.free_shipping_threshold) {
                    return 0;
                }
            }

            // Cálculo de envío basado en peso si hay costo extra por kg
            if (shippingInfo.extraCostPerKg) {
                const totalWeight = calculateTotalWeight();
                // Si el peso total es mayor que 1kg, calcular el costo adicional
                const extraWeight = Math.max(0, totalWeight - 1); // Peso adicional después del primer kg
                return shippingInfo.baseCost + (extraWeight * shippingInfo.extraCostPerKg);
            }

            // Devolver el costo base de envío
            return parseFloat(shippingInfo.baseCost);
        }
        return 0;
    };

    const calculatePaymentCommission = () => {
        if (selectedPaymentMethod?.commission_percentage) {
            const subtotal = calculateSubtotal();
            const shipping = getShippingCost();
            return ((subtotal + shipping) * selectedPaymentMethod.commission_percentage) / 100;
        }
        return 0;
    };

    const paymentCommission = calculatePaymentCommission();

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const response = await getPaymentMethods();

                if (response.success && response.data) {
                    // Filtrar solo los métodos de pago activos
                    const activePaymentMethods = response.data.filter(method => method.active);
                    setPaymentMethods(activePaymentMethods);
                    if (activePaymentMethods.length > 0) {
                        setSelectedMethod(activePaymentMethods[0]._id);
                    }
                }
            } catch (err) {
                setError('Error al cargar los métodos de pago');
                toast.error('Error al cargar los métodos de pago');
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentMethods();
    }, []);

    useEffect(() => {
        if (!shippingInfo) {
            navigate('/checkout/envio');
        }
    }, [shippingInfo, navigate]);

    // Función para validar el stock de los productos en el carrito
    const validateCartItemsStock = () => {
        for (const item of cartItems) {
            const product = item.productId;
            const variant = item.variant;

            // Buscar la información de stock para esta variante
            const variantInfo = product.precioVariantesPorPeso?.find(v => v.pesoId === variant.pesoId);

            // Verificar si hay suficiente stock
            if (!variantInfo || variantInfo.stockDisponible < item.quantity) {
                const productName = product.nombre;
                const variantSize = `${variant.peso}${variant.unidad}`;
                const availableStock = variantInfo ? variantInfo.stockDisponible : 0;

                toast.error(`No hay suficiente stock para ${productName} (${variantSize}). Stock disponible: ${availableStock}`);
                return false;
            }
        }
        return true;
    };

    const checkPaymentStatus = async (orderId) => {
        try {
            const response = await getPaymentStatus(orderId, token);
            clearCart();
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

    const isFormValid = () => {
        if (facturacion.comprobanteTipo === "boleta") {
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateCartItemsStock()) {
            return;
        }

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

            const facturacionData = {
                comprobanteTipo: facturacion.comprobanteTipo,
                rut: facturacion.comprobanteTipo === "factura" ? facturacion.rut : "",
                razonSocial: facturacion.comprobanteTipo === "factura" ? facturacion.razonSocial : "",
                giro: facturacion.comprobanteTipo === "factura" ? facturacion.giro : "",
                direccionFacturacion: facturacion.comprobanteTipo === "factura" ? facturacion.direccionFacturacion : ""
            }

            const orderData = {
                shippingAddressId: shippingInfo.address._id,
                paymentMethod: selectedMethod,
                shippingMethod: shippingInfo.carrierId,
                recipientName: shippingInfo.recipientInfo.recipientName,
                phoneContact: shippingInfo.recipientInfo.phoneContact,
                additionalInstructions: shippingInfo.recipientInfo.additionalInstructions || '',
                facturacion: facturacionData
            };

            console.log('orderData', orderData);

            console.log('shippingInfo', shippingInfo);

            console.log('orderData', orderData);
            // shippingAddressId
            console.log('shippingAddressId', shippingInfo.address._id);
            // paymentMethod
            console.log('paymentMethod', selectedMethod);
            // shippingMethod
            console.log('shippingMethod', shippingInfo.carrierId);


            const orderResponse = await createOrder(orderData, token);

            if (!orderResponse.success) {
                throw new Error(orderResponse.message || 'Error al crear la orden');
            }

            localStorage.setItem('currentOrderId', orderResponse.order._id);

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
                <h1 className="text-3xl font-bold mb-6 text-gray-700">Procesando...</h1>
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Cargando información de pago...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2 text-white">Finalizar Compra</h1>
            <p className="text-gray-500 mb-6">Complete los detalles de pago para finalizar su compra.</p>

            <CheckoutProgress />

            <ShippingInfoDisplay shippingInfo={shippingInfo} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                            <h2 className="text-xl font-bold mb-4 text-gray-600">Método de Pago</h2>

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
                                <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <FiLock className="text-green-600 mr-2" size={20} />
                                    <span className="text-sm">Pago Seguro</span>
                                </div>
                                <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <BsShieldLock className="text-green-600 mr-2" size={20} />
                                    <span className="text-sm">Datos Encriptados</span>
                                </div>
                                <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <HiShieldCheck className="text-green-600 mr-2" size={20} />
                                    <span className="text-sm">Transacción Protegida</span>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-200 pt-6">
                                <h3 className="font-medium mb-4 text-gray-700">Datos de Facturación</h3>

                                <div className="mb-4">
                                    <label htmlFor="comprobanteTipo" className="block text-sm font-medium text-gray-700 mb-1">
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
                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="boleta">Boleta</option>
                                        <option value="factura">Factura</option>
                                    </select>
                                </div>

                                {facturacion.comprobanteTipo === "factura" && (
                                    <>
                                        <div className="mb-4">
                                            <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-1">
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
                                                className={`mt-1 block w-full rounded-md border ${facturacionErrors.rut ? 'border-red-500' : 'border-gray-300'
                                                    } py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                                placeholder="Ingrese el RUT para la factura"
                                                required={facturacion.comprobanteTipo === "factura"}
                                            />
                                            {facturacionErrors.rut && (
                                                <p className="mt-1 text-sm text-red-600">{facturacionErrors.rut}</p>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="razonSocial" className="block text-sm font-medium text-gray-700 mb-1">
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
                                                className={`mt-1 block w-full rounded-md border ${facturacionErrors.razonSocial ? 'border-red-500' : 'border-gray-300'
                                                    } py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                                placeholder="Ingrese la razón social"
                                                required={facturacion.comprobanteTipo === "factura"}
                                            />
                                            {facturacionErrors.razonSocial && (
                                                <p className="mt-1 text-sm text-red-600">{facturacionErrors.razonSocial}</p>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="giro" className="block text-sm font-medium text-gray-700 mb-1">
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
                                                className={`mt-1 block w-full rounded-md border ${facturacionErrors.giro ? 'border-red-500' : 'border-gray-300'
                                                    } py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                                placeholder="Ingrese el giro"
                                                required={facturacion.comprobanteTipo === "factura"}
                                            />
                                            {facturacionErrors.giro && (
                                                <p className="mt-1 text-sm text-red-600">{facturacionErrors.giro}</p>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="direccionFacturacion" className="block text-sm font-medium text-gray-700 mb-1">
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
                                                className={`mt-1 block w-full rounded-md border ${facturacionErrors.direccionFacturacion ? 'border-red-500' : 'border-gray-300'
                                                    } py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                                placeholder="Ingrese la dirección de facturación"
                                                required={facturacion.comprobanteTipo === "factura"}
                                            />
                                            {facturacionErrors.direccionFacturacion && (
                                                <p className="mt-1 text-sm text-red-600">{facturacionErrors.direccionFacturacion}</p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            {cartItems.length > 0 && (
                                <div className="mt-8 border-t border-gray-200 pt-4">
                                    <h3 className="font-medium mb-3">Resumen de Productos</h3>
                                    <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                                        {cartItems.map((item, index) => {
                                            const product = item.productId;
                                            const variant = item.variant;
                                            const variantInfo = product.precioVariantesPorPeso?.find(
                                                v => v.pesoId === variant.pesoId
                                            );
                                            const price = variantInfo?.precioFinal || variant.precio;

                                            // Obtener la URL de la imagen principal
                                            const getImageUrl = () => {
                                                if (product.multimedia?.imagenes && product.multimedia.imagenes.length > 0) {
                                                    return product.multimedia.imagenes[0].url;
                                                }
                                                return '/images/placeholder.png';
                                            };

                                            return (
                                                <div key={`${product._id}-${variant.pesoId}-${index}`}
                                                    className="flex items-center py-2 border-b border-gray-100 last:border-b-0">
                                                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                                                        <img
                                                            src={getImageUrl()}
                                                            alt={product.nombre}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.target.src = '/images/placeholder.png' }}
                                                        />
                                                    </div>
                                                    <div className="ml-3 flex-grow">
                                                        <p className="font-medium text-gray-800 line-clamp-1">{product.nombre}</p>
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                {variant.peso}{variant.unidad}
                                                            </span>
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                                Cant: {item.quantity}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-2 text-right">
                                                        <div className="font-semibold text-gray-900">{formatCurrency(price * item.quantity)}</div>
                                                        <div className="text-xs text-gray-500">({formatCurrency(price)} c/u)</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between mt-8">
                            <Link
                                to="/checkout/envio"
                                className="flex items-center text-blue-500 hover:text-blue-700 py-2 px-4"
                                onClick={() => !isProcessing}
                            >
                                <FiArrowLeft className="mr-2" /> Volver a envío
                            </Link>
                            <button
                                type="submit"
                                disabled={isProcessing || !selectedMethod || (facturacion.comprobanteTipo === "factura" && !isFormValid())}
                                className={`py-3 px-6 rounded-lg flex items-center ${isProcessing || (facturacion.comprobanteTipo === "factura" && !isFormValid())
                                    ? 'bg-gray-400 cursor-not-allowed'
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

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="font-semibold text-xl mb-4">Resumen de tu compra</h2>

                        <div className="space-y-3 mb-6">
                            {cartItems.map((item, index) => {
                                const product = item.productId;
                                const variant = item.variant;

                                // Buscar información de precio para esta variante
                                const variantInfo = product.precioVariantesPorPeso?.find(v => v.pesoId === variant.pesoId);
                                const price = variantInfo?.precioFinal || variant.precio;
                                const totalItemPrice = price * item.quantity;

                                return (
                                    <div key={`${product._id}-${variant.pesoId}-${index}`} className="flex justify-between">
                                        <div className="flex-1 text-gray-600 truncate">
                                            <span className="font-medium">{item.quantity}x</span> {product.nombre} - {variant.peso}{variant.unidad}
                                        </div>
                                        <div className="font-medium">{formatCurrency(totalItemPrice)}</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="border-t border-gray-200 pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Envío</span>
                                <span className="font-medium">{formatCurrency(getShippingCost())}</span>
                            </div>
                            {paymentCommission > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Comisión de pago ({selectedPaymentMethod.commission_percentage}%)</span>
                                    <span className="font-medium">{formatCurrency(paymentCommission)}</span>
                                </div>
                            )}
                            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                <span className="text-lg font-semibold">Total</span>
                                <span className="text-lg font-semibold">
                                    {formatCurrency(calculateSubtotal() + getShippingCost() + paymentCommission)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <GuaranteesAndPolicies />
                </div>
            </div>
        </div>
    );
};

export { SistemaDePago };