import React from 'react';
import PropTypes from 'prop-types';

export const InventorySection = ({ data, onChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        const numericValue = value === '' ? 0 : Number(value);

        onChange('inventario', {
            ...data.inventario,
            [name]: numericValue
        });
    };

    const getStockStatus = () => {
        const stock = data.inventario?.stockUnidades || 0;
        const umbral = data.inventario?.umbralStockBajo || 0;

        if (stock === 0) return { color: 'red', text: 'Sin Stock' };
        if (stock <= umbral) return { color: 'yellow', text: 'Stock Bajo' };
        return { color: 'green', text: 'Stock Disponible' };
    };

    const status = getStockStatus();

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Inventario</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Stock Actual (unidades) *
                    </label>
                    <input
                        type="number"
                        name="stockUnidades"
                        value={data.inventario?.stockUnidades || ''}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        min="0"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Umbral de Stock Bajo
                    </label>
                    <input
                        type="number"
                        name="umbralStockBajo"
                        value={data.inventario?.umbralStockBajo || ''}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        min="0"
                    />
                </div>
            </div>

            <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300">Estado del Stock:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-800`}>
                        {status.text}
                    </span>
                </div>
                
                {data.inventario?.umbralStockBajo > 0 && (
                    <p className="mt-2 text-sm text-slate-400">
                        Se notificará cuando el stock sea menor o igual a {data.inventario.umbralStockBajo} unidades
                    </p>
                )}
            </div>
        </div>
    );
};

InventorySection.propTypes = {
    data: PropTypes.shape({
        inventario: PropTypes.shape({
            stockUnidades: PropTypes.number,
            umbralStockBajo: PropTypes.number
        })
    }).isRequired,
    onChange: PropTypes.func.isRequired
};