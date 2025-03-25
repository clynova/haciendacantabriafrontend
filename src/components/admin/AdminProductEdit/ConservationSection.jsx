import React from 'react';
import PropTypes from 'prop-types';

export const ConservationSection = ({ data, onChange }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;

        onChange('conservacion', {
            ...data.conservacion,
            [name]: finalValue
        });
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Conservación</h2>
            
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="requiereRefrigeracion"
                            name="requiereRefrigeracion"
                            checked={data.conservacion?.requiereRefrigeracion || false}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 border-slate-600 rounded focus:ring-blue-500 bg-slate-700"
                        />
                        <label htmlFor="requiereRefrigeracion" className="text-sm font-medium text-slate-300">
                            Requiere Refrigeración
                        </label>
                    </div>

                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="requiereCongelacion"
                            name="requiereCongelacion"
                            checked={data.conservacion?.requiereCongelacion || false}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 border-slate-600 rounded focus:ring-blue-500 bg-slate-700"
                        />
                        <label htmlFor="requiereCongelacion" className="text-sm font-medium text-slate-300">
                            Requiere Congelación
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Vida Útil (días)
                    </label>
                    <input
                        type="number"
                        name="vidaUtil"
                        value={data.conservacion?.vidaUtil || ''}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Instrucciones de Conservación
                    </label>
                    <textarea
                        name="instrucciones"
                        value={data.conservacion?.instrucciones || ''}
                        onChange={handleChange}
                        rows="3"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        placeholder="Ej: Mantener refrigerado entre 0°C y 4°C..."
                    />
                </div>
            </div>
        </div>
    );
};

ConservationSection.propTypes = {
    data: PropTypes.shape({
        conservacion: PropTypes.shape({
            requiereRefrigeracion: PropTypes.bool,
            requiereCongelacion: PropTypes.bool,
            vidaUtil: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            instrucciones: PropTypes.string
        })
    }).isRequired,
    onChange: PropTypes.func.isRequired
};