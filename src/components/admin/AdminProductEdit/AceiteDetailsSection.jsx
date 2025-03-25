import React from 'react';
import PropTypes from 'prop-types';

export const AceiteDetailsSection = ({ data, onChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange('infoAceite', {
            ...data.infoAceite,
            [name]: value
        });
    };

    const handleNumericChange = (e) => {
        const { name, value } = e.target;
        const numericValue = value === '' ? 0 : Number(value);
        onChange('infoAceite', {
            ...data.infoAceite,
            [name]: numericValue
        });
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Detalles del Aceite</h2>
            
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Tipo de Aceite *
                        </label>
                        <select
                            name="tipo"
                            value={data.infoAceite?.tipo || ''}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            required
                        >
                            <option value="">Seleccionar tipo</option>
                            <option value="OLIVA">Oliva</option>
                            <option value="OLIVA_EXTRA_VIRGEN">Oliva Extra Virgen</option>
                            <option value="OLIVA_VIRGEN">Oliva Virgen</option>
                            <option value="VEGETAL">Vegetal</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Volumen (ml) *
                        </label>
                        <input
                            type="number"
                            name="volumen"
                            value={data.infoAceite?.volumen || ''}
                            onChange={handleNumericChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            min="0"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Envase *
                        </label>
                        <select
                            name="envase"
                            value={data.infoAceite?.envase || ''}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            required
                        >
                            <option value="">Seleccionar envase</option>
                            <option value="BOTELLA_VIDRIO">Botella de Vidrio</option>
                            <option value="BOTELLA_PLASTICO">Botella de Plástico</option>
                            <option value="LATA">Lata</option>
                            <option value="BIDON">Bidón</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Acidez (%) *
                        </label>
                        <input
                            type="number"
                            name="acidez"
                            value={data.infoAceite?.acidez || ''}
                            onChange={handleNumericChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            min="0"
                            max="100"
                            step="0.1"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Origen
                    </label>
                    <input
                        type="text"
                        name="origen"
                        value={data.infoAceite?.origen || ''}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        placeholder="Ej: Italia, España, Chile..."
                    />
                </div>
            </div>
        </div>
    );
};

AceiteDetailsSection.propTypes = {
    data: PropTypes.shape({
        infoAceite: PropTypes.shape({
            tipo: PropTypes.string,
            volumen: PropTypes.number,
            envase: PropTypes.string,
            acidez: PropTypes.number,
            origen: PropTypes.string
        })
    }).isRequired,
    onChange: PropTypes.func.isRequired
};