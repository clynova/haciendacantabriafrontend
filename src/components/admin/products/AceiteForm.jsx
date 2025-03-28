import React from 'react';
import PropTypes from 'prop-types';
import { FormInput, FormSelect, FormTextarea } from '../../common/FormInputs';

// Define constants to match backend schema
const TIPO_ACEITE = ['MARAVILLA', 'OLIVA', 'CANOLA', 'MIXTO'];
const TIPO_ENVASE = ['VACIO', 'CAJA', 'BOTELLA', 'BIDON', 'BOLSA'];

const METODOS_PRODUCCION = [
    'PRENSADO_MECANICO',
    'EXTRACCION_SOLVENTE',
    'CENTRIFUGACION',
    'DECANTACION',
    'FILTRACION_MEMBRANA'
];

const FILTRACION_TIPOS = [
    'FILTRADO',
    'SIN_FILTRAR'
];

const EXTRACCION_TIPOS = [
    'PRENSADO_FRIO',
    'PRIMERA_PRENSADA',
    'REFINADO',
    'CENTRIFUGADO'
];

const ADITIVOS_COMUNES = [
    'ANTIOXIDANTES',
    'CONSERVANTES',
    'VITAMINA_E',
    'OMEGA_3',
    'OMEGA_6',
    'VITAMINA_A',
    'VITAMINA_D'
];

const USOS_RECOMENDADOS = [
    'ENSALADAS',
    'FRITURAS',
    'COCINAR',
    'ADEREZOS',
    'MARINADOS',
    'REPOSTERIA',
    'CONSUMO_DIRECTO',
    'SALSAS'
];

// Add this helper function at the top of the file
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

