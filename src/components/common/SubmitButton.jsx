export const SubmitButton = ({ loading }) => {
    return (
        <div className="flex justify-end pt-6">
            <button
                type="submit"
                disabled={loading}
                className={`
                    px-6 py-2 rounded-lg text-white font-medium
                    ${loading 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600'}
                    transition-colors duration-200
                    flex items-center space-x-2
                `}
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle 
                                className="opacity-25" 
                                cx="12" 
                                cy="12" 
                                r="10" 
                                stroke="currentColor" 
                                strokeWidth="4"
                            />
                            <path 
                                className="opacity-75" 
                                fill="currentColor" 
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        <span>Creando Producto...</span>
                    </>
                ) : (
                    <>
                        <span>Crear Producto</span>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                        >
                            <path 
                                fillRule="evenodd" 
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" 
                                clipRule="evenodd" 
                            />
                        </svg>
                    </>
                )}
            </button>
        </div>
    );
};