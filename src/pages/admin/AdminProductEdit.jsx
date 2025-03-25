import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiArrowLeft } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { getProductById, updateProduct } from '../../services/adminService';

// Import existing section components
import { BasicInfoSection } from '../../components/admin/AdminProductEdit/BasicInfoSection';
import { ProductTypeSection } from '../../components/admin/AdminProductEdit/ProductTypeSection';
import { DescriptionSection } from '../../components/admin/AdminProductEdit/DescriptionSection';
import { PricingSection } from '../../components/admin/AdminProductEdit/PricingSection';
import { InventorySection } from '../../components/admin/AdminProductEdit/InventorySection';
import { ImageSection } from '../../components/admin/AdminProductEdit/ImageSection';
import { ConservationSection } from '../../components/admin/AdminProductEdit/ConservationSection';
import { SeoSection } from '../../components/admin/AdminProductEdit/SEOSection';
import { SubmitButton } from '../../components/common/SubmitButton';

// Add imports
import { CarneDetailsSection } from '../../components/admin/AdminProductEdit/CarneDetailsSection';
import { AceiteDetailsSection } from '../../components/admin/AdminProductEdit/AceiteDetailsSection';
import { PRODUCT_TYPES, DEFAULT_VALUES } from '../../constants/productDefaults';
import { TagsSection } from '../../components/admin/AdminProductEdit/TagsSection';

