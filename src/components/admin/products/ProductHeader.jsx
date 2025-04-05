import PropTypes from 'prop-types';

export const ProductHeader = ({ onBack }) => {
    return (
        <div className="mb-8">
            {/* Navigation and Title */}
            <div className="flex items-center justify-between mb-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-2" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                    >
                        <path 
                            fillRule="evenodd" 
                            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                            clipRule="evenodd" 
                        />
                    </svg>
                    Volver a Productos
                </button>
            </div>

            {/* Header Content */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                    Crear Nuevo Producto
                </h1>
                <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Complete los detalles del producto. Los campos marcados con * son obligatorios.
                </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 dark:bg-slate-700 my-6" />
        </div>
    );
};

ProductHeader.propTypes = {
    onBack: PropTypes.func.isRequired
};