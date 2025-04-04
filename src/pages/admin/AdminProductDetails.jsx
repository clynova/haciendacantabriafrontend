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

const baseStyles = {
  text: {
    primary: "text-slate-900 dark:text-slate-100",
    secondary: "text-slate-700 dark:text-slate-300",
    muted: "text-slate-600 dark:text-slate-400"
  },
  background: {
    primary: "bg-white dark:bg-slate-800",
    secondary: "bg-slate-50 dark:bg-slate-700/50",
    highlight: "bg-slate-100 dark:bg-slate-600/50"
  },
  card: {
    base: "bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm",
    header: "border-b border-slate-200 dark:border-slate-700"
  },
  border: "border-slate-200 dark:border-slate-700",
  gradient: "bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20"
};

// Componente de tarjeta reutilizable para información
const InfoCard = ({ title, children, className = "" }) => (
    <div className={`space-y-4 ${className}`}>
        <h2 className={`text-lg font-semibold ${baseStyles.text.primary}`}>{title}</h2>
        <div className={`p-4 rounded-lg ${baseStyles.background.secondary}`}>
            {children}
        </div>
    </div>
);

// Componente para mostrar un campo individual
const InfoField = ({ label, value, type = "text" }) => {
    let displayValue = value;
    
    if (value === undefined || value === null) {
        displayValue = "No especificado";
    } else if (type === "boolean") {
        displayValue = value ? "Sí" : "No";
    } else if (type === "date") {
        displayValue = new Date(value).toLocaleString();
    } else if (type === "number") {
        displayValue = typeof value === "number" ? value.toFixed(2) : value;
    }

    return (
        <p className={baseStyles.text.secondary}>
            <span className={baseStyles.text.muted}>{label}:</span>{" "}
            {displayValue}
        </p>
    );
};

// Componente para mostrar etiquetas
const TagList = ({ tags }) => (
    <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
            <span
                key={index}
                className={`px-3 py-1 text-sm rounded-full ${baseStyles.background.highlight} ${baseStyles.text.secondary}`}
            >
                {tag}
            </span>
        ))}
    </div>
);

// Componente para una sección de información
const InfoSection = ({ title, children, className = "" }) => (
    <div className={`space-y-4 ${className}`}>
        <h2 className={`text-lg font-semibold ${baseStyles.text.primary}`}>{title}</h2>
        <div className={`p-4 rounded-lg ${baseStyles.background.secondary}`}>
            {children}
        </div>
    </div>
);