// Modify the component initialization to properly merge data
export const AceiteForm = ({ formData = {}, handleInputChange, mode = 'create' }) => {
    // Remove defaultProps and use direct destructuring with defaults
    const {
        caracteristicas = { aditivos: [] },
        produccion = {},
        infoNutricional = {},
        usosRecomendados = [],
        opcionesVolumen = []
    } = formData;

    // Update handleChange to properly handle edit mode
    const handleChange = (e, section) => {
        const { name, value, type } = e.target;
        const processedValue = type === 'number' ? Number(value) : value;

        handleInputChange(section, {
            ...formData[section],
            [name]: processedValue
        });
    };

    // Update handleAditivosChange
    const handleAditivosChange = (e) => {
        const { checked, value } = e.target;
        const currentAditivos = caracteristicas?.aditivos || [];
        const updatedAditivos = checked
            ? [...currentAditivos, value]
            : currentAditivos.filter(aditivo => aditivo !== value);

        handleInputChange('caracteristicas', {
            ...caracteristicas,
            aditivos: updatedAditivos
        });
    };

    // Update handleOpcionVolumenChange
    const handleOpcionVolumenChange = (index, field, value) => {
        const updatedOpciones = [...opcionesVolumen];
        
        if (!updatedOpciones[index]) {
            updatedOpciones[index] = {};
        }
        
        if (field === 'esPredeterminado' && value === true) {
            updatedOpciones.forEach((opcion, i) => {
                if (i !== index) opcion.esPredeterminado = false;
            });
        }
        
        updatedOpciones[index] = {
            ...updatedOpciones[index],
            [field]: value
        };

        handleInputChange('opcionesVolumen', updatedOpciones);
    };

    // Update handleUsosRecomendadosChange
    const handleUsosRecomendadosChange = (e) => {
        const { checked, value } = e.target;
        const updatedUsos = checked
            ? [...usosRecomendados, value]
            : usosRecomendados.filter(uso => uso !== value);

        handleInputChange('usosRecomendados', updatedUsos);
    };

    // Update addOpcionVolumen
    const addOpcionVolumen = () => {
        const newOpcion = {
            volumen: 0,
            precio: 0,
            sku: '',
            esPredeterminado: opcionesVolumen.length === 0
        };
        
        handleInputChange('opcionesVolumen', [...opcionesVolumen, newOpcion]);
    };

    // Update removeOpcionVolumen
    const removeOpcionVolumen = (index) => {
        const updatedOpciones = [...opcionesVolumen];
        const removedOpcion = updatedOpciones[index];
        updatedOpciones.splice(index, 1);

        if (removedOpcion.esPredeterminado && updatedOpciones.length > 0) {
            updatedOpciones[0].esPredeterminado = true;
        }

        handleInputChange('opcionesVolumen', updatedOpciones);
    };

    const formatEnumLabel = (value) => {
        return value.split('_').map(word => 
            word.charAt(0) + word.slice(1).toLowerCase()
        ).join(' ');
    };

    return (
        <div className="bg-slate-800 rounded-lg p-5 space-y-6">
            <h2 className="text-lg font-semibold text-slate-200">Características del Aceite</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Acidez */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Acidez (%)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            name="acidez"
                            value={caracteristicas.acidez || ''}
                            onChange={(e) => handleChange(e, 'caracteristicas')}
                            step="0.01"
                            min="0"
                            max="100"
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white pr-12"
                            placeholder="0.00"
                        />
                        <span className="absolute right-3 top-2 text-gray-400">%</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        Ingrese el porcentaje de acidez del aceite (0-100%)
                    </p>
                </div>

                {/* Filtración */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Tipo de Filtración
                    </label>
                    <select
                        name="filtracion"
                        value={caracteristicas.filtracion || ''}
                        onChange={(e) => handleChange(e, 'caracteristicas')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                    >
                        <option value="">Seleccione el tipo de filtración</option>
                        {FILTRACION_TIPOS.map(tipo => (
                            <option key={tipo} value={tipo}>
                                {formatEnumLabel(tipo)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Extracción */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Método de Extracción
                    </label>
                    <select
                        name="extraccion"
                        value={caracteristicas.extraccion || ''}
                        onChange={(e) => handleChange(e, 'caracteristicas')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                    >
                        <option value="">Seleccione el método de extracción</option>
                        {EXTRACCION_TIPOS.map(tipo => (
                            <option key={tipo} value={tipo}>
                                {formatEnumLabel(tipo)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Aditivos */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        Aditivos
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {ADITIVOS_COMUNES.map(aditivo => (
                            <div key={aditivo} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`aditivo-${aditivo}`}
                                    value={aditivo}
                                    checked={caracteristicas.aditivos?.includes(aditivo) || false}
                                    onChange={handleAditivosChange}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-500 bg-gray-700"
                                />
                                <label 
                                    htmlFor={`aditivo-${aditivo}`}
                                    className="text-sm text-gray-300 cursor-pointer"
                                >
                                    {formatEnumLabel(aditivo)}
                                </label>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        Seleccione todos los aditivos presentes en el aceite
                    </p>
                </div>
            </div>

            {/* Información Nutricional */}
            <h2 className="text-lg font-semibold text-slate-200 mt-6">Información Nutricional</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Porción
                    </label>
                    <input
                        type="text"
                        name="porcion"
                        value={infoNutricional.porcion || ''}
                        onChange={(e) => handleChange(e, 'infoNutricional')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                        placeholder="ej. 15ml (1 cucharada)"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Calorías (kcal)
                    </label>
                    <input
                        type="number"
                        name="calorias"
                        value={infoNutricional.calorias || ''}
                        onChange={(e) => handleChange(e, 'infoNutricional')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                        min="0"
                        step="0.1"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Grasa Total (g)
                    </label>
                    <input
                        type="number"
                        name="grasaTotal"
                        value={infoNutricional.grasaTotal || ''}
                        onChange={(e) => handleChange(e, 'infoNutricional')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                        min="0"
                        step="0.1"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Grasa Saturada (g)
                    </label>
                    <input
                        type="number"
                        name="grasaSaturada"
                        value={infoNutricional.grasaSaturada || ''}
                        onChange={(e) => handleChange(e, 'infoNutricional')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                        min="0"
                        step="0.1"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Grasa Trans (g)
                    </label>
                    <input
                        type="number"
                        name="grasaTrans"
                        value={infoNutricional.grasaTrans || ''}
                        onChange={(e) => handleChange(e, 'infoNutricional')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                        min="0"
                        step="0.1"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Grasa Poliinsaturada (g)
                    </label>
                    <input
                        type="number"
                        name="grasaPoliinsaturada"
                        value={infoNutricional.grasaPoliinsaturada || ''}
                        onChange={(e) => handleChange(e, 'infoNutricional')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                        min="0"
                        step="0.1"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Grasa Monoinsaturada (g)
                    </label>
                    <input
                        type="number"
                        name="grasaMonoinsaturada"
                        value={infoNutricional.grasaMonoinsaturada || ''}
                        onChange={(e) => handleChange(e, 'infoNutricional')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                        min="0"
                        step="0.1"
                    />
                </div>
            </div>

            {/* Usos Recomendados */}
            <h2 className="text-lg font-semibold text-slate-200 mt-6">Usos Recomendados</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {USOS_RECOMENDADOS.map(uso => (
                    <div key={uso} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={`uso-${uso}`}
                            value={uso}
                            checked={usosRecomendados.includes(uso)}
                            onChange={handleUsosRecomendadosChange}
                            className="w-4 h-4 text-blue-600 rounded border-gray-500 bg-gray-700"
                        />
                        <label 
                            htmlFor={`uso-${uso}`}
                            className="text-sm text-gray-300 cursor-pointer"
                        >
                            {formatEnumLabel(uso)}
                        </label>
                    </div>
                ))}
            </div>

            {/* Producción */}
            <h2 className="text-lg font-semibold text-slate-200 mt-6">Producción</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Método de Producción
                    </label>
                    <select
                        name="metodo"
                        value={produccion.metodo || ''}
                        onChange={(e) => handleChange(e, 'produccion')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                    >
                        <option value="">Seleccione el método</option>
                        {METODOS_PRODUCCION.map(metodo => (
                            <option key={metodo} value={metodo}>
                                {formatEnumLabel(metodo)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Temperatura de Producción (°C)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            name="temperatura"
                            value={produccion.temperatura || ''}
                            onChange={(e) => handleChange(e, 'produccion')}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white pr-12"
                            min="0"
                            max="300"
                            step="0.1"
                            placeholder="0.0"
                        />
                        <span className="absolute right-3 top-2 text-gray-400">°C</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Fecha de Envasado
                    </label>
                    <input
                        type="date"
                        name="fechaEnvasado"
                        value={formatDateForInput(produccion.fechaEnvasado)}
                        onChange={(e) => handleChange(e, 'produccion')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Fecha de Vencimiento
                    </label>
                    <input
                        type="date"
                        name="fechaVencimiento"
                        value={formatDateForInput(produccion.fechaVencimiento)}
                        onChange={(e) => handleChange(e, 'produccion')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                        min={formatDateForInput(produccion.fechaEnvasado)}
                    />
                    {produccion.fechaVencimiento && 
                     produccion.fechaEnvasado && 
                     new Date(produccion.fechaVencimiento) <= new Date(produccion.fechaEnvasado) && (
                        <p className="text-xs text-red-400 mt-1">
                            La fecha de vencimiento debe ser posterior a la fecha de envasado
                        </p>
                    )}
                </div>
            </div>

            {/* Opciones de Volumen */}
            <h2 className="text-lg font-semibold text-slate-200 mt-6">Opciones de Volumen</h2>
            <div className="space-y-4">
                {opcionesVolumen.map((opcion, index) => (
                    <div key={index} className="bg-slate-700 p-4 rounded-md">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-white font-medium">Opción {index + 1}</h3>
                            <button
                                type="button"
                                onClick={() => removeOpcionVolumen(index)}
                                className="text-red-400 hover:text-red-300"
                            >
                                Eliminar
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">
                                    Volumen (ml)
                                </label>
                                <input
                                    type="number"
                                    value={opcion.volumen || ''}
                                    onChange={(e) => handleOpcionVolumenChange(index, 'volumen', Number(e.target.value))}
                                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-white"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">
                                    Precio ($)
                                </label>
                                <input
                                    type="number"
                                    value={opcion.precio || ''}
                                    onChange={(e) => handleOpcionVolumenChange(index, 'precio', Number(e.target.value))}
                                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-white"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">
                                    SKU
                                </label>
                                <input
                                    type="text"
                                    value={opcion.sku || ''}
                                    onChange={(e) => handleOpcionVolumenChange(index, 'sku', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-white"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="flex items-center space-x-2 cursor-pointer mt-6">
                                    <input
                                        type="checkbox"
                                        checked={opcion.esPredeterminado || false}
                                        onChange={(e) => handleOpcionVolumenChange(index, 'esPredeterminado', e.target.checked)}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-500 bg-gray-700"
                                    />
                                    <span className="text-sm text-gray-300">
                                        Predeterminado
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addOpcionVolumen}
                    className="mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
                >
                    Agregar Opción de Volumen
                </button>
            </div>
        </div>
    );
};

AceiteForm.propTypes = {
    formData: PropTypes.shape({
        infoAceite: PropTypes.shape({
            tipo: PropTypes.string,
            volumen: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            envase: PropTypes.string
        }),
        caracteristicas: PropTypes.shape({
            acidez: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            filtracion: PropTypes.string,
            extraccion: PropTypes.string,
            aditivos: PropTypes.arrayOf(PropTypes.string)
        }),
        infoNutricional: PropTypes.shape({
            porcion: PropTypes.string,
            calorias: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            grasaTotal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            grasaSaturada: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            grasaTrans: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            grasaPoliinsaturada: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            grasaMonoinsaturada: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        }),
        produccion: PropTypes.shape({
            metodo: PropTypes.string,
            temperatura: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            fechaEnvasado: PropTypes.string,
            fechaVencimiento: PropTypes.string
        }),
        usosRecomendados: PropTypes.arrayOf(PropTypes.string),
        opcionesVolumen: PropTypes.arrayOf(PropTypes.shape({
            volumen: PropTypes.number,
            precio: PropTypes.number,
            sku: PropTypes.string,
            esPredeterminado: PropTypes.bool
        }))
    }),
    handleInputChange: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['create', 'edit'])
};