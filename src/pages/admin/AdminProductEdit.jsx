import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiArrowLeft, HiSave } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { getProductById, updateProduct } from '../../services/adminService';

const AdminProductEdit = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        codigo: '',
        sku: '',
        nombre: '',
        descripcion: {
            corta: '',
            completa: ''
        },
        precios: {
            base: '',
            descuentos: {
                regular: 0,
                transferencia: 0
            }
        },
        estado: 'ACTIVO',
        destacado: false,
        categoria: 'ACEITE',
        infoAceite: {
            tipo: 'OLIVA',
            volumen: '',
            envase: 'BOTELLA'
        },
        inventario: {
            stockUnidades: '',
            umbralStockBajo: ''
        },
        multimedia: {
            imagenes: []
        }
    });

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const response = await getProductById(productId, token);
            
            if (response.success) {
                const product = response.product;
                setFormData({
                    codigo: product.codigo,
                    sku: product.sku,
                    nombre: product.nombre,
                    descripcion: {
                        corta: product.descripcion?.corta || '',
                        completa: product.descripcion?.completa || ''
                    },
                    precios: {
                        base: product.precios?.base || '',
                        descuentos: {
                            regular: product.precios?.descuentos?.regular || 0,
                            transferencia: product.precios?.descuentos?.transferencia || 0
                        }
                    },
                    estado: product.estado,
                    destacado: product.destacado,
                    categoria: product.categoria,
                    infoAceite: {
                        tipo: product.infoAceite?.tipo || 'OLIVA',
                        volumen: product.infoAceite?.volumen || '',
                        envase: product.infoAceite?.envase || 'BOTELLA'
                    },
                    inventario: {
                        stockUnidades: product.inventario?.stockUnidades || '',
                        umbralStockBajo: product.inventario?.umbralStockBajo || ''
                    },
                    multimedia: {
                        imagenes: product.multimedia?.imagenes || []
                    }
                });
            } else {
                toast.error('Error al cargar los datos del producto');
            }
        } catch (error) {
            toast.error(error.msg || 'Error al cargar los datos del producto');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setSaving(true);
            
            // Convert numeric fields
            const processedData = {
                ...formData,
                precios: {
                    ...formData.precios,
                    base: Number(formData.precios.base),
                    descuentos: {
                        regular: Number(formData.precios.descuentos.regular),
                        transferencia: Number(formData.precios.descuentos.transferencia)
                    }
                },
                inventario: {
                    ...formData.inventario,
                    stockUnidades: Number(formData.inventario.stockUnidades),
                    umbralStockBajo: Number(formData.inventario.umbralStockBajo)
                },
                infoAceite: {
                    ...formData.infoAceite,
                    volumen: formData.infoAceite.volumen ? Number(formData.infoAceite.volumen) : ''
                }
            };

            const response = await updateProduct(productId, processedData, token);
            
            if (response.success) {
                toast.success('Producto actualizado exitosamente');
                navigate(`/admin/products/${productId}`);
            } else {
                toast.error(response.msg || 'Error al actualizar el producto');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.msg || 'Error al actualizar el producto');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (e, section, subsection) => {
        const { name, value, type, checked } = e.target;
        
        if (section) {
            if (subsection) {
                setFormData(prev => ({
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [subsection]: {
                            ...prev[section][subsection],
                            [name]: type === 'number' ? Number(value) : value
                        }
                    }
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [name]: type === 'number' ? Number(value) : value
                    }
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
            }));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate(`/admin/products/${productId}`)}
                        className="flex items-center gap-2 text-slate-300 hover:text-white"
                    >
                        <HiArrowLeft className="h-5 w-5" />
                        <span>Volver a detalles</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-slate-700">
                        <h1 className="text-2xl font-bold text-white">Editar Producto</h1>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-slate-200">Información Básica</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">
                                            Código
                                        </label>
                                        <input
                                            type="text"
                                            name="codigo"
                                            value={formData.codigo}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">
                                            SKU
                                        </label>
                                        <input
                                            type="text"
                                            name="sku"
                                            value={formData.sku}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">
                                            Nombre
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Information */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-slate-200">Precios</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">
                                            Precio Base
                                        </label>
                                        <input
                                            type="number"
                                            name="base"
                                            value={formData.precios.base}
                                            onChange={(e) => handleInputChange(e, 'precios')}
                                            step="0.01"
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                                Descuento Regular (%)
                                            </label>
                                            <input
                                                type="number"
                                                name="regular"
                                                value={formData.precios.descuentos.regular}
                                                onChange={(e) => handleInputChange(e, 'precios', 'descuentos')}
                                                min="0"
                                                max="100"
                                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                                Descuento Transferencia (%)
                                            </label>
                                            <input
                                                type="number"
                                                name="transferencia"
                                                value={formData.precios.descuentos.transferencia}
                                                onChange={(e) => handleInputChange(e, 'precios', 'descuentos')}
                                                min="0"
                                                max="100"
                                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Inventory Information */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-slate-200">Inventario</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">
                                            Stock (unidades)
                                        </label>
                                        <input
                                            type="number"
                                            name="stockUnidades"
                                            value={formData.inventario.stockUnidades}
                                            onChange={(e) => handleInputChange(e, 'inventario')}
                                            min="0"
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">
                                            Stock Mínimo
                                        </label>
                                        <input
                                            type="number"
                                            name="umbralStockBajo"
                                            value={formData.inventario.umbralStockBajo}
                                            onChange={(e) => handleInputChange(e, 'inventario')}
                                            min="0"
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Status and Category */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-slate-200">Estado y Categoría</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">
                                            Estado
                                        </label>
                                        <select
                                            name="estado"
                                            value={formData.estado}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        >
                                            <option value="ACTIVO">Activo</option>
                                            <option value="INACTIVO">Inactivo</option>
                                            <option value="SIN_STOCK">Sin Stock</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">
                                            Categoría
                                        </label>
                                        <select
                                            name="categoria"
                                            value={formData.categoria}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        >
                                            <option value="ACEITE">Aceite</option>
                                            <option value="CARNE">Carne</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="destacado"
                                            checked={formData.destacado}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-blue-600 border-slate-600 rounded focus:ring-blue-500"
                                        />
                                        <label className="ml-2 text-sm font-medium text-slate-400">
                                            Producto Destacado
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Oil Specific Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Información del Aceite</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">
                                        Tipo de Aceite
                                    </label>
                                    <select
                                        name="tipo"
                                        value={formData.infoAceite?.tipo || 'OLIVA'}
                                        onChange={(e) => handleInputChange(e, 'infoAceite')}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                    >
                                        <option value="OLIVA">Oliva</option>
                                        <option value="MARAVILLA">Maravilla</option>
                                        <option value="CANOLA">Canola</option>
                                        <option value="MIXTO">Mixto</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">
                                        Volumen (ml)
                                    </label>
                                    <input
                                        type="number"
                                        name="volumen"
                                        value={formData.infoAceite?.volumen || ''}
                                        onChange={(e) => handleInputChange(e, 'infoAceite')}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">
                                        Tipo de Envase
                                    </label>
                                    <select
                                        name="envase"
                                        value={formData.infoAceite?.envase || 'BOTELLA'}
                                        onChange={(e) => handleInputChange(e, 'infoAceite')}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                    >
                                        <option value="BOTELLA">Botella</option>
                                        <option value="BIDON">Bidón</option>
                                        <option value="VACIO">Vacío</option>
                                        <option value="CAJA">Caja</option>
                                        <option value="BOLSA">Bolsa</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Conservation Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Conservación</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="requiereRefrigeracion"
                                            checked={formData.conservacion?.requiereRefrigeracion || false}
                                            onChange={(e) => handleInputChange(e, 'conservacion')}
                                            className="w-4 h-4 text-blue-600 border-slate-600 rounded focus:ring-blue-500"
                                        />
                                        <label className="ml-2 text-sm font-medium text-slate-400">
                                            Requiere Refrigeración
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="requiereCongelacion"
                                            checked={formData.conservacion?.requiereCongelacion || false}
                                            onChange={(e) => handleInputChange(e, 'conservacion')}
                                            className="w-4 h-4 text-blue-600 border-slate-600 rounded focus:ring-blue-500"
                                        />
                                        <label className="ml-2 text-sm font-medium text-slate-400">
                                            Requiere Congelación
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Información Adicional</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">
                                        Certificaciones (separadas por coma)
                                    </label>
                                    <input
                                        type="text"
                                        name="certificaciones"
                                        value={formData.infoAdicional?.certificaciones?.join(', ') || ''}
                                        onChange={(e) => {
                                            const certificaciones = e.target.value.split(',').map(cert => cert.trim());
                                            setFormData(prev => ({
                                                ...prev,
                                                infoAdicional: {
                                                    ...prev.infoAdicional,
                                                    certificaciones
                                                }
                                            }));
                                        }}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        placeholder="Ej: ISO 9001, Orgánico, Kosher"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">
                                        Usos Recomendados (separados por coma)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.usosRecomendados?.join(', ') || ''}
                                        onChange={(e) => {
                                            const usos = e.target.value.split(',').map(uso => uso.trim());
                                            setFormData(prev => ({
                                                ...prev,
                                                usosRecomendados: usos
                                            }));
                                        }}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        placeholder="Ej: Cocina, Ensaladas, Fritura"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SEO Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">SEO</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">
                                        Palabras Clave (separadas por coma)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.seo?.palabrasClave?.join(', ') || ''}
                                        onChange={(e) => {
                                            const keywords = e.target.value.split(',').map(keyword => keyword.trim());
                                            setFormData(prev => ({
                                                ...prev,
                                                seo: {
                                                    ...prev.seo,
                                                    palabrasClave: keywords
                                                }
                                            }));
                                        }}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        placeholder="Ej: aceite, oliva, extra virgen"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Descripción</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">
                                        Descripción Corta
                                    </label>
                                    <input
                                        type="text"
                                        name="corta"
                                        value={formData.descripcion.corta}
                                        onChange={(e) => handleInputChange(e, 'descripcion')}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">
                                        Descripción Completa
                                    </label>
                                    <textarea
                                        name="completa"
                                        value={formData.descripcion.completa}
                                        onChange={(e) => handleInputChange(e, 'descripcion')}
                                        rows="4"
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Image Upload Section */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Imágenes del Producto</h2>
                            <div className="space-y-4">
                                {/* Current Images Preview */}
                                {formData.multimedia?.imagenes?.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {formData.multimedia.imagenes.map((imagen, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={imagen.url}
                                                    alt={`Producto ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newImages = formData.multimedia.imagenes.filter((_, i) => i !== index);
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            multimedia: {
                                                                ...prev.multimedia,
                                                                imagenes: newImages
                                                            }
                                                        }));
                                                    }}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Image Upload Input */}
                                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-600 rounded-lg">
                                    <div className="space-y-2 text-center">
                                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="text-sm text-slate-400">
                                            <label htmlFor="image-upload" className="relative cursor-pointer bg-slate-700 rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                <span>Subir imagen</span>
                                                <input 
                                                    id="image-upload" 
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    className="sr-only"
                                                    onChange={async (e) => {
                                                        const files = Array.from(e.target.files);
                                                        const imagePromises = files.map(file => {
                                                            return new Promise((resolve) => {
                                                                const reader = new FileReader();
                                                                reader.onload = (e) => resolve({
                                                                    url: e.target.result,
                                                                    file: file
                                                                });
                                                                reader.readAsDataURL(file);
                                                            });
                                                        });

                                                        const images = await Promise.all(imagePromises);
                                                        
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            multimedia: {
                                                                ...prev.multimedia,
                                                                imagenes: [
                                                                    ...(prev.multimedia?.imagenes || []),
                                                                    ...images
                                                                ]
                                                            }
                                                        }));
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        <p className="text-xs text-slate-400">PNG, JPG, GIF hasta 10MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6 border-t border-slate-700">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            >
                                <HiSave className="h-5 w-5" />
                                <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export { AdminProductEdit };