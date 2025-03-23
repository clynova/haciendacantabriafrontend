import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getQuotationById } from '../../services/quotationService';
import { formatCurrency } from '../../utils/funcionesReutilizables';
import { toast } from 'react-hot-toast';
import { 
    HiArrowLeft, HiCreditCard, HiExclamationCircle, HiCheckCircle, 
    HiClock, HiLocationMarker, HiInformationCircle, HiTruck, HiCalendar,
    HiClipboardCheck 
} from 'react-icons/hi';

const MyQuotationsDetails = () => {
    const { quotationId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    
    const [quotation, setQuotation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuotationDetails();
    }, [quotationId, token]);

    const fetchQuotationDetails = async () => {
        try {
            setLoading(true);
            const response = await getQuotationById(quotationId, token);
            if (response.success) {
                setQuotation(response.quotation);
            } else {
                setError('No se pudo cargar la cotización');
                toast.error('No se pudo cargar la cotización');
            }
        } catch (error) {
            console.error('Error fetching quotation details:', error);
            setError('Error al cargar los detalles de la cotización');
            toast.error('Error al cargar los detalles de la cotización');
        } finally {
            setLoading(false);
        }
    };

    // Function to get status badge styling
    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending':
                return {
                    icon: <HiClock className="h-5 w-5" />,
                    label: 'Pendiente',
                    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-500',
                    message: 'Esta cotización está siendo revisada por nuestro equipo.'
                };
            case 'approved':
                return {
                    icon: <HiCheckCircle className="h-5 w-5" />,
                    label: 'Aprobada',
                    className: 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-500',
                    message: 'Esta cotización ha sido aprobada y está lista para proceder al pago.'
                };
            case 'rejected':
                return {
                    icon: <HiExclamationCircle className="h-5 w-5" />,
                    label: 'Rechazada',
                    className: 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-500',
                    message: 'Esta cotización ha sido rechazada.'
                };
            case 'finalized':
                return {
                    icon: <HiClipboardCheck  className="h-5 w-5" />,
                    label: 'Finalizada',
                    className: 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-500',
                    message: 'Esta cotización ha sido pagada y finalizada.'
                };
            default:
                return {
                    icon: <HiClock className="h-5 w-5" />,
                    label: 'Desconocido',
                    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400',
                    message: 'Estado desconocido.'
                };
        }
    };

    // Check if quotation is still valid
    const isQuotationValid = (quotation) => {
        if (!quotation.validUntil) return false;
        const validUntil = new Date(quotation.validUntil);
        const today = new Date();
        return validUntil > today;
    };

    const handleProceedToPayment = () => {
        navigate(`/checkout/quotation/${quotationId}`);
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="md:col-span-2 space-y-4">
                            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !quotation) {
        return (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400">{error || 'No se encontró la cotización'}</p>
                <button
                    onClick={() => navigate('/profile/quotations')}
                    className="mt-4 text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
                >
                    <HiArrowLeft className="mr-2" /> Volver a mis cotizaciones
                </button>
            </div>
        );
    }

    const statusBadge = getStatusBadge(quotation.status);
    const isValid = isQuotationValid(quotation);
    const validityMessage = isValid 
        ? `Válida hasta el ${new Date(quotation.validUntil).toLocaleDateString()}`
        : 'Esta cotización ha expirado';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {/* Header */}
            <div className="p-6 border-b dark:border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Link
                                to="/profile/quotations"
                                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                            >
                                <HiArrowLeft className="mr-1" /> Volver
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Cotización #{quotation._id.slice(-6)}
                            </h1>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Solicitada el {new Date(quotation.quotationDate).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 inline-flex items-center gap-1 rounded-full text-sm font-medium ${statusBadge.className}`}>
                            {statusBadge.icon}
                            {statusBadge.label}
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <HiCalendar className="mr-1" /> 
                            {validityMessage}
                        </p>
                    </div>
                </div>
            </div>

            {/* Status Message */}
            <div className={`p-4 ${
                quotation.status === 'pending' ? 'bg-yellow-50 dark:bg-yellow-900/10' : 
                quotation.status === 'approved' ? 'bg-green-50 dark:bg-green-900/10' : 
                quotation.status === 'finalized' ? 'bg-blue-50 dark:bg-blue-900/10' : 
                'bg-red-50 dark:bg-red-900/10'
            }`}>
                <p className={`flex items-center gap-2 text-sm ${
                    quotation.status === 'pending' ? 'text-yellow-700 dark:text-yellow-400' : 
                    quotation.status === 'approved' ? 'text-green-700 dark:text-green-400' : 
                    quotation.status === 'finalized' ? 'text-blue-700 dark:text-blue-400' : 
                    'text-red-700 dark:text-red-400'
                }`}>
                    <HiInformationCircle className="h-5 w-5" />
                    {statusBadge.message}
                    {quotation.status === 'rejected' && quotation.rejectionReason && (
                        <> Motivo: {quotation.rejectionReason}</>
                    )}
                    {quotation.status === 'finalized' && quotation.orderId && (
                        <> Orden relacionada: #{quotation.orderId.slice(-6)}</>
                    )}
                </p>
            </div>

            {/* Main Content */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - Products and Shipping */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Products */}
                        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Productos</h2>
                            <div className="divide-y dark:divide-gray-700">
                                {quotation.products?.map((item, index) => (
                                    <div key={index} className="py-4 first:pt-0 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                                {item.product?.multimedia?.imagenes && item.product.multimedia.imagenes.length > 0 ? (
                                                    <img 
                                                        src={item.product.multimedia.imagenes[0].url} 
                                                        alt={item.product.nombre} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500">
                                                        Sin imagen
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 dark:text-white">{item.product.nombre}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Cantidad: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(item.price)}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Total: {formatCurrency(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                <HiLocationMarker className="inline-block mr-2" />
                                Información de Envío
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Dirección de Entrega</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{quotation.shippingAddress?.recipientName}</p>
                                    <p className="text-gray-600 dark:text-gray-400">{quotation.shippingAddress?.street}</p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {quotation.shippingAddress?.city}, {quotation.shippingAddress?.state}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">CP: {quotation.shippingAddress?.zipCode}</p>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        Tel: {quotation.shippingAddress?.phoneContact}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <HiTruck className="inline-block mr-2" />
                                        Método de Envío
                                    </h3>
                                    <p className="text-gray-900 dark:text-white font-medium">{quotation.shipping?.carrier?.name}</p>
                                    <p className="text-gray-600 dark:text-gray-400">{quotation.shipping?.method}</p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Costo de envío: {formatCurrency(quotation.shipping?.cost || 0)}
                                    </p>
                                    {quotation.shippingAddress?.additionalInstructions && (
                                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm">Instrucciones adicionales:</h4>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                                {quotation.shippingAddress.additionalInstructions}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm p-6 sticky top-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Resumen</h2>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span className="text-gray-900 dark:text-white">{formatCurrency(quotation.subtotal || 0)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Envío</span>
                                    <span className="text-gray-900 dark:text-white">{formatCurrency(quotation.shipping?.cost || 0)}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t dark:border-gray-700">
                                    <span className="font-medium text-gray-900 dark:text-white">Total</span>
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(quotation.total || 0)}
                                    </span>
                                </div>
                            </div>

                            {quotation.status === 'approved' && isValid && (
                                <button
                                    onClick={handleProceedToPayment}
                                    className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center hover:bg-blue-700 transition-colors"
                                >
                                    <HiCreditCard className="mr-2" />
                                    Proceder al pago
                                </button>
                            )}

                            {quotation.status === 'finalized' && quotation.orderId && (
                                <Link
                                    to={`/profile/orders/${quotation.orderId}`}
                                    className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center hover:bg-blue-700 transition-colors mt-3"
                                >
                                    <HiClipboardCheck  className="mr-2" />
                                    Ver orden de compra
                                </Link>
                            )}

                            {quotation.status === 'approved' && !isValid && (
                                <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg p-4 text-center">
                                    <HiExclamationCircle className="h-6 w-6 text-orange-500 dark:text-orange-400 mx-auto mb-2" />
                                    <p className="text-orange-700 dark:text-orange-400 text-sm">
                                        Esta cotización ha expirado.
                                    </p>
                                </div>
                            )}

                            {quotation.status === 'rejected' && (
                                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                    <h3 className="font-medium text-red-700 dark:text-red-400 mb-2">Motivo del Rechazo</h3>
                                    <p className="text-red-600 dark:text-red-400 text-sm">
                                        {quotation.rejectionReason || 'No se proporcionó un motivo específico.'}
                                    </p>
                                </div>
                            )}
                            
                            <div className="mt-6 pt-6 border-t dark:border-gray-700">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Validez de la Cotización</h3>
                                <div className={`p-3 rounded-lg ${
                                    isValid 
                                        ? 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400' 
                                        : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                }`}>
                                    {quotation.validUntil ? (
                                        <p className="text-sm flex items-center">
                                            <HiCalendar className="mr-2" />
                                            Válida hasta: {new Date(quotation.validUntil).toLocaleDateString()}
                                            {isValid && (
                                                <span className="ml-1">
                                                    ({Math.ceil((new Date(quotation.validUntil) - new Date()) / (1000 * 60 * 60 * 24))} días)
                                                </span>
                                            )}
                                        </p>
                                    ) : (
                                        <p className="text-sm">No se especificó periodo de validez</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { MyQuotationsDetails };