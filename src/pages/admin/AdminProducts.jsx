import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiSearch, HiPlus, HiPencil, HiTrash, HiEye, HiStatusOnline, HiBell } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { getAllProducts, updateProductStatus, notificarProductoFavorito } from '../../services/adminService';

const AdminProducts = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (filters = {}) => {
        try {
            setLoading(true);
            const response = await getAllProducts(token, filters);
            
            if (response.success) {
                setProducts(response.products || []);
            } else {
                toast.error('Error al cargar los productos');
                setProducts([]);
            }
        } catch (error) {
            toast.error(error.msg || 'Error al cargar los productos');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (productId, currentStatus) => {
        const newStatus = !currentStatus;
        const action = newStatus ? 'activar' : 'desactivar';
        
        if (window.confirm(`¿Está seguro de ${action} este producto?`)) {
            try {
                setLoading(true);
                const response = await updateProductStatus(productId, newStatus, token);
                
                if (response.success) {
                    toast.success(`Producto ${action}do exitosamente`);
                    await fetchProducts();
                } else {
                    toast.error(response.msg || `Error al ${action} el producto`);
                }
            } catch (error) {
                toast.error(error.msg || `Error al ${action} el producto`);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleNotifyFavorites = async (productId, productName) => {
        if (window.confirm(`¿Desea enviar una notificación a los usuarios que tienen "${productName}" como favorito?`)) {
            try {
                const response = await notificarProductoFavorito(productId, token);
                if (response.success) {
                    toast.success('Notificación enviada exitosamente');
                } else {
                    toast.error(response.msg || 'Error al enviar la notificación');
                }
            } catch (error) {
                toast.error(error.msg || 'Error al enviar la notificación');
            }
        }
    };

    const filteredProducts = products?.filter(product =>
        product?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Productos</h1>
                    <button
                        onClick={() => navigate('/admin/products/create')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        <HiPlus className="h-5 w-5" />
                        Nuevo Producto
                    </button>
                </div>

                <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-700">
                        <div className="relative">
                            <HiSearch className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o código..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        SKU
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Precio Base
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
                                        <td colSpan="6" className="px-6 py-4 text-center text-slate-400">
                                            Cargando productos...
                                        </td>
                                    </tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-slate-400">
                                            No se encontraron productos
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product._id} className="hover:bg-slate-700/30">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                                {product.sku}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                                {product.nombre}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                                {product.inventario?.stockUnidades || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                                ${product.precios?.base?.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    product.estado 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {product.estado ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => navigate(`/admin/products/${product._id}`)}
                                                        className="text-blue-400 hover:text-blue-300"
                                                        title="Ver detalles"
                                                    >
                                                        <HiEye className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                                                        className="text-yellow-400 hover:text-yellow-300"
                                                        title="Editar"
                                                    >
                                                        <HiPencil className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(product._id, product.estado)}
                                                        className={`${
                                                            product.estado 
                                                                ? 'text-red-400 hover:text-red-300' 
                                                                : 'text-green-400 hover:text-green-300'
                                                        }`}
                                                        title={product.estado ? 'Desactivar' : 'Activar'}
                                                    >
                                                        <HiStatusOnline className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleNotifyFavorites(product._id, product.nombre)}
                                                        className="text-purple-400 hover:text-purple-300"
                                                        title="Notificar a favoritos"
                                                    >
                                                        <HiBell className="h-5 w-5" />
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
        </div>
    );
};

export { AdminProducts };