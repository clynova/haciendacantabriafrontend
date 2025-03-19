import React from 'react';

const TIPOS_ACEITE = [
    { value: 'OLIVA', label: 'Aceite de Oliva' },
    { value: 'GIRASOL', label: 'Aceite de Girasol' }
];

const TIPOS_ENVASE = [
    { value: 'BOTELLA', label: 'Botella' },
    { value: 'BIDON', label: 'Bidón' },
    { value: 'LATA', label: 'Lata' }
];

export const ProductTypeSection = ({ data, onChange }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'categoria') {
            onChange('categoria', value);
            // Reset category specific info when changing category
            onChange('infoAceite', {
                tipo: 'OLIVA',
                volumen: 0,
                envase: 'BOTELLA'
            });
        } else if (name.startsWith('infoAceite.')) {
            const field = name.split('.')[1];
            onChange('infoAceite', {
                ...data.infoAceite,
                [field]: type === 'number' ? Number(value) : value
            });
        } else {
            onChange(name, type === 'checkbox' ? checked : value);
        }
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Tipo de Producto</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Categoría *
                        </label>
                        <select
                            name="categoria"
                            value={data.categoria}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            required
                        >
                            <option value="ACEITE">Aceite</option>
                            <option value="CARNE">Carne</option>
                        </select>
                    </div>
                    <div>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="destacado"
                                checked={data.destacado || false}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 border-slate-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-slate-300">Producto Destacado</span>
                        </label>
                    </div>
                </div>

                {data.categoria === 'ACEITE' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Tipo de Aceite
                            </label>
                            <select
                                name="infoAceite.tipo"
                                value={data.infoAceite?.tipo || 'OLIVA'}
                                onChange={handleChange}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            >
                                {TIPOS_ACEITE.map(tipo => (
                                    <option key={tipo.value} value={tipo.value}>
                                        {tipo.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Volumen (ml)
                            </label>
                            <input
                                type="number"
                                name="infoAceite.volumen"
                                value={data.infoAceite?.volumen || ''}
                                onChange={handleChange}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Tipo de Envase
                            </label>
                            <select
                                name="infoAceite.envase"
                                value={data.infoAceite?.envase || 'BOTELLA'}
                                onChange={handleChange}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            >
                                {TIPOS_ENVASE.map(tipo => (
                                    <option key={tipo.value} value={tipo.value}>
                                        {tipo.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};