import { useState, useEffect } from 'react';
import { LoadingSpinner } from '../components/Loading/LoadingSpinner';
import { useGlobal } from '../context/GlobalContext';
import { searchProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/funcionesReutilizables';
import { CategoryFilters } from '../components/Categories/CategoryFilters';
import { getAllTags } from '../services/tagsService';

const DEFAULT_FILTERS = {
    estado: true,
    precioMin: '',
    precioMax: '',
    destacado: false,
    ordenar: '',
    tipoCarne: '',
    corte: '',
    marmoleo: '',
    metodosCoccion: [],
    pesoMin: '',
    pesoMax: '',
    tipoAceite: '',
    volumenMin: '',
    volumenMax: '',
    tipoEnvase: '',
    origen: '',
    marca: '',
    requiereRefrigeracion: false,
    requiereCongelacion: false
};

const AllProducts = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const { setPageTitle } = useGlobal();
    const { addToCart } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

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
                
                const response = await searchProducts();
                
                if (!response.success) {
                    throw new Error(response.error);
                }
                
                setProducts(response.products);
                setPageTitle(`Todos los productos (${response.products.length})`);

            } catch (err) {
                setError(err.message || 'Error al cargar los productos');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [setPageTitle]);

    const handleAddToCart = (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

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

        const matchesTags = selectedTags.length === 0 || 
            product.tags?.some(tag => selectedTags.includes(tag));

        let matchesProductType = true;

        if (product.tipoProducto === 'ProductoCarne' && (filters.tipoCarne || filters.corte || filters.marmoleo || filters.metodosCoccion.length)) {
            matchesProductType = (
                (!filters.tipoCarne || product.infoCarne?.tipoCarne === filters.tipoCarne) &&
                (!filters.corte || product.infoCarne?.corte === filters.corte) &&
                (!filters.marmoleo || product.caracteristicas?.marmoleo === Number(filters.marmoleo)) &&
                (!filters.metodosCoccion?.length || 
                    product.coccion?.metodos?.some(m => filters.metodosCoccion.includes(m)))
            );
        } else if (product.tipoProducto === 'ProductoAceite' && (filters.tipoAceite || filters.tipoEnvase)) {
            matchesProductType = (
                (!filters.tipoAceite || product.infoAceite?.tipo === filters.tipoAceite) &&
                (!filters.tipoEnvase || product.infoAceite?.envase === filters.tipoEnvase)
            );
        }

        return matchesSearch && matchesPrecio && matchesEstado && matchesDestacado && 
               matchesOrigen && matchesMarca && matchesConservacion && matchesProductType &&
               matchesTags;
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
            default:
                if (a.destacado && !b.destacado) return -1;
                if (!a.destacado && b.destacado) return 1;
                return 0;
        }
    });

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
                    onClick={() => window.location.reload()}
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
                        Todos los Productos
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {filteredProducts.length} productos encontrados
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <aside className="md:w-64 flex-shrink-0">
                        <CategoryFilters
                            filters={filters}
                            handleFilterChange={handleFilterChange}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            availableTags={availableTags}
                            selectedTags={selectedTags}
                            onTagChange={handleTagChange}
                        />
                    </aside>

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

export default AllProducts;