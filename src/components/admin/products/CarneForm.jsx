import React from 'react';
import PropTypes from 'prop-types';
import { FormInput, FormSelect } from '../../common/FormInputs';

// Updated enum values to match backend schema
const TIPO_CARNE = ['VACUNO', 'CERDO', 'POLLO', 'CORDERO', 'PAVO'];
const CORTES_VACUNO = [
    // Cortes Argentinos
    'BIFE_ANCHO', 'BIFE_ANGOSTO', 'BIFE_DE_PALETA', 'BIFE_DE_VACIO',
    'BOLA_DE_LOMO', 'BRAZUELO', 'CARNAZA_DE_CUADRADA', 'CARNAZA_PALETA',
    'CHINGOLO', 'COGOTE', 'COLITA_DE_CUADRIL', 'CORAZON_DE_CUADRIL',
    'ENTRAÑA_FINA', 'FALDA_DESHUESADA', 'GARRON', 'HUACHALOMO',
    'LOMO', 'MARUCHA', 'NALGA_DE_ADENTRO', 'PECETO',
    'PECHO', 'SOBRECOSTILLA', 'TAPA_DE_BIFE_ANCHO', 'TAPA_DE_CUADRIL',
    'TORTUGUITA', 'VACIO',

    // Cortes Chilenos
    'LOMO_VETADO', 'LOMO_LISO', 'ASADO_DEL_CARNICERO', 'PALANCA',
    'POSTA_ROSADA', 'OSOBUCO_DE_MANO', 'GANSO', 'POSTA_DE_PALETA',
    'CHOCLILLO', 'PUNTA_PICANA', 'ASIENTO', 'ENTRAÑA',
    'ALETILLA', 'OSOBUCO_DE_PIERNA', 'FILETE', 'PUNTA_DE_PALETA',
    'POSTA_NEGRA', 'POLLO_DE_GANSO', 'TAPAPECHO', 'PLATEADA',
    'PUNTA_DE_GANSO', 'ABASTERO', 'TAPABARRIGA',

    // Adicionales
    'MOLIDA_ESPECIAL', 'MOLIDA_CORRIENTE'
];

const COLORES_CARNE = [
    'ROJO_BRILLANTE',
    'ROJO_CEREZA',
    'ROJO_OSCURO',
    'ROSADO',
    'MARRON_CLARO',
    'MARRON_OSCURO'
];

const TEXTURAS_CARNE = [
    'TIERNA',
    'JUGOSA',
    'FIRME',
    'FIBROSA',
    'SUAVE',
    'ELASTICA',
    'COMPACTA',
    'GRANULADA'
];

const TIPO_ENVASE = [
    'BANDEJA',
    'VACIO',
    'CAJA',
    'GRANEL',
    'FILM',
    'MALLA'
];

const RAZAS_VACUNO = [
    'ANGUS',
    'HEREFORD',
    'WAGYU',
    'HOLSTEIN',
    'CHAROLAIS',
    'OTRAS'
];

const PAISES = [
    'CHILE',
    'ARGENTINA',
    'BRASIL',
    'URUGUAY',
    'PARAGUAY'
];

const formatCorteLabel = (corte) => {
    return corte
        .split('_')
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ');
};

