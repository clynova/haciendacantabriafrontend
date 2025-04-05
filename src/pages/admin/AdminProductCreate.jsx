import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AceiteForm } from '../../components/admin/products/AceiteForm';
import { CarneForm } from '../../components/admin/products/CarneForm';
import { ProductHeader } from '../../components/admin/products/ProductHeader';
import { createProduct, getAllProducts } from '../../services/adminService'; // Add getAllProducts import
import { toast } from 'react-hot-toast';
import { uploadImageToCloudinary } from '../../services/utilService';
import { SubmitButton } from '../../components/common/SubmitButton';
import { ProductTypeSelector } from '../../components/admin/products/ProductTypeSelector';
import BaseProductForm from '../../components/admin/products/create/BaseProductForm';
import { TestingTools } from '../../components/admin/products/TestingTools';
// Cortes de carne según el modelo del backend
const CORTES_CARNE = [
    'LOMO_VETADO', 'LOMO_LISO', 'ASADO_DEL_CARNICERO', 'PALANCA',
    'POSTA_ROSADA', 'OSOBUCO_DE_MANO', 'GANSO', 'POSTA_DE_PALETA',
    'CHOCLILLO', 'PUNTA_PICANA', 'ASIENTO', 'ENTRAÑA',
    'ALETILLA', 'OSOBUCO_DE_PIERNA', 'FILETE', 'PUNTA_DE_PALETA',
    'POSTA_NEGRA', 'POLLO_DE_GANSO', 'TAPAPECHO', 'PLATEADA',
    'PUNTA_DE_GANSO', 'ABASTERO', 'TAPABARRIGA',
    'BIFE_ANCHO', 'BIFE_ANGOSTO', 'BIFE_DE_PALETA', 'BIFE_DE_VACIO',
    'BOLA_DE_LOMO', 'BRAZUELO', 'CARNAZA_DE_CUADRADA', 'CARNAZA_PALETA',
    'CHINGOLO', 'COGOTE', 'COLITA_DE_CUADRIL', 'CORAZON_DE_CUADRIL',
    'ENTRAÑA_FINA', 'FALDA_DESHUESADA', 'GARRON', 'HUACHALOMO',
    'LOMO', 'MARUCHA', 'NALGA_DE_ADENTRO', 'PECETO',
    'PECHO', 'SOBRECOSTILLA', 'TAPA_DE_BIFE_ANCHO', 'TAPA_DE_CUADRIL',
    'TORTUGUITA', 'VACIO',
    'MOLIDA_ESPECIAL', 'MOLIDA_CORRIENTE'
];
// Función para generar slug a partir de texto
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
    const [selectedCategoria, setSelectedCategoria] = useState('ACEITE');
    
    // Estado inicial para todos los tipos de productos
    const [formData, setFormData] = useState({
        // Campos base (comunes para todos los tipos)
        sku: '',
        nombre: '',
        tipoProducto: 'ProductoBase',
        categoria: 'ACCESORIO', // Por defecto
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
        precios: {
            base: '',
            descuentos: {
                regular: 0
            }
        },
        opcionesPeso: {
            esPesoVariable: true,
            pesoPromedio: '',
            pesoMinimo: '',
            pesoMaximo: '',
            pesosEstandar: [],
            rangosPreferidos: []
        },
        tags: [],
        // Campos específicos para aceite
        infoAceite: {
            tipo: 'OLIVA', // Valor inicial válido del enum TipoAceite
            envase: 'BOTELLA' // Valor inicial válido del enum TipoEnvase
        },
        caracteristicasAceite: {
            aditivos: [],
            filtracion: '',
            acidez: '',
            extraccion: ''
        },
        usosRecomendados: [], 
        // Campos específicos para carne
        infoCarne: {
            tipoCarne: 'VACUNO',
            corte: '',
            nombreArgentino: '',
            nombreChileno: ''
        },
        caracteristicas: {  // Cambiar caracteristicasCarne por caracteristicas
            porcentajeGrasa: '',
            marmoleo: '',
            color: '',
            textura: []
        },
        // Información nutricional común
        infoNutricional: {
            porcion: '',
            calorias: 0,         // Cambiar de '' a 0
            proteinas: 0,        // Cambiar de '' a 0
            grasaTotal: 0,       // Cambiar de '' a 0
            grasaSaturada: 0,    // Cambiar de '' a 0
            grasaTrans: 0,       // Cambiar de '' a 0
            grasaPoliinsaturada: 0, // Cambiar de '' a 0
            grasaMonoinsaturada: 0, // Cambiar de '' a 0
            colesterol: 0,       // Cambiar de '' a 0
            sodio: 0,            // Cambiar de '' a 0
            carbohidratos: 0     // Cambiar de '' a 0
        },
        produccion: {
            metodo: '',
            temperatura: '',
            fechaEnvasado: '',
            fechaVencimiento: ''
        },
        metadatos: {},  // Agregar esta línea
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
    });

    useEffect(() => {
        if (selectedType === 'ProductoAceite') {
            setFormData(prev => ({
                ...prev,
                infoAceite: {
                    tipo: '',
                    envase: ''
                },
                caracteristicasAceite: {
                    aditivos: [],
                    filtracion: '',
                    acidez: '',
                    extraccion: ''
                },
                // ...otros campos específicos de aceite
            }));
        }
    }, []); // Solo se ejecuta al montar el componente

    // Al inicio del componente, después de los estados
    useEffect(() => {
        // Sincronizar el tipo de producto y la categoría
        setFormData(prev => ({
            ...prev,
            tipoProducto: selectedType,
            categoria: selectedCategoria,
            infoAceite: selectedType === 'ProductoAceite' ? {
                tipo: 'OLIVA',
                envase: 'BOTELLA'
            } : undefined,
            caracteristicasAceite: selectedType === 'ProductoAceite' ? {
                aditivos: [],
                filtracion: '',
                acidez: '',
                extraccion: ''
            } : undefined
        }));
    }, [selectedType, selectedCategoria]);

    // Update the handleInputChange function to handle discounts correctly
    const handleInputChange = (e, section) => {
        const { name, value, type, checked } = e.target;
        
        setFormData(prev => {
            // Manejo especial para información nutricional
            if (section === 'infoNutricional') {
                const numericFields = [
                    'calorias', 'proteinas', 'grasaTotal', 'grasaSaturada',
                    'grasaTrans', 'grasaPoliinsaturada', 'grasaMonoinsaturada',
                    'colesterol', 'sodio', 'carbohidratos'
                ];
                
                return {
                    ...prev,
                    infoNutricional: {
                        ...prev.infoNutricional,
                        [name]: numericFields.includes(name) ? 
                            Number(value) || 0 : 
                            value
                    }
                };
            }
            
            // Handle special case for discounts
            if (section === 'precios' && name === 'regular') {
                const discountValue = Math.min(Math.max(Number(value) || 0, 0), 100); // Clamp between 0 and 100
                return {
                    ...prev,
                    precios: {
                        ...prev.precios,
                        descuentos: {
                            ...prev.precios.descuentos,
                            regular: discountValue
                        }
                    }
                };
            }

            // Handle direct array updates (like usosRecomendados)
            if (name === 'usosRecomendados') {
                return {
                    ...prev,
                    [name]: value // value is already an array here
                };
            }

            if (section === 'caracteristicasAceite' && name === 'acidez') {
                return {
                    ...prev,
                    caracteristicasAceite: {
                        ...prev.caracteristicasAceite,
                        acidez: Number(value) || 0
                    }
                };
            }

            // Handle other cases...
            if (section) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [name]: type === 'checkbox' ? checked : value
                    }
                };
            }

            return {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };
        });
    };

    // Manejador para cambio de tipo de producto
    const handleTypeChange = (e) => {
        const newType = e.target.value;
        const newCategoria = e.target.dataset?.categoria || 'ACEITE';
        
        setSelectedType(newType);
        setSelectedCategoria(newCategoria);
        
        setFormData(prev => {
            // Estado base común
            const baseState = {
                ...prev,
                tipoProducto: newType,
                categoria: newCategoria,
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
                usosRecomendados: []
            };

            // Agregar campos específicos según el tipo
            if (newType === 'ProductoAceite') {
                return {
                    ...baseState,
                    infoAceite: {
                        tipo: 'OLIVA',
                        envase: 'BOTELLA'
                    },
                    caracteristicasAceite: {
                        aditivos: [],
                        filtracion: '',
                        acidez: '',
                        extraccion: ''
                    },
                    infoNutricional: {
                        ...baseState.infoNutricional,
                        grasaTrans: '',
                        grasaPoliinsaturada: '',
                        grasaMonoinsaturada: ''
                    },
                    infoCarne: undefined,
                    caracteristicas: undefined
                };
            } else if (newType === 'ProductoCarne') {
                return {
                    ...baseState,
                    infoCarne: {
                        tipoCarne: 'VACUNO',
                        corte: '',
                        nombreArgentino: '',
                        nombreChileno: ''
                    },
                    caracteristicas: {
                        porcentajeGrasa: '',
                        marmoleo: '',
                        color: '',
                        textura: []
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
                    infoAceite: undefined,
                    caracteristicasAceite: undefined
                };
            }

            // Para tipos base (CONDIMENTO, ACCESORIO, OTRO)
            return {
                ...baseState,
                infoAceite: undefined,
                caracteristicasAceite: undefined,
                infoCarne: undefined,
                caracteristicas: undefined
            };
        });
    };

    // Manejador para subir imágenes
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);

        try {
            const uploadPromises = files.map(async (file) => {
                const cloudinaryUrl = await uploadImageToCloudinary(file);
                if (cloudinaryUrl) {
                    return {
                        url: cloudinaryUrl,
                        nombre: file.name,
                        tipo: file.type,
                        textoAlternativo: file.name, // Texto alt predeterminado
                        esPrincipal: false
                    };
                }
                throw new Error(`Error al subir ${file.name}`);
            });

            const uploadedImages = await Promise.all(uploadPromises);

            setFormData(prev => ({
                ...prev,
                multimedia: {
                    ...prev.multimedia,
                    imagenes: [
                        ...prev.multimedia.imagenes,
                        ...uploadedImages.map((img, idx) => ({
                            ...img,
                            esPrincipal: prev.multimedia.imagenes.length === 0 && idx === 0
                        }))
                    ]
                }
            }));

            toast.success(`${uploadedImages.length} imágenes subidas exitosamente`);
        } catch (error) {
            console.error('Error al procesar imágenes:', error);
            toast.error('Error al subir las imágenes');
        }
    };

    // Manejador para eliminar imágenes
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

    // Manejador para actualizar texto alternativo o imagen principal
    const handleUpdateAltText = (index, newAltText, setPrincipal = false) => {
        setFormData(prev => {
            const updatedImages = [...prev.multimedia.imagenes];

            if (setPrincipal) {
                // Actualizar imagen principal
                updatedImages.forEach((img, i) => {
                    img.esPrincipal = i === index;
                });
            } else {
                // Actualizar texto alternativo
                updatedImages[index] = {
                    ...updatedImages[index],
                    textoAlternativo: newAltText
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

    // Manejador para cambiar video
    const handleVideoChange = (e) => {
        setFormData(prev => ({
            ...prev,
            multimedia: {
                ...prev.multimedia,
                video: e.target.value
            }
        }));
    };
    // Manejador para cambiar tags
    const handleTagChange = (newTags) => {
        setFormData(prev => ({
            ...prev,
            tags: newTags
        }));
    };

    // Add the missing function to check if SKU exists
    const checkExistingSku = async (sku) => {
        try {
            const response = await getAllProducts(token, { sku });
            return response.products && response.products.some(product => 
                product.sku.toLowerCase() === sku.toLowerCase()
            );
        } catch (error) {
            console.error('Error al verificar SKU:', error);
            return false; // En caso de error, permitir continuar
        }
    };

    // Agregar validación de opcionesPeso
    const validateOpcionesPeso = (data) => {
        if (!data.opcionesPeso) return;
        
        data.opcionesPeso = {
            ...data.opcionesPeso,
            pesosEstandar: data.opcionesPeso.pesosEstandar.map(peso => ({
                ...peso,
                peso: Number(peso.peso),
                precio: Number(peso.precio),
                stockDisponible: Number(peso.stockDisponible),
                umbralStockBajo: Number(peso.umbralStockBajo)
            }))
        };
    };

    // Agregar estas validaciones en handleSubmit
    const validateProductData = (data) => {
        const errors = [];
        
        if (!data.infoAceite?.tipo) errors.push('El tipo de aceite es requerido');
        if (!data.caracteristicasAceite?.filtracion) errors.push('La filtración es requerida');
        if (!data.opcionesPeso?.pesosEstandar?.length) errors.push('Debe agregar al menos una opción de peso');
        
        return errors;
    };

    // Validación mejorada para envío de formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        let loadingToast;

        try {
            // Validaciones básicas
            const validationErrors = [];
            
            if (!formData.sku?.trim()) validationErrors.push('SKU es requerido');
            if (!formData.nombre?.trim()) validationErrors.push('Nombre es requerido');
            if (!formData.multimedia?.imagenes?.length) validationErrors.push('Al menos una imagen es requerida');
            if (!formData.opcionesPeso?.pesosEstandar?.length) validationErrors.push('Debe agregar al menos una opción de peso');

            // Verificar validaciones específicas por tipo
            if (selectedType === 'ProductoCarne' && !formData.infoCarne?.tipoCarne) {
                validationErrors.push('El tipo de carne es requerido');
            }

            if (validationErrors.length > 0) {
                validationErrors.forEach(error => toast.error(error));
                return;
            }

            setLoading(true);
            loadingToast = toast.loading('Creando producto...');

            // Preparar datos base
            let productData = {
                sku: formData.sku.trim(),
                nombre: formData.nombre.trim(),
                slug: generateSlug(formData.nombre),
                tipoProducto: selectedType,
                categoria: selectedCategoria,
                estado: Boolean(formData.estado),
                destacado: Boolean(formData.destacado),
                descripcion: {
                    corta: formData.descripcion.corta?.trim() || '',
                    completa: formData.descripcion.completa?.trim() || ''
                },
                multimedia: {
                    imagenes: formData.multimedia.imagenes,
                    video: formData.multimedia.video?.trim() || ''
                },
                seo: {
                    metaTitulo: formData.seo.metaTitulo?.trim() || '',
                    metaDescripcion: formData.seo.metaDescripcion?.trim() || '',
                    palabrasClave: formData.seo.palabrasClave || []
                },
                infoAdicional: {
                    origen: formData.infoAdicional.origen?.trim() || '',
                    marca: formData.infoAdicional.marca?.trim() || '',
                    certificaciones: formData.infoAdicional.certificaciones || []
                },
                conservacion: {
                    requiereRefrigeracion: Boolean(formData.conservacion.requiereRefrigeracion),
                    requiereCongelacion: Boolean(formData.conservacion.requiereCongelacion),
                    vidaUtil: formData.conservacion.vidaUtil?.trim() || '',
                    instrucciones: formData.conservacion.instrucciones?.trim() || ''
                },
                tags: formData.tags || [],
                opcionesPeso: {
                    esPesoVariable: Boolean(formData.opcionesPeso.esPesoVariable),
                    pesoPromedio: Number(formData.opcionesPeso.pesoPromedio) || null,
                    pesoMinimo: Number(formData.opcionesPeso.pesoMinimo) || null,
                    pesoMaximo: Number(formData.opcionesPeso.pesoMaximo) || null,
                    pesosEstandar: formData.opcionesPeso.pesosEstandar.map(peso => ({
                        peso: Number(peso.peso),
                        unidad: peso.unidad,
                        esPredeterminado: Boolean(peso.esPredeterminado),
                        precio: Number(peso.precio),
                        sku: peso.sku,
                        stockDisponible: Number(peso.stockDisponible),
                        umbralStockBajo: Number(peso.umbralStockBajo),
                        descuentos: {
                            regular: Number(peso.descuentos?.regular || 0)
                        },
                        ultimaActualizacion: new Date().toISOString()
                    })),
                    rangosPreferidos: formData.opcionesPeso.rangosPreferidos.map(rango => ({
                        nombre: rango.nombre,
                        pesoMinimo: Number(rango.pesoMinimo),
                        pesoMaximo: Number(rango.pesoMaximo),
                        descripcion: rango.descripcion,
                        esPredeterminado: Boolean(rango.esPredeterminado)
                    }))
                },
                infoNutricional: {
                    porcion: formData.infoNutricional.porcion?.trim() || '',
                    calorias: Number(formData.infoNutricional.calorias) || 0,
                    proteinas: Number(formData.infoNutricional.proteinas) || 0,
                    grasaTotal: Number(formData.infoNutricional.grasaTotal) || 0,
                    grasaSaturada: Number(formData.infoNutricional.grasaSaturada) || 0,
                    colesterol: Number(formData.infoNutricional.colesterol) || 0,
                    sodio: Number(formData.infoNutricional.sodio) || 0,
                    carbohidratos: Number(formData.infoNutricional.carbohidratos) || 0
                }
            };

            // Agregar campos específicos según el tipo de producto
            if (selectedType === 'ProductoAceite') {
                productData = {
                    ...productData,
                    infoAceite: {
                        tipo: formData.infoAceite.tipo,
                        envase: formData.infoAceite.envase
                    },
                    caracteristicas: {
                        aditivos: formData.caracteristicasAceite.aditivos || [],
                        filtracion: formData.caracteristicasAceite.filtracion || '',
                            acidez: Number(formData.caracteristicasAceite.acidez) || 0, // Asegurar conversión a número
                        extraccion: formData.caracteristicasAceite.extraccion || ''
                    },
                    usosRecomendados: formData.usosRecomendados || [], // Agregar esta línea
                    infoNutricional: {
                        ...productData.infoNutricional,
                        grasaTrans: Number(formData.infoNutricional.grasaTrans) || 0,
                        grasaPoliinsaturada: Number(formData.infoNutricional.grasaPoliinsaturada) || 0,
                        grasaMonoinsaturada: Number(formData.infoNutricional.grasaMonoinsaturada) || 0
                    },
                    // Agregar el campo produccion
                    produccion: {
                        metodo: formData.produccion?.metodo || '',
                        temperatura: formData.produccion?.temperatura || '',
                        fechaEnvasado: formData.produccion?.fechaEnvasado ? new Date(formData.produccion.fechaEnvasado).toISOString() : null,
                        fechaVencimiento: formData.produccion?.fechaVencimiento ? new Date(formData.produccion.fechaVencimiento).toISOString() : null
                    }
                };
            }

            if (selectedType === 'ProductoCarne') {
                if (!formData.infoCarne?.tipoCarne) {
                    validationErrors.push('El tipo de carne es requerido');
                }
                
                productData = {
                    ...productData,
                    infoCarne: {
                        tipoCarne: formData.infoCarne.tipoCarne,
                        corte: formData.infoCarne.corte,
                        nombreArgentino: formData.infoCarne.nombreArgentino,
                        nombreChileno: formData.infoCarne.nombreChileno
                    },
                    caracteristicas: {  // Usar caracteristicas en lugar de caracteristicasCarne
                        porcentajeGrasa: Number(formData.caracteristicas.porcentajeGrasa) || 0,
                        marmoleo: Number(formData.caracteristicas.marmoleo) || 0,
                        color: formData.caracteristicas.color || '',
                        textura: formData.caracteristicas.textura || []
                    },
                    // Agregar campo coccion
                    coccion: {
                        metodos: formData.coccion?.metodos || [],
                        temperaturaIdeal: formData.coccion?.temperaturaIdeal || '',
                        tiempoEstimado: formData.coccion?.tiempoEstimado || '',
                        consejos: formData.coccion?.consejos || [],
                        recetas: formData.coccion?.recetas || []
                    },
                    // Agregar campo empaque
                    empaque: {
                        tipo: formData.empaque?.tipo || 'VACIO',
                        unidadesPorCaja: Number(formData.empaque?.unidadesPorCaja) || 0,
                        pesoCaja: Number(formData.empaque?.pesoCaja) || 0
                    },
                    origen: {
                        pais: formData.origen?.pais || '',
                        region: formData.origen?.region || '',
                        productor: formData.origen?.productor || '',
                        raza: formData.origen?.raza || '',
                        maduracion: formData.origen?.maduracion || ''
                    },
                    procesamiento: {
                        fechaFaenado: formData.procesamiento?.fechaFaenado ? new Date(formData.procesamiento.fechaFaenado).toISOString() : null,
                        fechaEnvasado: formData.procesamiento?.fechaEnvasado ? new Date(formData.procesamiento.fechaEnvasado).toISOString() : null,
                        fechaVencimiento: formData.procesamiento?.fechaVencimiento ? new Date(formData.procesamiento.fechaVencimiento).toISOString() : null,
                        numeroLote: formData.procesamiento?.numeroLote || ''
                    }
                };
            }

            console.log('Datos a enviar:', JSON.stringify(productData, null, 2));
            const response = await createProduct(token, productData);
            
            toast.dismiss(loadingToast);
            toast.success('Producto creado exitosamente');
            navigate('/admin/products');

        } catch (error) {
            console.error('Error al crear producto:', error);
            toast.dismiss(loadingToast);
            toast.error(error.response?.data?.message || 'Error al crear el producto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <ProductHeader onBack={() => navigate('/admin/products')} />
                
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-6 space-y-6">
                        <ProductTypeSelector
                            selectedType={selectedType}
                            selectedCategoria={selectedCategoria}
                            onChange={handleTypeChange}
                        />

                        {/* Formulario base siempre visible */}
                        <BaseProductForm
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleImageUpload={handleImageUpload}
                            handleImageDelete={handleImageDelete}
                            handleUpdateAltText={handleUpdateAltText}
                            handleVideoChange={handleVideoChange}
                            handleTagChange={handleTagChange}
                        />

                        {/* Formularios específicos solo para Aceite y Carne */}
                        {selectedType === 'ProductoAceite' && (
                            <AceiteForm
                                formData={formData}
                                handleInputChange={handleInputChange}
                            />
                        )}

                        {selectedType === 'ProductoCarne' && (
                            <CarneForm
                                formData={formData}
                                handleInputChange={handleInputChange}
                                cortesCarne={CORTES_CARNE}
                            />
                        )}

                        <SubmitButton loading={loading} />
                        
                    </div>
                </form>
            </div>
            <TestingTools onTestDataFill={(testData) => setFormData(prev => ({
            ...prev,
            ...testData
        }))} />
        </div>
    );
};

export { AdminProductCreate };