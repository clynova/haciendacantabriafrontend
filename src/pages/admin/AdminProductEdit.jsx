import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiArrowLeft, HiSave } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { getProductById, updateProduct } from '../../services/adminService';
import { uploadImageToCloudinary } from '../../services/utilService';

// Components
import { BasicInfoSection } from '../../components/admin/AdminProductEdit/BasicInfoSection';
import { PricingSection } from '../../components/admin/AdminProductEdit/PricingSection';
import { ProductTypeSection } from '../../components/admin/AdminProductEdit/ProductTypeSection';
import { InventorySection } from '../../components/admin/AdminProductEdit/InventorySection';
import { ConservationSection } from '../../components/admin/AdminProductEdit/ConservationSection';
import { ImageSection } from '../../components/admin/AdminProductEdit/ImageSection';
import { SEOSection } from '../../components/admin/AdminProductEdit/SEOSection';
import { DescriptionSection } from '../../components/admin/AdminProductEdit/DescriptionSection';

const DEFAULT_FORM_DATA = {
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
    estado: 'ACTIVO',
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
};

export const AdminProductEdit = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

    useEffect(() => {
        if (productId !== 'create') {
            fetchProductDetails();
        } else {
            setLoading(false);
        }
    }, [productId]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            console.log('Fetching product:', productId);
            const response = await getProductById(productId, token);
            
            if (response.success) {
                console.log('Product data:', response.product);
                setFormData(response.product);
            } else {
                toast.error('Error al cargar los datos del producto');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Error al cargar los datos del producto');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (files) => {
        try {
            console.group('📤 Image Upload Process');
            console.log('Files to upload:', files);

            const uploadPromises = Array.from(files).map(file => uploadImageToCloudinary(file));
            const uploadedUrls = await Promise.all(uploadPromises);
            
            console.log('📥 Uploaded URLs:', uploadedUrls);

            // Filter out any failed uploads
            const validUrls = uploadedUrls.filter(url => url);

            setFormData(prev => ({
                ...prev,
                multimedia: {
                    imagenes: [...(prev.multimedia?.imagenes || []), ...validUrls]
                }
            }));

            toast.success('Imágenes subidas correctamente');
        } catch (error) {
            console.error('❌ Error uploading images:', error);
            toast.error('Error al subir las imágenes');
        } finally {
            console.groupEnd();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setSaving(true);
            console.group('💾 Form Submission');
            
            const cleanedData = {
                codigo: formData.codigo?.trim(),
                sku: formData.sku?.trim(),
                nombre: formData.nombre?.trim(),
                categoria: formData.categoria,
                tipoProducto: formData.tipoProducto,
                estado: Boolean(formData.estado),
                destacado: Boolean(formData.destacado),
                descripcion: {
                    corta: formData.descripcion?.corta?.trim() || '',
                    completa: formData.descripcion?.completa?.trim() || ''
                },
                precios: {
                    base: Number(formData.precios?.base) || 0,
                    descuentos: {
                        promocion: {
                            porcentaje: Number(formData.precios?.descuentos?.promocion?.porcentaje) || 0,
                            activa: Boolean(formData.precios?.descuentos?.promocion?.activa)
                        },
                        regular: Number(formData.precios?.descuentos?.regular) || 0,
                        transferencia: Number(formData.precios?.descuentos?.transferencia) || 0
                    }
                },
                multimedia: {
                    imagenes: formData.multimedia?.imagenes?.map(img => 
                        typeof img === 'string' ? { url: img } : { url: img.url }
                    ) || []
                },
                seo: {
                    metaTitulo: formData.seo?.metaTitulo?.trim() || '',
                    metaDescripcion: formData.seo?.metaDescripcion?.trim() || '',
                    palabrasClave: formData.seo?.palabrasClave || []
                },
                infoAdicional: {
                    origen: formData.infoAdicional?.origen || '',
                    marca: formData.infoAdicional?.marca || '',
                    certificaciones: formData.infoAdicional?.certificaciones || []
                },
                conservacion: {
                    requiereRefrigeracion: Boolean(formData.conservacion?.requiereRefrigeracion),
                    requiereCongelacion: Boolean(formData.conservacion?.requiereCongelacion),
                    vidaUtil: formData.conservacion?.vidaUtil?.trim() || '',
                    instrucciones: formData.conservacion?.instrucciones?.trim() || ''
                },
                relacionados: {
                    productosSimilares: formData.relacionados?.productosSimilares || [],
                    productosComplementarios: formData.relacionados?.productosComplementarios || [],
                    compradosJuntos: formData.relacionados?.compradosJuntos || []
                },
                tags: formData.tags || [],
                usosRecomendados: formData.usosRecomendados || [],
                opcionesVolumen: formData.opcionesVolumen || []
            };

            // Add category-specific fields
            if (formData.categoria === 'CARNE') {
                cleanedData.inventario = {
                    stockKg: Number(formData.inventario?.stockKg) || 0,
                    stockUnidades: Number(formData.inventario?.stockUnidades) || 0,
                    umbralStockBajo: Number(formData.inventario?.umbralStockBajo) || 0,
                    ultimaActualizacion: new Date().toISOString()
                };
                cleanedData.infoCarne = {
                    tipoCarne: formData.infoCarne?.tipoCarne || 'VACUNO',
                    corte: formData.infoCarne?.corte || 'BIFE_ANGOSTO',
                    nombreArgentino: formData.infoCarne?.nombreArgentino || '',
                    nombreChileno: formData.infoCarne?.nombreChileno || '',
                    precioPorKg: Number(formData.infoCarne?.precioPorKg) || 0
                };
                cleanedData.caracteristicas = {
                    textura: formData.caracteristicas?.textura || []
                };
                cleanedData.coccion = {
                    metodos: formData.coccion?.metodos || [],
                    temperaturaIdeal: formData.coccion?.temperaturaIdeal || '',
                    tiempoEstimado: formData.coccion?.tiempoEstimado || '',
                    consejos: formData.coccion?.consejos || [],
                    recetas: formData.coccion?.recetas || []
                };
                cleanedData.opcionesPeso = {
                    esPesoVariable: Boolean(formData.opcionesPeso?.esPesoVariable),
                    pesosEstandar: formData.opcionesPeso?.pesosEstandar || [],
                    rangosPreferidos: formData.opcionesPeso?.rangosPreferidos || []
                };
                cleanedData.empaque = {
                    tipo: formData.empaque?.tipo || 'VACIO'
                };
            } else {
                cleanedData.inventario = {
                    stockUnidades: Number(formData.inventario?.stockUnidades) || 0,
                    umbralStockBajo: Number(formData.inventario?.umbralStockBajo) || 0,
                    ultimaActualizacion: new Date().toISOString()
                };
                cleanedData.infoAceite = {
                    tipo: formData.infoAceite?.tipo || 'OLIVA',
                    volumen: Number(formData.infoAceite?.volumen) || 0,
                    envase: formData.infoAceite?.envase || 'BOTELLA'
                };
                cleanedData.caracteristicas = {
                    aditivos: [],
                    filtracion: '',
                    acidez: '',
                    extraccion: ''
                };
            }

            console.log('Data to be sent:', cleanedData);

            const response = await updateProduct(productId, cleanedData, token);
            
            if (response.success) {
                toast.success('Producto actualizado exitosamente');
                navigate(`/admin/products/${productId}`);
            } else {
                throw new Error(response.msg || 'Error al actualizar el producto');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.msg || error.message || 'Error al actualizar el producto');
        } finally {
            setSaving(false);
            console.groupEnd();
        }
    };

    const handleInputChange = (section, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: value
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
        );
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
                    <h1 className="text-2xl font-bold text-white">
                        {productId === 'create' ? 'Crear Producto' : 'Editar Producto'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <BasicInfoSection 
                        data={formData} 
                        onChange={handleInputChange} 
                    />
                    
                    <ProductTypeSection 
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
                        onUpload={handleImageUpload}
                    />
                    
                    <SEOSection 
                        data={formData} 
                        onChange={handleInputChange} 
                    />
                    
                    <DescriptionSection 
                        data={formData} 
                        onChange={handleInputChange} 
                    />

                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                            <HiSave className="h-5 w-5" />
                            <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};