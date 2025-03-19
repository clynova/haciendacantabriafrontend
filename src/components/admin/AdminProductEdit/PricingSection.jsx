import React from 'react';

export const PricingSection = ({ data, onChange }) => {
    const handleChange = (e, subsection) => {
        const { name, value } = e.target;
        const numericValue = value === '' ? 0 : Number(value);

        if (subsection) {
            onChange('precios', {
                ...data.precios,
                [subsection]: {
                    ...data.precios[subsection],
                    [name]: numericValue
                }
            });
        } else {
            onChange('precios', {
                ...data.precios,
                [name]: numericValue
            });
        }
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Precios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Precio Base *
                    </label>
                    <input
                        type="number"
                        name="base"
                        value={data.precios?.base || 0}
                        onChange={(e) => handleChange(e)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Descuento Regular (%)
                    </label>
                    <input
                        type="number"
                        name="regular"
                        value={data.precios?.descuentos?.regular || 0}
                        onChange={(e) => handleChange(e, 'descuentos')}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        min="0"
                        max="100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Descuento Transferencia (%)
                    </label>
                    <input
                        type="number"
                        name="transferencia"
                        value={data.precios?.descuentos?.transferencia || 0}
                        onChange={(e) => handleChange(e, 'descuentos')}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        min="0"
                        max="100"
                    />
                </div>
            </div>
        </div>
    );
};