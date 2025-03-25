import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BasicInfoSection } from '../../components/admin/products/BasicInfoSection';
import { AceiteForm } from '../../components/admin/products/AceiteForm';
import { CarneForm } from '../../components/admin/products/CarneForm';
import { ImageUploader } from '../../components/admin/products/ImageUploader';
import { ProductHeader } from '../../components/admin/products/ProductHeader';
import { createProduct } from '../../services/adminService';
import { toast } from 'react-hot-toast';
import { uploadImageToCloudinary } from '../../services/utilService';
import { SubmitButton } from '../../components/common/SubmitButton';
import { ProductTypeSelector } from '../../components/admin/products/ProductTypeSelector';
import { NutritionalInfoSection } from '../../components/admin/products/NutritionalInfoSection';
import { ConservationSection } from '../../components/admin/products/ConservationSection';
import { PricingAndInventorySection } from '../../components/admin/products/PricingAndInventorySection';
import { SeoSection } from '../../components/admin/products/SeoSection';
import { AdditionalInfoSection } from '../../components/admin/products/AdditionalInfoSection';
import { TestingTools } from '../../components/admin/products/TestingTools';

// Update the CORTES_CARNE constant to match backend enum values
const CORTES_CARNE = [
    'LOMO_VETADO',    // Replace ASADO
    'LOMO_LISO',      // Replace BIFE
    'PUNTA_PALETA',   // Replace LOMO
    'TAPAPECHO',      // Replace COSTILLA
    'PLATEADA',       // Replace POSTA
    'ABASTERO',       // Replace OSOBUCO
    'ASIENTO',
    'POLLO',
    'PUNTA_GANSO',
    'PALANCA',
    'HUACHALOMO',
    'POSTA_NEGRA',
    'POSTA_ROSADA',
    'SOBRECOSTILLA',
    'CHOCLILLO',
    'TAPABARRIGA',
    'ENTRANHA',
    'MALAYA',
    'PICANA'
];

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

