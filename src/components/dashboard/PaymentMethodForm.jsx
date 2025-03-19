import { useState } from 'react';

const PaymentMethodForm = ({ 
    initialData, 
    onSubmit, 
    onClose, 
    isLoading 
}) => {
    const [formData, setFormData] = useState(initialData);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : 
                    name === 'commission_percentage' ? parseFloat(value) : 
                    value
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSubmit(formData, selectedImage);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-200">
                        Nombre del método de pago *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                        placeholder="ej. Tarjeta de Crédito"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-200">
                        Tipo *
                    </label>
                    <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                        placeholder="ej. card, transfer, cash"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-200">
                        Descripción *
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                        rows="3"
                        placeholder="Describe las características principales del método de pago"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-200">
                        Proveedor *
                    </label>
                    <input
                        type="text"
                        name="provider"
                        value={formData.provider}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                        placeholder="ej. Visa, PayPal, Stripe"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-200">
                        Comisión (%) *
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        name="commission_percentage"
                        value={formData.commission_percentage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                        min="0"
                        max="100"
                    />
                </div>

                <div className="space-y-4 md:col-span-2">
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="requires_additional_data"
                            name="requires_additional_data"
                            checked={formData.requires_additional_data}
                            onChange={handleInputChange}
                            className="w-4 h-4 bg-slate-700 border-slate-600 rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800"
                        />
                        <label htmlFor="requires_additional_data" className="text-sm font-medium text-slate-200">
                            Requiere datos adicionales
                        </label>
                    </div>

                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="active"
                            name="active"
                            checked={formData.active}
                            onChange={handleInputChange}
                            className="w-4 h-4 bg-slate-700 border-slate-600 rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800"
                        />
                        <label htmlFor="active" className="text-sm font-medium text-slate-200">
                            Activo
                        </label>
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
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
                        {formData.logo_url && (
                            <img
                                src={formData.logo_url}
                                alt="Preview"
                                className="h-16 w-auto object-contain"
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 border border-slate-600 rounded-lg text-slate-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:bg-blue-400/50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </form>
    );
};

export default PaymentMethodForm;