import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllQuotations, updateQuotation } from "../../services/quotationService";
import { HiSearch, HiEye, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../../utils/funcionesReutilizables';

const AdminCotizaciones = () => {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuotations();
    }, [token]);

    const fetchQuotations = async () => {
        try {
            setLoading(true);
            const response = await getAllQuotations(token);
            if (response.success) {
                setQuotations(response.quotations);
            }
        } catch (error) {
            toast.error('Error al cargar las cotizaciones');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (quotationId, newStatus, rejectionReason = '') => {
        try {
            const updatedData = {
                status: newStatus,
                ...(newStatus === 'rejected' && { rejectionReason })
            };

            const response = await updateQuotation(quotationId, updatedData, token);
            
            if (response.success) {
                toast.success(`Cotización ${newStatus === 'approved' ? 'aprobada' : 'rechazada'} exitosamente`);
                fetchQuotations(); // Recargar la lista
            }
        } catch (error) {
            toast.error('Error al actualizar el estado de la cotización');
            console.error('Error:', error);
        }
    };

    const handleReject = (quotationId) => {
        const reason = prompt('Por favor, ingrese el motivo del rechazo:');
        if (reason !== null) {
            handleStatusChange(quotationId, 'rejected', reason);
        }
    };

    const filteredQuotations = quotations.filter(quotation => {
        const matchesSearch = 
            quotation.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quotation.userId.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quotation.userId.lastName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Gestión de Cotizaciones</h1>
            </div>

            <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
                {/* Filtros */}
                <div className="p-4 border-b border-slate-700 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <HiSearch className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar por usuario..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="pending">Pendientes</option>
                        <option value="approved">Aprobadas</option>
                        <option value="rejected">Rechazadas</option>
                    </select>
                </div>

                {/* Tabla de cotizaciones */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Subtotal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Envío</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredQuotations.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-slate-400">
                                        No se encontraron cotizaciones
                                    </td>
                                </tr>
                            ) : (
                                filteredQuotations.map((quotation) => (
                                    <tr key={quotation._id} className="hover:bg-slate-700/30">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-200">
                                                    {quotation.userId.firstName} {quotation.userId.lastName}
                                                </span>
                                                <span className="text-sm text-slate-400">{quotation.userId.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                            {new Date(quotation.quotationDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${quotation.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                                quotation.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                                'bg-yellow-100 text-yellow-800'}`}>
                                                {quotation.status === 'approved' ? 'Aprobada' :
                                                quotation.status === 'rejected' ? 'Rechazada' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                            {formatCurrency(quotation.subtotal)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                            {formatCurrency(quotation.total)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                            {quotation.shipping?.method}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                {quotation.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusChange(quotation._id, 'approved')}
                                                            className="text-green-400 hover:text-green-300"
                                                            title="Aprobar"
                                                        >
                                                            <HiCheckCircle className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(quotation._id)}
                                                            className="text-red-400 hover:text-red-300"
                                                            title="Rechazar"
                                                        >
                                                            <HiXCircle className="h-5 w-5" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => navigate(`/admin/quotations/${quotation._id}`)}
                                                    className="text-blue-400 hover:text-blue-300"
                                                    title="Ver detalles"
                                                >
                                                    <HiEye className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export { AdminCotizaciones };