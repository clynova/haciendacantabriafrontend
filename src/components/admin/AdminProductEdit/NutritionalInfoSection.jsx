import React from 'react';
import PropTypes from 'prop-types';

export const NutritionalInfoSection = ({ data, onChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        const numericValue = value === '' ? 0 : Number(value);
        
        onChange('infoNutricional', {
            ...data.infoNutricional,
            [name]: numericValue
        });
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Información Nutricional</h2>
            
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Porción (g/ml) *
                        </label>
                        <input
                            type="number"
                            name="porcion"
                            value={data.infoNutricional?.porcion || ''}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            min="0"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Calorías (kcal) *
                        </label>
                        <input
                            type="number"
                            name="calorias"
                            value={data.infoNutricional?.calorias || ''}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            min="0"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Proteínas (g)
                        </label>
                        <input
                            type="number"
                            name="proteinas"
                            value={data.infoNutricional?.proteinas || ''}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            min="0"
                            step="0.1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Grasa Total (g)
                        </label>
                        <input
                            type="number"
                            name="grasaTotal"
                            value={data.infoNutricional?.grasaTotal || ''}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            min="0"
                            step="0.1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Grasa Saturada (g)
                        </label>
                        <input
                            type="number"
                            name="grasaSaturada"
                            value={data.infoNutricional?.grasaSaturada || ''}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            min="0"
                            step="0.1"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

NutritionalInfoSection.propTypes = {
    data: PropTypes.shape({
        infoNutricional: PropTypes.shape({
            porcion: PropTypes.number,
            calorias: PropTypes.number,
            proteinas: PropTypes.number,
            grasaTotal: PropTypes.number,
            grasaSaturada: PropTypes.number
        })
    }).isRequired,
    onChange: PropTypes.func.isRequired
};