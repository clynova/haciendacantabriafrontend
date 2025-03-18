import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiSearch, HiPlus, HiPencil, HiTrash, HiEye } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { getAllProducts, deleteProduct } from '../../services/adminService';

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
            console.log('Fetching products...'); // Debug log
            const response = await getAllProducts(token, filters);
            console.log('API Response:', response); // Debug log
            
            if (response.success) {
                // Update to use response.products instead of response.data
                console.log('Products data:', response.products); // Debug log
                setProducts(response.products || []);
            } else {
                console.error('Error response:', response); // Debug log
                toast.error('Error al cargar los productos');
                setProducts([]);
            }
        } catch (error) {
            console.error('Fetch error:', error); // Debug log
            toast.error(error.msg || 'Error al cargar los productos');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('¿Está seguro de eliminar este producto?')) {
            try {
                setLoading(true);
                const response = await deleteProduct(productId, token);
                
                if (response.success) {
                    toast.success('Producto eliminado exitosamente');
                    // Refresh the products list
                    await fetchProducts();
                } else {
                    toast.error(response.msg || 'Error al eliminar el producto');
                }
            } catch (error) {
                toast.error(error.msg || 'Error al eliminar el producto');
            } finally {
                setLoading(false);
            }
        }
    };

    const filteredProducts = products?.filter(product =>
        product?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    console.log('Current products state:', products); // Debug log
    console.log('Filtered products:', filteredProducts); // Debug log

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
                                        Código
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
                                                {product.codigo}
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
                                                    product.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' :
                                                    product.estado === 'INACTIVO' ? 'bg-red-100 text-red-800' :
                                                    product.estado === 'SIN_STOCK' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {product.estado}
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
                                                        onClick={() => handleDelete(product._id)}
                                                        className="text-red-400 hover:text-red-300"
                                                        title="Eliminar"
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

export { AdminProducts };