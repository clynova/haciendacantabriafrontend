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
    // Asegurarnos de que caracteristicasAceite existe y tiene un array de aditivos
    const {
        caracteristicasAceite = {},
        caracteristicas = {}, // Añadir esto
        produccion = {},
        infoNutricional = {},
        usosRecomendados = []
    } = formData;

    // Usar el objeto correcto dependiendo del modo
    const aditivosData = mode === 'edit' ? caracteristicas : caracteristicasAceite;
    const aditivos = aditivosData?.aditivos || [];

    // Determinar qué objeto de características usar
    const caracteristicasData = mode === 'edit' ? formData.caracteristicas : formData.caracteristicasAceite;

    // Modificar el handleChange
    const handleChange = (e, section) => {
        const { name, value, type } = e.target;
        
        if (name === 'acidez') {
            handleInputChange({
                target: {
                    name,
                    value: value === '' ? '' : Number(value)
                }
            }, section);
            return;
        }

        handleInputChange({
            target: {
                name,
                value: value === '' ? '' : 
                    section === 'infoNutricional' ? value : 
                    parseFloat(value)
            }
        }, section);
    };

    // Actualizar handleAditivosChange
    const handleAditivosChange = (e) => {
        const { checked, value } = e.target;
        const updatedAditivos = checked
            ? [...aditivos, value]
            : aditivos.filter(aditivo => aditivo !== value);

        // En modo edición, usar 'caracteristicas', de lo contrario usar 'caracteristicasAceite'
        const targetSection = mode === 'edit' ? 'caracteristicas' : 'caracteristicasAceite';

        handleInputChange({
            target: {
                name: 'aditivos',
                value: updatedAditivos
            }
        }, targetSection);
    };

    // Corregir handleUsosRecomendadosChange
    const handleUsosRecomendadosChange = (e) => {
        const { checked, value } = e.target;
        const currentUsos = formData.usosRecomendados || [];
        
        const updatedUsos = checked
            ? [...currentUsos, value]
            : currentUsos.filter(uso => uso !== value);

        // Actualizar directamente en la raíz del formData
        handleInputChange({
            target: {
                name: 'usosRecomendados',
                value: updatedUsos
            }
        });
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
                <FormSelect
                    label="Tipo de Aceite"
                    name="tipo"
                    value={formData.infoAceite?.tipo || ''}
                    onChange={(e) => handleChange(e, 'infoAceite')}
                    options={TIPO_ACEITE.map(tipo => ({
                        value: tipo,
                        label: formatEnumLabel(tipo)
                    }))}
                    required
                />

                <FormSelect
                    label="Tipo de Envase"
                    name="envase"
                    value={formData.infoAceite?.envase || ''}
                    onChange={(e) => handleChange(e, 'infoAceite')}
                    options={TIPO_ENVASE.map(tipo => ({
                        value: tipo,
                        label: formatEnumLabel(tipo)
                    }))}
                />
            </div>
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
                            value={caracteristicasData?.acidez ?? ''} // Usar operador nullish
                            onChange={(e) => handleChange(e, mode === 'edit' ? 'caracteristicas' : 'caracteristicasAceite')}
                            step="any"
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
                        value={caracteristicasData?.filtracion || ''}
                        onChange={(e) => handleChange(e, mode === 'edit' ? 'caracteristicas' : 'caracteristicasAceite')}
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
                        value={caracteristicasData?.extraccion || ''}
                        onChange={(e) => handleChange(e, mode === 'edit' ? 'caracteristicas' : 'caracteristicasAceite')}
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
                                    checked={aditivos.includes(aditivo)}
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

            {/* Información Nutricional Section */}
            <div className="border-t border-slate-700 pt-6">
                <h3 className="text-md font-medium text-slate-300 mb-4">Información Nutricional</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                        label="Porción"
                        name="porcion"
                        value={formData.infoNutricional?.porcion || ''}
                        onChange={(e) => handleInputChange(e, 'infoNutricional')}
                        placeholder="Ej: 15ml"
                    />
                    
                    <FormInput
                        label="Calorías"
                        type="number"
                        name="calorias"
                        value={formData.infoNutricional?.calorias || ''}
                        onChange={(e) => handleInputChange(e, 'infoNutricional')}
                        min="0"
                        step="any"
                        placeholder="kcal"
                    />

                    <FormInput
                        label="Grasa Total (g)"
                        type="number"
                        name="grasaTotal"
                        value={formData.infoNutricional?.grasaTotal || ''}
                        onChange={(e) => handleInputChange(e, 'infoNutricional')}
                        min="0"
                        step="any"
                    />

                    <FormInput
                        label="Grasa Saturada (g)"
                        type="number"
                        name="grasaSaturada"
                        value={formData.infoNutricional?.grasaSaturada || ''}
                        onChange={(e) => handleInputChange(e, 'infoNutricional')}
                        min="0"
                        step="any"
                    />

                    <FormInput
                        label="Grasa Trans (g)"
                        type="number"
                        name="grasaTrans"
                        value={formData.infoNutricional?.grasaTrans || ''}
                        onChange={(e) => handleInputChange(e, 'infoNutricional')}
                        min="0"
                        step="any"
                    />

                    <FormInput
                        label="Grasa Poliinsaturada (g)"
                        type="number"
                        name="grasaPoliinsaturada"
                        value={formData.infoNutricional?.grasaPoliinsaturada || ''}
                        onChange={(e) => handleInputChange(e, 'infoNutricional')}
                        min="0"
                        step="any"
                    />

                    <FormInput
                        label="Grasa Monoinsaturada (g)"
                        type="number"
                        name="grasaMonoinsaturada"
                        value={formData.infoNutricional?.grasaMonoinsaturada || ''}
                        onChange={(e) => handleInputChange(e, 'infoNutricional')}
                        min="0"
                        step="any"
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
                            checked={formData.usosRecomendados?.includes(uso) || false}
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
        </div>
    );
};

AceiteForm.propTypes = {
    formData: PropTypes.shape({
        infoAceite: PropTypes.shape({
            tipo: PropTypes.oneOf(TIPO_ACEITE),
            envase: PropTypes.oneOf(TIPO_ENVASE)
        }).isRequired,
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
        usosRecomendados: PropTypes.arrayOf(PropTypes.string)
    }),
    handleInputChange: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['create', 'edit'])
};