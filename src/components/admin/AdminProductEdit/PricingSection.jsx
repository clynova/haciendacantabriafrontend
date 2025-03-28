import React from 'react';
import PropTypes from 'prop-types';

export const PricingSection = ({ data, onChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        const numericValue = value === '' ? 0 : Number(value);

        if (name.includes('.')) {
            const [section, field] = name.split('.');
            onChange('precios', {
                ...data.precios,
                [section]: {
                    ...data.precios[section],
                    [field]: numericValue
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
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-400">$</span>
                        <input
                            type="number"
                            name="base"
                            value={data.precios?.base || ''}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-8 pr-3 py-2 text-white"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Descuento Regular (%)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            name="descuentos.regular"
                            value={data.precios?.descuentos?.regular || ''}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            min="0"
                            max="100"
                            step="0.1"
                        />
                        <span className="absolute right-3 top-2 text-slate-400">%</span>
                    </div>
                </div>
            </div>

            {data.precios?.base > 0 && (
                <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                    <h3 className="text-sm font-medium text-slate-300 mb-2">Precios Calculados:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-slate-400">Precio Base:</span>
                            <span className="ml-2 text-white">${data.precios.base.toFixed(2)}</span>
                        </div>
                        <div>
                            <span className="text-slate-400">Con Descuento Regular:</span>
                            <span className="ml-2 text-white">
                                ${(data.precios.base * (1 - (data.precios?.descuentos?.regular || 0) / 100)).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

PricingSection.propTypes = {
    data: PropTypes.shape({
        precios: PropTypes.shape({
            base: PropTypes.number,
            descuentos: PropTypes.shape({
                regular: PropTypes.number,
                transferencia: PropTypes.number
            })
        })
    }).isRequired,
    onChange: PropTypes.func.isRequired
};