import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HiSearch, HiPlus, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '../../components/Loading/LoadingSpinner';
import { regionesComunas } from '../../data/regiones-comunas';
import { getRegionsAll, createRegion, updateRegionStatus } from '../../services/regionService';

const AdminRegionesDeEnvio = () => {
    const { token } = useAuth();
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        isActive: true
    });

    // Obtener las regiones al cargar el componente
    useEffect(() => {
        fetchRegions();
    }, [token]);

    // Función para obtener las regiones desde la API
    const fetchRegions = async () => {
        try {
            setLoading(true);
            const response = await getRegionsAll(token);
            
            if (response && response.success) {
                setRegions(response.data || []);
            } else {
                toast.error('Error al cargar las regiones');
                setRegions([]);
            }
        } catch (error) {
            toast.error('Error al cargar las regiones');
            setRegions([]);
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar el envío del formulario de creación
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.code) {
            toast.error('Por favor complete todos los campos');
            return;
        }
        
        try {
            setLoading(true);
            const response = await createRegion(formData, token);
            
            if (response && response.success) {
                toast.success('Región creada exitosamente');
                setIsFormOpen(false);
                setFormData({ name: '', code: '', isActive: true });
                await fetchRegions();
            } else {
                toast.error(response.msg || 'Error al crear la región');
            }
        } catch (error) {
            toast.error('Error al crear la región');
        } finally {
            setLoading(false);
        }
    };

    // Función para cambiar el estado de una región (activa/inactiva)
    const handleToggleStatus = async (regionId, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            
            // Optimistic UI update
            setRegions(prevRegions => 
                prevRegions.map(region => 
                    region._id === regionId ? { ...region, isActive: newStatus } : region
                )
            );
            
            const response = await updateRegionStatus(regionId, newStatus, token);
            
            if (response && response.success) {
                toast.success(`Región ${newStatus ? 'activada' : 'desactivada'} exitosamente`);
            } else {
                // Revert on failure
                setRegions(prevRegions => 
                    prevRegions.map(region => 
                        region._id === regionId ? { ...region, isActive: currentStatus } : region
                    )
                );
                toast.error(response.msg || `Error al ${newStatus ? 'activar' : 'desactivar'} la región`);
            }
        } catch (error) {
            // Revert on error
            setRegions(prevRegions => 
                prevRegions.map(region => 
                    region._id === regionId ? { ...region, isActive: currentStatus } : region
                )
            );
            toast.error(`Error al cambiar el estado de la región`);
        }
    };

    // Filtrar regiones por término de búsqueda
    const filteredRegions = regions.filter(region =>
        region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        region.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Lista de regiones disponibles en Chile para el selector
    const availableRegions = Object.keys(regionesComunas)
        .filter(region => !regions.some(r => r.name === region))
        .sort();

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Regiones de Envío</h1>
                    <button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        <HiPlus className="h-5 w-5" />
                        Nueva Región
                    </button>
                </div>

                {isFormOpen && (
                    <div className="mb-6 bg-slate-800 rounded-xl shadow-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            Crear Nueva Región de Envío
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-200 mb-1">
                                    Región *
                                </label>
                                <select
                                    value={formData.name}
                                    onChange={(e) => {
                                        const selectedRegion = e.target.value;
                                        setFormData({
                                            ...formData,
                                            name: selectedRegion,
                                            // Generar un código basado en el nombre de la región
                                            code: selectedRegion
                                                .split(' ')
                                                .map(word => word.charAt(0))
                                                .join('')
                                                .toUpperCase()
                                        });
                                    }}
                                    className="block w-full rounded-lg border border-slate-600 bg-slate-700/50 
                                             text-slate-200 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Seleccione una región</option>
                                    {availableRegions.map(region => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-200 mb-1">
                                    Código *
                                </label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                    placeholder="Ej: RM"
                                    className="block w-full rounded-lg border border-slate-600 bg-slate-700/50 
                                             text-slate-200 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                    className="h-4 w-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500"
                                    id="region-active"
                                />
                                <label htmlFor="region-active" className="ml-2 block text-sm text-slate-200">
                                    Región activa para envíos
                                </label>
                            </div>
                            
                            <div className="flex justify-end space-x-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsFormOpen(false);
                                        setFormData({ name: '', code: '', isActive: true });
                                    }}
                                    className="px-4 py-2 border border-slate-600 rounded-lg text-slate-200 
                                             hover:bg-slate-700 transition-colors duration-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg 
                                             hover:bg-blue-600 transition-colors duration-200"
                                >
                                    Crear Región
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Barra de búsqueda */}
                <div className="mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HiSearch className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar regiones..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-lg bg-slate-700/50 
                                     text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Tabla de regiones */}
                <div className="overflow-x-auto bg-slate-800 rounded-xl shadow-xl">
                    <table className="min-w-full divide-y divide-slate-700">
                        <thead className="bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                    Región
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                    Código
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4">
                                        <LoadingSpinner />
                                    </td>
                                </tr>
                            ) : filteredRegions.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-slate-400">
                                        No se encontraron regiones
                                    </td>
                                </tr>
                            ) : (
                                filteredRegions.map((region) => (
                                    <tr key={region._id} className="hover:bg-slate-700/30">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                            {region.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                            {region.code}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                region.isActive 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {region.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                            <button
                                                onClick={() => handleToggleStatus(region._id, region.isActive)}
                                                className={`inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm ${
                                                    region.isActive
                                                        ? 'hover:bg-red-700 bg-red-600 text-white'
                                                        : 'hover:bg-green-700 bg-green-600 text-white'
                                                }`}
                                                title={region.isActive ? 'Desactivar región' : 'Activar región'}
                                            >
                                                {region.isActive ? (
                                                    <HiXCircle className="h-5 w-5" />
                                                ) : (
                                                    <HiCheckCircle className="h-5 w-5" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Información sobre regiones */}
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-slate-300 text-sm">
                    <p>
                        <strong>Nota:</strong> Las regiones activas estarán disponibles para seleccionar durante el proceso de compra. 
                        Desactive las regiones a las que no desea realizar envíos.
                    </p>
                </div>
            </div>
        </div>
    );
};

export { AdminRegionesDeEnvio };