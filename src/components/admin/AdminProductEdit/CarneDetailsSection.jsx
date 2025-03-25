import React from 'react';
import PropTypes from 'prop-types';

const CORTES_CARNE = [
    'LOMO_VETADO',
    'LOMO_LISO',
    'PUNTA_PALETA',
    'TAPAPECHO',
    'PLATEADA',
    'ABASTERO',
    'ASIENTO',
    'POLLO',
    'PUNTA_GANSO',
    'PALANCA',
    'HUACHALOMO',
    'POSTA_NEGRA',
    'POSTA_ROSADA',
    'SOBRECOSTILLA',
    'CHOCLILLO',
    'TAPABARRIGA',
    'ENTRANHA',
    'MALAYA',
    'PICANA'
];

const METODOS_COCCION = [
    'PARRILLA',
    'SARTEN', 
    'HORNO',
    'COCCION_LENTA',
    'SOUS_VIDE',
    'GUISO'
];

export const CarneDetailsSection = ({ data, onChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange('infoCarne', {
            ...data.infoCarne,
            [name]: value
        });
    };

    const handleNumericChange = (e) => {
        const { name, value } = e.target;
        const numericValue = value === '' ? 0 : Number(value);
        onChange('infoCarne', {
            ...data.infoCarne,
            [name]: numericValue
        });
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Detalles del Corte</h2>
            
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Tipo de Carne *
                        </label>
                        <select
                            name="tipoCarne"
                            value={data.infoCarne?.tipoCarne || ''}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            required
                        >
                            <option value="">Seleccionar tipo</option>
                            <option value="VACUNO">Vacuno</option>
                            <option value="CERDO">Cerdo</option>
                            <option value="POLLO">Pollo</option>
                            <option value="CORDERO">Cordero</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Corte *
                        </label>
                        <select
                            name="corte"
                            value={data.infoCarne?.corte || ''}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            required
                        >
                            <option value="">Seleccionar corte</option>
                            {CORTES_CARNE.map(corte => (
                                <option key={corte} value={corte}>
                                    {corte.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Nombre Chileno
                        </label>
                        <input
                            type="text"
                            name="nombreChileno"
                            value={data.infoCarne?.nombreChileno || ''}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Nombre Argentino
                        </label>
                        <input
                            type="text"
                            name="nombreArgentino"
                            value={data.infoCarne?.nombreArgentino || ''}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Precio por Kg *
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-400">$</span>
                        <input
                            type="number"
                            name="precioPorKg"
                            value={data.infoCarne?.precioPorKg || ''}
                            onChange={handleNumericChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-8 pr-3 py-2 text-white"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Métodos de Cocción Recomendados
                    </label>
                    <select
                        multiple
                        name="metodosCoccion"
                        value={data.infoCarne?.coccion?.metodos || []}
                        onChange={(e) => {
                            const methods = Array.from(e.target.selectedOptions, option => option.value);
                            onChange('infoCarne', {
                                ...data.infoCarne,
                                coccion: {
                                    ...data.infoCarne?.coccion,
                                    metodos: methods
                                }
                            });
                        }}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                    >
                        {METODOS_COCCION.map(method => (
                            <option key={method} value={method}>
                                {method.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

CarneDetailsSection.propTypes = {
    data: PropTypes.shape({
        infoCarne: PropTypes.shape({
            tipoCarne: PropTypes.string,
            corte: PropTypes.string,
            nombreChileno: PropTypes.string,
            nombreArgentino: PropTypes.string,
            precioPorKg: PropTypes.number,
            coccion: PropTypes.shape({
                metodos: PropTypes.arrayOf(PropTypes.string)
            })
        })
    }).isRequired,
    onChange: PropTypes.func.isRequired
};