import { useState, useEffect } from 'react';
import { HiSearch, HiPlus, HiPencil, HiTrash, HiEye } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { getAllTags, createTag, deleteTag, renameTag } from '../../services/adminService';   
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminCategories = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [tags, setTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTag, setSelectedTag] = useState('');
    const [newTagName, setNewTagName] = useState('');

    useEffect(() => {
        fetchTags();
    }, [token]);

    const fetchTags = async () => {
        try {
            setLoading(true);
            const response = await getAllTags(token);
            if (response.success) {
                setTags(response.tags);
            }
        } catch (err) {
            toast.error('Error al cargar las categorías');
        } finally {
            setLoading(false);
        }
    };

    const handleRenameTag = async () => {
        try {
            const response = await renameTag(selectedTag, newTagName, token);
            if (response.success) {
                toast.success('Categoría renombrada correctamente');
                fetchTags();
                setOpenDialog(false);
            }
        } catch (err) {
            toast.error(err.msg || 'Error al renombrar la categoría');
        }
    };

    const handleDeleteTag = async (tag) => {
        if (window.confirm('¿Está seguro de eliminar esta categoría?')) {
            try {
                const response = await deleteTag(tag, token);
                if (response.success) {
                    toast.success('Categoría eliminada correctamente');
                    fetchTags();
                }
            } catch (err) {
                toast.error(err.msg || 'Error al eliminar la categoría');
            }
        }
    };

    const handleViewTagProducts = (tag) => {
        navigate(`/admin/categories/${encodeURIComponent(tag)}`);
    };

    const filteredTags = tags.filter(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Categorías</h1>
                </div>

                <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-700">
                        <div className="relative">
                            <HiSearch className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Buscar categorías..."
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
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-4 text-center text-slate-400">
                                            Cargando categorías...
                                        </td>
                                    </tr>
                                ) : filteredTags.length === 0 ? (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-4 text-center text-slate-400">
                                            No se encontraron categorías
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTags.map((tag) => (
                                        <tr key={tag} className="hover:bg-slate-700/30">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                                {tag}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewTagProducts(tag)}
                                                        className="text-blue-400 hover:text-blue-300"
                                                        title="Ver productos"
                                                    >
                                                        <HiEye className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedTag(tag);
                                                            setNewTagName(tag);
                                                            setOpenDialog(true);
                                                        }}
                                                        className="text-yellow-400 hover:text-yellow-300"
                                                        title="Editar"
                                                    >
                                                        <HiPencil className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTag(tag)}
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

            {/* Modal de edición */}
            {openDialog && (
                <div 
                    className="fixed inset-0 backdrop-blur-sm bg-slate-900/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setOpenDialog(false)} // Cierra el modal al hacer clic en el fondo
                >
                    <div 
                        className="bg-slate-800/90 backdrop-blur-md rounded-lg p-6 max-w-md w-full shadow-xl border border-slate-700"
                        onClick={e => e.stopPropagation()} // Evita que se cierre al hacer clic en el contenido
                    >
                        <h2 className="text-xl font-bold text-white mb-4">Renombrar Categoría</h2>
                        <input
                            type="text"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            className="w-full px-4 py-2 mb-4 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setOpenDialog(false)}
                                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleRenameTag}
                                className="px-4 py-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded-lg transition-colors"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export { AdminCategories };