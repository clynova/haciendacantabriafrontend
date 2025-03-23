import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getQuotations } from '../../services/quotationService';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../../utils/funcionesReutilizables';
import { HiEye, HiCreditCard, HiExclamationCircle, HiCheckCircle, HiClock } from 'react-icons/hi';

const MyQuotations = () => {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuotations();
    }, [token]);

    const fetchQuotations = async () => {
        try {
            setLoading(true);
            const response = await getQuotations(token);
            if (response.success) {
                setQuotations(response.quotations);
            } else {
                setError('No se pudieron cargar las cotizaciones');
            }
        } catch (error) {
            setError('Error al cargar las cotizaciones');
            console.error('Error fetching quotations:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredQuotations = selectedStatus === 'all' 
        ? quotations 
        : quotations.filter(q => q.status === selectedStatus);

    // Function to get status badge styling
    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending':
                return {
                    icon: <HiClock className="h-5 w-5" />,
                    label: 'Pendiente',
                    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-500'
                };
            case 'approved':
                return {
                    icon: <HiCheckCircle className="h-5 w-5" />,
                    label: 'Aprobada',
                    className: 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-500'
                };
            case 'rejected':
                return {
                    icon: <HiExclamationCircle className="h-5 w-5" />,
                    label: 'Rechazada',
                    className: 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-500'
                };
            default:
                return {
                    icon: <HiClock className="h-5 w-5" />,
                    label: 'Desconocido',
                    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400'
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

    const handleProceedToPayment = (quotationId) => {
        navigate(`/checkout/quotation/${quotationId}`);
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Cotizaciones</h1>
                <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600 dark:text-gray-300">Estado:</label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Todos</option>
                        <option value="pending">Pendientes</option>
                        <option value="approved">Aprobadas</option>
                        <option value="rejected">Rechazadas</option>
                    </select>
                </div>
            </div>

            {filteredQuotations.length === 0 ? (
                <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                        <HiExclamationCircle className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No tienes cotizaciones</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        Cuando solicites cotizaciones, aparecerán aquí para que puedas revisarlas y gestionarlas.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredQuotations.map((quotation) => {
                        const statusBadge = getStatusBadge(quotation.status);
                        const isValid = isQuotationValid(quotation);
                        
                        return (
                            <div 
                                key={quotation._id} 
                                className="border dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                            >
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                                Cotización #{quotation._id.slice(-6)}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Creada el {new Date(quotation.quotationDate).toLocaleDateString()}
                                                {quotation.validUntil && (
                                                    <> · Válida hasta {new Date(quotation.validUntil).toLocaleDateString()}</>
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 inline-flex items-center gap-1 rounded-full text-xs font-medium ${statusBadge.className}`}>
                                                {statusBadge.icon}
                                                {statusBadge.label}
                                            </span>
                                            {quotation.status === 'approved' && !isValid && (
                                                <span className="px-3 py-1 inline-flex items-center gap-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-800/20 dark:text-orange-500">
                                                    <HiExclamationCircle className="h-4 w-4" />
                                                    Expirada
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Productos: {quotation.products?.length || 0}</p>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                Envío: {quotation.shipping?.method || 'No especificado'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Subtotal: {formatCurrency(quotation.subtotal || 0)}</p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                Total: {formatCurrency(quotation.total || 0)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 mt-4 border-t dark:border-gray-700 pt-4">
                                        <Link
                                            to={`/profile/quotations/${quotation._id}`}
                                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <HiEye className="mr-2 -ml-1 h-5 w-5" />
                                            Ver detalles
                                        </Link>
                                        
                                        {quotation.status === 'approved' && isValid && (
                                            <button
                                                onClick={() => handleProceedToPayment(quotation._id)}
                                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <HiCreditCard className="mr-2 -ml-1 h-5 w-5" />
                                                Proceder al pago
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export { MyQuotations };