import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LoadingSpinner } from '../components/Loading/LoadingSpinner';
import { useGlobal } from '../context/GlobalContext';
import { searchProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/funcionesReutilizables';
import { CategoryFilters } from '../components/Categories/CategoryFilters';

const CORTES_VACUNO = [
    'ASADO', 'BIFE', 'LOMO', 'COSTILLA', 'PICANHA', 
    'OSOBUCO', 'MATAMBRE', 'ENTRAÑA'
];

const TIPOS_ACEITE = ['OLIVA', 'GIRASOL', 'MAIZ', 'MEZCLA'];

const METODOS_COCCION = ['PARRILLA', 'HORNO', 'SARTEN', 'PLANCHA'];

const TIPOS_ENVASE = ['BOTELLA', 'BIDON', 'LATA'];

const Categorias = () => {
    const { nombre } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const { setPageTitle } = useGlobal();
    const { addToCart } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        estado: '',
        precioMin: '',
        precioMax: '',
        destacado: false,
        ordenar: '',
        tipoCarne: '', // Add this
        corteVacuno: '',
        tipoAceite: '',
        metodoCoccion: '',
        tipoEnvase: ''
    });
    const [retryCount, setRetryCount] = useState(0);

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
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await searchProducts({ 
                    categoria: categoryName
                });
                
                const productsData = response?.products || [];

                if (!Array.isArray(productsData)) {
                    setProducts([]);
                    return;
                }

                setProducts(productsData);
                setPageTitle(`Categoría: ${categoryName}`);
            } catch (err) {
                setError(err.message || 'Error al cargar los productos');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [nombre, setPageTitle, categoryName]);

    const handleAddToCart = (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    // Filter and search logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.descripcion?.corta?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesPrecio = (!filters.precioMin || product.precioFinal >= Number(filters.precioMin)) &&
                             (!filters.precioMax || product.precioFinal <= Number(filters.precioMax));
        
        const matchesEstado = !filters.estado || product.estado === filters.estado;
        
        const matchesDestacado = !filters.destacado || product.destacado === true;

        // Update meat type filter logic
        const matchesTipoCarne = !filters.tipoCarne || 
                                (product.tipoProducto === 'ProductoCarne' && 
                                 product.infoCarne?.tipoCarne === filters.tipoCarne);

        // Only apply corteVacuno filter if tipoCarne is VACUNO
        const matchesCorteVacuno = !filters.corteVacuno || 
                                  (filters.tipoCarne === 'VACUNO' && 
                                   product.infoCarne?.corte === filters.corteVacuno);

        const matchesTipoAceite = !filters.tipoAceite || 
            (product.tipoProducto === 'ProductoAceite' && 
             product.infoAceite?.tipo === filters.tipoAceite);

        const matchesMetodoCoccion = !filters.metodoCoccion || 
            (product.tipoProducto === 'ProductoVacuno' && 
             product.infoVacuno?.metodoCoccion === filters.metodoCoccion);

        const matchesTipoEnvase = !filters.tipoEnvase || 
            (product.tipoProducto === 'ProductoAceite' && 
             product.infoAceite?.envase === filters.tipoEnvase);

        return matchesSearch && matchesPrecio && matchesEstado && matchesDestacado &&
               matchesTipoCarne && matchesCorteVacuno && matchesTipoAceite && matchesMetodoCoccion && matchesTipoEnvase;
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
            default:
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