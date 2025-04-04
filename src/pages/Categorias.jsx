import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { LoadingSpinner } from '../components/Loading/LoadingSpinner';
import { useGlobal } from '../context/GlobalContext';
import { searchProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/funcionesReutilizables';
import { CategoryFilters } from '../components/Categories/CategoryFilters';
import { CategoryBanner } from '../components/Categories/CategoryBanner';
import { getAllTags, getProductsByTags } from '../services/tagsService';
import { motion, AnimatePresence } from 'framer-motion';
import imgCarne from '../images/categories/Carne.webp';
import imgAceite from '../images/categories/Aceite.webp';
import imgDestino from '../images/categories/destino.webp';
import imgAccesorios from '../images/categories/destino.webp';
import { FaSnowflake, FaTemperatureLow, FaLeaf } from 'react-icons/fa';

const TIPOS_ACEITE = ['OLIVA', 'GIRASOL', 'MAIZ', 'MEZCLA'];
const METODOS_COCCION = ['PARRILLA', 'HORNO', 'SARTEN', 'PLANCHA'];
const TIPOS_ENVASE = ['BOTELLA', 'BIDON', 'LATA'];
const OFFER_TAGS = ['promocion', 'oferta', 'descuento'];
const OFFERS_CATEGORY = 'ofertas';

const DEFAULT_FILTERS = {
    // Base product filters
    estado: true,
    precioMin: '',
    precioMax: '',
    destacado: false,
    ordenar: '',
    // Meat specific filters
    tipoCarne: '',
    corte: '',
    marmoleo: '',
    metodosCoccion: [],
    pesoMin: '',
    pesoMax: '',
    // Oil specific filters
    tipoAceite: '',
    volumenMin: '',
    volumenMax: '',
    tipoEnvase: '',
    // Additional filters
    origen: '',
    marca: '',
    requiereRefrigeracion: false,
    requiereCongelacion: false
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 80,
            damping: 15
        }
    }
};

const getConservationInfo = (product) => {
    if (product.conservacion?.requiereCongelacion) {
        return {
            icon: <FaSnowflake className="w-4 h-4 text-blue-500" />,
            text: 'Congelado',
            bgColor: 'bg-blue-100/90'
        };
    } else if (product.conservacion?.requiereRefrigeracion) {
        return {
            icon: <FaTemperatureLow className="w-4 h-4 text-cyan-500" />,
            text: 'Refrigerado',
            bgColor: 'bg-cyan-100/90'
        };
    }
    return {
        icon: <FaLeaf className="w-4 h-4 text-green-500" />,
        text: 'Fresco',
        bgColor: 'bg-green-100/90'
    };
};

