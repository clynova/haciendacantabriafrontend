import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { changePassword } from '../../services/userService';
import { toast } from 'react-hot-toast';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const MyConfiguration = () => {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        repNewPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error cuando el usuario comienza a escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.currentPassword) {
            newErrors.currentPassword = 'La contraseña actual es requerida';
        }
        
        if (!formData.newPassword) {
            newErrors.newPassword = 'La nueva contraseña es requerida';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
        }
        
        if (!formData.repNewPassword) {
            newErrors.repNewPassword = 'Debe confirmar la nueva contraseña';
        } else if (formData.newPassword !== formData.repNewPassword) {
            newErrors.repNewPassword = 'Las contraseñas no coinciden';
        }
        
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        
        setLoading(true);
        try {
            const response = await changePassword(formData, token);
            toast.success(response.msg || 'Contraseña actualizada correctamente');
            // Limpiar el formulario después de un cambio exitoso
            setFormData({
                currentPassword: '',
                newPassword: '',
                repNewPassword: ''
            });
        } catch (error) {
            const errorMsg = error?.msg || 'Error al actualizar la contraseña';
            toast.error(errorMsg);
            // Si el error es específico de un campo, lo mostramos
            if (error?.field) {
                setErrors(prev => ({ ...prev, [error.field]: errorMsg }));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Configuración de cuenta
            </h1>
            
            <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Cambiar contraseña
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label 
                            htmlFor="currentPassword" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Contraseña actual
                        </label>
                        <div className="relative">
                            <input 
                                type={showPasswords.current ? "text" : "password"}
                                id="currentPassword"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                className={`block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none
                                        dark:bg-gray-700 dark:border-gray-600 dark:text-white
                                        ${errors.currentPassword 
                                            ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-800' 
                                            : 'border-gray-300 focus:ring-blue-200 dark:focus:ring-blue-800'}`}
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute inset-y-0 right-0 px-3 flex items-center"
                            >
                                {showPasswords.current ? 
                                    <HiEyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" /> : 
                                    <HiEye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                }
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.currentPassword}</p>
                        )}
                    </div>
                    
                    <div>
                        <label 
                            htmlFor="newPassword" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Nueva contraseña
                        </label>
                        <div className="relative">
                            <input 
                                type={showPasswords.new ? "text" : "password"}
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                className={`block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none
                                        dark:bg-gray-700 dark:border-gray-600 dark:text-white
                                        ${errors.newPassword 
                                            ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-800' 
                                            : 'border-gray-300 focus:ring-blue-200 dark:focus:ring-blue-800'}`}
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute inset-y-0 right-0 px-3 flex items-center"
                            >
                                {showPasswords.new ? 
                                    <HiEyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" /> : 
                                    <HiEye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                }
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>
                        )}
                    </div>
                    
                    <div>
                        <label 
                            htmlFor="repNewPassword" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Confirmar nueva contraseña
                        </label>
                        <div className="relative">
                            <input 
                                type={showPasswords.confirm ? "text" : "password"}
                                id="repNewPassword"
                                name="repNewPassword"
                                value={formData.repNewPassword}
                                onChange={handleInputChange}
                                className={`block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none
                                        dark:bg-gray-700 dark:border-gray-600 dark:text-white
                                        ${errors.repNewPassword 
                                            ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-800' 
                                            : 'border-gray-300 focus:ring-blue-200 dark:focus:ring-blue-800'}`}
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute inset-y-0 right-0 px-3 flex items-center"
                            >
                                {showPasswords.confirm ? 
                                    <HiEyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" /> : 
                                    <HiEye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                }
                            </button>
                        </div>
                        {errors.repNewPassword && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.repNewPassword}</p>
                        )}
                    </div>
                    
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium
                                    rounded-lg transition-colors duration-300 focus:outline-none focus:ring-4
                                    focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-50
                                    disabled:cursor-not-allowed flex justify-center"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Actualizando...
                                </span>
                            ) : 'Cambiar contraseña'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export { MyConfiguration };