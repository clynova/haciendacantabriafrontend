import React from 'react';

export const InventorySection = ({ data, onChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange('inventario', {
            ...data.inventario,
            [name]: Number(value)
        });
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Inventario</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Stock Unidades
                    </label>
                    <input
                        type="number"
                        name="stockUnidades"
                        value={data.inventario?.stockUnidades || 0}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        min="0"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Umbral Stock Bajo
                    </label>
                    <input
                        type="number"
                        name="umbralStockBajo"
                        value={data.inventario?.umbralStockBajo || 0}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        min="0"
                    />
                </div>
            </div>
        </div>
    );
};