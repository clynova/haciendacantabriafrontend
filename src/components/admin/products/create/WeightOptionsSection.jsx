import React from 'react';
import PropTypes from 'prop-types';
import { FormInput, FormSelect } from '../../../common/FormInputs';

export const WeightOptionsSection = ({ formData, handleInputChange }) => {
    // Obtener las unidades de peso según la categoría
    const getUnidadesPeso = () => {
        const unidadesBase = [
            { value: 'g', label: 'Gramos (g)' },
            { value: 'kg', label: 'Kilogramos (kg)' },
            { value: 'ml', label: 'Mililitros (ml)' },
            { value: 'L', label: 'Litros (L)' },
            { value: 'unidades', label: 'Unidades' }
        ];

        // Filtrar unidades según la categoría
        if (formData.categoria === 'CARNE') {
            return unidadesBase.filter(u => ['g', 'kg'].includes(u.value));
        }
        if (formData.categoria === 'ACEITE') {
            return unidadesBase.filter(u => ['ml', 'L'].includes(u.value));
        }
        return unidadesBase;
    };

    const validateUnidad = (unidad, unidadesDisponibles) => {
        return unidadesDisponibles.some(u => u.value === unidad) ? unidad : unidadesDisponibles[0].value;
    };

    const handleStandardWeightChange = (index, field, value) => {
        const updatedPesosEstandar = [...formData.opcionesPeso.pesosEstandar];
        if (field === 'unidad') {
            value = validateUnidad(value, getUnidadesPeso());
        }

        // Special handling for esPredeterminado
        if (field === 'esPredeterminado') {
            // Remove predeterminado from all other items
            updatedPesosEstandar.forEach((item, i) => {
                if (i !== index) {
                    item.esPredeterminado = false;
                }
            });
            // Set the new predeterminado
            updatedPesosEstandar[index].esPredeterminado = true;
        } else {
            updatedPesosEstandar[index] = {
                ...updatedPesosEstandar[index],
                [field]: value
            };
        }

        handleInputChange({
            target: {
                name: 'pesosEstandar',
                value: updatedPesosEstandar
            }
        }, 'opcionesPeso');
    };

    const addStandardWeight = () => {
        const currentPesos = formData.opcionesPeso.pesosEstandar;
        const unidadPorDefecto = formData.categoria === 'ACEITE' ? 'ml' : 'g';
        
        const newPesoEstandar = {
            peso: '',
            unidad: unidadPorDefecto,
            esPredeterminado: currentPesos.length === 0, // Primer item es predeterminado
            precio: '',
            sku: '',
            stockDisponible: 0,
            umbralStockBajo: 5,
            descuentos: {
                regular: 0
            },
            ultimaActualizacion: new Date()
        };

        handleInputChange({
            target: {
                name: 'pesosEstandar',
                value: [...currentPesos, newPesoEstandar]
            }
        }, 'opcionesPeso');
    };

    const removeStandardWeight = (index) => {
        handleInputChange({
            target: {
                name: 'pesosEstandar',
                value: formData.opcionesPeso.pesosEstandar.filter((_, i) => i !== index)
            }
        }, 'opcionesPeso');
    };

    const addRangoPreferido = () => {
        const newRango = {
            nombre: '',
            pesoMinimo: '',
            pesoMaximo: '',
            descripcion: '',
            esPredeterminado: false
        };
        handleInputChange({
            target: {
                name: 'rangosPreferidos',
                value: [...formData.opcionesPeso.rangosPreferidos, newRango]
            }
        }, 'opcionesPeso');
    };

    // Agregar el manejador de cambios para rangos preferidos
    const handleRangoPreferidoChange = (index, field, value) => {
        const updatedRangos = [...formData.opcionesPeso.rangosPreferidos];
        
        if (field === 'esPredeterminado') {
            // Solo puede haber un rango predeterminado
            updatedRangos.forEach((rango, i) => {
                if (i !== index) rango.esPredeterminado = false;
            });
            updatedRangos[index].esPredeterminado = true;
        } else {
            updatedRangos[index] = {
                ...updatedRangos[index],
                [field]: field === 'pesoMinimo' || field === 'pesoMaximo' ? Number(value) : value
            };
        }
    
        handleInputChange({
            target: {
                name: 'rangosPreferidos',
                value: updatedRangos
            }
        }, 'opcionesPeso');
    };
    
    const removeRangoPreferido = (index) => {
        handleInputChange({
            target: {
                name: 'rangosPreferidos',
                value: formData.opcionesPeso.rangosPreferidos.filter((_, i) => i !== index)
            }
        }, 'opcionesPeso');
    };

    return (
        <div className="border rounded-lg p-6 bg-white dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Opciones de Peso
            </h2>

            {/* Agregar campos generales de peso al inicio */}
            <div className="mb-6 space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                    <input
                        type="checkbox"
                        id="esPesoVariable"
                        checked={formData.opcionesPeso.esPesoVariable}
                        onChange={(e) => handleInputChange({
                            target: {
                                name: 'esPesoVariable',
                                value: e.target.checked
                            }
                        }, 'opcionesPeso')}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="esPesoVariable" className="text-sm text-gray-700 dark:text-gray-200">
                        Peso Variable
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                        label="Peso Promedio"
                        name="pesoPromedio"
                        type="number"
                        value={formData.opcionesPeso.pesoPromedio || ''}
                        onChange={(e) => handleInputChange({
                            target: {
                                name: 'pesoPromedio',
                                value: e.target.value
                            }
                        }, 'opcionesPeso')}
                        min="0"
                        step="0.01"
                    />
                    <FormInput
                        label="Peso Mínimo"
                        name="pesoMinimo"
                        type="number"
                        value={formData.opcionesPeso.pesoMinimo || ''}
                        onChange={(e) => handleInputChange({
                            target: {
                                name: 'pesoMinimo',
                                value: e.target.value
                            }
                        }, 'opcionesPeso')}
                        min="0"
                        step="0.01"
                    />
                    <FormInput
                        label="Peso Máximo"
                        name="pesoMaximo"
                        type="number"
                        value={formData.opcionesPeso.pesoMaximo || ''}
                        onChange={(e) => handleInputChange({
                            target: {
                                name: 'pesoMaximo',
                                value: e.target.value
                            }
                        }, 'opcionesPeso')}
                        min="0"
                        step="0.01"
                    />
                </div>
            </div>

            <div className="border-t dark:border-gray-700 pt-6 mt-6">
                <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Pesos Estándar
                </h3>

                <div className="space-y-4">
                    {formData.opcionesPeso.pesosEstandar.map((peso, index) => (
                        <div key={index} className="p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-slate-700">
                            {/* SKU Section */}
                            <div className="mb-4">
                                <FormInput
                                    label="SKU"
                                    name="sku"
                                    value={peso.sku}
                                    onChange={(e) => handleStandardWeightChange(index, 'sku', e.target.value)}
                                />
                            </div>

                            {/* Weight, Unit, Price, Discount Section */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <FormInput
                                    label="Peso"
                                    name="peso"
                                    type="number"
                                    value={peso.peso}
                                    onChange={(e) => handleStandardWeightChange(index, 'peso', e.target.value)}
                                    min="0"
                                    step="0.01"
                                />
                                <FormSelect
                                    label="Unidad"
                                    name={`unidad-${index}`}
                                    value={peso.unidad}
                                    onChange={(e) => handleStandardWeightChange(index, 'unidad', e.target.value)}
                                    options={getUnidadesPeso()}
                                />
                                <FormInput
                                    label="Precio"
                                    name="precio"
                                    type="number"
                                    value={peso.precio}
                                    onChange={(e) => handleStandardWeightChange(index, 'precio', e.target.value)}
                                    min="0"
                                />
                                <FormInput
                                    label="Descuento (%)"
                                    name="descuento"
                                    type="number"
                                    value={peso.descuentos?.regular || 0}
                                    onChange={(e) => handleStandardWeightChange(index, 'descuentos', 
                                        { regular: Math.min(100, Math.max(0, Number(e.target.value))) })}
                                    min="0"
                                    max="100"
                                />
                            </div>

                            {/* Stock Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput
                                    label="Stock Disponible"
                                    name="stockDisponible"
                                    type="number"
                                    value={peso.stockDisponible}
                                    onChange={(e) => handleStandardWeightChange(index, 'stockDisponible', e.target.value)}
                                    min="0"
                                />
                                <FormInput
                                    label="Umbral Stock Bajo"
                                    name="umbralStockBajo"
                                    type="number"
                                    value={peso.umbralStockBajo}
                                    onChange={(e) => handleStandardWeightChange(index, 'umbralStockBajo', e.target.value)}
                                    min="0"
                                />
                            </div>

                            <div className="flex justify-between items-center mt-4 pt-3 border-t dark:border-gray-600">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={peso.esPredeterminado}
                                        onChange={() => handleStandardWeightChange(index, 'esPredeterminado')}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-200">
                                        Predeterminado
                                    </span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => removeStandardWeight(index)}
                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                    disabled={peso.esPredeterminado}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addStandardWeight}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                    >
                        Agregar Opción de Peso
                    </button>
                </div>
            </div>

            {/* Sección de Rangos Preferidos */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Rangos de Peso Preferidos
                </h3>
                <div className="space-y-4">
                    {formData.opcionesPeso.rangosPreferidos.map((rango, index) => (
                        <div key={index} className="p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-slate-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <FormInput
                                    label="Nombre del Rango"
                                    name="nombre"
                                    value={rango.nombre}
                                    onChange={(e) => handleRangoPreferidoChange(index, 'nombre', e.target.value)}
                                    placeholder="ej: Porción Individual"
                                />
                                <FormInput
                                    label="Descripción"
                                    name="descripcion"
                                    value={rango.descripcion}
                                    onChange={(e) => handleRangoPreferidoChange(index, 'descripcion', e.target.value)}
                                    placeholder="ej: Ideal para una persona"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <FormInput
                                    label="Peso Mínimo"
                                    name="pesoMinimo"
                                    type="number"
                                    value={rango.pesoMinimo}
                                    onChange={(e) => handleRangoPreferidoChange(index, 'pesoMinimo', e.target.value)}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                                <FormInput
                                    label="Peso Máximo"
                                    name="pesoMaximo"
                                    type="number"
                                    value={rango.pesoMaximo}
                                    onChange={(e) => handleRangoPreferidoChange(index, 'pesoMaximo', e.target.value)}
                                    min={rango.pesoMinimo || 0}
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={rango.esPredeterminado}
                                        onChange={() => handleRangoPreferidoChange(index, 'esPredeterminado')}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-200">
                                        Rango Predeterminado
                                    </span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => removeRangoPreferido(index)}
                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                    disabled={rango.esPredeterminado}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addRangoPreferido}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                    >
                        Agregar Rango Preferido
                    </button>
                </div>
            </div>
        </div>
    );
};

WeightOptionsSection.propTypes = {
    formData: PropTypes.shape({
        categoria: PropTypes.string,
        opcionesPeso: PropTypes.shape({
            esPesoVariable: PropTypes.bool,
            pesoPromedio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            pesoMinimo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            pesoMaximo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            pesosEstandar: PropTypes.arrayOf(PropTypes.shape({
                peso: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                unidad: PropTypes.string,
                esPredeterminado: PropTypes.bool,
                precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                sku: PropTypes.string,
                stockDisponible: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                umbralStockBajo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                descuentos: PropTypes.shape({
                    regular: PropTypes.number
                })
            })),
            rangosPreferidos: PropTypes.arrayOf(PropTypes.shape({
                nombre: PropTypes.string,
                pesoMinimo: PropTypes.number,
                pesoMaximo: PropTypes.number,
                descripcion: PropTypes.string,
                esPredeterminado: PropTypes.bool
            }))
        }).isRequired
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired
};