// Update the initial state
const getInitialState = (categoria = PRODUCT_TYPES.ACEITE) => ({
    ...DEFAULT_VALUES.common,
    ...(categoria === PRODUCT_TYPES.CARNE ? DEFAULT_VALUES.CARNE : DEFAULT_VALUES.ACEITE),
    codigo: '',
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

    const fetchProductDetails = async () => {
        try {
            console.log('Fetching product details for ID:', productId);
            const response = await getProductById(productId, token);
            
            if (response.success) {
                // Format multimedia data
                const formattedMultimedia = {
                    ...response.product.multimedia,
                    imagenes: response.product.multimedia?.imagenes?.map(img => ({
                        url: img.url,
                        textoAlternativo: img.textoAlternativo || img.nombre,
                        esPrincipal: Boolean(img.esPrincipal),
                        id: img._id || img.id
                    })) || []
                };

                // Format prices and discounts
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

                // Format SEO data with automatic slug generation
                const formattedSeo = {
                    metaTitulo: response.product.seo?.metaTitulo || response.product.nombre || '',
                    metaDescripcion: response.product.seo?.metaDescripcion || '',
                    palabrasClave: Array.isArray(response.product.seo?.palabrasClave) 
                        ? response.product.seo.palabrasClave 
                        : [],
                    slug: response.product.seo?.slug || generateSlug(response.product.nombre)
                };

                // Format the complete data
                const formattedData = {
                    ...response.product,
                    estado: Boolean(response.product.estado),
                    destacado: Boolean(response.product.destacado),
                    multimedia: formattedMultimedia,
                    precios: formattedPrecios,
                    tags: Array.isArray(response.product.tags) ? response.product.tags : [],
                    caracteristicas: {
                        textura: response.product.caracteristicas?.textura || [],
                        ...response.product.caracteristicas
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
                    seo: formattedSeo
                };

                console.log('Formatted SEO data:', formattedSeo);
                setFormData(formattedData);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Error al cargar el producto');
        } finally {
            setLoading(false);
        }
    };

    // Add category change handler
    const handleCategoryChange = (newCategory) => {
        setFormData(prev => ({
            ...getInitialState(newCategory),
            codigo: prev.codigo,
            sku: prev.sku,
            nombre: prev.nombre
        }));
    };

    // Update handleInputChange to handle category changes
    const handleInputChange = (field, value) => {
        console.log('Input change:', { field, value });
        if (field === 'categoria' && value !== formData.categoria) {
            console.log('Category change detected:', value);
            handleCategoryChange(value);
            return;
        }

        setFormData(prev => {
            const newData = {
                ...prev,
                [field]: value
            };
            console.log('Updated form data:', newData);
            return newData;
        });
    };

    const validateProductData = (data) => {
        console.log('Validating product data:', data);
        
        const errors = [];
    
        // Required fields validation
        if (!data.codigo?.trim()) errors.push('El código es requerido');
        if (!data.sku?.trim()) errors.push('El SKU es requerido');
        if (!data.nombre?.trim()) errors.push('El nombre es requerido');
        if (!data.categoria) errors.push('La categoría es requerida');
        if (!data.precios?.base) errors.push('El precio base es requerido');
    
        // Category specific validation
        if (data.categoria === 'ACEITE') {
            if (!data.infoAceite?.tipo) errors.push('El tipo de aceite es requerido');
            if (!data.infoAceite?.volumen) errors.push('El volumen es requerido');
        } else if (data.categoria === 'CARNE') {
            if (!data.infoCarne?.tipoCarne) errors.push('El tipo de carne es requerido');
            if (!data.infoCarne?.corte) errors.push('El corte es requerido');
        }
    
        // Data type validation
        if (typeof data.estado !== 'boolean') {
            console.warn('Estado no es booleano:', data.estado);
            errors.push('El estado debe ser un valor booleano');
        }
        if (typeof data.destacado !== 'boolean') {
            console.warn('Destacado no es booleano:', data.destacado);
            errors.push('El destacado debe ser un valor booleano');
        }

        // SEO validation
        if (!data.seo?.metaTitulo?.trim()) {
            errors.push('El meta título es requerido');
        }
        if (!data.seo?.metaDescripcion?.trim()) {
            errors.push('La meta descripción es requerida');
        }
        if (!Array.isArray(data.seo?.palabrasClave) || data.seo.palabrasClave.length === 0) {
            errors.push('Se requiere al menos una palabra clave');
        }
        if (!data.seo?.slug?.trim()) {
            errors.push('El slug es requerido');
        }
    
        console.log('Validation results:', { errors, isValid: errors.length === 0 });
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
            console.group('💾 Form Submission');
            
            const cleanedData = {
                codigo: formData.codigo?.trim(),
                sku: formData.sku?.trim(),
                nombre: formData.nombre?.trim(),
                categoria: formData.categoria,
                tipoProducto: formData.tipoProducto,
                estado: formData.estado || 'ACTIVO',
                destacado: Boolean(formData.destacado),
                conservacion: formData.conservacion ? {
                    ...formData.conservacion,
                    requiereRefrigeracion: Boolean(formData.conservacion.requiereRefrigeracion),
                    requiereCongelacion: Boolean(formData.conservacion.requiereCongelacion)
                } : { requiereRefrigeracion: false, requiereCongelacion: false },
                seo: {
                    metaTitulo: formData.seo?.metaTitulo?.trim() || '',
                    metaDescripcion: formData.seo?.metaDescripcion?.trim() || '',
                    palabrasClave: Array.isArray(formData.seo?.palabrasClave) 
                        ? formData.seo.palabrasClave.filter(keyword => keyword?.trim())
                        : [],
                    slug: formData.seo?.slug?.trim() || ''
                }
            };
            
            const dataToSend = {
                ...cleanedData,
                seo: {
                    ...cleanedData.seo,
                    slug: cleanedData.seo?.slug || generateSlug(cleanedData.seo?.metaTitulo || cleanedData.nombre)
                }
            };

            // Remove calculated fields
            delete dataToSend.precioFinal;
            delete dataToSend.precioTransferencia;
            delete dataToSend.precioPorKgFinal;
            delete dataToSend.precioPorKgTransferencia;
            delete dataToSend.__v;
            delete dataToSend.fechaActualizacion;

            console.log('Sending data:', JSON.stringify(dataToSend, null, 2));
            
            const response = await updateProduct(productId, dataToSend, token);
            
            if (response.success) {
                toast.success('Producto actualizado exitosamente');
                navigate('/admin/products');
            } else {
                throw new Error(response.msg || 'Error al actualizar el producto');
            }
        } catch (error) {
            console.error('Update error:', {
                message: error.message,
                data: error.response?.data,
                formData
            });
            toast.error(error.msg || 'Error al actualizar el producto');
        } finally {
            setSaving(false);
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
                    />
                    
                    <TagsSection 
                        data={formData}
                        onChange={handleInputChange}
                    />
                    
                    <ProductTypeSection 
                        data={formData}
                        onChange={handleInputChange}
                    />

                    {formData.categoria === 'CARNE' ? (
                        <CarneDetailsSection 
                            data={formData}
                            onChange={handleInputChange}
                        />
                    ) : formData.categoria === 'ACEITE' ? (
                        <AceiteDetailsSection 
                            data={formData}
                            onChange={handleInputChange}
                        />
                    ) : null}
                    
                    <DescriptionSection 
                        data={formData}
                        onChange={handleInputChange}
                    />
                    
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