// First, update the getDuplicateFieldMessage function to better handle MongoDB errors
const getDuplicateFieldMessage = (error) => {
    let field, value;

    // Check for MongoDB duplicate key error pattern
    if (error.keyPattern || error.error?.keyPattern) {
        const keyPattern = error.keyPattern || error.error.keyPattern;
        const keyValue = error.keyValue || error.error.keyValue;
        field = Object.keys(keyPattern)[0];
        value = keyValue[field];
    } else if (typeof error === 'string') {
        // Try to parse error message
        const matches = error.match(/duplicate key error.*\{ (\w+): "([^"]+)" \}/);
        if (matches) {
            field = matches[1];
            value = matches[2];
        }
    }

    // Map technical field names to user-friendly Spanish names
    const fieldMap = {
        codigo: 'código',
        sku: 'SKU',
        nombre: 'nombre',
        slug: 'URL amigable'
    };

    return {
        field: fieldMap[field] || field,
        value: value
    };
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
        estado: true,
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
            umbralStockBajo: '',
            stockKg: ''  // Add this required field
        },
        infoCarne: {
            tipoCarne: 'VACUNO',
            corte: 'LOMO_VETADO',  // Use a valid enum value from CORTES_CARNE
            nombreArgentino: '',
            nombreChileno: '',
            precioPorKg: ''
        },
        caracteristicasCarne: {
            color: '',
            textura: [],
            porcentajeGrasa: '',
            marmoleo: 1,
        },
        infoNutricional: {
            porcion: '',
            calorias: '',
            proteinas: '',
            grasaTotal: '',
            grasaSaturada: '',
            colesterol: '',
            sodio: '',
            carbohidratos: '',
            grasaTrans: '',
            grasaPoliinsaturada: '',
            grasaMonoinsaturada: ''
        },
        coccion: {
            metodos: [],
            temperaturaIdeal: '',
            tiempoEstimado: '',
            consejos: [],
            recetas: []
        },
        produccion: {
            metodo: '',
            temperatura: '',
            fechaEnvasado: '',
            fechaVencimiento: ''
        },
        peso: {
            esPesoVariable: false,
            pesoPromedio: '',
            pesoMinimo: '',
            pesoMaximo: ''
        },
        empaque: {
            tipo: '',
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

    // Update the handleImageUpload function
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
                        textoAlternativo: file.name, // Default alt text
                        esPrincipal: false
                    };
                }
                throw new Error(`Failed to upload ${file.name}`);
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
            console.error('Error processing images:', error);
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

    // Add new handlers
    const handleUpdateAltText = (index, newAltText, setPrincipal = false) => {
        setFormData(prev => {
            const updatedImages = [...prev.multimedia.imagenes];

            if (setPrincipal) {
                // Update principal image
                updatedImages.forEach((img, i) => {
                    img.esPrincipal = i === index;
                });
            } else {
                // Update alt text
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

    const handleVideoChange = (e) => {
        setFormData(prev => ({
            ...prev,
            multimedia: {
                ...prev.multimedia,
                video: e.target.value
            }
        }));
    };

    // Add inside the AdminProductCreate component, before the return statement
    const handleTestDataFill = (testData) => {
        setFormData(prev => ({
            ...prev,
            ...testData,
            estado: true, // Ensure boolean value
            destacado: false, // Ensure boolean value
            conservacion: {
                ...prev.conservacion,
                ...testData.conservacion,
                requiereRefrigeracion: Boolean(testData.conservacion?.requiereRefrigeracion),
                requiereCongelacion: Boolean(testData.conservacion?.requiereCongelacion)
            },
            peso: {
                ...prev.peso,
                ...testData.peso,
                esPesoVariable: Boolean(testData.peso?.esPesoVariable)
            }
        }));
    };

    // Add validation before submitting
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const loadingToast = toast.loading('Creando producto...');

            // Validate meat cut if it's a meat product
            if (selectedType === 'ProductoCarne' && !CORTES_CARNE.includes(formData.infoCarne.corte)) {
                toast.error('El corte seleccionado no es válido');
                setLoading(false);
                return;
            }

            // Generate slug from nombre if it doesn't exist
            const slug = generateSlug(formData.nombre);

            // Transform data before sending
            const dataToSend = {
                ...formData,
                slug, // Add the generated slug
                estado: Boolean(formData.estado),
                precios: {
                    ...formData.precios,
                    base: Number(formData.precios.base) || 0,
                    descuentos: {
                        regular: Number(formData.precios.descuentos.regular) / 100 || 0,
                        transferencia: Number(formData.precios.descuentos.transferencia) / 100 || 0
                    }
                },
                // Add any other necessary transformations...
            };

            const response = await createProduct(dataToSend, token);

            toast.dismiss(loadingToast);

            if (response.success) {
                toast.success('Producto creado exitosamente');
                navigate('/admin/products');
            } else {
                // Handle validation errors
                if (response.error?.errores?.length > 0) {
                    toast.custom((t) => (
                        <div className="bg-slate-800 text-white px-6 py-4 rounded-lg shadow-lg max-w-lg">
                            <div className="flex items-center mb-3">
                                <svg className="w-6 h-6 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="font-semibold text-lg">Errores de validación</h3>
                            </div>
                            <ul className="list-disc pl-5 space-y-1">
                                {response.error.errores.map((err, index) => (
                                    <li key={index} className="text-sm">
                                        <span className="font-medium">
                                            {err.campo === 'slug' ? 'URL amigable' : err.campo}:
                                        </span>{' '}
                                        {err.mensaje}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="mt-4 text-sm text-slate-400 hover:text-white"
                            >
                                Cerrar
                            </button>
                        </div>
                    ), {
                        duration: 8000,
                        position: 'top-center',
                    });
                } else if (response.code === 11000 || response.error?.code === 11000) {
                    const { field, value } = getDuplicateFieldMessage(response.error || response);

                    toast.custom((t) => (
                        <div className="bg-slate-800 text-white px-6 py-4 rounded-lg shadow-lg">
                            <div className="flex items-center mb-3">
                                <svg className="w-6 h-6 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="font-semibold text-lg">Producto Duplicado</h3>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm">
                                    Ya existe un producto con el {field}:
                                    <span className="font-bold ml-1 text-yellow-400">{value}</span>
                                </p>
                                <p className="text-sm text-gray-300">
                                    Por favor, utiliza un {field} diferente para este producto.
                                </p>
                                {field === 'SKU' && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Tip: El SKU debe ser único para cada producto.
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="mt-4 text-sm text-slate-400 hover:text-white"
                            >
                                Cerrar
                            </button>
                        </div>
                    ), {
                        duration: 8000,
                        position: 'top-center',
                    });
                    return; // Stop execution after showing duplicate error
                } else {
                    toast.error(response.msg || 'Error al crear el producto');
                }
            }
        } catch (error) {
            console.error('Error en el proceso de creación:', error);

            // Check for duplicate key error in various formats
            if (error.code === 11000 ||
                error.error?.code === 11000 ||
                error.message?.includes('duplicate key error') ||
                error.error?.message?.includes('duplicate key error')) {

                const duplicateInfo = getDuplicateFieldMessage(error);

                if (duplicateInfo.field && duplicateInfo.value) {
                    toast.custom((t) => (
                        <div className="bg-slate-800 text-white px-6 py-4 rounded-lg shadow-lg">
                            <div className="flex items-center mb-3">
                                <svg className="w-6 h-6 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="font-semibold text-lg">Producto Duplicado</h3>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm">
                                    Ya existe un producto con el mismo {duplicateInfo.field}:
                                    <span className="font-bold ml-1 text-yellow-400">{duplicateInfo.value}</span>
                                </p>
                                <p className="text-sm text-gray-300">
                                    Por favor, utiliza un {duplicateInfo.field} diferente para este producto.
                                </p>
                                {duplicateInfo.field === 'SKU' && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Tip: El SKU debe ser único para cada producto.
                                    </p>
                                )}
                                {duplicateInfo.field === 'código' && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Tip: El código debe ser único para cada producto.
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="mt-4 text-sm text-slate-400 hover:text-white"
                            >
                                Cerrar
                            </button>
                        </div>
                    ), {
                        duration: 10000, // Increased duration to ensure message is seen
                        position: 'top-center',
                    });
                    return;
                }
            }

            // Add duplicate handling in catch block too
            if (error.code === 11000 || error.error?.code === 11000) {
                const { field, value } = getDuplicateFieldMessage(error.error || error);

                toast.custom((t) => (
                    <div className="bg-slate-800 text-white px-6 py-4 rounded-lg shadow-lg">
                        <div className="flex items-center mb-3">
                            <svg className="w-6 h-6 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="font-semibold text-lg">Producto Duplicado</h3>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm">
                                Ya existe un producto con el {field}:
                                <span className="font-bold ml-1 text-yellow-400">{value}</span>
                            </p>
                            <p className="text-sm text-gray-300">
                                Por favor, utiliza un {field} diferente para este producto.
                            </p>
                            {field === 'SKU' && (
                                <p className="text-xs text-gray-400 mt-1">
                                    Tip: El SKU debe ser único para cada producto.
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="mt-4 text-sm text-slate-400 hover:text-white"
                        >
                            Cerrar
                        </button>
                    </div>
                ));
            } else if (error.error?.errores?.length > 0) {
                toast.custom((t) => (
                    <div className="bg-slate-800 text-white px-6 py-4 rounded-lg shadow-lg max-w-lg">
                        <div className="flex items-center mb-3">
                            <svg className="w-6 h-6 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="font-semibold text-lg">Error al crear el producto</h3>
                        </div>
                        <ul className="list-disc pl-5 space-y-1">
                            {error.error.errores.map((err, index) => (
                                <li key={index} className="text-sm">
                                    <span className="font-medium">{err.campo}:</span> {err.mensaje}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="mt-4 text-sm text-slate-400 hover:text-white"
                        >
                            Cerrar
                        </button>
                    </div>
                ), {
                    duration: 8000,
                    position: 'top-center',
                });
            } else {
                toast.error(`Error: ${error.message || 'Error desconocido'}`);
            }
        } finally {
            setLoading(false);
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
                            onChange={handleTypeChange}
                        />

                        <BasicInfoSection
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />

                        <PricingAndInventorySection
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />

                        {selectedType === 'ProductoAceite' ? (
                            <AceiteForm
                                formData={formData}
                                handleInputChange={handleInputChange}
                            />
                        ) : (
                            <CarneForm
                                formData={formData}
                                handleInputChange={handleInputChange}
                            />
                        )}

                        <NutritionalInfoSection
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                        <AdditionalInfoSection
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                        <ConservationSection
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                        <ImageUploader
                            images={formData.multimedia.imagenes}
                            onUpload={handleImageUpload}
                            onDelete={handleImageDelete}
                            onUpdateAltText={handleUpdateAltText}
                            onVideoChange={handleVideoChange}
                        />
                        <SeoSection
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />

                        <SubmitButton loading={loading} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export { AdminProductCreate };