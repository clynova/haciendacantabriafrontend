import React from 'react';

export const ConservationSection = ({ data, onChange }) => {
    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        onChange('conservacion', {
            ...data.conservacion,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Conservación</h2>
            <div className="space-y-4">
                <div className="flex items-center gap-6">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="requiereRefrigeracion"
                            checked={data.conservacion?.requiereRefrigeracion || false}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-500 border-slate-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-slate-300">Requiere Refrigeración</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="requiereCongelacion"
                            checked={data.conservacion?.requiereCongelacion || false}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-500 border-slate-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-slate-300">Requiere Congelación</span>
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Vida Útil
                    </label>
                    <input
                        type="text"
                        name="vidaUtil"
                        value={data.conservacion?.vidaUtil || ''}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        placeholder="Ej: 12 meses"
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
                        placeholder="Instrucciones específicas de conservación..."
                    />
                </div>
            </div>
        </div>
    );
};