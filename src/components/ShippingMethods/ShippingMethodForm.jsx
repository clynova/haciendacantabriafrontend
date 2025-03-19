import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';

const ShippingMethodForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        tracking_url: initialData?.tracking_url || '',
        methods: [{
            name: initialData?.methods?.[0]?.name || '',
            delivery_time: initialData?.methods?.[0]?.delivery_time || '',
            base_cost: initialData?.methods?.[0]?.base_cost?.toString() || '',
            free_shipping_threshold: initialData?.methods?.[0]?.free_shipping_threshold?.toString() || ''
        }],
        active: initialData?.active ?? true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.methods[0].name || !formData.methods[0].delivery_time || !formData.methods[0].base_cost) {
            toast.error('Por favor complete todos los campos requeridos');
            return;
        }

        onSubmit({
            ...formData,
            methods: [
                {
                    ...formData.methods[0],
                    base_cost: Number(formData.methods[0].base_cost) || 0,
                    free_shipping_threshold: formData.methods[0].free_shipping_threshold ? 
                        Number(formData.methods[0].free_shipping_threshold) : undefined
                }
            ]
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-200">
                        Nombre del Transportista *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700/50 
                                 text-slate-200 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-200">
                        URL de Seguimiento
                    </label>
                    <input
                        type="url"
                        value={formData.tracking_url}
                        onChange={(e) => setFormData({...formData, tracking_url: e.target.value})}
                        placeholder="https://ejemplo.com/track?number={tracking_number}"
                        className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700/50 
                                 text-slate-200 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div className="space-y-4 p-4 border border-slate-600 rounded-lg">
                    <h3 className="text-lg font-medium text-slate-200">Detalles del Método</h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-200">
                            Nombre del Método *
                        </label>
                        <input
                            type="text"
                            value={formData.methods[0].name}
                            onChange={(e) => setFormData({
                                ...formData, 
                                methods: [{ ...formData.methods[0], name: e.target.value }]
                            })}
                            className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700/50 
                                     text-slate-200 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-200">
                            Tiempo de Entrega *
                        </label>
                        <input
                            type="text"
                            value={formData.methods[0].delivery_time}
                            onChange={(e) => setFormData({
                                ...formData, 
                                methods: [{ ...formData.methods[0], delivery_time: e.target.value }]
                            })}
                            placeholder="5-7 días hábiles"
                            className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700/50 
                                     text-slate-200 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-200">
                            Costo Base *
                        </label>
                        <input
                            type="number"
                            value={formData.methods[0].base_cost}
                            onChange={(e) => setFormData({
                                ...formData, 
                                methods: [{ ...formData.methods[0], base_cost: e.target.value }]
                            })}
                            min="0"
                            className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700/50 
                                     text-slate-200 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-200">
                            Monto para Envío Gratuito
                        </label>
                        <input
                            type="number"
                            value={formData.methods[0].free_shipping_threshold}
                            onChange={(e) => setFormData({
                                ...formData, 
                                methods: [{ ...formData.methods[0], free_shipping_threshold: e.target.value }]
                            })}
                            min="0"
                            className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700/50 
                                     text-slate-200 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData({...formData, active: e.target.checked})}
                        className="h-4 w-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-slate-200">
                        Método de envío activo
                    </label>
                </div>
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-slate-600 rounded-lg text-slate-200 
                             hover:bg-slate-700 transition-colors duration-200"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg 
                             hover:bg-blue-600 transition-colors duration-200"
                >
                    {initialData ? 'Actualizar' : 'Crear'} Método de Envío
                </button>
            </div>
        </form>
    );
};

ShippingMethodForm.propTypes = {
    initialData: PropTypes.shape({
        name: PropTypes.string,
        tracking_url: PropTypes.string,
        methods: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            delivery_time: PropTypes.string,
            base_cost: PropTypes.number,
            free_shipping_threshold: PropTypes.number
        })),
        active: PropTypes.bool
    }),
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export { ShippingMethodForm };