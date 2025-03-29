import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiArrowLeft } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { getProductById, updateProduct } from '../../services/adminService';

// Import existing section components
import { PricingSection } from '../../components/admin/AdminProductEdit/PricingSection';
import { InventorySection } from '../../components/admin/AdminProductEdit/InventorySection';
import { ImageSection } from '../../components/admin/AdminProductEdit/ImageSection';
import { ConservationSection } from '../../components/admin/AdminProductEdit/ConservationSection';
import { SeoSection } from '../../components/admin/AdminProductEdit/SEOSection';
import { SubmitButton } from '../../components/common/SubmitButton';

// Add imports
import { PRODUCT_TYPES, DEFAULT_VALUES } from '../../constants/productDefaults';
import { BasicInfoSection } from '../../components/admin/products/create/BasicInfoSection';

// Actualizar imports
import { CarneForm } from '../../components/admin/products/CarneForm';
import { AceiteForm } from '../../components/admin/products/AceiteForm';
import { TagsInput } from '../../components/admin/products/create/TagsInput';

// Update the initial state
const getInitialState = (categoria = PRODUCT_TYPES.ACEITE) => ({
    ...DEFAULT_VALUES.common,
    ...(categoria === PRODUCT_TYPES.CARNE ? DEFAULT_VALUES.CARNE : DEFAULT_VALUES.ACEITE),
    sku: '',
    nombre: '',
    descripcion: {
        corta: '',
        completa: ''
    },
    precios: {
        base: 0,
        descuentos: {
            regular: 0,
            transferencia: 0
        }
    },
    estado: true,
    destacado: false,
    categoria: 'ACEITE',
    tipoProducto: 'ProductoAceite',
    multimedia: {
        imagenes: []
    },
    inventario: {
        stockUnidades: 0,
        umbralStockBajo: 0
    },
    conservacion: {
        requiereRefrigeracion: false,
        requiereCongelacion: false,
        vidaUtil: '',
        instrucciones: ''
    },
    infoAceite: {
        tipo: 'OLIVA',
        volumen: 0,
        envase: 'BOTELLA'
    },
    seo: {
        palabrasClave: []
    },
    usosRecomendados: []
});

const generateSlug = (text) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .trim();
};

