import React from 'react';
import PropTypes from 'prop-types';

// Definir todos los tipos de productos y sus categorías
const PRODUCT_TYPES = [
    { value: 'ProductoAceite', label: 'Aceite', categoria: 'ACEITE' },
    { value: 'ProductoCarne', label: 'Carne', categoria: 'CARNE' },
    { value: 'ProductoBase', label: 'Condimento', categoria: 'CONDIMENTO' },
    { value: 'ProductoBase', label: 'Accesorio', categoria: 'ACCESORIO' },
    { value: 'ProductoBase', label: 'Otro', categoria: 'OTRO' }
];

export const ProductTypeSelector = ({ selectedType, selectedCategoria, onChange }) => {
    return (
        <div className=" rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Tipo de Producto</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {PRODUCT_TYPES.map((type) => (
                    <button
                        key={`${type.value}-${type.categoria}`}
                        type="button"
                        onClick={() => onChange({
                            target: { 
                                value: type.value,
                                dataset: { categoria: type.categoria }
                            }
                        })}
                        className={`py-2 px-4 rounded-md text-center transition-colors ${
                            selectedType === type.value && selectedCategoria === type.categoria
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-600 text-gray-200 hover:bg-slate-500'
                        }`}
                    >
                        {type.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

ProductTypeSelector.propTypes = {
    selectedType: PropTypes.string.isRequired,
    selectedCategoria: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};