import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LoadingSpinner } from '../components/Loading/LoadingSpinner';
import { useGlobal } from '../context/GlobalContext';
import { searchProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/funcionesReutilizables';
import { CategoryFilters } from '../components/Categories/CategoryFilters';
import { getAllTags, getProductsByTags } from '../services/tagsService';

const CORTES_VACUNO = [
    'BIFE_ANCHO', 'BIFE_ANGOSTO', 'BIFE_DE_PALETA', 'BIFE_DE_VACIO',
    'BOLA_DE_LOMO', 'BRAZUELO', 'CARNAZA_DE_CUADRADA', 'CARNAZA_PALETA',
    'CHINGOLO', 'COGOTE', 'COLITA_DE_CUADRIL', 'CORAZON_DE_CUADRIL',
    'ENTRAÑA_FINA', 'FALDA_DESHUESADA', 'GARRON', 'HUACHALOMO',
    'LOMO', 'MARUCHA', 'NALGA_DE_ADENTRO', 'PECETO',
    'PECHO', 'SOBRECOSTILLA', 'TAPA_DE_BIFE_ANCHO', 'TAPA_DE_CUADRIL',
    'TORTUGUITA', 'VACIO'
];

const TIPOS_ACEITE = ['OLIVA', 'GIRASOL', 'MAIZ', 'MEZCLA'];

const METODOS_COCCION = ['PARRILLA', 'HORNO', 'SARTEN', 'PLANCHA'];

const TIPOS_ENVASE = ['BOTELLA', 'BIDON', 'LATA'];

const OFFER_TAGS = ['promocion', 'oferta', 'descuento'];

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

const OFFERS_CATEGORY = 'ofertas';

const Categorias = () => {
    const { nombre } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const { setPageTitle } = useGlobal();
    const { addToCart } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [retryCount, setRetryCount] = useState(0);
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [matchAllTags, setMatchAllTags] = useState(true);

    // Function to format category name based on specific rules
    const formatCategoryName = (name) => {
        // List of categories that should be in uppercase
        const upperCaseCategories = ['vacuno', 'pollo', 'cerdo', 'aceite', 'carne'];
        
        // Handle hyphens first
        const normalizedName = name.split('-').join(' ');
        
        // Check if category should be uppercase
        if (upperCaseCategories.includes(normalizedName.toLowerCase())) {
            return normalizedName.toUpperCase();
        }

        // Default formatting for other categories
        return normalizedName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const categoryName = formatCategoryName(nombre);

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
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                let productsData;
                
                if (selectedTags.length > 0) {
                    // Fetch products by tags
                    const tagResponse = await getProductsByTags(selectedTags, matchAllTags);
                    if (!tagResponse.success) {
                        throw new Error(tagResponse.error);
                    }
                    productsData = tagResponse.products;
                } else {
                    // Handle offers category differently
                    const response = await searchProducts({ 
                        categoria: nombre.toLowerCase() === OFFERS_CATEGORY ? '' : categoryName
                    });
                    
                    if (!response.success) {
                        throw new Error(response.error);
                    }
                    
                    productsData = response.products;

                    // Filter for offers if we're in the offers category
                    if (nombre.toLowerCase() === OFFERS_CATEGORY) {
                        productsData = productsData.filter(product => 
                            product.tags?.some(tag => OFFER_TAGS.includes(tag.toLowerCase()))
                        );
                    }
                }

                setProducts(productsData);
                
                // Set appropriate page title
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
        };

        fetchProducts();
    }, [nombre, setPageTitle, categoryName, selectedTags, matchAllTags]);

    useEffect(() => {
        // Reset filters when category changes
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

    // Filter and search logic
    const filteredProducts = products.filter(product => {
        // Basic search
        const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.descripcion?.corta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        // Price range
        const matchesPrecio = (!filters.precioMin || product.precioFinal >= Number(filters.precioMin)) &&
                             (!filters.precioMax || product.precioFinal <= Number(filters.precioMax));

        // Base product filters
        const matchesEstado = !filters.estado || product.estado === filters.estado;
        const matchesDestacado = !filters.destacado || product.destacado === true;
        const matchesOrigen = !filters.origen || product.infoAdicional?.origen === filters.origen;
        const matchesMarca = !filters.marca || product.infoAdicional?.marca === filters.marca;
        const matchesConservacion = (
            (!filters.requiereRefrigeracion || product.conservacion?.requiereRefrigeracion === true) &&
            (!filters.requiereCongelacion || product.conservacion?.requiereCongelacion === true)
        );

        // Product type specific filters
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

    // Sort products based on selected option
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
        
        // Handle price validation
        if (name === 'precioMin' || name === 'precioMax') {
            // Allow empty string or positive numbers only
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
                        setRetryCount(prev => prev + 1);
                        fetchProducts(); // Re-fetch without page reload
                    }}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 
                             dark:hover:text-blue-300 transition-colors"
                >
                    Intentar nuevamente
                </button>
            </div>
        );
    }

    return (
        <div className="pt-16">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 
                                 dark:text-gray-100 mb-4">
                        {categoryName}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {filteredProducts.length} productos encontrados
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar Filters */}
                    <aside className="md:w-64 flex-shrink-0">
                        <CategoryFilters
                            filters={filters}
                            handleFilterChange={handleFilterChange}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            categoryName={categoryName}
                            CORTES_VACUNO={CORTES_VACUNO}
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

                    {/* Products Grid - Updated with smaller cards */}
                    <main className="flex-1">
                        {sortedProducts.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {sortedProducts.map((product) => (
                                    <Link
                                        key={product._id}
                                        to={`/product/${product.slug || product._id}`}
                                        className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm 
                                                 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="aspect-square relative overflow-hidden rounded-t-lg">
                                            <img
                                                src={product.multimedia?.imagenes?.[0]?.url || '/images/placeholder.png'}
                                                alt={product.nombre}
                                                className="w-full h-full object-cover group-hover:scale-105 
                                                         transition-transform duration-300"
                                                loading="lazy"
                                            />
                                        </div>

                                        <div className="p-3">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white 
                                                         line-clamp-1 group-hover:text-blue-600 
                                                         dark:group-hover:text-blue-400">
                                                {product.nombre}
                                            </h3>
                                            
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
                                                className="mt-2 w-full px-3 py-1.5 text-sm font-medium 
                                                         bg-blue-600 text-white rounded-md 
                                                         hover:bg-blue-700 transition-colors duration-200 
                                                         disabled:bg-gray-400 disabled:cursor-not-allowed"
                                            >
                                                {product.inventario.stockUnidades ? 
                                                    'Agregar' : 'Agotado'}
                                            </button>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-600 dark:text-gray-400">
                                    No se encontraron productos con los filtros seleccionados.
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export { Categorias };