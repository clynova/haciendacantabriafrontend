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

const CORTES_CARNE = [
    'ASADO',
    'BIFE',
    'LOMO',
    'COSTILLA',
    'POSTA',
    'OSOBUCO',
    // Add more cuts as needed
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
            umbralStockBajo: '',
            stockKg: ''  // Add this required field
        },
        infoCarne: {
            tipoCarne: 'VACUNO',
            corte: CORTES_CARNE[0],  // Set a default value from the enum
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
            // Upload each image to Cloudinary and get URLs
            const uploadPromises = files.map(async (file) => {
                const cloudinaryUrl = await uploadImageToCloudinary(file);
                if (cloudinaryUrl) {
                    return {
                        url: cloudinaryUrl,
                        nombre: file.name,
                        tipo: file.type
                    };
                }
                throw new Error(`Failed to upload ${file.name}`);
            });

            const uploadedImages = await Promise.all(uploadPromises);
            
            setFormData(prev => ({
                ...prev,
                multimedia: {
                    ...prev.multimedia,
                    imagenes: [...prev.multimedia.imagenes, ...uploadedImages]
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Add validation for required fields
        if (selectedType === 'ProductoCarne' && (!formData.infoCarne.corte || !formData.inventario.stockKg)) {
            toast.error('Para productos de carne, el corte y stock en Kg son obligatorios');
            return;
        }

        try {
            setLoading(true);
            console.log('Iniciando creación de producto...');
            
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
                    umbralStockBajo: Number(formData.inventario.umbralStockBajo || 0),
                    stockKg: selectedType === 'ProductoCarne' ? Number(formData.inventario.stockKg) : undefined
                }
            };

            console.log('Datos a enviar:', dataToSend);
            const loadingToast = toast.loading('Creando producto...');

            const response = await createProduct(dataToSend, token);
            console.log('Respuesta del servidor:', response);

            if (response.success) {
                toast.dismiss(loadingToast);
                toast.success('Producto creado exitosamente');
                console.log('Producto creado:', response.data);
                navigate('/admin/products');
            } else {
                toast.dismiss(loadingToast);
                toast.error(response.message || 'Error al crear el producto');
                console.error('Error en la creación:', response.message);
            }
        } catch (error) {
            console.error('Error en el proceso de creación:', error);
            toast.error('Error al crear el producto. Por favor, intente nuevamente.');
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

                        <ConservationSection 
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />

                        <ImageUploader 
                            images={formData.multimedia.imagenes}
                            onUpload={handleImageUpload}
                            onDelete={handleImageDelete}
                        />

                        <SubmitButton loading={loading} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export { AdminProductCreate };