export const CarneForm = ({ formData = {}, handleInputChange }) => {
    const infoCarne = formData.infoCarne || {};
    const precios = formData.precios || {};

    const handleTexturaChange = (e) => {
        const { checked, value } = e.target;
        const currentTexturas = formData.caracteristicasCarne.textura || [];
        
        const updatedTexturas = checked
            ? [...currentTexturas, value]
            : currentTexturas.filter(t => t !== value);

        handleInputChange({
            target: {
                name: 'textura',
                value: updatedTexturas
            }
        }, 'caracteristicasCarne');
    };

    const formatEnumLabel = (value) => {
        return value.split('_')
            .map(word => word.charAt(0) + word.slice(1).toLowerCase())
            .join(' ');
    };

    const handlePesoVariableChange = (e) => {
        const { checked } = e.target;
        handleInputChange({
            target: {
                name: 'esPesoVariable',
                value: checked
            }
        }, 'peso');

        // Reset weight values if changing to fixed weight
        if (!checked) {
            handleInputChange({
                target: {
                    name: 'pesoMinimo',
                    value: ''
                }
            }, 'peso');
            handleInputChange({
                target: {
                    name: 'pesoMaximo',
                    value: ''
                }
            }, 'peso');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-200">Información de la Carne</h2>
            <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        label="Precio por Kg"
                        name="precioPorKg"
                        type="number"
                        value={precios.precioPorKg || ''}
                        onChange={(e) => handleInputChange(e, 'precios')}
                        step="0.01"
                    />
                    <FormSelect
                        label="Tipo de Carne"
                        name="tipoCarne"
                        value={infoCarne.tipoCarne || ''}
                        onChange={(e) => handleInputChange(e, 'infoCarne')}
                        options={TIPO_CARNE}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Corte *
                    </label>
                    <select
                        name="corte"
                        value={formData.infoCarne.corte}
                        onChange={(e) => handleInputChange(e, 'infoCarne')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                        required
                    >
                        {CORTES_VACUNO.map(corte => (
                            <option key={corte} value={corte}>
                                {formatCorteLabel(corte)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                    label="Precio por Kg *"
                    name="precioPorKg"
                    type="number"
                    value={formData.infoCarne.precioPorKg}
                    onChange={(e) => handleInputChange(e, 'infoCarne')}
                    min="0"
                    step="0.01"
                    required
                />

                <FormInput
                    label="Stock (Kg) *"
                    name="stockKg"
                    type="number"
                    value={formData.inventario.stockKg}
                    onChange={(e) => handleInputChange(e, 'inventario')}
                    min="0"
                    step="0.01"
                    required
                />

                <FormInput
                    label="Nombre Argentino"
                    name="nombreArgentino"
                    value={formData.infoCarne.nombreArgentino}
                    onChange={(e) => handleInputChange(e, 'infoCarne')}
                />

                <FormInput
                    label="Nombre Chileno"
                    name="nombreChileno"
                    value={formData.infoCarne.nombreChileno}
                    onChange={(e) => handleInputChange(e, 'infoCarne')}
                />
            </div>

            {/* Características de la Carne */}
            <div className="mt-6">
                <h3 className="text-md font-semibold text-slate-300 mb-4">Características</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label="Porcentaje de Grasa"
                        name="porcentajeGrasa"
                        type="number"
                        value={formData.caracteristicasCarne.porcentajeGrasa}
                        onChange={(e) => handleInputChange(e, 'caracteristicasCarne')}
                        min="0"
                        max="100"
                    />
                    <FormInput
                        label="Marmoleo (1-5)"
                        name="marmoleo"
                        type="number"
                        value={formData.caracteristicasCarne.marmoleo}
                        onChange={(e) => handleInputChange(e, 'caracteristicasCarne')}
                        min="1"
                        max="5"
                    />
                </div>
            </div>

            <h3 className="text-md font-medium text-slate-300 mb-3">Características de la Carne</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Color Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Color de la Carne *
                    </label>
                    <select
                        name="color"
                        value={formData.caracteristicasCarne.color || ''}
                        onChange={(e) => handleInputChange(e, 'caracteristicasCarne')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                        required
                    >
                        <option value="">Seleccione el color</option>
                        {COLORES_CARNE.map(color => (
                            <option key={color} value={color}>
                                {formatEnumLabel(color)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Texture Selection */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        Texturas *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {TEXTURAS_CARNE.map(textura => (
                            <div key={textura} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`textura-${textura}`}
                                    value={textura}
                                    checked={formData.caracteristicasCarne.textura?.includes(textura)}
                                    onChange={handleTexturaChange}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-500 bg-gray-700"
                                />
                                <label 
                                    htmlFor={`textura-${textura}`}
                                    className="text-sm text-gray-300 cursor-pointer"
                                >
                                    {formatEnumLabel(textura)}
                                </label>
                            </div>
                        ))}
                    </div>
                    {formData.caracteristicasCarne.textura?.length === 0 && (
                        <p className="text-xs text-red-400 mt-1">
                            Seleccione al menos una textura
                        </p>
                    )}
                </div>
            </div>

            <div className="border-t border-slate-700 pt-6">
                <h3 className="text-md font-medium text-slate-300 mb-4">Opciones de Peso</h3>
                
                {/* Peso Variable Switch */}
                <div className="flex items-center mb-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={formData.peso?.esPesoVariable || false}
                            onChange={handlePesoVariableChange}
                        />
                        <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-slate-300">
                            Peso Variable
                        </span>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Peso Promedio */}
                    <FormInput
                        label="Peso Promedio (kg)"
                        type="number"
                        name="pesoPromedio"
                        value={formData.peso?.pesoPromedio || ''}
                        onChange={(e) => handleInputChange(e, 'peso')}
                        min="0.001"
                        step="0.001"
                        required
                        helperText="Peso promedio por unidad"
                    />

                    {formData.peso?.esPesoVariable && (
                        <>
                            {/* Peso Mínimo */}
                            <FormInput
                                label="Peso Mínimo (kg)"
                                type="number"
                                name="pesoMinimo"
                                value={formData.peso?.pesoMinimo || ''}
                                onChange={(e) => handleInputChange(e, 'peso')}
                                min="0.001"
                                step="0.001"
                                required
                                helperText="Peso mínimo aceptable"
                            />

                            {/* Peso Máximo */}
                            <FormInput
                                label="Peso Máximo (kg)"
                                type="number"
                                name="pesoMaximo"
                                value={formData.peso?.pesoMaximo || ''}
                                onChange={(e) => handleInputChange(e, 'peso')}
                                min={formData.peso?.pesoMinimo || 0}
                                step="0.001"
                                required
                                helperText="Peso máximo aceptable"
                            />
                        </>
                    )}
                </div>

                {/* Validation Messages */}
                {formData.peso?.pesoMaximo && 
                 formData.peso?.pesoMinimo && 
                 Number(formData.peso.pesoMaximo) <= Number(formData.peso.pesoMinimo) && (
                    <p className="text-xs text-red-400 mt-2">
                        El peso máximo debe ser mayor que el peso mínimo
                    </p>
                )}
            </div>

            {/* Empaque Section */}
            <div className="border-t border-slate-700 pt-6">
                <h3 className="text-md font-medium text-slate-300 mb-4">Empaque</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                            Tipo de Envase *
                        </label>
                        <select
                            name="tipo"
                            value={formData.empaque?.tipo || ''}
                            onChange={(e) => handleInputChange(e, 'empaque')}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                            required
                        >
                            <option value="">Seleccione tipo</option>
                            {TIPO_ENVASE.map(tipo => (
                                <option key={tipo} value={tipo}>
                                    {tipo.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    <FormInput
                        label="Unidades por Caja"
                        type="number"
                        name="unidadesPorCaja"
                        value={formData.empaque?.unidadesPorCaja || ''}
                        onChange={(e) => handleInputChange(e, 'empaque')}
                        min="1"
                        required
                    />

                    <FormInput
                        label="Peso por Caja (kg)"
                        type="number"
                        name="pesoCaja"
                        value={formData.empaque?.pesoCaja || ''}
                        onChange={(e) => handleInputChange(e, 'empaque')}
                        min="0.001"
                        step="0.001"
                        required
                    />
                </div>
            </div>

            {/* Origen Section */}
            <div className="border-t border-slate-700 pt-6">
                <h3 className="text-md font-medium text-slate-300 mb-4">Origen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                            País de Origen *
                        </label>
                        <select
                            name="pais"
                            value={formData.origen?.pais || ''}
                            onChange={(e) => handleInputChange(e, 'origen')}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                            required
                        >
                            <option value="">Seleccione país</option>
                            {PAISES.map(pais => (
                                <option key={pais} value={pais}>
                                    {pais.charAt(0) + pais.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <FormInput
                        label="Región"
                        name="region"
                        value={formData.origen?.region || ''}
                        onChange={(e) => handleInputChange(e, 'origen')}
                        placeholder="Ej: Región Metropolitana"
                    />

                    <FormInput
                        label="Productor"
                        name="productor"
                        value={formData.origen?.productor || ''}
                        onChange={(e) => handleInputChange(e, 'origen')}
                        placeholder="Nombre del productor"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                            Raza *
                        </label>
                        <select
                            name="raza"
                            value={formData.origen?.raza || ''}
                            onChange={(e) => handleInputChange(e, 'origen')}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                            required
                        >
                            <option value="">Seleccione raza</option>
                            {RAZAS_VACUNO.map(raza => (
                                <option key={raza} value={raza}>
                                    {raza.charAt(0) + raza.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <FormInput
                        label="Tiempo de Maduración (días)"
                        type="number"
                        name="maduracion"
                        value={formData.origen?.maduracion || ''}
                        onChange={(e) => handleInputChange(e, 'origen')}
                        min="0"
                        helperText="Días de maduración"
                    />
                </div>
            </div>

            {/* Procesamiento Section */}
            <div className="border-t border-slate-700 pt-6">
                <h3 className="text-md font-medium text-slate-300 mb-4">Procesamiento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                            Fecha de Faenado *
                        </label>
                        <input
                            type="date"
                            name="fechaFaenado"
                            value={formData.procesamiento?.fechaFaenado || ''}
                            onChange={(e) => handleInputChange(e, 'procesamiento')}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                            Fecha de Envasado *
                        </label>
                        <input
                            type="date"
                            name="fechaEnvasado"
                            value={formData.procesamiento?.fechaEnvasado || ''}
                            onChange={(e) => handleInputChange(e, 'procesamiento')}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                            required
                            min={formData.procesamiento?.fechaFaenado || ''}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                            Fecha de Vencimiento *
                        </label>
                        <input
                            type="date"
                            name="fechaVencimiento"
                            value={formData.procesamiento?.fechaVencimiento || ''}
                            onChange={(e) => handleInputChange(e, 'procesamiento')}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                            required
                            min={formData.procesamiento?.fechaEnvasado || ''}
                        />
                    </div>

                    <FormInput
                        label="Número de Lote"
                        name="numeroLote"
                        value={formData.procesamiento?.numeroLote || ''}
                        onChange={(e) => handleInputChange(e, 'procesamiento')}
                        required
                        placeholder="Ej: LOT-2025-001"
                    />
                </div>
                
                {/* Date validation messages */}
                {formData.procesamiento?.fechaEnvasado && 
                 formData.procesamiento?.fechaFaenado && 
                 new Date(formData.procesamiento.fechaEnvasado) < new Date(formData.procesamiento.fechaFaenado) && (
                    <p className="text-xs text-red-400 mt-2">
                        La fecha de envasado debe ser posterior a la fecha de faenado
                    </p>
                )}
                
                {formData.procesamiento?.fechaVencimiento && 
                 formData.procesamiento?.fechaEnvasado && 
                 new Date(formData.procesamiento.fechaVencimiento) <= new Date(formData.procesamiento.fechaEnvasado) && (
                    <p className="text-xs text-red-400 mt-2">
                        La fecha de vencimiento debe ser posterior a la fecha de envasado
                    </p>
                )}
            </div>
        </div>
    );
};

CarneForm.propTypes = {
    formData: PropTypes.shape({
        caracteristicasCarne: PropTypes.shape({
            color: PropTypes.string,
            textura: PropTypes.arrayOf(PropTypes.string),
            // ...other props
        }).isRequired,
        peso: PropTypes.shape({
            esPesoVariable: PropTypes.bool,
            pesoPromedio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            pesoMinimo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            pesoMaximo: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        }),
        empaque: PropTypes.shape({
            tipo: PropTypes.string,
            unidadesPorCaja: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            pesoCaja: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        }),
        origen: PropTypes.shape({
            pais: PropTypes.string,
            region: PropTypes.string,
            productor: PropTypes.string,
            raza: PropTypes.string,
            maduracion: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        }),
        procesamiento: PropTypes.shape({
            fechaFaenado: PropTypes.string,
            fechaEnvasado: PropTypes.string,
            fechaVencimiento: PropTypes.string,
            numeroLote: PropTypes.string
        })
        // ...other form data props
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired
};