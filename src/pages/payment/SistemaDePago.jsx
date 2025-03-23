import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getPaymentMethods } from '../../services/paymentMethods';
import { createOrder, initiatePayment, getPaymentStatus } from '../../services/checkoutService';
import { FiArrowLeft, FiArrowRight, FiLock, FiCreditCard, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { BsPaypal, BsBank, BsShieldLock, BsCreditCard2Front } from 'react-icons/bs';
import { HiShieldCheck } from 'react-icons/hi';
import CartSummary from '../../components/Cart/CartSummary';

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

    const selectedPaymentMethod = selectedMethod
        ? paymentMethods.find(method => method._id === selectedMethod)
        : null;

    const calculatePaymentCommission = () => {
        if (selectedPaymentMethod?.commission_percentage) {
            const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
            const shipping = shippingInfo?.baseCost ? parseFloat(shippingInfo.baseCost) : 0;
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateCartStock()) {
            return;
        }

        if (!selectedMethod) {
            toast.error('Por favor selecciona un método de pago');
            return;
        }

        setIsProcessing(true);
        toast.loading('Procesando tu pago...', { id: 'payment' });

        try {
            const orderData = {
                shippingAddressId: shippingInfo.address._id,
                paymentMethod: selectedMethod,
                shippingMethod: shippingInfo.carrierId,
                recipientName: shippingInfo.recipientInfo.recipientName,
                phoneContact: shippingInfo.recipientInfo.phoneContact,
                additionalInstructions: shippingInfo.recipientInfo.additionalInstructions || ''
            };

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
                                disabled={isProcessing || !selectedMethod}
                                className={`py-3 px-6 rounded-lg flex items-center ${isProcessing
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
                    <CartSummary
                        cartItems={cartItems}
                        shippingInfo={shippingInfo}
                        paymentMethod={selectedPaymentMethod}
                        showButton={false}
                        loading={loading}
                    />

                    <GuaranteesAndPolicies />
                </div>
            </div>
        </div>
    );
};

export { SistemaDePago };