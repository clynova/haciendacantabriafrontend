import { useState } from 'react';
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
// import { TestingTools } from '../../components/admin/products/TestingTools';
import BaseProductForm from '../../components/admin/products/create/BaseProductForm';

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

// Categorías de productos según el modelo del backend
const PRODUCT_CATEGORIES = ['CARNE', 'ACEITE', 'CONDIMENTO', 'ACCESORIO', 'OTRO'];

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
        sku: '',
        nombre: '',
        tipoProducto: 'ProductoAceite',
        categoria: 'ACEITE',
        estado: true,
        destacado: false,
        descripcion: {
            corta: '',
            completa: ''
        },
        precios: {
            base: '',
            descuentos: {
                regular: 0
            }
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
        tags: [],
        // Para aceite
        infoAceite: {
            tipo: 'OLIVA',
            volumen: '',
            envase: 'BOTELLA'
        },
        caracteristicasAceite: {
            aditivos: [],
            filtracion: '',
            acidez: '',
            extraccion: ''
        },
        // Para carne
        infoCarne: {
            tipoCarne: 'VACUNO',
            corte: 'LOMO_VETADO',
            nombreArgentino: '',
            nombreChileno: ''
        },
        caracteristicasCarne: {
            porcentajeGrasa: '',
            marmoleo: 1,
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
        opcionesPeso: {
            esPesoVariable: true,
            pesoPromedio: '',
            pesoMinimo: '',
            pesoMaximo: '',
            pesosEstandar: [],
            rangosPreferidos: []
        },
        // Para información nutricional (todos los productos)
        infoNutricional: {
            porcion: '',
            calorias: 0, // Changed from '' to 0
            proteinas: 0, // Changed from '' to 0
            grasaTotal: 0, // Changed from '' to 0
            grasaSaturada: 0, // Changed from '' to 0
            colesterol: 0, // Changed from '' to 0
            sodio: 0, // Changed from '' to 0
            carbohidratos: 0, // Changed from '' to 0
            grasaTrans: 0, // Changed from '' to 0
            grasaPoliinsaturada: 0, // Changed from '' to 0
            grasaMonoinsaturada: 0 // Changed from '' to 0
        },
        // Campos adicionales para productos genéricos
        tipoCondimento: '',
        contenidoNeto: '',
        tipoAccesorio: '',
        material: '',
        dimensiones: '',
        descripcionEspecial: '',
        // Campos para aceite
        produccion: {
            metodo: '',
            temperatura: '',
            fechaEnvasado: '',
            fechaVencimiento: ''
        },
        // Campos para carne
        empaque: {
            tipo: 'VACIO',
            unidadesPorCaja: '',
            pesoCaja: ''
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
        },
        // Campo para inventario
        inventario: {
            stockUnidades: '',
            umbralStockBajo: ''
        }
    });

    // Update handleInputChange function
    const handleInputChange = (e, section, subsection) => {
        if (typeof e === 'object' && e.target) {
            const { name, value, type, checked } = e.target;
            
            setFormData(prev => {
                // Handle direct (top-level) fields
                if (!section) {
                    return {
                        ...prev,
                        [name]: type === 'checkbox' ? checked : value
                    };
                }

                // Handle numeric inputs for infoNutricional
                if (section === 'infoNutricional' && type === 'number') {
                    return {
                        ...prev,
                        [section]: {
                            ...prev[section],
                            [name]: value === '' ? 0 : Number(value)
                        }
                    };
                }

                // Handle nested fields
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [name]: type === 'checkbox' ? checked : value
                    }
                };
            });
        } else {
            // Handle direct value updates
            setFormData(prev => ({
                ...prev,
                [section]: subsection ? {
                    ...prev[section],
                    [subsection]: e
                } : e
            }));
        }
    };

    // Manejador para cambio de tipo de producto
    const handleTypeChange = (e) => {
        const newType = e.target.value;
        const newCategoria = e.target.dataset?.categoria || 'ACEITE';
        
        setSelectedType(newType);
        setSelectedCategoria(newCategoria);
        
        setFormData(prev => ({
            ...prev,
            tipoProducto: newType,
            categoria: newCategoria
        }));
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

    // Manejador para cargar datos de prueba
    // const handleTestDataFill = (testData) => {
    //     console.log('Recibiendo datos de prueba:', testData);
        
    //     // Actualizar el tipo y categoría según los datos de prueba
    //     if (testData.tipoProducto) {
    //         setSelectedType(testData.tipoProducto);
    //     }
        
    //     if (testData.categoria) {
    //         setSelectedCategoria(testData.categoria);
    //     }
        
    //     setFormData(prev => {
    //         const updatedForm = {
    //             ...prev,
    //             ...testData,
    //             estado: true,
    //             destacado: false,
    //             conservacion: {
    //                 ...prev.conservacion,
    //                 ...testData.conservacion,
    //                 requiereRefrigeracion: Boolean(testData.conservacion?.requiereRefrigeracion),
    //                 requiereCongelacion: Boolean(testData.conservacion?.requiereCongelacion)
    //             },
    //             opcionesPeso: {
    //                 ...prev.opcionesPeso,
    //                 ...testData.opcionesPeso,
    //                 esPesoVariable: Boolean(testData.opcionesPeso?.esPesoVariable)
    //             }
    //         };
    //         console.log('Formulario actualizado:', updatedForm);
    //         return updatedForm;
    //     });
    // };

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

    // Fix the submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Define the loadingToast variable here
        let loadingToast;

        try {
            setLoading(true);
            loadingToast = toast.loading('Creando producto...'); // Define it here

            // Validar campos obligatorios
            if (!formData.sku || !formData.nombre) {
                toast.dismiss(loadingToast);
                toast.error('SKU y Nombre son campos obligatorios');
                setLoading(false);
                return;
            }

            // Verificar si el SKU ya existe
            const skuExists = await checkExistingSku(formData.sku);
            if (skuExists) {
                toast.dismiss(loadingToast);
                toast.error(`Ya existe un producto con el SKU: "${formData.sku}". Utilice un valor único.`);
                setLoading(false);
                return;
            }

            // Validar el corte de carne si es un producto de carne
            if (selectedType === 'ProductoCarne' && !CORTES_CARNE.includes(formData.infoCarne.corte)) {
                toast.dismiss(loadingToast);
                toast.error('El corte seleccionado no es válido');
                setLoading(false);
                return;
            }

            // Generar slug único con timestamp
            const slug = generateSlug(formData.nombre) + '-' + Date.now();

            // Preparar datos base
            const baseData = {
                sku: formData.sku,
                nombre: formData.nombre,
                slug,
                categoria: selectedCategoria,
                estado: Boolean(formData.estado),
                destacado: Boolean(formData.destacado),
                descripcion: formData.descripcion,
                precios: {
                    ...formData.precios,
                    base: Number(formData.precios.base) || 0,
                    descuentos: {
                        regular: Number(formData.precios.descuentos.regular) / 100 || 0
                    }
                },
                multimedia: formData.multimedia,
                seo: {
                    ...formData.seo,
                    slug
                },
                infoAdicional: formData.infoAdicional,
                conservacion: {
                    ...formData.conservacion,
                    requiereRefrigeracion: Boolean(formData.conservacion.requiereRefrigeracion),
                    requiereCongelacion: Boolean(formData.conservacion.requiereCongelacion)
                },
                inventario: {
                    ...formData.inventario,
                    stockUnidades: Number(formData.inventario.stockUnidades) || 0,
                    umbralStockBajo: Number(formData.inventario.umbralStockBajo) || 5
                },
                tags: formData.tags || []
            };

            // Preparar datos específicos según el tipo de producto
            let specificData = {};
            
            if (selectedType === 'ProductoAceite') {
                specificData = {
                    tipoProducto: 'ProductoAceite',
                    infoAceite: {
                        ...formData.infoAceite,
                        volumen: Number(formData.infoAceite.volumen) || 0
                    },
                    caracteristicas: formData.caracteristicasAceite,
                    produccion: formData.produccion,
                    infoNutricional: {
                        ...formData.infoNutricional,
                        calorias: Number(formData.infoNutricional.calorias) || 0,
                        grasaTotal: Number(formData.infoNutricional.grasaTotal) || 0,
                        grasaSaturada: Number(formData.infoNutricional.grasaSaturada) || 0,
                        grasaTrans: formData.infoNutricional.grasaTrans || '',
                        grasaPoliinsaturada: formData.infoNutricional.grasaPoliinsaturada || '',
                        grasaMonoinsaturada: formData.infoNutricional.grasaMonoinsaturada || ''
                    }
                };
            } else if (selectedType === 'ProductoCarne') {
                specificData = {
                    tipoProducto: 'ProductoCarne',
                    infoCarne: formData.infoCarne,
                    caracteristicas: formData.caracteristicasCarne,
                    coccion: {
                        ...formData.coccion,
                        metodos: Array.isArray(formData.coccion.metodos) ? formData.coccion.metodos : []
                    },
                    opcionesPeso: {
                        ...formData.opcionesPeso,
                        esPesoVariable: Boolean(formData.opcionesPeso.esPesoVariable),
                        pesoPromedio: Number(formData.opcionesPeso.pesoPromedio) || null,
                        pesoMinimo: Number(formData.opcionesPeso.pesoMinimo) || null,
                        pesoMaximo: Number(formData.opcionesPeso.pesoMaximo) || null
                    },
                    empaque: formData.empaque,
                    origen: formData.origen,
                    procesamiento: formData.procesamiento,
                    infoNutricional: {
                        ...formData.infoNutricional,
                        calorias: Number(formData.infoNutricional.calorias) || 0,
                        proteinas: Number(formData.infoNutricional.proteinas) || 0,
                        grasaTotal: Number(formData.infoNutricional.grasaTotal) || 0,
                        grasaSaturada: Number(formData.infoNutricional.grasaSaturada) || 0,
                        colesterol: Number(formData.infoNutricional.colesterol) || 0,
                        sodio: Number(formData.infoNutricional.sodio) || 0,
                        carbohidratos: Number(formData.infoNutricional.carbohidratos) || 0
                    }
                };
            } else {
                // Para otros tipos de productos (CONDIMENTO, ACCESORIO, OTRO)
                specificData = {
                    tipoProducto: 'ProductoBase',
                    // Incluir información específica según la categoría
                    infoEspecifica: {
                        categoria: selectedCategoria,
                        // Para condimentos
                        ...(selectedCategoria === 'CONDIMENTO' && {
                            tipoCondimento: formData.tipoCondimento || '',
                            contenidoNeto: Number(formData.contenidoNeto) || 0
                        }),
                        // Para accesorios
                        ...(selectedCategoria === 'ACCESORIO' && {
                            tipoAccesorio: formData.tipoAccesorio || '',
                            material: formData.material || '',
                            dimensiones: formData.dimensiones || ''
                        }),
                        // Para otros productos
                        ...(selectedCategoria === 'OTRO' && {
                            descripcionEspecial: formData.descripcionEspecial || ''
                        })
                    },
                    infoNutricional: {
                        ...formData.infoNutricional,
                        calorias: Number(formData.infoNutricional.calorias) || 0,
                        proteinas: Number(formData.infoNutricional.proteinas) || 0,
                        grasaTotal: Number(formData.infoNutricional.grasaTotal) || 0,
                        grasaSaturada: Number(formData.infoNutricional.grasaSaturada) || 0,
                        colesterol: Number(formData.infoNutricional.colesterol) || 0,
                        sodio: Number(formData.infoNutricional.sodio) || 0,
                        carbohidratos: Number(formData.infoNutricional.carbohidratos) || 0
                    }
                };
            }

            // Combinar datos
            const dataToSend = {
                ...baseData,
                ...specificData
            };

            // Eliminar campos duplicados y temporales
            delete dataToSend.caracteristicasAceite;
            delete dataToSend.caracteristicasCarne;
            delete dataToSend.tipoCondimento;
            delete dataToSend.contenidoNeto;
            delete dataToSend.tipoAccesorio;
            delete dataToSend.material;
            delete dataToSend.dimensiones;
            delete dataToSend.descripcionEspecial;

            console.log('Enviando datos al servidor:', dataToSend);
            
            // Enviar datos al servidor
            const response = await createProduct(dataToSend, token);
            
            // Manejar respuesta exitosa
            toast.dismiss(loadingToast);
            toast.success('Producto creado exitosamente');
            console.log('Respuesta del servidor:', response);
            
            navigate('/admin/products');
            
        } catch (error) {
            console.error('Error al crear producto:', error);
            if (loadingToast) toast.dismiss(loadingToast); // Check if defined before dismissing
            setLoading(false);
            
            // Manejar errores de duplicación de forma más completa
            if (error.response?.data?.error?.type === "DuplicateKeyError") {
                // Formato de error específico con tipo
                const field = error.response.data.error.field;
                const value = error.response.data.error.value;
                
                const fieldNames = {
                    sku: 'SKU',
                    nombre: 'Nombre',
                    slug: 'URL amigable',
                };
                
                const fieldName = fieldNames[field] || field;
                toast.error(`Ya existe un producto con ${fieldName}: "${value}". Utilice un valor único.`);
            } 
            else if (error.code === 11000 || error.response?.data?.code === 11000) {
                // MongoDB duplicate key error code
                const errorData = error.response?.data || error;
                const keyPattern = errorData.keyPattern || {};
                const field = Object.keys(keyPattern)[0] || 'campo';
                
                const fieldNames = {
                    sku: 'SKU',
                    nombre: 'Nombre',
                    slug: 'URL amigable'
                };
                
                const fieldName = fieldNames[field] || field;
                toast.error(`Ya existe un producto con el mismo ${fieldName}. Utilice un valor único.`);
            }
            else if (error.response?.status === 400) {
                // A veces el backend envía un mensaje específico para duplicados
                const errorMsg = error.response.data?.msg || '';
                if (errorMsg.includes('Ya existe un producto con ese SKU') || 
                    errorMsg.includes('Ya existe un producto con ese slug') ||
                    errorMsg.includes('existe un producto con el mismo valor') ||
                    errorMsg.includes('duplicate key')) {
                    toast.error(errorMsg);
                } else {
                    toast.error(errorMsg || 'Error al crear el producto. Verifica los datos e intenta nuevamente.');
                }
            } 
            else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } 
            else {
                toast.error('Error al crear el producto. Verifica los datos e intenta nuevamente.');
            }
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <ProductHeader onBack={() => navigate('/admin/products')} />

                <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-6 space-y-6">
                        <ProductTypeSelector
                            selectedType={selectedType}
                            selectedCategoria={selectedCategoria}
                            onChange={handleTypeChange}
                        />

                        {/* Componente base para todos los campos comunes */}
                        <BaseProductForm
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleImageUpload={handleImageUpload}
                            handleImageDelete={handleImageDelete}
                            handleUpdateAltText={handleUpdateAltText}
                            handleVideoChange={handleVideoChange}
                            handleTagChange={handleTagChange}
                        />

                        {/* Formularios específicos basados en el tipo de producto */}
                        {selectedType === 'ProductoAceite' && (
                            <AceiteForm
                                formData={{
                                    ...formData,
                                    caracteristicas: formData.caracteristicasAceite
                                }}
                                handleInputChange={handleInputChange}
                            />
                        )}

                        {selectedType === 'ProductoCarne' && (
                            <CarneForm
                                formData={{
                                    ...formData,
                                    caracteristicas: formData.caracteristicasCarne
                                }}
                                handleInputChange={handleInputChange}
                                cortesCarne={CORTES_CARNE}
                            />
                        )}
                        <SubmitButton loading={loading} />
                    </div>
                </form>
            </div>
            {/* <TestingTools 
                onTestDataFill={handleTestDataFill} 
                selectedType={selectedType}
                selectedCategoria={selectedCategoria}
            /> */}
        </div>
    );
};

export { AdminProductCreate };