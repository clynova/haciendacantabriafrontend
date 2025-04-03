import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { HiOutlineInformationCircle } from "react-icons/hi";
import { getImageUrl } from '../../utils/funcionesReutilizables';
import { memo } from 'react';

// Memoizamos el componente para evitar re-renderizados innecesarios
const SearchResults = memo(({ results, isLoading = false, onClose }) => {
    // Si está cargando, mostrar indicador de carga
    if (isLoading) {
        return (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-lg shadow-xl p-4 text-center z-50">
                <div className="flex justify-center items-center space-x-2">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                    <span className="text-slate-300">Buscando productos...</span>
                </div>
            </div>
        );
    }
    
    // Si no hay resultados, no mostrar nada
    if (results.length === 0) return null;
    
    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
            <div className="p-2 text-slate-400 text-sm border-b border-slate-700">
                {results.length} productos encontrados
            </div>
            <div className="divide-y divide-slate-700">
                {results.map((product) => (
                    <Link
                        key={product._id}
                        to={`/product/${product.slug || product._id}`}
                        className="flex items-center p-4 hover:bg-slate-700 transition-colors"
                        onClick={onClose}
                    >
                        <div className="w-12 h-12 flex-shrink-0 bg-slate-700 rounded overflow-hidden">
                            <img                        
                                src={product.multimedia?.imagenes?.[0]?.url || "/images/placeholder.png"}
                                alt={product.nombre}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                    e.target.src = "/images/placeholder.png";
                                }}
                            />
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{product.nombre}</p>
                            <p className="text-slate-400">${product.precioFinal.toLocaleString('es-AR')}</p>
                            {product.precios?.base && product.precioFinal < product.precios.base && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-slate-500 text-xs line-through">
                                        ${product.precios.base.toLocaleString('es-AR')}
                                    </span>
                                    <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                                        {Math.round((1 - product.precioFinal / product.precios.base) * 100)}% OFF
                                    </span>
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // Lógica de comparación personalizada para evitar renderizados innecesarios
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.results.length !== nextProps.results.length) return false;
    
    // Solo comparamos los IDs para evitar comparaciones profundas de objetos completos
    const prevIds = prevProps.results.map(item => item._id);
    const nextIds = nextProps.results.map(item => item._id);
    return prevIds.every((id, index) => id === nextIds[index]);
});

SearchResults.displayName = 'SearchResults'; // Ayuda en las herramientas de desarrollo

SearchResults.propTypes = {
    results: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ]).isRequired,
            slug: PropTypes.string,
            multimedia: PropTypes.shape({
                imagenes: PropTypes.arrayOf(
                    PropTypes.shape({
                        url: PropTypes.string,
                        textoAlternativo: PropTypes.string
                    })
                )
            }),
            nombre: PropTypes.string.isRequired,
            precioFinal: PropTypes.number.isRequired,
            precios: PropTypes.shape({
                base: PropTypes.number,
                descuentos: PropTypes.shape({
                    promocion: PropTypes.shape({
                        porcentaje: PropTypes.number,
                        activa: PropTypes.bool
                    })
                })
            })
        })
    ).isRequired,
    isLoading: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
};

export { SearchResults };