// Componente principal AdminProductDetails
const AdminProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (productId !== 'create') {
            fetchProductDetails();
        }
    }, [productId]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const response = await getProductById(productId, token);

            if (response.success) {
                setProduct(response.product);
            } else {
                toast.error('Error al cargar los detalles del producto');
            }
        } catch (error) {
            toast.error(error.msg || 'Error al cargar los detalles del producto');
        } finally {
            setLoading(false);
        }
    };

    // Renderizar información específica según el tipo de producto
    const renderProductTypeSpecificInfo = () => {
        if (!product) return null;

        switch (product.tipoProducto) {
            case "ProductoCarne":
                return renderMeatInfo(product);
            case "ProductoAceite":
                return renderOilInfo(product);
            default:
                return null;
        }
    };

    // Función para renderizar la información de productos de carne
    const renderMeatInfo = (product) => (
        <>
            {/* Información Básica de la Carne */}
            <InfoSection title="Información de la Carne">
                <div className="space-y-2">
                    <InfoField 
                        label="Tipo de Carne" 
                        value={product.infoCarne?.tipoCarne} 
                    />
                    <InfoField 
                        label="Corte" 
                        value={product.infoCarne?.corte} 
                    />
                    <InfoField 
                        label="Nombre Argentino" 
                        value={product.infoCarne?.nombreArgentino} 
                    />
                    <InfoField 
                        label="Nombre Chileno" 
                        value={product.infoCarne?.nombreChileno} 
                    />
                </div>
            </InfoSection>

            {/* Características */}
            <InfoSection title="Características">
                <div className="space-y-2">
                    <InfoField 
                        label="Porcentaje de Grasa" 
                        value={product.caracteristicas?.porcentajeGrasa}
                        type="number"
                    />
                    <InfoField 
                        label="Marmoleo" 
                        value={product.caracteristicas?.marmoleo}
                        type="number"
                    />
                    <InfoField 
                        label="Color" 
                        value={product.caracteristicas?.color} 
                    />
                    {product.caracteristicas?.textura?.length > 0 && (
                        <div>
                            <span className={baseStyles.text.muted}>Textura:</span>
                            <div className="mt-2">
                                <TagList tags={product.caracteristicas.textura} />
                            </div>
                        </div>
                    )}
                </div>
            </InfoSection>

            {/* Información Nutricional */}
            <InfoSection title="Información Nutricional">
                <div className="space-y-2">
                    <InfoField 
                        label="Porción" 
                        value={product.infoNutricional?.porcion} 
                    />
                    <InfoField 
                        label="Calorías" 
                        value={product.infoNutricional?.calorias}
                        type="number"
                    />
                    <InfoField 
                        label="Proteínas" 
                        value={product.infoNutricional?.proteinas}
                        type="number"
                    />
                    <InfoField 
                        label="Grasa Total" 
                        value={product.infoNutricional?.grasaTotal}
                        type="number"
                    />
                    <InfoField 
                        label="Grasa Saturada" 
                        value={product.infoNutricional?.grasaSaturada}
                        type="number"
                    />
                    <InfoField 
                        label="Colesterol" 
                        value={product.infoNutricional?.colesterol}
                        type="number"
                    />
                    <InfoField 
                        label="Sodio" 
                        value={product.infoNutricional?.sodio}
                        type="number"
                    />
                    <InfoField 
                        label="Carbohidratos" 
                        value={product.infoNutricional?.carbohidratos}
                        type="number"
                    />
                </div>
            </InfoSection>

            {/* Cocción */}
            <InfoSection title="Información de Cocción">
                <div className="space-y-4">
                    {product.coccion?.metodos?.length > 0 && (
                        <div>
                            <span className={baseStyles.text.muted}>Métodos de Cocción:</span>
                            <div className="mt-2">
                                <TagList tags={product.coccion.metodos} />
                            </div>
                        </div>
                    )}
                    <InfoField 
                        label="Temperatura Ideal" 
                        value={product.coccion?.temperaturaIdeal} 
                    />
                    <InfoField 
                        label="Tiempo Estimado" 
                        value={product.coccion?.tiempoEstimado} 
                    />
                    {product.coccion?.consejos?.length > 0 && (
                        <div>
                            <span className={baseStyles.text.muted}>Consejos:</span>
                            <div className="mt-2">
                                <TagList tags={product.coccion.consejos} />
                            </div>
                        </div>
                    )}
                    {product.coccion?.recetas?.length > 0 && (
                        <div className="mt-4">
                            <span className={`block mb-2 ${baseStyles.text.muted}`}>Recetas:</span>
                            <div className="grid grid-cols-1 gap-4">
                                {product.coccion.recetas.map((receta, index) => (
                                    <div 
                                        key={index}
                                        className={`p-4 rounded-lg ${baseStyles.background.highlight}`}
                                    >
                                        <InfoField 
                                            label="Nombre" 
                                            value={receta.nombre} 
                                        />
                                        <InfoField 
                                            label="Descripción" 
                                            value={receta.descripcion} 
                                        />
                                        {receta.url && (
                                            <a 
                                                href={receta.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-600 mt-2 inline-block"
                                            >
                                                Ver receta completa
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </InfoSection>

            {/* Empaque */}
            <InfoSection title="Información de Empaque">
                <div className="space-y-2">
                    <InfoField 
                        label="Tipo de Envase" 
                        value={product.empaque?.tipo} 
                    />
                    <InfoField 
                        label="Unidades por Caja" 
                        value={product.empaque?.unidadesPorCaja}
                        type="number"
                    />
                    <InfoField 
                        label="Peso por Caja" 
                        value={product.empaque?.pesoCaja}
                        type="number"
                    />
                </div>
            </InfoSection>

            {/* Origen */}
            <InfoSection title="Información de Origen">
                <div className="space-y-2">
                    <InfoField 
                        label="País" 
                        value={product.origen?.pais} 
                    />
                    <InfoField 
                        label="Región" 
                        value={product.origen?.region} 
                    />
                    <InfoField 
                        label="Productor" 
                        value={product.origen?.productor} 
                    />
                    <InfoField 
                        label="Raza" 
                        value={product.origen?.raza} 
                    />
                    <InfoField 
                        label="Maduración" 
                        value={product.origen?.maduracion} 
                    />
                </div>
            </InfoSection>

            {/* Procesamiento */}
            <InfoSection title="Información de Procesamiento">
                <div className="space-y-2">
                    <InfoField 
                        label="Fecha de Faenado" 
                        value={product.procesamiento?.fechaFaenado}
                        type="date"
                    />
                    <InfoField 
                        label="Fecha de Envasado" 
                        value={product.procesamiento?.fechaEnvasado}
                        type="date"
                    />
                    <InfoField 
                        label="Fecha de Vencimiento" 
                        value={product.procesamiento?.fechaVencimiento}
                        type="date"
                    />
                    <InfoField 
                        label="Número de Lote" 
                        value={product.procesamiento?.numeroLote} 
                    />
                </div>
            </InfoSection>
        </>
    );

    // Función para renderizar la información de productos de aceite
    const renderOilInfo = (product) => (
        <>
            {/* Información Básica del Aceite */}
            <InfoSection title="Información del Aceite">
                <div className="space-y-2">
                    <InfoField 
                        label="Tipo" 
                        value={product.infoAceite?.tipo} 
                    />
                    <InfoField 
                        label="Envase" 
                        value={product.infoAceite?.envase} 
                    />
                </div>
            </InfoSection>

            {/* Características */}
            <InfoSection title="Características">
                <div className="space-y-4">
                    {product.caracteristicas?.aditivos?.length > 0 && (
                        <div>
                            <span className={baseStyles.text.muted}>Aditivos:</span>
                            <div className="mt-2">
                                <TagList tags={product.caracteristicas.aditivos} />
                            </div>
                        </div>
                    )}
                    <InfoField 
                        label="Filtración" 
                        value={product.caracteristicas?.filtracion} 
                    />
                    <InfoField 
                        label="Acidez" 
                        value={product.caracteristicas?.acidez}
                    />
                    <InfoField 
                        label="Extracción" 
                        value={product.caracteristicas?.extraccion} 
                    />
                </div>
            </InfoSection>

            {/* Información Nutricional */}
            <InfoSection title="Información Nutricional">
                <div className="space-y-2">
                    <InfoField 
                        label="Porción" 
                        value={product.infoNutricional?.porcion} 
                    />
                    <InfoField 
                        label="Calorías" 
                        value={product.infoNutricional?.calorias}
                        type="number" 
                    />
                    <InfoField 
                        label="Grasa Total" 
                        value={product.infoNutricional?.grasaTotal}
                        type="number" 
                    />
                    <InfoField 
                        label="Grasa Saturada" 
                        value={product.infoNutricional?.grasaSaturada}
                        type="number" 
                    />
                    <InfoField 
                        label="Grasa Trans" 
                        value={product.infoNutricional?.grasaTrans}
                        type="number" 
                    />
                    <InfoField 
                        label="Grasa Poliinsaturada" 
                        value={product.infoNutricional?.grasaPoliinsaturada}
                        type="number" 
                    />
                    <InfoField 
                        label="Grasa Monoinsaturada" 
                        value={product.infoNutricional?.grasaMonoinsaturada}
                        type="number" 
                    />
                </div>
            </InfoSection>

            {/* Usos Recomendados */}
            {product.usosRecomendados?.length > 0 && (
                <InfoSection title="Usos Recomendados">
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                            <TagList tags={product.usosRecomendados} />
                        </div>
                    </div>
                </InfoSection>
            )}

            {/* Producción */}
            <InfoSection title="Información de Producción">
                <div className="space-y-2">
                    <InfoField 
                        label="Método" 
                        value={product.produccion?.metodo} 
                    />
                    <InfoField 
                        label="Temperatura" 
                        value={product.produccion?.temperatura} 
                    />
                    <InfoField 
                        label="Fecha de Envasado" 
                        value={product.produccion?.fechaEnvasado}
                        type="date" 
                    />
                    <InfoField 
                        label="Fecha de Vencimiento" 
                        value={product.produccion?.fechaVencimiento}
                        type="date" 
                    />
                </div>
            </InfoSection>
        </>
    );

    // Renderizar la información base del producto
    const renderBaseProductInfo = (product) => (
        <>
            {/* Información Básica */}
            <InfoSection title="Información Básica">
                <div className="space-y-2">
                    <p className={baseStyles.text.secondary}>
                        <span className={baseStyles.text.muted}>SKU:</span> {product.sku}
                    </p>
                    <p className={baseStyles.text.secondary}>
                        <span className={baseStyles.text.muted}>Nombre:</span> {product.nombre}
                    </p>
                    <p className={baseStyles.text.secondary}>
                        <span className={baseStyles.text.muted}>Slug:</span> {product.slug}
                    </p>
                    <p className={baseStyles.text.secondary}>
                        <span className={baseStyles.text.muted}>Categoría:</span> {product.categoria}
                    </p>
                    <p className={baseStyles.text.secondary}>
                        <span className={baseStyles.text.muted}>Estado:</span> {product.estado ? 'Activo' : 'Inactivo'}
                    </p>
                    <p className={baseStyles.text.secondary}>
                        <span className={baseStyles.text.muted}>Destacado:</span> {product.destacado ? 'Sí' : 'No'}
                    </p>
                </div>
            </InfoSection>

            {/* Descripción */}
            <InfoSection title="Descripción">
                <div className="space-y-4">
                    <p className={baseStyles.text.secondary}>
                        <span className={baseStyles.text.muted}>Descripción Corta:</span>
                        <br />
                        {product.descripcion?.corta || 'No especificada'}
                    </p>
                    <p className={baseStyles.text.secondary}>
                        <span className={baseStyles.text.muted}>Descripción Completa:</span>
                        <br />
                        {product.descripcion?.completa || 'No especificada'}
                    </p>
                </div>
            </InfoSection>

            {/* Precios */}
            <InfoSection title="Precios">
                <div className="space-y-2">
                    <p className={baseStyles.text.secondary}>
                        <span className={baseStyles.text.muted}>Precio Base:</span> ${product.precios?.base?.toFixed(2)}
                    </p>
                    <p className={baseStyles.text.secondary}>
                        <span className={baseStyles.text.muted}>Descuento Regular:</span> {product.precios?.descuentos?.regular}%
                    </p>
                    <p className={baseStyles.text.secondary}>
                        <span className={baseStyles.text.muted}>Precio Final:</span> ${product.precioFinal?.toFixed(2)}
                    </p>
                </div>
            </InfoSection>

            {/* Multimedia */}
            <InfoSection title="Multimedia">
                <ImageGallery
                    images={product.multimedia?.imagenes || []}
                    productName={product.nombre}
                />
                {product.multimedia?.video && (
                    <div className="mt-4">
                        <p className={baseStyles.text.secondary}>
                            <span className={baseStyles.text.muted}>Video:</span>
                            <a href={product.multimedia.video} target="_blank" rel="noopener noreferrer" 
                               className="text-blue-500 hover:text-blue-600 ml-2">
                                Ver video
                            </a>
                        </p>
                    </div>
                )}
            </InfoSection>

            {/* SEO */}
            <InfoSection title="SEO">
                <div className="space-y-4">
                    <p className={baseStyles.text.secondary}>
                        <span className={baseStyles.text.muted}>Meta Título:</span>
                        <br />
                        {product.seo?.metaTitulo || 'No especificado'}
                    </p>
                    <p className={baseStyles.text.secondary}>
                        <span className={baseStyles.text.muted}>Meta Descripción:</span>
                        <br />
                        {product.seo?.metaDescripcion || 'No especificada'}
                    </p>
                    {product.seo?.palabrasClave?.length > 0 && (
                        <div>
                            <span className={`block mb-2 ${baseStyles.text.muted}`}>Palabras Clave:</span>
                            <div className="flex flex-wrap gap-2">
                                {product.seo.palabrasClave.map((palabra, index) => (
                                    <span key={index} className={`px-3 py-1 rounded-full text-sm ${baseStyles.background.highlight} ${baseStyles.text.secondary}`}>
                                        {palabra}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </InfoSection>

            {/* Opciones de Peso */}
            {product.opcionesPeso && (
                <InfoSection title="Opciones de Peso">
                    <div className="space-y-4">
                        <p className={baseStyles.text.secondary}>
                            <span className={baseStyles.text.muted}>Peso Variable:</span>
                            {product.opcionesPeso.esPesoVariable ? 'Sí' : 'No'}
                        </p>
                        {product.opcionesPeso.pesoPromedio && (
                            <p className={baseStyles.text.secondary}>
                                <span className={baseStyles.text.muted}>Peso Promedio:</span>
                                {product.opcionesPeso.pesoPromedio}
                            </p>
                        )}
                        {/* ... resto de opciones de peso ... */}
                    </div>
                </InfoSection>
            )}

            {/* Conservación */}
            <InfoSection title="Conservación">
                <div className="space-y-2">
                    <p className={baseStyles.text.secondary}>
                        <span className={baseStyles.text.muted}>Requiere Refrigeración:</span>
                        {product.conservacion?.requiereRefrigeracion ? 'Sí' : 'No'}
                    </p>
                    <p className={baseStyles.text.secondary}>
                        <span className={baseStyles.text.muted}>Requiere Congelación:</span>
                        {product.conservacion?.requiereCongelacion ? 'Sí' : 'No'}
                    </p>
                    {product.conservacion?.vidaUtil && (
                        <p className={baseStyles.text.secondary}>
                            <span className={baseStyles.text.muted}>Vida Útil:</span>
                            {product.conservacion.vidaUtil}
                        </p>
                    )}
                    {product.conservacion?.instrucciones && (
                        <p className={baseStyles.text.secondary}>
                            <span className={baseStyles.text.muted}>Instrucciones:</span>
                            {product.conservacion.instrucciones}
                        </p>
                    )}
                </div>
            </InfoSection>

            {/* Información Adicional */}
            <InfoSection title="Información Adicional">
                <div className="space-y-2">
                    <InfoField 
                        label="Origen" 
                        value={product.infoAdicional?.origen} 
                    />
                    <InfoField 
                        label="Marca" 
                        value={product.infoAdicional?.marca} 
                    />
                    {product.infoAdicional?.certificaciones?.length > 0 && (
                        <div>
                            <span className={baseStyles.text.muted}>Certificaciones:</span>
                            <div className="mt-2">
                                <TagList tags={product.infoAdicional.certificaciones} />
                            </div>
                        </div>
                    )}
                </div>
            </InfoSection>

            {/* Opciones de Peso (versión completa) */}
            {product.opcionesPeso && (
                <InfoSection title="Opciones de Peso">
                    <div className="space-y-4">
                        <InfoField 
                            label="Peso Variable" 
                            value={product.opcionesPeso.esPesoVariable} 
                            type="boolean" 
                        />
                        <InfoField 
                            label="Peso Promedio" 
                            value={product.opcionesPeso.pesoPromedio} 
                            type="number" 
                        />
                        <InfoField 
                            label="Peso Mínimo" 
                            value={product.opcionesPeso.pesoMinimo} 
                            type="number" 
                        />
                        <InfoField 
                            label="Peso Máximo" 
                            value={product.opcionesPeso.pesoMaximo} 
                            type="number" 
                        />

                        {/* Pesos Estándar */}
                        {product.opcionesPeso.pesosEstandar?.length > 0 && (
                            <div className="mt-4">
                                <h3 className={`text-base font-medium ${baseStyles.text.primary} mb-2`}>
                                    Pesos Estándar
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {product.opcionesPeso.pesosEstandar.map((peso, index) => (
                                        <div 
                                            key={index} 
                                            className={`p-4 rounded-lg ${baseStyles.background.highlight}`}
                                        >
                                            <InfoField 
                                                label="Peso" 
                                                value={`${peso.peso} ${peso.unidad}`} 
                                            />
                                            <InfoField 
                                                label="Precio" 
                                                value={peso.precio} 
                                                type="number" 
                                            />
                                            <InfoField 
                                                label="SKU" 
                                                value={peso.sku} 
                                            />
                                            <InfoField 
                                                label="Stock Disponible" 
                                                value={peso.stockDisponible} 
                                                type="number" 
                                            />
                                            <InfoField 
                                                label="Umbral de Stock Bajo" 
                                                value={peso.umbralStockBajo} 
                                                type="number" 
                                            />
                                            <InfoField 
                                                label="Última Actualización" 
                                                value={peso.ultimaActualizacion} 
                                                type="date" 
                                            />
                                            {peso.esPredeterminado && (
                                                <span className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${baseStyles.background.secondary} ${baseStyles.text.secondary}`}>
                                                    Predeterminado
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Rangos Preferidos */}
                        {product.opcionesPeso.rangosPreferidos?.length > 0 && (
                            <div className="mt-4">
                                <h3 className={`text-base font-medium ${baseStyles.text.primary} mb-2`}>
                                    Rangos Preferidos
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {product.opcionesPeso.rangosPreferidos.map((rango, index) => (
                                        <div 
                                            key={index} 
                                            className={`p-4 rounded-lg ${baseStyles.background.highlight}`}
                                        >
                                            <InfoField 
                                                label="Nombre" 
                                                value={rango.nombre} 
                                            />
                                            <InfoField 
                                                label="Peso Mínimo" 
                                                value={rango.pesoMinimo} 
                                                type="number" 
                                            />
                                            <InfoField 
                                                label="Peso Máximo" 
                                                value={rango.pesoMaximo} 
                                                type="number" 
                                            />
                                            <InfoField 
                                                label="Descripción" 
                                                value={rango.descripcion} 
                                            />
                                            {rango.esPredeterminado && (
                                                <span className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${baseStyles.background.secondary} ${baseStyles.text.secondary}`}>
                                                    Predeterminado
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </InfoSection>
            )}

            {/* Metadatos */}
            {product.metadatos && product.metadatos.size > 0 && (
                <InfoSection title="Metadatos">
                    <div className="space-y-2">
                        {Array.from(product.metadatos).map(([key, value]) => (
                            <InfoField 
                                key={key}
                                label={key} 
                                value={JSON.stringify(value)} 
                            />
                        ))}
                    </div>
                </InfoSection>
            )}

            {/* Tags */}
            {product.tags?.length > 0 && (
                <InfoSection title="Etiquetas">
                    <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                            <span key={index} className={`px-3 py-1 rounded-full text-sm ${baseStyles.background.highlight} ${baseStyles.text.secondary}`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </InfoSection>
            )}
        </>
    );

    // Renderizado condicional para estados de carga y error
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="p-6">
                <div className={`text-center ${baseStyles.text.muted}`}>
                    Producto no encontrado
                </div>
            </div>
        );
    }

    // Renderizado principal
    return (
        <div className={`p-6 ${baseStyles.background.primary}`}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className={`flex items-center gap-2 ${baseStyles.text.secondary} hover:${baseStyles.text.primary}`}
                    >
                        <HiArrowLeft className="h-5 w-5" />
                        <span>Volver a la lista</span>
                    </button>
                    <button
                        onClick={() => navigate(`/admin/products/${productId}/edit`)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                    >
                        <HiPencil className="h-5 w-5" />
                        Editar
                    </button>
                </div>

                {/* Contenido principal */}
                <div className={`rounded-xl shadow-xl overflow-hidden ${baseStyles.background.primary}`}>
                    {/* Encabezado del producto */}
                    <div className={`p-6 ${baseStyles.gradient} ${baseStyles.card.header}`}>
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

                    {/* Contenido del producto */}
                    <div className="p-6 space-y-8">
                        {renderBaseProductInfo(product)}
                        {renderProductTypeSpecificInfo()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { AdminProductDetails };