import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiSearch, HiTrash, HiEye } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { findProductsByTags, removeTagFromProduct } from '../../services/adminService';

export const AdminCategorieDetails = () => {
    const { tag } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, [tag, token]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await findProductsByTags([tag], true, token);
            if (response.success) {
                setProducts(response.products);
            }
        } catch (err) {
            toast.error('Error al cargar los productos');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveTag = async (productId, productName) => {
        const confirmed = window.confirm(
            `¿Estás seguro que deseas eliminar la categoría "${decodeURIComponent(tag)}" del producto "${productName}"?\n\nEsta acción no se puede deshacer.`
        );

        if (confirmed) {
            try {
                const response = await removeTagFromProduct(productId, tag, token);
                if (response.success) {
                    toast.success(`Categoría eliminada del producto "${productName}"`);
                    // Recargar los productos para actualizar la lista
                    fetchProducts();
                }
            } catch (err) {
                toast.error('Error al eliminar la categoría del producto');
            }
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedProducts(filteredProducts.map(product => product._id));
        } else {
            setSelectedProducts([]);
        }
    };

    const handleSelectProduct = (productId) => {
        setSelectedProducts(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId);
            }
            return [...prev, productId];
        });
    };

    const handleBulkRemoveTag = async () => {
        if (selectedProducts.length === 0) return;

        const selectedCount = selectedProducts.length;
        const confirmed = window.confirm(
            `¿Estás seguro que deseas eliminar la categoría "${decodeURIComponent(tag)}" de ${selectedCount} producto${selectedCount !== 1 ? 's' : ''}?\n\nEsta acción no se puede deshacer.`
        );

        if (confirmed) {
            try {
                const promises = selectedProducts.map(productId => 
                    removeTagFromProduct(productId, tag, token)
                );
                
                await Promise.all(promises);
                toast.success(`Categoría eliminada de ${selectedCount} producto${selectedCount !== 1 ? 's' : ''}`);
                setSelectedProducts([]);
                fetchProducts();
            } catch (err) {
                toast.error('Error al eliminar la categoría de algunos productos');
            }
        }
    };

    const handleViewProduct = (productId) => {
        navigate(`/admin/products/${productId}`);
    };

    const filteredProducts = products.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())  // Changed from codigo to sku
    );

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate('/admin/categories')}
                        className="flex items-center gap-2 text-slate-300 hover:text-white"
                    >
                        <HiArrowLeft className="h-5 w-5" />
                        <span>Volver a categorías</span>
                    </button>
                    <h1 className="text-2xl font-bold text-white">
                        Productos en categoría: {decodeURIComponent(tag)}
                    </h1>
                </div>

                <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-700">
                        <div className="flex justify-between items-center gap-4">
                            <div className="relative flex-1">
                                <HiSearch className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            {selectedProducts.length > 0 && (
                                <button
                                    onClick={handleBulkRemoveTag}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                                >
                                    <HiTrash className="h-5 w-5" />
                                    <span>Eliminar seleccionados ({selectedProducts.length})</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                                            className="rounded border-slate-600 text-blue-500 focus:ring-blue-500 bg-slate-700"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        SKU
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Nombre
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
                                        <td colSpan="5" className="px-6 py-4 text-center text-slate-400">
                                            Cargando productos...
                                        </td>
                                    </tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-slate-400">
                                            No se encontraron productos en esta categoría
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product._id} className="hover:bg-slate-700/30">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(product._id)}
                                                    onChange={() => handleSelectProduct(product._id)}
                                                    className="rounded border-slate-600 text-blue-500 focus:ring-blue-500 bg-slate-700"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                                {product.sku}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                                {product.nombre}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    product.estado 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {product.estado ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewProduct(product._id)}
                                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                                        title="Ver detalles del producto"
                                                    >
                                                        <HiEye className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveTag(product._id, product.nombre)}
                                                        className="text-red-400 hover:text-red-300 transition-colors"
                                                        title="Eliminar categoría del producto"
                                                    >
                                                        <HiTrash className="h-5 w-5" />
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

export default AdminCategorieDetails;