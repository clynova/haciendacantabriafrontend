import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';

const PaymentMethodForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        type: initialData?.type || '',
        description: initialData?.description || '',
        provider: initialData?.provider || '',
        logo_url: initialData?.logo_url || '',
        commission_percentage: initialData?.commission_percentage || 0,
        requires_additional_data: initialData?.requires_additional_data || false,
        active: initialData?.active ?? true
    });

    const [selectedImage, setSelectedImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.type || !formData.provider) {
            toast.error('Por favor complete todos los campos requeridos');
            return;
        }

        onSubmit(formData, selectedImage);
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-200">
                        Nombre del Método de Pago *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700/50 
                                 text-slate-200 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                        placeholder="ej. Tarjeta de Crédito"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-200">
                        Tipo *
                    </label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700/50 
                                 text-slate-200 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                    >
                        <option value="">Seleccione un tipo</option>
                        <option value="transferencia">Transferencia</option>
                        <option value="webpay">Webpay</option>
                        <option value="mercadopago">Mercadopago</option>
                        <option value="flow">Flow</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-200">
                        Descripción
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700/50 
                                 text-slate-200 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        rows="3"
                        placeholder="Describe las características principales del método de pago"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-200">
                        Proveedor *
                    </label>
                    <input
                        type="text"
                        value={formData.provider}
                        onChange={(e) => setFormData({...formData, provider: e.target.value})}
                        className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700/50 
                                 text-slate-200 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                        placeholder="ej. Visa, PayPal, Stripe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-200">
                        Comisión (%)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.commission_percentage}
                        onChange={(e) => setFormData({...formData, commission_percentage: parseFloat(e.target.value) || 0})}
                        className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700/50 
                                 text-slate-200 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        min="0"
                        max="100"
                    />
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-200">
                        Logo
                    </label>
                    <div className="flex items-center space-x-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full text-sm text-slate-200
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-500 file:text-white
                                hover:file:bg-blue-600
                                file:cursor-pointer"
                        />
                        {(formData.logo_url || selectedImage) && (
                            <img
                                src={selectedImage ? URL.createObjectURL(selectedImage) : formData.logo_url}
                                alt="Preview"
                                className="h-16 w-auto object-contain"
                            />
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={formData.requires_additional_data}
                        onChange={(e) => setFormData({...formData, requires_additional_data: e.target.checked})}
                        className="h-4 w-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-slate-200">
                        Requiere datos adicionales
                    </label>
                </div>

                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData({...formData, active: e.target.checked})}
                        className="h-4 w-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-slate-200">
                        Método de pago activo
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
                    {initialData ? 'Actualizar' : 'Crear'} Método de Pago
                </button>
            </div>
        </form>
    );
};

PaymentMethodForm.propTypes = {
    initialData: PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
        description: PropTypes.string,
        provider: PropTypes.string,
        logo_url: PropTypes.string,
        commission_percentage: PropTypes.number,
        requires_additional_data: PropTypes.bool,
        active: PropTypes.bool
    }),
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export { PaymentMethodForm };