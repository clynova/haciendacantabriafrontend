import React from 'react';

export const DescriptionSection = ({ data, onChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange('descripcion', {
            ...data.descripcion,
            [name]: value
        });
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Descripción</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Descripción Corta
                    </label>
                    <textarea
                        name="corta"
                        value={data.descripcion?.corta || ''}
                        onChange={handleChange}
                        rows="2"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        placeholder="Breve descripción del producto..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Descripción Completa
                    </label>
                    <textarea
                        name="completa"
                        value={data.descripcion?.completa || ''}
                        onChange={handleChange}
                        rows="4"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        placeholder="Descripción detallada del producto..."
                    />
                </div>
            </div>
        </div>
    );
};