export const AdminProductEdit = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState(getInitialState());

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    // Update the fetchProductDetails function to properly format aceite data
    const fetchProductDetails = async () => {
        try {
            const response = await getProductById(productId, token);

            if (response.success) {
                const formattedMultimedia = {
                    ...response.product.multimedia,
                    imagenes: response.product.multimedia?.imagenes?.map(img => ({
                        url: img.url,
                        textoAlternativo: img.textoAlternativo || img.nombre,
                        esPrincipal: Boolean(img.esPrincipal),
                        id: img._id || img.id
                    })) || []
                };

                const formattedPrecios = {
                    base: Number(response.product.precios?.base) || 0,
                    descuentos: {
                        regular: Number(response.product.precios?.descuentos?.regular) || 0,
                        transferencia: Number(response.product.precios?.descuentos?.transferencia) || 0,
                        promocion: {
                            porcentaje: Number(response.product.precios?.descuentos?.promocion?.porcentaje) || 0,
                            activa: Boolean(response.product.precios?.descuentos?.promocion?.activa)
                        }
                    }
                };

                const formattedSeo = {
                    metaTitulo: response.product.seo?.metaTitulo || response.product.nombre || '',
                    metaDescripcion: response.product.seo?.metaDescripcion || '',
                    palabrasClave: Array.isArray(response.product.seo?.palabrasClave)
                        ? response.product.seo.palabrasClave
                        : [],
                    slug: response.product.slug || generateSlug(response.product.nombre)
                };

                const formattedData = {
                    ...response.product,
                    estado: Boolean(response.product.estado),
                    destacado: Boolean(response.product.destacado),
                    multimedia: formattedMultimedia,
                    precios: formattedPrecios,
                    tags: Array.isArray(response.product.tags) ? response.product.tags : [],
                    caracteristicas: {
                        textura: response.product.caracteristicas?.textura || [],
                        ...response.product.caracteristicas,
                        acidez: response.product.caracteristicas?.acidez || '',
                        filtracion: response.product.caracteristicas?.filtracion || '',
                        extraccion: response.product.caracteristicas?.extraccion || '',
                        aditivos: Array.isArray(response.product.caracteristicas?.aditivos)
                            ? response.product.caracteristicas.aditivos
                            : []
                    },
                    coccion: {
                        metodos: response.product.coccion?.metodos || [],
                        temperaturaIdeal: response.product.coccion?.temperaturaIdeal || '',
                        tiempoEstimado: response.product.coccion?.tiempoEstimado || '',
                        consejos: response.product.coccion?.consejos || [],
                        recetas: response.product.coccion?.recetas || []
                    },
                    conservacion: {
                        requiereRefrigeracion: Boolean(response.product.conservacion?.requiereRefrigeracion),
                        requiereCongelacion: Boolean(response.product.conservacion?.requiereCongelacion),
                        vidaUtil: response.product.conservacion?.vidaUtil || '',
                        instrucciones: response.product.conservacion?.instrucciones || ''
                    },
                    infoCarne: response.product.categoria === 'CARNE' ? {
                        ...response.product.infoCarne,
                        precioPorKg: Number(response.product.infoCarne?.precioPorKg) || 0
                    } : undefined,
                    produccion: {
                        metodo: response.product.produccion?.metodo || '',
                        temperatura: response.product.produccion?.temperatura || '',
                        fechaEnvasado: response.product.produccion?.fechaEnvasado || '',
                        fechaVencimiento: response.product.produccion?.fechaVencimiento || ''
                    },
                    infoNutricional: {
                        ...response.product.infoNutricional
                    },
                    usosRecomendados: Array.isArray(response.product.usosRecomendados)
                        ? response.product.usosRecomendados
                        : [],
                    opcionesVolumen: Array.isArray(response.product.opcionesVolumen)
                        ? response.product.opcionesVolumen
                        : [],
                    seo: formattedSeo
                };

                setFormData(formattedData);
            }
        } catch (error) {
            toast.error('Error al cargar el producto');
        } finally {
            setLoading(false);
        }
    };

    // Replace the existing handleInputChange function
    const handleInputChange = (field, value) => {
        setFormData(prev => {
            let newState;

            if (typeof field === 'object' && field.target) {
                const { name, value: eventValue, type, checked } = field.target;
                const section = value;

                newState = {
                    ...prev,
                    [section]: {
                        ...(prev[section] || {}),
                        [name]: type === 'checkbox' ? checked : eventValue
                    }
                };
            } else if (typeof value === 'object' && !Array.isArray(value)) {
                newState = {
                    ...prev,
                    [field]: {
                        ...(prev[field] || {}),
                        ...value
                    }
                };
            } else if (Array.isArray(value)) {
                newState = {
                    ...prev,
                    [field]: value
                };
            } else {
                newState = {
                    ...prev,
                    [field]: value
                };
            }

            return newState;
        });
    };

    const validateProductData = (data) => {
        const errors = [];

        // Required fields validation
        if (!data.sku?.trim()) errors.push('El SKU es requerido');
        if (!data.nombre?.trim()) errors.push('El nombre es requerido');
        if (!data.categoria) errors.push('La categoría es requerida');
        if (!data.precios?.base) errors.push('El precio base es requerido');

        // Data type validation
        if (typeof data.estado !== 'boolean') {
            errors.push('El estado debe ser un valor booleano');
        }
        if (typeof data.destacado !== 'boolean') {
            errors.push('El destacado debe ser un valor booleano');
        }

        // SEO validation
        if (!data.seo?.metaTitulo?.trim()) {
            errors.push('El meta título es requerido');
        }
        if (!data.seo?.slug?.trim()) {
            errors.push('El slug es requerido');
        }

        return errors;
    };

    // Update the handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateProductData(formData);
        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return;
        }

        try {
            setSaving(true);

            // Formatear los datos específicos de aceite antes de enviar
            const dataToSend = {
                ...formData,
                // Asegurar que los datos específicos del aceite estén presentes
                caracteristicas: {
                    ...(formData.caracteristicas || {}),
                    aditivos: formData.caracteristicas?.aditivos || [],
                    acidez: Number(formData.caracteristicas?.acidez) || 0,
                    filtracion: formData.caracteristicas?.filtracion || '',
                    extraccion: formData.caracteristicas?.extraccion || ''
                },
                produccion: {
                    ...(formData.produccion || {}),
                    metodo: formData.produccion?.metodo || '',
                    temperatura: Number(formData.produccion?.temperatura) || 0,
                    fechaEnvasado: formData.produccion?.fechaEnvasado || '',
                    fechaVencimiento: formData.produccion?.fechaVencimiento || ''
                },
                infoNutricional: {
                    ...(formData.infoNutricional || {}),
                    porcion: formData.infoNutricional?.porcion || '',
                    calorias: Number(formData.infoNutricional?.calorias) || 0,
                    grasaTotal: Number(formData.infoNutricional?.grasaTotal) || 0,
                    grasaSaturada: Number(formData.infoNutricional?.grasaSaturada) || 0,
                    grasaTrans: Number(formData.infoNutricional?.grasaTrans) || 0,
                    grasaPoliinsaturada: Number(formData.infoNutricional?.grasaPoliinsaturada) || 0,
                    grasaMonoinsaturada: Number(formData.infoNutricional?.grasaMonoinsaturada) || 0
                },
                usosRecomendados: formData.usosRecomendados || [],
                opcionesVolumen: (formData.opcionesVolumen || []).map(opcion => ({
                    ...opcion,
                    volumen: Number(opcion.volumen) || 0,
                    precio: Number(opcion.precio) || 0,
                    sku: opcion.sku || '',
                    esPredeterminado: Boolean(opcion.esPredeterminado)
                })),
                seo: {
                    ...formData.seo,
                    slug: formData.seo?.slug || generateSlug(formData.seo?.metaTitulo || formData.nombre)
                }
            };

            // Remover campos calculados y metadata
            delete dataToSend.precioFinal;
            delete dataToSend.precioTransferencia;
            delete dataToSend.precioPorKgFinal;
            delete dataToSend.precioPorKgTransferencia;
            delete dataToSend.__v;
            delete dataToSend.fechaActualizacion;

            const response = await updateProduct(productId, dataToSend, token);

            if (response.success) {
                toast.success('Producto actualizado exitosamente');
                navigate('/admin/products');
            } else {
                throw new Error(response.msg || 'Error al actualizar el producto');
            }
        } catch (error) {
            toast.error(error.message || 'Error al actualizar el producto');
        } finally {
            setSaving(false);
        }
    };

    // Update renderSpecificForm without console.logs
    const renderSpecificForm = () => {
        switch (formData.categoria) {
            case 'CARNE':
                return (
                    <CarneForm
                        formData={formData}
                        handleInputChange={handleInputChange}
                        mode="edit"
                    />
                );
            case 'ACEITE':
                return (
                    <AceiteForm
                        formData={formData}  // Changed from productData to formData
                        handleInputChange={handleInputChange}
                        mode="edit"
                    />
                );
            default:
                return null;
        }
    };

    if (loading) {
        return <div className="p-6">Cargando...</div>;
    }

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="flex items-center gap-2 text-slate-300 hover:text-white"
                    >
                        <HiArrowLeft className="h-5 w-5" />
                        <span>Volver</span>
                    </button>
                    <h1 className="text-2xl font-bold text-white">Editar Producto</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <BasicInfoSection
                        data={formData}
                        onChange={handleInputChange}
                        mode="edit"
                        disableCategoryChange={true} // Prevenir cambios de categoría en edición
                    />

                    <TagsInput
                        tags={formData.tags || []}
                        onChange={(newTags) => handleInputChange('tags', newTags)}
                        placeholder="Agregar etiquetas al producto..."
                        helperText="Agrega etiquetas relevantes para categorizar el producto"
                        showSuggestions={true}
                    />
                    {/* Renderizar el formulario específico según la categoría */}
                    {renderSpecificForm()}

                    <PricingSection
                        data={formData}
                        onChange={handleInputChange}
                    />

                    <InventorySection
                        data={formData}
                        onChange={handleInputChange}
                    />

                    <ConservationSection
                        data={formData}
                        onChange={handleInputChange}
                    />

                    <ImageSection
                        data={formData}
                        onChange={handleInputChange}
                    />

                    <SeoSection
                        data={formData}
                        onChange={handleInputChange}
                    />

                    <SubmitButton
                        loading={saving}
                        text="Guardar Cambios"
                    />
                </form>
            </div>
        </div>
    );
};