import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiArrowLeft } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { getProductById, updateProduct } from '../../services/adminService';

// Import existing section components
import { PricingSection } from '../../components/admin/AdminProductEdit/PricingSection';
import { InventorySection } from '../../components/admin/AdminProductEdit/InventorySection';
import { ImageUploader } from '../../components/admin/products/create/ImageUploader';
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
import { uploadImageToCloudinary } from '../../services/utilService';
import BaseProductForm from '../../components/admin/products/create/BaseProductForm';

// Actualizar el estado inicial
const getInitialState = (categoria = 'ACEITE') => ({
    sku: '',
    nombre: '',
    slug: '',
    categoria: categoria,
    estado: true,
    destacado: false,
    descripcion: {
        corta: '',
        completa: ''
    },
    multimedia: {
        imagenes: [],
        video: ''
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
    opcionesPeso: {
        esPesoVariable: false,
        pesoPromedio: null,
        pesoMinimo: null,
        pesoMaximo: null,
        pesosEstandar: [],
        rangosPreferidos: []
    },
    tags: [],
    // Campos específicos por tipo de producto
    ...(categoria === 'ACEITE' ? {
        tipoProducto: 'ProductoAceite',
        infoAceite: {
            tipo: 'OLIVA',
            envase: 'BOTELLA'
        },
        caracteristicas: {
            aditivos: [],
            filtracion: '',
            acidez: 0,
            extraccion: ''
        },
        infoNutricional: {
            porcion: '',
            calorias: 0,
            grasaTotal: 0,
            grasaSaturada: 0,
            grasaTrans: 0,
            grasaPoliinsaturada: 0,
            grasaMonoinsaturada: 0
        },
        usosRecomendados: [],
        produccion: {
            metodo: '',
            temperatura: '',
            fechaEnvasado: '',
            fechaVencimiento: ''
        }
    } : categoria === 'CARNE' ? {
        tipoProducto: 'ProductoCarne',
        infoCarne: {
            tipoCarne: 'VACUNO',
            corte: '',
            nombreArgentino: '',
            nombreChileno: ''
        },
        caracteristicas: {
            porcentajeGrasa: 0,
            marmoleo: 0,
            color: '',
            textura: []
        },
        infoNutricional: {
            porcion: '',
            calorias: 0,
            proteinas: 0,
            grasaTotal: 0,
            grasaSaturada: 0,
            colesterol: 0,
            sodio: 0,
            carbohidratos: 0
        },
        coccion: {
            metodos: [],
            temperaturaIdeal: '',
            tiempoEstimado: '',
            consejos: [],
            recetas: []
        },
        empaque: {
            tipo: 'VACIO',
            unidadesPorCaja: 0,
            pesoCaja: 0
        },
        origen: {
            pais: '',
            region: '',
            productor: '',
            raza: '',
            maduracion: ''
        },
        procesamiento: {
            fechaFaenado: '',
            fechaEnvasado: '',
            fechaVencimiento: '',
            numeroLote: ''
        }
    } : {})
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

    // Actualizar fetchProductDetails para manejar correctamente los datos
    const fetchProductDetails = async () => {
        try {
            const response = await getProductById(productId, token);
            if (response.success) {
                const product = response.product;
                
                // Formatear los datos según el tipo de producto
                const formattedData = {
                    ...getInitialState(product.categoria),
                    ...product,
                    // Formatear datos comunes
                    multimedia: {
                        imagenes: product.multimedia?.imagenes?.map(img => ({
                            url: img.url,
                            textoAlternativo: img.textoAlternativo || '',
                            esPrincipal: Boolean(img.esPrincipal)
                        })) || [],
                        video: product.multimedia?.video || ''
                    },
                    opcionesPeso: {
                        ...product.opcionesPeso,
                        pesosEstandar: product.opcionesPeso?.pesosEstandar?.map(peso => ({
                            ...peso,
                            peso: Number(peso.peso),
                            precio: Number(peso.precio),
                            stockDisponible: Number(peso.stockDisponible),
                            umbralStockBajo: Number(peso.umbralStockBajo)
                        })) || []
                    },
                    // Formatear datos específicos según el tipo
                    ...(product.categoria === 'ACEITE' ? {
                        caracteristicas: {
                            aditivos: product.caracteristicas?.aditivos || [],
                            filtracion: product.caracteristicas?.filtracion || '',
                            acidez: Number(product.caracteristicas?.acidez) || 0,
                            extraccion: product.caracteristicas?.extraccion || ''
                        },
                        infoNutricional: {
                            ...product.infoNutricional,
                            calorias: Number(product.infoNutricional?.calorias) || 0,
                            grasaTotal: Number(product.infoNutricional?.grasaTotal) || 0,
                            grasaSaturada: Number(product.infoNutricional?.grasaSaturada) || 0,
                            grasaTrans: Number(product.infoNutricional?.grasaTrans) || 0,
                            grasaPoliinsaturada: Number(product.infoNutricional?.grasaPoliinsaturada) || 0,
                            grasaMonoinsaturada: Number(product.infoNutricional?.grasaMonoinsaturada) || 0
                        }
                    } : product.categoria === 'CARNE' ? {
                        caracteristicas: {
                            porcentajeGrasa: Number(product.caracteristicas?.porcentajeGrasa) || 0,
                            marmoleo: Number(product.caracteristicas?.marmoleo) || 0,
                            color: product.caracteristicas?.color || '',
                            textura: product.caracteristicas?.textura || []
                        },
                        infoNutricional: {
                            ...product.infoNutricional,
                            calorias: Number(product.infoNutricional?.calorias) || 0,
                            proteinas: Number(product.infoNutricional?.proteinas) || 0,
                            grasaTotal: Number(product.infoNutricional?.grasaTotal) || 0,
                            grasaSaturada: Number(product.infoNutricional?.grasaSaturada) || 0,
                            colesterol: Number(product.infoNutricional?.colesterol) || 0,
                            sodio: Number(product.infoNutricional?.sodio) || 0,
                            carbohidratos: Number(product.infoNutricional?.carbohidratos) || 0
                        }
                    } : {})
                };

                setFormData(formattedData);
            }
        } catch (error) {
            toast.error('Error al cargar el producto');
        } finally {
            setLoading(false);
        }
    };

    // Update handleInputChange function
    const handleInputChange = (e, section, subsection) => {
        // Handle tags separately since they come directly as an array
        if (section === 'tags') {
            setFormData(prev => ({
                ...prev,
                tags: e
            }));
            return;
        }

        if (typeof e === 'object' && e.target) {
            const { name, value, type, checked } = e.target;

            setFormData(prev => {
                // Handle pricing and discounts
                if (section === 'precios') {
                    if (subsection === 'descuentos') {
                        // Ensure discount is between 0 and 100
                        const discountValue = Math.min(Math.max(Number(value) || 0, 0), 100);
                        return {
                            ...prev,
                            precios: {
                                ...prev.precios,
                                descuentos: {
                                    ...prev.precios?.descuentos,
                                    [name]: discountValue
                                }
                            }
                        };
                    }
                    // Handle other precio fields
                    return {
                        ...prev,
                        precios: {
                            ...prev.precios,
                            [name]: type === 'number' ? Number(value) : value
                        }
                    };
                }

                // Rest of the existing logic
                if (name.includes('.')) {
                    const [parent, child] = name.split('.');
                    return {
                        ...prev,
                        [parent]: {
                            ...prev[parent],
                            [child]: value
                        }
                    };
                }

                // Handle section-based updates
                if (section) {
                    return {
                        ...prev,
                        [section]: {
                            ...prev[section],
                            [name]: Array.isArray(value) ? value :
                                type === 'checkbox' ? checked : value
                        }
                    };
                }

                // Handle direct field updates
                return {
                    ...prev,
                    [name]: type === 'checkbox' ? checked : value
                };
            });
        }
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
        
        try {
            setSaving(true);
            
            // Preparar datos para envío
            const dataToSend = {
                ...formData,
                // Asegurar que los campos numéricos sean números
                opcionesPeso: {
                    ...formData.opcionesPeso,
                    pesosEstandar: formData.opcionesPeso.pesosEstandar.map(peso => ({
                        ...peso,
                        peso: Number(peso.peso),
                        precio: Number(peso.precio),
                        stockDisponible: Number(peso.stockDisponible),
                        umbralStockBajo: Number(peso.umbralStockBajo)
                    }))
                }
            };

            // Formatear fechas si existen
            if (formData.categoria === 'CARNE') {
                dataToSend.procesamiento = {
                    ...dataToSend.procesamiento,
                    fechaFaenado: dataToSend.procesamiento?.fechaFaenado ? 
                        new Date(dataToSend.procesamiento.fechaFaenado).toISOString() : null,
                    fechaEnvasado: dataToSend.procesamiento?.fechaEnvasado ? 
                        new Date(dataToSend.procesamiento.fechaEnvasado).toISOString() : null,
                    fechaVencimiento: dataToSend.procesamiento?.fechaVencimiento ? 
                        new Date(dataToSend.procesamiento.fechaVencimiento).toISOString() : null
                };
            } else if (formData.categoria === 'ACEITE') {
                dataToSend.produccion = {
                    ...dataToSend.produccion,
                    fechaEnvasado: dataToSend.produccion?.fechaEnvasado ? 
                        new Date(dataToSend.produccion.fechaEnvasado).toISOString() : null,
                    fechaVencimiento: dataToSend.produccion?.fechaVencimiento ? 
                        new Date(dataToSend.produccion.fechaVencimiento).toISOString() : null
                };
            }

            // Remover campos no necesarios
            delete dataToSend._id;
            delete dataToSend.__v;
            delete dataToSend.fechaCreacion;
            delete dataToSend.fechaActualizacion;

            const response = await updateProduct(productId, dataToSend, token);
            
            if (response.success) {
                toast.success('Producto actualizado exitosamente');
                navigate('/admin/products');
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

    // Add these handler functions inside AdminProductEdit component
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);

        try {
            const uploadPromises = files.map(async (file) => {
                const cloudinaryUrl = await uploadImageToCloudinary(file);
                if (!cloudinaryUrl) {
                    throw new Error(`Error al subir ${file.name}`);
                }
                
                // Ensure all required properties are present
                return {
                    url: cloudinaryUrl,
                    nombre: file.name || 'Imagen sin nombre', // Ensure nombre is always present
                    tipo: file.type,
                    textoAlternativo: file.name || 'Imagen sin descripción',
                    esPrincipal: false,
                    id: Date.now().toString()
                };
            });

            const uploadedImages = await Promise.all(uploadPromises);

            setFormData(prev => {
                const currentImages = prev.multimedia?.imagenes || [];
                const newImages = uploadedImages.map((img, idx) => ({
                    ...img,
                    esPrincipal: currentImages.length === 0 && idx === 0
                }));

                return {
                    ...prev,
                    multimedia: {
                        ...prev.multimedia,
                        imagenes: [...currentImages, ...newImages]
                    }
                };
            });

            toast.success(`${uploadedImages.length} imágenes subidas exitosamente`);
        } catch (error) {
            console.error('Error al procesar imágenes:', error);
            toast.error('Error al subir las imágenes');
        }
    };

    const handleImageDelete = (index) => {
        setFormData(prev => ({
            ...prev,
            multimedia: {
                ...prev.multimedia,
                imagenes: prev.multimedia.imagenes.filter((_, i) => i !== index)
            }
        }));
        toast.success('Imagen eliminada');
    };

    const handleAltTextUpdate = (index, newAltText, setPrincipal = false) => {
        setFormData(prev => {
            const updatedImages = [...prev.multimedia.imagenes];

            if (setPrincipal) {
                updatedImages.forEach((img, i) => {
                    img.esPrincipal = i === index;
                });
            } else {
                updatedImages[index] = {
                    ...updatedImages[index],
                    textoAlternativo: newAltText || updatedImages[index].nombre // Fallback to nombre if empty
                };
            }

            return {
                ...prev,
                multimedia: {
                    ...prev.multimedia,
                    imagenes: updatedImages
                }
            };
        });
    };

    const handleVideoChange = (videoUrl) => {
        setFormData(prev => ({
            ...prev,
            multimedia: {
                ...prev.multimedia,
                video: videoUrl
            }
        }));
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
                    {/* BaseProductForm maneja todos los campos base */}
                    <BaseProductForm 
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleImageUpload={handleImageUpload}
                        handleImageDelete={handleImageDelete}
                        handleUpdateAltText={handleAltTextUpdate}
                        handleVideoChange={handleVideoChange}
                        handleTagChange={(newTags) => handleInputChange(newTags, 'tags')}
                    />

                    {/* Formularios específicos según tipo de producto */}
                    {formData.categoria === 'ACEITE' && (
                        <AceiteForm
                            formData={formData}
                            handleInputChange={handleInputChange}
                            mode="edit"
                        />
                    )}

                    {formData.categoria === 'CARNE' && (
                        <CarneForm
                            formData={formData}
                            handleInputChange={handleInputChange}
                            mode="edit"
                        />
                    )}
                    <SubmitButton loading={saving} isEdit={true} />
                </form>
            </div>
        </div>
    );
};
