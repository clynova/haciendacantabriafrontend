import React from 'react';
import PropTypes from 'prop-types';
import { FormInput, FormSelect } from '../../common/FormInputs';

// Define constants or import them from a shared constants file
const TIPO_ACEITE = ['MARAVILLA', 'OLIVA', 'CANOLA', 'MIXTO'];
const TIPO_ENVASE = ['VACIO', 'CAJA', 'BOTELLA', 'BIDON', 'BOLSA'];

const METODOS_PRODUCCION = [
    'PRENSADO_MECANICO',
    'EXTRACCION_SOLVENTE',
    'CENTRIFUGACION',
    'DECANTACION',
    'FILTRACION_MEMBRANA'
];

// Define enums for oil characteristics
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

export const AceiteForm = ({ formData, handleInputChange }) => {
    const handleAditivosChange = (e) => {
        const { checked, value } = e.target;
        const currentAditivos = formData.caracteristicas.aditivos || [];
        
        const updatedAditivos = checked
            ? [...currentAditivos, value]
            : currentAditivos.filter(aditivo => aditivo !== value);

        handleInputChange({
            target: {
                name: 'aditivos',
                value: updatedAditivos
            }
        }, 'caracteristicas');
    };

    const formatEnumLabel = (value) => {
        return value.split('_').map(word => 
            word.charAt(0) + word.slice(1).toLowerCase()
        ).join(' ');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-200">Información del Aceite</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormSelect
                    label="Tipo de Aceite"
                    name="tipo"
                    value={formData.infoAceite.tipo}
                    onChange={(e) => handleInputChange(e, 'infoAceite')}
                    options={TIPO_ACEITE}
                    required
                />
                <FormInput
                    label="Volumen (ml)"
                    name="volumen"
                    type="number"
                    value={formData.infoAceite.volumen}
                    onChange={(e) => handleInputChange(e, 'infoAceite')}
                    min="0"
                    required
                />
                <FormSelect
                    label="Tipo de Envase"
                    name="envase"
                    value={formData.infoAceite.envase}
                    onChange={(e) => handleInputChange(e, 'infoAceite')}
                    options={TIPO_ENVASE}
                    required
                />
            </div>
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
                            value={formData.caracteristicas.acidez || ''}
                            onChange={(e) => handleInputChange(e, 'caracteristicas')}
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
                        value={formData.caracteristicas.filtracion || ''}
                        onChange={(e) => handleInputChange(e, 'caracteristicas')}
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
                        value={formData.caracteristicas.extraccion || ''}
                        onChange={(e) => handleInputChange(e, 'caracteristicas')}
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
                                    checked={formData.caracteristicas.aditivos?.includes(aditivo)}
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

            <h2 className="text-lg font-semibold text-slate-200 mt-6">Producción</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Método de Producción
                    </label>
                    <select
                        name="metodo"
                        value={formData.produccion?.metodo || ''}
                        onChange={(e) => handleInputChange(e, 'produccion')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                        required
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
                            value={formData.produccion?.temperatura || ''}
                            onChange={(e) => handleInputChange(e, 'produccion')}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white pr-12"
                            min="0"
                            max="300"
                            step="0.1"
                            required
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
                        value={formData.produccion?.fechaEnvasado || ''}
                        onChange={(e) => handleInputChange(e, 'produccion')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Fecha de Vencimiento
                    </label>
                    <input
                        type="date"
                        name="fechaVencimiento"
                        value={formData.produccion?.fechaVencimiento || ''}
                        onChange={(e) => handleInputChange(e, 'produccion')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                        required
                        min={formData.produccion?.fechaEnvasado || ''}
                    />
                    {formData.produccion?.fechaVencimiento && 
                     formData.produccion?.fechaEnvasado && 
                     new Date(formData.produccion.fechaVencimiento) <= new Date(formData.produccion.fechaEnvasado) && (
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
            tipo: PropTypes.string.isRequired,
            volumen: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            envase: PropTypes.string.isRequired
        }).isRequired,
        caracteristicas: PropTypes.shape({
            acidez: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            filtracion: PropTypes.string,
            extraccion: PropTypes.string,
            aditivos: PropTypes.arrayOf(PropTypes.string)
        }).isRequired,
        produccion: PropTypes.shape({
            metodo: PropTypes.string,
            temperatura: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            fechaEnvasado: PropTypes.string,
            fechaVencimiento: PropTypes.string
        }).isRequired
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired
};