const Categorias = () => {
    const { nombre } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const { setPageTitle } = useGlobal();
    const { addToCart } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [matchAllTags, setMatchAllTags] = useState(true);
    const [activeView, setActiveView] = useState('grid'); // 'grid' or 'list'
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const formatCategoryName = (name) => {
        const upperCaseCategories = ['vacuno', 'pollo', 'cerdo', 'aceite', 'carne'];
        
        const normalizedName = name.split('-').join(' ');
        
        if (upperCaseCategories.includes(normalizedName.toLowerCase())) {
            return normalizedName.toUpperCase();
        }

        return normalizedName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const categoryName = formatCategoryName(nombre);

    const getCategoryBanner = () => {
        const category = nombre.toLowerCase();
        
        if (category.includes('vacuno') || category.includes('carne')) {
            return imgCarne;
        } else if (category.includes('aceite')) {
            return imgAceite;
        } else if (category === OFFERS_CATEGORY) {
            return imgDestino;
        } else {
            return imgAccesorios;
        }
    };

    const getCategoryDescription = () => {
        const category = nombre.toLowerCase();
        
        if (category.includes('vacuno') || category.includes('carne')) {
            return "Explora nuestra selección premium de cortes argentinos de la más alta calidad";
        } else if (category.includes('aceite')) {
            return "Descubre nuestros aceites gourmet, perfectos para realzar tus platos";
        } else if (category === OFFERS_CATEGORY) {
            return "Las mejores ofertas y promociones especiales seleccionadas para ti";
        } else {
            return "Todo lo que necesitas para complementar tu experiencia culinaria";
        }
    };

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            let productsData;
            
            if (selectedTags.length > 0) {
                const tagResponse = await getProductsByTags(selectedTags, matchAllTags);
                if (!tagResponse.success) {
                    throw new Error(tagResponse.error);
                }
                productsData = tagResponse.products;
            } else {
                const response = await searchProducts({ 
                    categoria: nombre.toLowerCase() === OFFERS_CATEGORY ? '' : categoryName
                });
                
                if (!response.success) {
                    throw new Error(response.error);
                }
                
                productsData = response.products;

                if (nombre.toLowerCase() === OFFERS_CATEGORY) {
                    productsData = productsData.filter(product => 
                        product.tags?.some(tag => OFFER_TAGS.includes(tag.toLowerCase()))
                    );
                }
            }

            setProducts(productsData);
            
            const title = nombre.toLowerCase() === OFFERS_CATEGORY 
                ? `Ofertas (${productsData.length} productos)`
                : `${categoryName} (${productsData.length} productos)`;
            
            setPageTitle(title);

        } catch (err) {
            setError(err.message || 'Error al cargar los productos');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [nombre, categoryName, selectedTags, matchAllTags, setPageTitle]);

    useEffect(() => {
        const fetchTags = async () => {
            const response = await getAllTags();
            if (response.success) {
                setAvailableTags(response.tags);
            }
        };
        fetchTags();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        setFilters(DEFAULT_FILTERS);
        setSearchTerm('');
        setSelectedTags([]);
        setMatchAllTags(true);
    }, [nombre]); // nombre is the category parameter from useParams

    const handleAddToCart = (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.descripcion?.corta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesPrecio = (!filters.precioMin || product.precioFinal >= Number(filters.precioMin)) &&
                             (!filters.precioMax || product.precioFinal <= Number(filters.precioMax));

        const matchesEstado = !filters.estado || product.estado === filters.estado;
        const matchesDestacado = !filters.destacado || product.destacado === true;
        const matchesOrigen = !filters.origen || product.infoAdicional?.origen === filters.origen;
        const matchesMarca = !filters.marca || product.infoAdicional?.marca === filters.marca;
        const matchesConservacion = (
            (!filters.requiereRefrigeracion || product.conservacion?.requiereRefrigeracion === true) &&
            (!filters.requiereCongelacion || product.conservacion?.requiereCongelacion === true)
        );

        let matchesProductType = true;

        if (product.tipoProducto === 'ProductoCarne') {
            matchesProductType = (
                (!filters.tipoCarne || product.infoCarne?.tipoCarne === filters.tipoCarne) &&
                (!filters.corte || product.infoCarne?.corte === filters.corte) &&
                (!filters.marmoleo || product.caracteristicas?.marmoleo === Number(filters.marmoleo)) &&
                (!filters.metodosCoccion?.length || 
                    product.coccion?.metodos?.some(m => filters.metodosCoccion.includes(m))) &&
                (!filters.pesoMin || product.opcionesPeso?.pesoPromedio >= Number(filters.pesoMin)) &&
                (!filters.pesoMax || product.opcionesPeso?.pesoPromedio <= Number(filters.pesoMax))
            );
        } else if (product.tipoProducto === 'ProductoAceite') {
            matchesProductType = (
                (!filters.tipoAceite || product.infoAceite?.tipo === filters.tipoAceite) &&
                (!filters.tipoEnvase || product.infoAceite?.envase === filters.tipoEnvase) &&
                (!filters.volumenMin || product.infoAceite?.volumen >= Number(filters.volumenMin)) &&
                (!filters.volumenMax || product.infoAceite?.volumen <= Number(filters.volumenMax))
            );
        }

        return matchesSearch && matchesPrecio && matchesEstado && matchesDestacado && 
               matchesOrigen && matchesMarca && matchesConservacion && matchesProductType;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (filters.ordenar) {
            case 'precio-asc':
                return a.precioFinal - b.precioFinal;
            case 'precio-desc':
                return b.precioFinal - a.precioFinal;
            case 'nombre-asc':
                return a.nombre.localeCompare(b.nombre);
            case 'nombre-desc':
                return b.nombre.localeCompare(a.nombre);
            case 'marmoleo-desc':
                if (a.tipoProducto === 'ProductoCarne' && b.tipoProducto === 'ProductoCarne') {
                    return (b.caracteristicas?.marmoleo || 0) - (a.caracteristicas?.marmoleo || 0);
                }
                return 0;
            case 'fecha-nuevo':
                return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
            case 'fecha-antiguo':
                return new Date(a.fechaCreacion) - new Date(b.fechaCreacion);
            default:
                if (a.destacado && !b.destacado) return -1;
                if (!a.destacado && b.destacado) return 1;
                return 0;
        }
    });

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === 'precioMin' || name === 'precioMax') {
            if (value === '' || Number(value) >= 0) {
                setFilters(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
            return;
        }

        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleTagChange = (tag) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    // Rendering functions for different views
    const renderGridView = () => (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6"
        >
            {sortedProducts.map((product) => (
                <motion.div key={product._id} variants={itemVariants}>
                    <Link
                        to={`/product/${product.slug || product._id}`}
                        className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm 
                                 hover:shadow-lg transition-all duration-300 block h-full"
                    >
                        <div className="aspect-square relative overflow-hidden rounded-t-xl">
                            <img
                                src={product.multimedia?.imagenes?.[0]?.url || '/images/placeholder.png'}
                                alt={product.nombre}
                                className="w-full h-full object-cover group-hover:scale-105 
                                         transition-transform duration-500"
                                loading="lazy"
                            />
                            
                            {/* Argentina Flag Badge */}
                            {product.tipoProducto === 'ProductoCarne' && 
                             product.origen?.pais?.toLowerCase() === 'argentina' && (
                                <div className="absolute top-2 left-2 z-20">
                                    <img
                                        src="/images/flags/argentina-flag.png"
                                        alt="Origen Argentina"
                                        className="w-8 h-8 rounded-full shadow-md"
                                        title="Producto de origen argentino"
                                    />
                                </div>
                            )}

                            {/* Conservation Badge - Moved to left side */}
                            {(() => {
                                const conservationInfo = getConservationInfo(product);
                                return (
                                    <div className={`absolute bottom-2 left-2 z-20 flex items-center gap-1.5 
                                                  px-2.5 py-1 rounded-full ${conservationInfo.bgColor} shadow-md`}>
                                        {conservationInfo.icon}
                                        <span className="text-xs font-medium text-gray-800">
                                            {conservationInfo.text}
                                        </span>
                                    </div>
                                );
                            })()}

                            {/* Discount Badge - Moved to right */}
                            {product.precios?.base && 
                             product.precioFinal < product.precios.base && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 
                                             rounded-md text-xs font-medium shadow-sm">
                                    {Math.round((1 - product.precioFinal / product.precios.base) * 100)}% OFF
                                </div>
                            )}

                            {/* Featured Badge - Adjust position to be below discount if present */}
                            {product.destacado && (
                                <div className={`absolute ${product.precios?.base && 
                                               product.precioFinal < product.precios.base ? 'top-10' : 'top-2'} 
                                               right-2 bg-yellow-500 text-white px-2 py-1 
                                               rounded-md text-xs font-medium shadow-sm`}>
                                    Destacado
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white 
                                         line-clamp-2 group-hover:text-blue-600 
                                         dark:group-hover:text-blue-400 min-h-[2.5rem]">
                                {product.nombre}
                            </h3>
                            
                            {product.tipoProducto === 'ProductoCarne' && (
                                <div className="mt-1 flex items-center">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                        {product.infoCarne?.tipoCarne || ''} • {product.infoCarne?.corte?.split('_').join(' ') || ''}
                                    </span>
                                </div>
                            )}
                            
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(product.precioFinal)}
                                </span>
                                {product.precios?.base && 
                                 product.precioFinal < product.precios.base && (
                                    <span className="text-xs text-gray-500 line-through">
                                        {formatCurrency(product.precios.base)}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={(e) => handleAddToCart(product, e)}
                                disabled={!product.inventario.stockUnidades}
                                className="mt-3 w-full px-3 py-2 text-sm font-medium 
                                         bg-blue-600 text-white rounded-lg
                                         hover:bg-blue-700 transition-colors duration-200 
                                         disabled:bg-gray-400 disabled:cursor-not-allowed
                                         flex items-center justify-center"
                            >
                                {product.inventario.stockUnidades ? (
                                    <>
                                        <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" 
                                             strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" 
                                             stroke="currentColor">
                                            <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                        </svg>
                                        Agregar
                                    </>
                                ) : 'Agotado'}
                            </button>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );

    const renderListView = () => (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
        >
            {sortedProducts.map((product) => (
                <motion.div 
                    key={product._id} 
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm 
                             hover:shadow-lg transition-all duration-300"
                >
                    <Link
                        to={`/product/${product.slug || product._id}`}
                        className="group flex flex-col sm:flex-row"
                    >
                        <div className="w-full sm:w-48 h-48 relative">
                            <img
                                src={product.multimedia?.imagenes?.[0]?.url || '/images/placeholder.png'}
                                alt={product.nombre}
                                className="w-full h-full object-cover rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none 
                                         group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                            />
                            
                            {/* Argentina Flag Badge */}
                            {product.tipoProducto === 'ProductoCarne' && 
                             product.origen?.pais?.toLowerCase() === 'argentina' && (
                                <div className="absolute top-2 left-2 z-20">
                                    <img
                                        src="/images/flags/argentina-flag.png"
                                        alt="Origen Argentina"
                                        className="w-8 h-8 rounded-full shadow-md"
                                        title="Producto de origen argentino"
                                    />
                                </div>
                            )}

                            {/* Conservation Badge - Moved to left side */}
                            {(() => {
                                const conservationInfo = getConservationInfo(product);
                                return (
                                    <div className={`absolute bottom-2 left-2 z-20 flex items-center gap-1.5 
                                                  px-2.5 py-1 rounded-full ${conservationInfo.bgColor} shadow-md`}>
                                        {conservationInfo.icon}
                                        <span className="text-xs font-medium text-gray-800">
                                            {conservationInfo.text}
                                        </span>
                                    </div>
                                );
                            })()}

                            {/* Discount Badge - Moved to right */}
                            {product.precios?.base && 
                             product.precioFinal < product.precios.base && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 
                                             rounded-md text-xs font-medium shadow-sm">
                                    {Math.round((1 - product.precioFinal / product.precios.base) * 100)}% OFF
                                </div>
                            )}

                            {/* Featured Badge - Adjust position to be below discount if present */}
                            {product.destacado && (
                                <div className={`absolute ${product.precios?.base && 
                                               product.precioFinal < product.precios.base ? 'top-10' : 'top-2'} 
                                               right-2 bg-yellow-500 text-white px-2 py-1 
                                               rounded-md text-xs font-medium shadow-sm`}>
                                    Destacado
                                </div>
                            )}
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white 
                                             group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                    {product.nombre}
                                </h3>
                                
                                {product.descripcion?.corta && (
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {product.descripcion.corta}
                                    </p>
                                )}
                                
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {product.tags?.slice(0, 3).map(tag => (
                                        <span key={tag} 
                                              className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 
                                                      text-gray-800 dark:text-gray-300 rounded-full text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mt-4 flex items-center justify-between">
                                <div>
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(product.precioFinal)}
                                    </span>
                                    {product.precios?.base && 
                                     product.precioFinal < product.precios.base && (
                                        <span className="ml-2 text-sm text-gray-500 line-through">
                                            {formatCurrency(product.precios.base)}
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={(e) => handleAddToCart(product, e)}
                                    disabled={!product.inventario.stockUnidades}
                                    className="px-4 py-2 text-sm font-medium 
                                             bg-blue-600 text-white rounded-lg
                                             hover:bg-blue-700 transition-colors duration-200 
                                             disabled:bg-gray-400 disabled:cursor-not-allowed
                                             flex items-center"
                                >
                                    {product.inventario.stockUnidades ? (
                                        <>
                                            <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" 
                                                 strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" 
                                                 stroke="currentColor">
                                                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                            </svg>
                                            Agregar
                                        </>
                                    ) : 'Agotado'}
                                </button>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Ocurrió un error
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                <button 
                    onClick={() => {
                        setError(null);
                        setLoading(true);
                        fetchProducts(); // Re-fetch without page reload
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg 
                             transition-colors duration-200 shadow-md"
                >
                    Intentar nuevamente
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Hero Banner */}
            <CategoryBanner 
                title={categoryName}
                description={getCategoryDescription()}
                imageUrl={getCategoryBanner()}
                productsCount={filteredProducts.length}
            />
            
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Mobile filter toggle */}
                <div className="md:hidden mb-4">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 
                                 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                        <span className="flex items-center text-gray-800 dark:text-gray-200">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filtros
                        </span>
                        <svg className={`w-5 h-5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} 
                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar Filters - Responsive */}
                    <aside className={`
                        ${isFilterOpen ? 'block' : 'hidden'} md:block
                        md:w-64 flex-shrink-0 transition-all duration-300 ease-in-out
                    `}>
                        <CategoryFilters
                            filters={filters}
                            handleFilterChange={handleFilterChange}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            categoryName={categoryName}
                            TIPOS_ACEITE={TIPOS_ACEITE}
                            METODOS_COCCION={METODOS_COCCION}
                            TIPOS_ENVASE={TIPOS_ENVASE}
                            availableTags={availableTags}
                            selectedTags={selectedTags}
                            onTagChange={handleTagChange}
                            matchAllTags={matchAllTags}
                            setMatchAllTags={setMatchAllTags}
                        />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* View controls and active filters */}
                        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex flex-wrap gap-2 items-center">
                                {selectedTags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Etiquetas:
                                        </span>
                                        {selectedTags.map(tag => (
                                            <span key={tag} className="flex items-center px-2 py-1 rounded-full 
                                                                text-xs bg-blue-100 text-blue-800 
                                                                dark:bg-blue-900 dark:text-blue-200">
                                                {tag}
                                                <button 
                                                    onClick={() => handleTagChange(tag)}
                                                    className="ml-1 text-blue-600 hover:text-blue-800 
                                                             dark:text-blue-300 dark:hover:text-blue-100"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                        <button 
                                            onClick={() => setSelectedTags([])}
                                            className="text-xs text-gray-600 hover:text-gray-900 
                                                     dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            Limpiar
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <div className="text-sm text-gray-600 dark:text-gray-400">Vista:</div>
                                <button
                                    onClick={() => setActiveView('grid')}
                                    className={`p-2 rounded-md ${
                                        activeView === 'grid' 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                    aria-label="Grid view"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setActiveView('list')}
                                    className={`p-2 rounded-md ${
                                        activeView === 'list' 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                    aria-label="List view"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                              d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        {sortedProducts.length > 0 ? (
                            <AnimatePresence mode="wait">
                                {activeView === 'grid' ? renderGridView() : renderListView()}
                            </AnimatePresence>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center"
                            >
                                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No se encontraron productos
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    No hay productos disponibles con los filtros seleccionados.
                                </p>
                                <button 
                                    onClick={() => {
                                        setFilters(DEFAULT_FILTERS);
                                        setSearchTerm('');
                                        setSelectedTags([]);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                                             hover:bg-blue-700 transition-colors"
                                >
                                    Limpiar filtros
                                </button>
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export { Categorias };