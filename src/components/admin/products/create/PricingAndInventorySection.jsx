import { FormInput } from '../../../common/FormInputs';

export const PricingAndInventorySection = ({ formData, handleInputChange }) => {
    // Add default values and null checks
    const precios = formData.precios || {};
    const descuentos = precios.descuentos || {};
    const promocion = precios.promocion || {};
    const inventario = formData.inventario || {};

    return (
        <div className="space-y-6">
            {/* Precios Básicos */}
            <div>
                <h2 className="text-lg font-semibold text-slate-200 mb-4">Precios</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                        label="Precio Base"
                        type="number"
                        name="base"
                        value={precios.base || ''}
                        onChange={(e) => handleInputChange(e, 'precios')}
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                            Descuento Regular
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                name="regular"
                                value={descuentos.regular || ''}
                                onChange={(e) => {
                                    const value = Math.min(Math.max(Number(e.target.value) || 0, 0), 100);
                                    handleInputChange({
                                        target: { name: 'regular', value }
                                    }, 'precios', 'descuentos');
                                }}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white pr-12"
                                min="0"
                                max="100"
                                step="1"
                                placeholder="0"
                            />
                            <span className="absolute right-3 top-2 text-gray-400">%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inventario */}
            <div>
                <h2 className="text-lg font-semibold text-slate-200 mb-4">Inventario</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        label="Stock (unidades)"
                        type="number"
                        name="stockUnidades"
                        value={inventario.stockUnidades || ''}
                        onChange={(e) => handleInputChange(e, 'inventario')}
                        min="0"
                        
                    />
                    <FormInput
                        label="Umbral Stock Bajo"
                        type="number"
                        name="umbralStockBajo"
                        value={inventario.umbralStockBajo || ''}
                        onChange={(e) => handleInputChange(e, 'inventario')}
                        min="0"
                        
                    />
                </div>
            </div>
        </div>
    );
};