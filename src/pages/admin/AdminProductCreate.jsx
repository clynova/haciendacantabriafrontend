import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiSave, HiUpload } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { createProduct } from '../../services/adminService';
import { toast } from 'react-hot-toast';

const PRODUCTO_TIPOS = ['ProductoAceite', 'ProductoCarne'];
const CATEGORIAS = ['ACEITE', 'CARNE', 'CONDIMENTO', 'ACCESORIO'];
const ESTADOS = ['ACTIVO', 'INACTIVO', 'SIN_STOCK', 'PROXIMAMENTE'];
const TIPO_CARNE = ['VACUNO', 'CERDO', 'POLLO', 'CORDERO', 'PAVO'];
const TIPO_ACEITE = ['MARAVILLA', 'OLIVA', 'CANOLA', 'MIXTO'];
const TIPO_ENVASE = ['VACIO', 'CAJA', 'BOTELLA', 'BIDON', 'BOLSA'];

const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

const AdminProductCreate = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState('ProductoAceite');
    const [formData, setFormData] = useState({
        codigo: '',
        sku: '',
        nombre: '',
        tipoProducto: 'ProductoAceite',
        categoria: 'ACEITE',
        estado: 'ACTIVO',
        destacado: false,
        descripcion: {
            corta: '',
            completa: ''
        },
        precios: {
            base: '',
            descuentos: {
                regular: 0,
                transferencia: 0
            },
            promocion: {
                porcentaje: 0,
                activa: false,
                fechaInicio: '',
                fechaFin: ''
            }
        },
        multimedia: {
            imagenes: []
        },
        seo: {
            metaTitulo: '',
            metaDescripcion: '',
            palabrasClave: []
        },
        infoAdicional: {
            origen: '',
            marca: '',
            certificaciones: []
        },
        conservacion: {
            requiereRefrigeracion: false,
            requiereCongelacion: false,
            vidaUtil: '',
            instrucciones: ''
        },
        infoAceite: {
            tipo: 'OLIVA',
            volumen: '',
            envase: 'BOTELLA'
        },
        caracteristicas: {
            aditivos: [],
            filtracion: '',
            acidez: '',
            extraccion: ''
        },
        usosRecomendados: [],
        inventario: {
            stockUnidades: '',
            umbralStockBajo: ''
        },
        infoCarne: {
            tipoCarne: 'VACUNO',
            corte: '',
            nombreArgentino: '',
            nombreChileno: '',
            precioPorKg: ''
        },
        caracteristicasCarne: {
            porcentajeGrasa: '',
            marmoleo: 1,
            color: '',
            textura: []
        },
        infoNutricional: {
            porcion: '',
            calorias: '',
            proteinas: '',
            grasaTotal: '',
            grasaSaturada: '',
            colesterol: '',
            sodio: '',
            carbohidratos: ''
        },
        coccion: {
            metodos: [],
            temperaturaIdeal: '',
            tiempoEstimado: '',
            consejos: [],
            recetas: []
        }
    });

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
                            [name]: type === 'checkbox' ? checked : value
                        }
                    }
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [name]: type === 'checkbox' ? checked : value
                    }
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setSelectedType(newType);
        setFormData(prev => ({
            ...prev,
            tipoProducto: newType,
            categoria: newType === 'ProductoAceite' ? 'ACEITE' : 'CARNE'
        }));
    };

    const handleArrayInput = (e, field) => {
        const values = e.target.value.split(',').map(item => item.trim());
        setFormData(prev => ({
            ...prev,
            [field]: values
        }));
    };

    const handleImageUpload = async (e) => {
        console.log('Starting image upload process...');
        const files = Array.from(e.target.files);
        
        try {
            const imagePromises = files.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        resolve({
                            url: e.target.result,
                            file: file,
                            nombre: file.name,
                            tipo: file.type
                        });
                    };
                    reader.onerror = (error) => reject(error);
                    reader.readAsDataURL(file);
                });
            });

            const images = await Promise.all(imagePromises);
            
            setFormData(prev => ({
                ...prev,
                multimedia: {
                    ...prev.multimedia,
                    imagenes: [...prev.multimedia.imagenes, ...images]
                }
            }));

            console.log('Images processed successfully:', images.length);
        } catch (error) {
            console.error('Error processing images:', error);
            toast.error('Error al procesar las imágenes');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.codigo || !formData.nombre || !formData.precios.base) {
            toast.error('Los campos código, nombre y precio base son obligatorios');
            return;
        }
    
        try {
            setLoading(true);
            console.log('Starting product creation...');
    
            // Log the initial state of images
            console.log('Initial multimedia state:', formData.multimedia);
    
            // Prepare images for upload
            const imagesToUpload = formData.multimedia.imagenes
                .filter(img => img.file)
                .map(img => img.file);
    
            console.log('Images to upload:', {
                count: imagesToUpload.length,
                files: imagesToUpload.map(f => ({
                    name: f.name,
                    type: f.type,
                    size: f.size
                }))
            });
    
            const dataToSend = {
                ...formData,
                slug: generateSlug(formData.nombre),
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
                    stockUnidades: Number(formData.inventario.stockUnidades || 0),
                    umbralStockBajo: Number(formData.inventario.umbralStockBajo || 0)
                }
            };
    
            if (imagesToUpload.length > 0) {
                console.log('Processing images for upload...');
                const formDataImages = new FormData();
                imagesToUpload.forEach(file => {
                    formDataImages.append('images', file);
                    console.log('Appended file to FormData:', file.name);
                });
    
                // Update the multimedia structure in the data to send
                dataToSend.multimedia = {
                    ...dataToSend.multimedia,
                    imagenes: formData.multimedia.imagenes.map(img => ({
                        url: img.url,
                        nombre: img.name,
                        tipo: img.type
                    }))
                };
            }
    
            console.log('Final data to send:', {
                ...dataToSend,
                multimedia: {
                    ...dataToSend.multimedia,
                    imagenes: dataToSend.multimedia.imagenes.map(img => ({
                        hasUrl: !!img.url,
                        tipo: img.tipo
                    }))
                }
            });
    
            const response = await createProduct(dataToSend, token);
            console.log('Create product response:', response);
    
            if (response.success) {
                toast.success('Producto creado exitosamente');
                navigate('/admin/products');
            } else {
                toast.error(response.msg || 'Error al crear el producto');
            }
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast.error(error.msg || 'Error al crear el producto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="flex items-center gap-2 text-slate-300 hover:text-white"
                    >
                        <HiArrowLeft className="h-5 w-5" />
                        <span>Volver a la lista</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-slate-700">
                        <h1 className="text-2xl font-bold text-white">Crear Nuevo Producto</h1>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Tipo de Producto */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-slate-400">
                                    Tipo de Producto
                                </label>
                                <select
                                    value={selectedType}
                                    onChange={handleTypeChange}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                >
                                    {PRODUCTO_TIPOS.map(tipo => (
                                        <option key={tipo} value={tipo}>
                                            {tipo === 'ProductoAceite' ? 'Aceite' : 'Carne'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-slate-400">
                                    Categoría
                                </label>
                                <select
                                    name="categoria"
                                    value={formData.categoria}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                >
                                    {CATEGORIAS.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-slate-400">
                                    Estado
                                </label>
                                <select
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                >
                                    {ESTADOS.map(estado => (
                                        <option key={estado} value={estado}>{estado}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Información Básica */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-slate-200">Información Básica</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">
                                            Código *
                                        </label>
                                        <input
                                            type="text"
                                            name="codigo"
                                            value={formData.codigo}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">
                                            SKU *
                                        </label>
                                        <input
                                            type="text"
                                            name="sku"
                                            value={formData.sku}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">
                                            Nombre *
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        />
                                    </div>
                                </div>
                            </div>

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
                                            maxLength="160"
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
                                            rows="3"
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Precios */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Precios</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">
                                        Precio Base *
                                    </label>
                                    <input
                                        type="number"
                                        name="base"
                                        value={formData.precios.base}
                                        onChange={(e) => handleInputChange(e, 'precios')}
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                    />
                                </div>
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

                        {/* Información Específica según el tipo de producto */}
                        {selectedType === 'ProductoAceite' ? (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-slate-200">Información del Aceite</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">
                                            Tipo de Aceite
                                        </label>
                                        <select
                                            name="tipo"
                                            value={formData.infoAceite.tipo}
                                            onChange={(e) => handleInputChange(e, 'infoAceite')}
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        >
                                            {TIPO_ACEITE.map(tipo => (
                                                <option key={tipo} value={tipo}>{tipo}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">
                                            Volumen (ml)
                                        </label>
                                        <input
                                            type="number"
                                            name="volumen"
                                            value={formData.infoAceite.volumen}
                                            onChange={(e) => handleInputChange(e, 'infoAceite')}
                                            min="0"
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">
                                            Tipo de Envase
                                        </label>
                                        <select
                                            name="envase"
                                            value={formData.infoAceite.envase}
                                            onChange={(e) => handleInputChange(e, 'infoAceite')}
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        >
                                            {TIPO_ENVASE.map(tipo => (
                                                <option key={tipo} value={tipo}>{tipo}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-slate-200">Información de la Carne</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">
                                            Tipo de Carne
                                        </label>
                                        <select
                                            name="tipoCarne"
                                            value={formData.infoCarne.tipoCarne}
                                            onChange={(e) => handleInputChange(e, 'infoCarne')}
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        >
                                            {TIPO_CARNE.map(tipo => (
                                                <option key={tipo} value={tipo}>{tipo}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">
                                            Precio por Kg
                                        </label>
                                        <input
                                            type="number"
                                            name="precioPorKg"
                                            value={formData.infoCarne.precioPorKg}
                                            onChange={(e) => handleInputChange(e, 'infoCarne')}
                                            min="0"
                                            step="0.01"
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">
                                            Porcentaje de Grasa
                                        </label>
                                        <input
                                            type="number"
                                            name="porcentajeGrasa"
                                            value={formData.caracteristicasCarne.porcentajeGrasa}
                                            onChange={(e) => handleInputChange(e, 'caracteristicasCarne')}
                                            min="0"
                                            max="100"
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Inventario */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Inventario</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                        {/* Imágenes */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Imágenes</h2>
                            <div className="space-y-4">
                                {formData.multimedia.imagenes.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {formData.multimedia.imagenes.map((imagen, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={imagen.url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            multimedia: {
                                                                ...prev.multimedia,
                                                                imagenes: prev.multimedia.imagenes.filter((_, i) => i !== index)
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
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-700/50 hover:bg-slate-700/70">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <HiUpload className="w-8 h-8 mb-4 text-slate-400" />
                                            <p className="mb-2 text-sm text-slate-400">
                                                <span className="font-semibold">Click para subir</span> o arrastra y suelta
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                PNG, JPG o GIF (MAX. 800x400px)
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div class="flex justify-end pt-6 border-t border-slate-700">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <HiSave className="h-5 w-5" />
                                <span>{loading ? 'Creando...' : 'Crear Producto'}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export { AdminProductCreate };