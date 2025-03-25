import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiArrowLeft, HiPencil } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { getProductById } from '../../services/adminService';
import { ImageGallery } from '../../components/admin/products/sections/ImageGallery';

const formatValue = (value, type = 'text') => {
    if (value === undefined || value === null) return 'No especificado';

    switch (type) {
        case 'date':
            return new Date(value).toLocaleDateString();
        case 'boolean':
            return value ? 'Sí' : 'No';
        case 'number':
            return value.toFixed(2);
        case 'array':
            return value.length ? value.join(', ') : 'No especificado';
        default:
            return value.toString();
    }
};

const AdminProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
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
            },
            promocion: {
                porcentaje: 0,
                activa: false
            }
        },
        tipoProducto: 'ProductoAceite',
        categoria: 'ACEITE',
        estado: 'ACTIVO',
        destacado: false,
        infoAceite: {
            tipo: 'OLIVA',
            volumen: '',
            envase: 'BOTELLA'
        },
        inventario: {
            stockUnidades: '',
            umbralStockBajo: ''
        },
        conservacion: {
            requiereRefrigeracion: false,
            requiereCongelacion: false
        },
        infoAdicional: {
            certificaciones: []
        },
        seo: {
            palabrasClave: []
        },
        usosRecomendados: []
    });

    useEffect(() => {
        console.log('ProductDetails mounted/updated with ID:', productId);
        if (productId !== 'create') {
            fetchProductDetails();
        }
    }, [productId]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            console.log('Fetching product with ID:', productId); // Log the ID being requested

            const response = await getProductById(productId, token);
            console.log('Raw API Response:', response); // Log full API response

            if (response.success) {
                console.log('Product data:', response.product); // Log the product data
                setProduct(response.product);
            } else {
                console.error('Error response:', response); // Log error response
                toast.error('Error al cargar los detalles del producto');
            }
        } catch (error) {
            console.error('Fetch error details:', {
                message: error.message,
                response: error.response,
                data: error.response?.data
            }); // Detailed error logging
            toast.error(error.msg || 'Error al cargar los detalles del producto');
        } finally {
            setLoading(false);
            console.log('Current product state:', product); // Log the final state
        }
    };

    const renderProductTypeSpecificInfo = () => {
        switch (product.tipoProducto) {
            case 'ProductoCarne':
                return (
                    <>
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Información de la Carne</h2>
                            <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Tipo de Carne:</span> {product.infoCarne?.tipoCarne}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Corte:</span> {product.infoCarne?.corte}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Precio por Kg:</span> ${product.infoCarne?.precioPorKg?.toFixed(2)}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Nombre Argentino:</span> {product.infoCarne?.nombreArgentino || 'No especificado'}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Nombre Chileno:</span> {product.infoCarne?.nombreChileno || 'No especificado'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Características de la Carne</h2>
                            <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Porcentaje de Grasa:</span> {product.caracteristicas?.porcentajeGrasa || 0}%
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Marmoleo:</span> {product.caracteristicas?.marmoleo || 'No especificado'}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Color:</span> {product.caracteristicas?.color || 'No especificado'}
                                </p>
                                {product.caracteristicas?.textura?.length > 0 && (
                                    <div>
                                        <span className="text-slate-400">Textura:</span>
                                        <ul className="list-disc list-inside">
                                            {product.caracteristicas.textura.map((tex, index) => (
                                                <li key={index} className="text-slate-300">{tex}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Información Nutricional</h2>
                            <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Porción:</span> {product.infoNutricional?.porcion}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Calorías:</span> {product.infoNutricional?.calorias}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Proteínas:</span> {product.infoNutricional?.proteinas}g
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Grasa Total:</span> {product.infoNutricional?.grasaTotal}g
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Cocción</h2>
                            <div className="bg-slate-700/50 p-4 rounded-lg space-y-4">
                                {product.coccion?.metodos?.length > 0 && (
                                    <div>
                                        <span className="text-slate-400 block mb-1">Métodos de Cocción:</span>
                                        <ul className="list-disc list-inside">
                                            {product.coccion.metodos.map((metodo, index) => (
                                                <li key={index} className="text-slate-300">{metodo}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Temperatura Ideal:</span> {product.coccion?.temperaturaIdeal}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Tiempo Estimado:</span> {product.coccion?.tiempoEstimado}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Opciones de Peso</h2>
                            <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Peso Variable:</span>
                                    {product.peso?.esPesoVariable ? 'Sí' : 'No'}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Peso Promedio:</span>
                                    {product.peso?.pesoPromedio} kg
                                </p>
                                {product.peso?.esPesoVariable && (
                                    <>
                                        <p className="text-slate-300">
                                            <span className="text-slate-400">Peso Mínimo:</span>
                                            {product.peso?.pesoMinimo} kg
                                        </p>
                                        <p className="text-slate-300">
                                            <span className="text-slate-400">Peso Máximo:</span>
                                            {product.peso?.pesoMaximo} kg
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Empaque</h2>
                            <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Tipo:</span>
                                    {product.empaque?.tipo}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Unidades por Caja:</span>
                                    {product.empaque?.unidadesPorCaja}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Peso por Caja:</span>
                                    {product.empaque?.pesoCaja} kg
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Origen</h2>
                            <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                                <p className="text-slate-300">
                                    <span className="text-slate-400">País:</span>
                                    {product.origen?.pais}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Región:</span>
                                    {product.origen?.region || 'No especificada'}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Productor:</span>
                                    {product.origen?.productor || 'No especificado'}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Raza:</span>
                                    {product.origen?.raza}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Maduración:</span>
                                    {product.origen?.maduracion} días
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Procesamiento</h2>
                            <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Fecha Faenado:</span>
                                    {new Date(product.procesamiento?.fechaFaenado).toLocaleDateString()}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Fecha Envasado:</span>
                                    {new Date(product.procesamiento?.fechaEnvasado).toLocaleDateString()}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Fecha Vencimiento:</span>
                                    {new Date(product.procesamiento?.fechaVencimiento).toLocaleDateString()}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Número de Lote:</span>
                                    {product.procesamiento?.numeroLote}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Producción</h2>
                            <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Método:</span>
                                    {product.produccion?.metodo}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Temperatura:</span>
                                    {product.produccion?.temperatura}°C
                                </p>
                            </div>
                        </div>
                    </>
                );

            case 'ProductoAceite':
                return (
                    <>
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Información del Aceite</h2>
                            <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Tipo:</span> {product.infoAceite?.tipo}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Volumen:</span> {product.infoAceite?.volumen}ml
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Envase:</span> {product.infoAceite?.envase}
                                </p>
                                {product.caracteristicas?.aditivos?.length > 0 && (
                                    <div>
                                        <span className="text-slate-400 block mb-1">Aditivos:</span>
                                        <ul className="list-disc list-inside">
                                            {product.caracteristicas.aditivos.map((aditivo, index) => (
                                                <li key={index} className="text-slate-300">{aditivo}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Add Characteristics Section */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Características</h2>
                            <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Filtración:</span>
                                    {product.caracteristicas?.filtracion}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Acidez:</span>
                                    {product.caracteristicas?.acidez}%
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Extracción:</span>
                                    {product.caracteristicas?.extraccion}
                                </p>
                            </div>
                        </div>

                        {/* Add Production Section */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Producción</h2>
                            <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Método:</span>
                                    {product.produccion?.metodo}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Temperatura:</span>
                                    {product.produccion?.temperatura}°C
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Fecha Envasado:</span>
                                    {new Date(product.produccion?.fechaEnvasado).toLocaleDateString()}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Fecha Vencimiento:</span>
                                    {new Date(product.produccion?.fechaVencimiento).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Información Nutricional</h2>
                            <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Porción:</span> {product.infoNutricional?.porcion}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Calorías:</span> {product.infoNutricional?.calorias}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Grasa Total:</span> {product.infoNutricional?.grasaTotal}g
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Grasa Saturada:</span> {product.infoNutricional?.grasaSaturada}g
                                </p>
                            </div>
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="p-6">
                <div className="text-center text-slate-400">
                    Producto no encontrado
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header section with navigation */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="flex items-center gap-2 text-slate-300 hover:text-white"
                    >
                        <HiArrowLeft className="h-5 w-5" />
                        <span>Volver a la lista</span>
                    </button>
                    <button
                        onClick={() => navigate(`/admin/products/${productId}/edit`)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                        <HiPencil className="h-5 w-5" />
                        Editar
                    </button>
                </div>

                <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
                    {/* Product Header */}
                    <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-slate-700">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-white">{product.nombre}</h1>
                                <p className="text-slate-400 mt-2">ID: {product._id}</p>
                                <p className="text-slate-400">Slug: {product.slug}</p>
                            </div>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.estado
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                {product.estado ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-6 space-y-8">
                        {/* Product Images - Updated Section */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Imágenes del Producto</h2>
                            <div className="bg-slate-700/50 p-4 rounded-lg">
                                <ImageGallery
                                    images={product.multimedia?.imagenes || []}
                                    productName={product.nombre}
                                />
                            </div>
                        </div>

                        {/* Basic Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-slate-200">Información Básica</h2>
                                <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                                    <p className="text-slate-300">
                                        <span className="text-slate-400">Código:</span> {product.codigo}
                                    </p>
                                    <p className="text-slate-300">
                                        <span className="text-slate-400">SKU:</span> {product.sku}
                                    </p>
                                    <p className="text-slate-300">
                                        <span className="text-slate-400">Categoría:</span> {product.categoria}
                                    </p>
                                    <p className="text-slate-300">
                                        <span className="text-slate-400">Tipo:</span> {product.tipoProducto}
                                    </p>
                                    <p className="text-slate-300">
                                        <span className="text-slate-400">Destacado:</span> {product.destacado ? 'Sí' : 'No'}
                                    </p>
                                </div>
                            </div>

                            {/* Pricing Information */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-slate-200">Precios</h2>
                                <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                                    <p className="text-slate-300">
                                        <span className="text-slate-400">Precio Base:</span> ${product.precios?.base?.toFixed(2)}
                                    </p>
                                    <p className="text-slate-300">
                                        <span className="text-slate-400">Descuento Regular:</span> {product.precios?.descuentos?.regular}%
                                    </p>
                                    <p className="text-slate-300">
                                        <span className="text-slate-400">Descuento Transferencia:</span> {product.precios?.descuentos?.transferencia}%
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-slate-600">
                                        <p className="text-slate-300">
                                            <span className="text-slate-400">Promoción:</span> {product.precios?.promocion?.activa ? 'Activa' : 'Inactiva'}
                                        </p>
                                        {product.precios?.promocion?.activa && (
                                            <p className="text-slate-300">
                                                <span className="text-slate-400">Porcentaje Promoción:</span> {product.precios?.promocion?.porcentaje}%
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Inventory Information */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-slate-200">Inventario</h2>
                                <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                                    <p className="text-slate-300">
                                        <span className="text-slate-400">Stock:</span> {product.inventario?.stockUnidades} unidades
                                    </p>
                                    <p className="text-slate-300">
                                        <span className="text-slate-400">Stock Mínimo:</span> {product.inventario?.umbralStockBajo} unidades
                                    </p>
                                    <p className="text-slate-300">
                                        <span className="text-slate-400">Última Actualización:</span>{' '}
                                        {new Date(product.inventario?.ultimaActualizacion).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {renderProductTypeSpecificInfo()}
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Descripción</h2>
                            <div className="bg-slate-700/50 p-4 rounded-lg space-y-4">
                                <p className="text-slate-300">
                                    <span className="text-slate-400 block mb-1">Descripción Corta:</span>
                                    {product.descripcion?.corta || 'No especificada'}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400 block mb-1">Descripción Completa:</span>
                                    {product.descripcion?.completa || 'No especificada'}
                                </p>
                            </div>
                        </div>

                        {/* SEO Information - Added Section */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">SEO</h2>
                            <div className="bg-slate-700/50 p-4 rounded-lg space-y-4">
                                <p className="text-slate-300">
                                    <span className="text-slate-400 block mb-1">Meta Título:</span>
                                    {product.seo?.metaTitulo || 'No especificado'}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400 block mb-1">Meta Descripción:</span>
                                    {product.seo?.metaDescripcion || 'No especificada'}
                                </p>
                                <div>
                                    <span className="text-slate-400 block mb-2">Palabras Clave:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {product.seo?.palabrasClave?.map((palabra, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-slate-600 text-slate-200 rounded-full text-sm"
                                            >
                                                {palabra}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Conservation Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Conservación</h2>
                            <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Requiere Refrigeración:</span> {product.conservacion?.requiereRefrigeracion ? 'Sí' : 'No'}
                                </p>
                                <p className="text-slate-300">
                                    <span className="text-slate-400">Requiere Congelación:</span> {product.conservacion?.requiereCongelacion ? 'Sí' : 'No'}
                                </p>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-200">Información Adicional</h2>
                            <div className="bg-slate-700/50 p-4 rounded-lg space-y-4">
                                <div>
                                    <span className="text-slate-400 block mb-1">Certificaciones:</span>
                                    {product.infoAdicional?.certificaciones?.length > 0 ? (
                                        <ul className="list-disc list-inside text-slate-300">
                                            {product.infoAdicional.certificaciones.map((cert, index) => (
                                                <li key={index}>{cert}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-slate-300">No hay certificaciones registradas</p>
                                    )}
                                </div>

                                <div>
                                    <span className="text-slate-400 block mb-1">Usos Recomendados:</span>
                                    {product.usosRecomendados?.length > 0 ? (
                                        <ul className="list-disc list-inside text-slate-300">
                                            {product.usosRecomendados.map((uso, index) => (
                                                <li key={index}>{uso}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-slate-300">No hay usos recomendados registrados</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="border-t border-slate-700 pt-6 text-sm text-slate-400">
                            <p>Creado: {new Date(product.fechaCreacion).toLocaleString()}</p>
                            <p>Última actualización: {new Date(product.fechaActualizacion).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { AdminProductDetails };