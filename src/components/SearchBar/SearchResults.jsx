import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { HiOutlineInformationCircle } from "react-icons/hi";

// Usando parámetros predeterminados de JavaScript en lugar de defaultProps
const SearchResults = ({ results, isLoading = false, onClose }) => {
    // Si está cargando, mostrar indicador de carga
    if (isLoading) {
        return (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-lg shadow-xl p-4 text-center">
                <div className="flex justify-center items-center space-x-2">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                    <span className="text-slate-300">Buscando productos...</span>
                </div>
            </div>
        );
    }
    
    // Si no hay resultados pero hubo una búsqueda
    if (results.length === 0) return null;
    
    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
            {results.length === 0 ? (
                <div className="p-4 text-center">
                    <HiOutlineInformationCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400">No se encontraron productos</p>
                </div>
            ) : (
                results.map((product) => (
                    <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        className="flex items-center p-4 hover:bg-slate-700 transition-colors"
                        onClick={onClose}
                    >
                        <img                        
                            src={product.images?.[0] || '/images/placeholder.png'} 
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                                e.target.src = "/images/placeholder.png";
                            }}
                        />
                        <div className="ml-4">
                            <p className="text-white font-medium">{product.name}</p>
                            <p className="text-slate-400">${product.price.toLocaleString('es-AR')}</p>
                            {product.discount > 0 && (
                                <div className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full inline-block mt-1">
                                    {product.discount}% OFF
                                </div>
                            )}
                        </div>
                    </Link>
                ))
            )}
        </div>
    );
};

SearchResults.propTypes = {
    results: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ]).isRequired,
            images: PropTypes.arrayOf(PropTypes.string),
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            discount: PropTypes.number,
            description: PropTypes.string
        })
    ).isRequired,
    isLoading: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
};

// Eliminamos la línea SearchResults.defaultProps

export { SearchResults };
