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

const TIPO_ENVASE = ['VACIO', 'CAJA', 'BOTELLA', 'BIDON', 'BOLSA'];

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

const METODOS_COCCION = [
    'PARRILLA', 'SARTEN', 'HORNO', 'COCCION_LENTA', 'SOUS_VIDE', 'GUISO'
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
        const currentTexturas = formData.caracteristicas.textura || [];
        
        const updatedTexturas = checked
            ? [...currentTexturas, value]
            : currentTexturas.filter(t => t !== value);

        handleInputChange({
            target: {
                name: 'textura',
                value: updatedTexturas
            }
        }, 'caracteristicas'); // Cambiar 'caracteristicasCarne' por 'caracteristicas'
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
        }, 'opcionesPeso');  // Cambiado de 'peso' a 'opcionesPeso'

        // Reset weight values if changing to fixed weight
        if (!checked) {
            handleInputChange({
                target: {
                    name: 'pesoMinimo',
                    value: ''
                }
            }, 'opcionesPeso');  // Cambiado de 'peso' a 'opcionesPeso'
            handleInputChange({
                target: {
                    name: 'pesoMaximo',
                    value: ''
                }
            }, 'opcionesPeso');  // Cambiado de 'peso' a 'opcionesPeso'
        }
    };

    const handlePesoEstandarChange = (index, field, value) => {
        const updatedPesos = [...(formData.opcionesPeso?.pesosEstandar || [])];
        updatedPesos[index] = {
            ...updatedPesos[index],
            [field]: field === 'peso' || field === 'precio' ? Number(value) : value
        };
        
        handleInputChange({
            target: {
                name: 'pesosEstandar',
                value: updatedPesos
            }
        }, 'opcionesPeso');
    };

    const addPesoEstandar = () => {
        const newPesoEstandar = {
            peso: 0,
            unidad: 'g',
            esPredeterminado: false,
            precio: 0,
            sku: ''
        };
        
        const updatedPesos = [...(formData.opcionesPeso?.pesosEstandar || []), newPesoEstandar];
        
        handleInputChange({
            target: {
                name: 'pesosEstandar',
                value: updatedPesos
            }
        }, 'opcionesPeso');
    };

    const removePesoEstandar = (index) => {
        const updatedPesos = [...(formData.opcionesPeso?.pesosEstandar || [])];
        updatedPesos.splice(index, 1);
        
        handleInputChange({
            target: {
                name: 'pesosEstandar',
                value: updatedPesos
            }
        }, 'opcionesPeso');
    };

    const handleRangoPreferidoChange = (index, field, value) => {
        const updatedRangos = [...(formData.opcionesPeso?.rangosPreferidos || [])];
        updatedRangos[index] = {
            ...updatedRangos[index],
            [field]: field === 'pesoMinimo' || field === 'pesoMaximo' ? Number(value) : value
        };
        
        handleInputChange({
            target: {
                name: 'rangosPreferidos',
                value: updatedRangos
            }
        }, 'opcionesPeso');
    };

    const addRangoPreferido = () => {
        const newRango = {
            nombre: '',
            pesoMinimo: 0,
            pesoMaximo: 0,
            descripcion: '',
            esPredeterminado: false
        };
        
        const updatedRangos = [...(formData.opcionesPeso?.rangosPreferidos || []), newRango];
        
        handleInputChange({
            target: {
                name: 'rangosPreferidos',
                value: updatedRangos
            }
        }, 'opcionesPeso');
    };

    const removeRangoPreferido = (index) => {
        const updatedRangos = [...(formData.opcionesPeso?.rangosPreferidos || [])];
        updatedRangos.splice(index, 1);
        
        handleInputChange({
            target: {
                name: 'rangosPreferidos',
                value: updatedRangos
            }
        }, 'opcionesPeso');
    };

    const handleMetodoCoccionChange = (e) => {
        const { checked, value } = e.target;
        const currentMetodos = formData.coccion?.metodos || [];
        
        const updatedMetodos = checked
            ? [...currentMetodos, value]
            : currentMetodos.filter(m => m !== value);

        handleInputChange({
            target: {
                name: 'metodos',
                value: updatedMetodos
            }
        }, 'coccion');
    };

    const handleAddReceta = () => {
        const updatedRecetas = [...(formData.coccion?.recetas || []), {
            nombre: '',
            url: '',
            descripcion: ''
        }];
        handleInputChange({
            target: {
                name: 'recetas',
                value: updatedRecetas
            }
        }, 'coccion');
    };

    const handleRemoveReceta = (index) => {
        const updatedRecetas = [...(formData.coccion?.recetas || [])];
        updatedRecetas.splice(index, 1);
        handleInputChange({
            target: {
                name: 'recetas',
                value: updatedRecetas
            }
        }, 'coccion');
    };

    const handleRecetaChange = (index, field, value) => {
        const updatedRecetas = [...(formData.coccion?.recetas || [])];
        updatedRecetas[index] = {
            ...updatedRecetas[index],
            [field]: value
        };
        handleInputChange({
            target: {
                name: 'recetas',
                value: updatedRecetas
            }
        }, 'coccion');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-200">Información de la Carne</h2>
            <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        value={formData.caracteristicas.porcentajeGrasa}
                        onChange={(e) => handleInputChange(e, 'caracteristicas')}
                        min="0"
                        max="100"
                    />
                    <FormInput
                        label="Marmoleo (1-5)"
                        name="marmoleo"
                        type="number"
                        value={formData.caracteristicas.marmoleo}
                        onChange={(e) => handleInputChange(e, 'caracteristicas')}
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
                        value={formData.caracteristicas.color || ''}
                        onChange={(e) => handleInputChange(e, 'caracteristicas')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
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
                                    checked={formData.caracteristicas.textura?.includes(textura)}
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
                    {formData.caracteristicas.textura?.length === 0 && (
                        <p className="text-xs text-red-400 mt-1">
                            Seleccione al menos una textura
                        </p>
                    )}
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
                        placeholder="Ej: 100g"
                    />
                    
                    <FormInput
                        label="Calorías"
                        type="number"
                        name="calorias"
                        value={formData.infoNutricional?.calorias || ''}
                        onChange={(e) => handleInputChange(e, 'infoNutricional')}
                        min="0"
                        step="0.1"
                        placeholder="kcal"
                    />

                    <FormInput
                        label="Proteínas (g)"
                        type="number"
                        name="proteinas"
                        value={formData.infoNutricional?.proteinas || ''}
                        onChange={(e) => handleInputChange(e, 'infoNutricional')}
                        min="0"
                        step="0.1"
                    />

                    <FormInput
                        label="Grasa Total (g)"
                        type="number"
                        name="grasaTotal"
                        value={formData.infoNutricional?.grasaTotal || ''}
                        onChange={(e) => handleInputChange(e, 'infoNutricional')}
                        min="0"
                        step="0.1"
                    />

                    <FormInput
                        label="Grasa Saturada (g)"
                        type="number"
                        name="grasaSaturada"
                        value={formData.infoNutricional?.grasaSaturada || ''}
                        onChange={(e) => handleInputChange(e, 'infoNutricional')}
                        min="0"
                        step="0.1"
                    />

                    <FormInput
                        label="Colesterol (mg)"
                        type="number"
                        name="colesterol"
                        value={formData.infoNutricional?.colesterol || ''}
                        onChange={(e) => handleInputChange(e, 'infoNutricional')}
                        min="0"
                        step="0.1"
                    />

                    <FormInput
                        label="Sodio (mg)"
                        type="number"
                        name="sodio"
                        value={formData.infoNutricional?.sodio || ''}
                        onChange={(e) => handleInputChange(e, 'infoNutricional')}
                        min="0"
                        step="0.1"
                    />

                    <FormInput
                        label="Carbohidratos (g)"
                        type="number"
                        name="carbohidratos"
                        value={formData.infoNutricional?.carbohidratos || ''}
                        onChange={(e) => handleInputChange(e, 'infoNutricional')}
                        min="0"
                        step="0.1"
                    />
                </div>
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
                    />

                    <FormInput
                        label="Peso por Caja (kg)"
                        type="number"
                        name="pesoCaja"
                        value={formData.empaque?.pesoCaja || ''}
                        onChange={(e) => handleInputChange(e, 'empaque')}
                        min="0.001"
                        step="0.001"
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
                            min={formData.procesamiento?.fechaEnvasado || ''}
                        />
                    </div>

                    <FormInput
                        label="Número de Lote"
                        name="numeroLote"
                        value={formData.procesamiento?.numeroLote || ''}
                        onChange={(e) => handleInputChange(e, 'procesamiento')}
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

            {/* Métodos de Cocción Section */}
            <div className="border-t border-slate-700 pt-6">
                <h3 className="text-md font-medium text-slate-300 mb-4">Métodos de Cocción</h3>
                
                <div className="md:col-span-2 mb-4">
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        Métodos Recomendados *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {METODOS_COCCION.map(metodo => (
                            <div key={metodo} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`metodo-${metodo}`}
                                    value={metodo}
                                    checked={formData.coccion?.metodos?.includes(metodo) || false}
                                    onChange={handleMetodoCoccionChange}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-500 bg-gray-700"
                                />
                                <label 
                                    htmlFor={`metodo-${metodo}`}
                                    className="text-sm text-gray-300 cursor-pointer"
                                >
                                    {formatEnumLabel(metodo)}
                                </label>
                            </div>
                        ))}
                    </div>
                    {formData.coccion?.metodos?.length === 0 && (
                        <p className="text-xs text-red-400 mt-1">
                            Seleccione al menos un método de cocción
                        </p>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        label="Temperatura Ideal"
                        name="temperaturaIdeal"
                        value={formData.coccion?.temperaturaIdeal || ''}
                        onChange={(e) => handleInputChange(e, 'coccion')}
                        placeholder="Ej: 175°C o A punto (63°C)"
                    />
                    
                    <FormInput
                        label="Tiempo Estimado"
                        name="tiempoEstimado"
                        value={formData.coccion?.tiempoEstimado || ''}
                        onChange={(e) => handleInputChange(e, 'coccion')}
                        placeholder="Ej: 5-7 minutos por lado"
                    />
                </div>
                
                {/* Recetas Section */}
                <div className="border-t border-slate-700 pt-6 mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-md font-medium text-slate-300">Recetas Recomendadas</h3>
                        <button
                            type="button"
                            onClick={handleAddReceta}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500"
                        >
                            + Añadir Receta
                        </button>
                    </div>

                    {(formData.coccion?.recetas || []).map((receta, index) => (
                        <div key={index} className="bg-slate-700 p-4 rounded-lg mb-4">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="text-sm font-medium text-slate-200">Receta {index + 1}</h4>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveReceta(index)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    Eliminar
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                                <FormInput
                                    label="Nombre de la Receta"
                                    value={receta.nombre || ''}
                                    onChange={(e) => handleRecetaChange(index, 'nombre', e.target.value)}
                                    placeholder="Ej: Bife a la Parrilla"
                                />

                                <FormInput
                                    label="URL de la Receta"
                                    value={receta.url || ''}
                                    onChange={(e) => handleRecetaChange(index, 'url', e.target.value)}
                                    placeholder="https://..."
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        value={receta.descripcion || ''}
                                        onChange={(e) => handleRecetaChange(index, 'descripcion', e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-white"
                                        rows="3"
                                        placeholder="Breve descripción de la receta..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Consejos de cocción */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Consejos de Cocción
                    </label>
                    <textarea
                        name="consejos"
                        value={formData.coccion?.consejos?.join('\n') || ''}
                        onChange={(e) => {
                            const consejos = e.target.value.split('\n').filter(c => c.trim() !== '');
                            handleInputChange({
                                target: {
                                    name: 'consejos',
                                    value: consejos
                                }
                            }, 'coccion');
                        }}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                        rows="4"
                        placeholder="Ingrese un consejo por línea"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Ingrese cada consejo en una línea diferente
                    </p>
                </div>
            </div>
        </div>
    );
};

CarneForm.propTypes = {
    formData: PropTypes.shape({
        caracteristicas: PropTypes.shape({
            color: PropTypes.string,
            textura: PropTypes.arrayOf(PropTypes.string),
            porcentajeGrasa: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            marmoleo: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        }).isRequired,
        infoCarne: PropTypes.shape({
            tipoCarne: PropTypes.string,
            corte: PropTypes.string,
            nombreArgentino: PropTypes.string,
            nombreChileno: PropTypes.string
        }).isRequired,
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
        }),
        coccion: PropTypes.shape({
            metodos: PropTypes.arrayOf(PropTypes.string),
            temperaturaIdeal: PropTypes.string,
            tiempoEstimado: PropTypes.string,
            consejos: PropTypes.arrayOf(PropTypes.string),
            recetas: PropTypes.arrayOf(
                PropTypes.shape({
                    nombre: PropTypes.string,
                    url: PropTypes.string,
                    descripcion: PropTypes.string
                })
            )
        }),
        infoNutricional: PropTypes.shape({
            porcion: PropTypes.string,
            calorias: PropTypes.number,
            proteinas: PropTypes.number,
            grasaTotal: PropTypes.number,
            grasaSaturada: PropTypes.number,
            colesterol: PropTypes.number,
            sodio: PropTypes.number,
            carbohidratos: PropTypes.number
        })
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired
};