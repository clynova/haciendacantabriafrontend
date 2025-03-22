import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getQuotationById, updateQuotation } from '../../services/quotationService';
import { HiArrowLeft, HiCheckCircle, HiXCircle, HiExternalLink } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../../utils/funcionesReutilizables';

const AdminQuotationDetails = () => {
    const { quotationId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [quotation, setQuotation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuotationDetails();
    }, [quotationId, token]);

    const fetchQuotationDetails = async () => {
        try {
            setLoading(true);
            const response = await getQuotationById(quotationId, token);
            if (response.success) {
                setQuotation(response.quotation);
            }
        } catch (error) {
            toast.error('Error al cargar los detalles de la cotización');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus, rejectionReason = '') => {
        try {
            const updatedData = {
                status: newStatus,
                ...(newStatus === 'rejected' && { rejectionReason })
            };

            const response = await updateQuotation(quotationId, updatedData, token);
            
            if (response.success) {
                toast.success(`Cotización ${newStatus === 'approved' ? 'aprobada' : 'rechazada'} exitosamente`);
                fetchQuotationDetails();
            }
        } catch (error) {
            toast.error('Error al actualizar el estado de la cotización');
            console.error('Error:', error);
        }
    };

    const handleReject = () => {
        const reason = prompt('Por favor, ingrese el motivo del rechazo:');
        if (reason !== null) {
            handleStatusChange('rejected', reason);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!quotation) {
        return (
            <div className="text-center text-slate-400 py-8">
                Cotización no encontrada
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/admin/quotations')}
                    className="flex items-center text-slate-300 hover:text-white"
                >
                    <HiArrowLeft className="h-5 w-5 mr-2" />
                    Volver a cotizaciones
                </button>
                {quotation.status === 'pending' && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleStatusChange('approved')}
                            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            <HiCheckCircle className="h-5 w-5 mr-2" />
                            Aprobar
                        </button>
                        <button
                            onClick={handleReject}
                            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            <HiXCircle className="h-5 w-5 mr-2" />
                            Rechazar
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Información Principal */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Estado y Detalles Básicos */}
                    <div className="bg-slate-800 rounded-xl shadow-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-2">
                                    Cotización #{quotation._id.slice(-6)}
                                </h1>
                                <p className="text-slate-400">
                                    Creada el {new Date(quotation.quotationDate).toLocaleDateString()}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                quotation.status === 'approved' ? 'bg-green-100 text-green-800' :
                                quotation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                                {quotation.status === 'approved' ? 'Aprobada' :
                                quotation.status === 'rejected' ? 'Rechazada' :
                                'Pendiente'}
                            </span>
                        </div>

                        <div className="border-t border-slate-700 pt-4 mt-4">
                            <h2 className="text-lg font-semibold text-white mb-4">Información del Cliente</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-slate-400 text-sm">Nombre</p>
                                    <p className="text-white">{quotation.userId.firstName} {quotation.userId.lastName}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-sm">Email</p>
                                    <p className="text-white">{quotation.userId.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(`/admin/users/${quotation.userId._id}`)}
                                className="mt-4 flex items-center text-blue-400 hover:text-blue-300"
                            >
                                <HiExternalLink className="h-5 w-5 mr-1" />
                                Ver perfil del usuario
                            </button>
                        </div>
                    </div>

                    {/* Información de Envío */}
                    <div className="bg-slate-800 rounded-xl shadow-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Información de Envío</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-slate-400 mb-2">Dirección de Entrega</h3>
                                <div className="space-y-1">
                                    <p className="text-white">{quotation.shippingAddress.recipientName}</p>
                                    <p className="text-slate-300">{quotation.shippingAddress.street}</p>
                                    <p className="text-slate-300">
                                        {quotation.shippingAddress.city}, {quotation.shippingAddress.state}
                                    </p>
                                    <p className="text-slate-300">CP: {quotation.shippingAddress.zipCode}</p>
                                    <p className="text-slate-300">Tel: {quotation.shippingAddress.phoneContact}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-slate-400 mb-2">Método de Envío</h3>
                                <div className="space-y-1">
                                    <p className="text-white">{quotation.shipping?.carrier?.name}</p>
                                    <p className="text-slate-300">{quotation.shipping?.method}</p>
                                    <p className="text-slate-300">Costo: {formatCurrency(quotation.shipping?.cost || 0)}</p>
                                </div>
                            </div>
                        </div>
                        {quotation.shippingAddress.additionalInstructions && (
                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-slate-400 mb-2">Instrucciones Adicionales</h3>
                                <p className="text-slate-300">{quotation.shippingAddress.additionalInstructions}</p>
                            </div>
                        )}
                    </div>

                    {/* Productos */}
                    <div className="bg-slate-800 rounded-xl shadow-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Productos</h2>
                        <div className="divide-y divide-slate-700">
                            {quotation.products.map((item, index) => (
                                <div key={index} className="py-4 first:pt-0 last:pb-0">
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={item.product.multimedia.imagenes[0].url}
                                            alt={item.product.nombre}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="text-white font-medium">{item.product.nombre}</h3>
                                            <p className="text-slate-400 text-sm">
                                                {item.quantity} x {formatCurrency(item.price)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-medium">
                                                {formatCurrency(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Resumen de Costos */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-800 rounded-xl shadow-xl p-6 sticky top-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Resumen de Costos</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Subtotal</span>
                                <span className="text-white">{formatCurrency(quotation.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Envío</span>
                                <span className="text-white">{formatCurrency(quotation.shipping?.cost || 0)}</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t border-slate-700">
                                <span className="text-lg font-medium text-white">Total</span>
                                <span className="text-lg font-medium text-white">
                                    {formatCurrency(quotation.total)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-slate-400 mb-2">Validez</h3>
                            <p className="text-white">
                                {quotation.validUntil ? (
                                    <>
                                        Válida hasta: {new Date(quotation.validUntil).toLocaleDateString()}
                                        <br />
                                        <span className="text-sm text-slate-400">
                                            ({Math.ceil((new Date(quotation.validUntil) - new Date()) / (1000 * 60 * 60 * 24))} días restantes)
                                        </span>
                                    </>
                                ) : (
                                    'Fecha de validez no especificada'
                                )}
                            </p>
                        </div>

                        {quotation.status === 'rejected' && quotation.rejectionReason && (
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-red-400 mb-2">Motivo del Rechazo</h3>
                                <p className="text-slate-300">{quotation.rejectionReason}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { AdminQuotationDetails };