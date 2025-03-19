import React from 'react';

export const BasicInfoSection = ({ data, onChange }) => {
    const handleBasicInfoChange = (e) => {
        const { name, value } = e.target;
        onChange(name, value);
    };

    const handleDescriptionChange = (e) => {
        const { name, value } = e.target;
        onChange('descripcion', {
            ...data.descripcion,
            [name]: value
        });
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Información Básica</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Código *
                        </label>
                        <input
                            type="text"
                            name="codigo"
                            value={data.codigo || ''}
                            onChange={handleBasicInfoChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            SKU *
                        </label>
                        <input
                            type="text"
                            name="sku"
                            value={data.sku || ''}
                            onChange={handleBasicInfoChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Nombre del Producto *
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        value={data.nombre || ''}
                        onChange={handleBasicInfoChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Descripción Corta
                    </label>
                    <textarea
                        name="corta"
                        value={data.descripcion?.corta || ''}
                        onChange={handleDescriptionChange}
                        rows="2"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Descripción Completa
                    </label>
                    <textarea
                        name="completa"
                        value={data.descripcion?.completa || ''}
                        onChange={handleDescriptionChange}
                        rows="4"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                    />
                </div>
            </div>
        </div>
    );
};