import { FormInput } from '../../common/FormInputs';

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
                    <FormInput
                        label="Descuento Regular (%)"
                        type="number"
                        name="regular"
                        value={descuentos.regular || ''}
                        onChange={(e) => handleInputChange(e, 'precios', 'descuentos')}
                    />
                    <FormInput
                        label="Descuento Transferencia (%)"
                        type="number"
                        name="transferencia"
                        value={descuentos.transferencia || ''}
                        onChange={(e) => handleInputChange(e, 'precios', 'descuentos')}
                    />
                </div>
            </div>

            {/* Promoción */}
            <div>
                <h3 className="text-md font-medium text-slate-300 mb-3">Promoción</h3>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="activa"
                            checked={promocion.activa || false}
                            onChange={(e) => handleInputChange(e, 'precios', 'promocion')}
                            className="w-4 h-4 text-blue-600"
                        />
                        <label className="ml-2 text-sm text-slate-300">
                            Promoción Activa
                        </label>
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
                        label="Stock Mínimo"
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