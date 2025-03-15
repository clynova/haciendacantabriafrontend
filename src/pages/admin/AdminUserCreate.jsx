import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiArrowLeft, HiMail, HiUser, HiKey, HiShieldCheck, HiExclamationCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { createUser } from '../../services/adminService';

const AdminUserCreate = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repPassword: '', // Changed from passwordConfirm to repPassword
        roles: ['customer'],
        confirmado: true,
        addresses: []
    });

    // Password validation
    const [passwordValidation, setPasswordValidation] = useState({
        isValid: false,
        errors: {
            password: '',
            repPassword: ''
        }
    });

    // Add validation functions from Register component
    const validatePassword = (value) => {
        if (!value) return 'La contraseña es requerida';
        if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
        if (!/[A-Z]/.test(value)) return 'La contraseña debe incluir al menos una mayúscula';
        if (!/[a-z]/.test(value)) return 'La contraseña debe incluir al menos una minúscula';
        if (!/[0-9]/.test(value)) return 'La contraseña debe incluir al menos un número';
        if (!/[!@#$%^&*]/.test(value)) return 'La contraseña debe incluir al menos un carácter especial (!@#$%^&*)';
        return '';
    };

    const validateRepPassword = (password, repPassword) => {
        if (!repPassword) return 'La confirmación de contraseña es requerida';
        if (repPassword !== password) return 'Las contraseñas no coinciden';
        if (repPassword.length < 8) return 'La confirmación de contraseña debe tener al menos 8 caracteres';
        if (!/[!@#$%^&*]/.test(repPassword)) return 'La confirmación de contraseña debe incluir al menos un carácter especial (!@#$%^&*)';
        return '';
    };

    // Update password change handlers
    const handlePasswordChange = (e) => {
        const password = e.target.value;
        const passwordError = validatePassword(password);
        const repPasswordError = validateRepPassword(password, formData.repPassword);

        setFormData({ ...formData, password });
        setPasswordValidation({
            isValid: !passwordError && !repPasswordError,
            errors: {
                password: passwordError,
                repPassword: repPasswordError
            }
        });
    };

    const handleConfirmPasswordChange = (e) => {
        const repPassword = e.target.value; // Changed variable name
        const passwordError = validatePassword(formData.password);
        const repPasswordError = validateRepPassword(formData.password, repPassword);

        setFormData({ ...formData, repPassword }); // Update state key
        setPasswordValidation({
            isValid: !passwordError && !repPasswordError,
            errors: {
                password: passwordError,
                repPassword: repPasswordError
            }
        });
    };

    const handleRoleChange = (e) => {
        setFormData({
            ...formData,
            roles: [e.target.value] // Update roles as array
        });
    };

    // Update the handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Create an array to collect all validation errors
        const errors = [];

        // Check for empty required fields
        if (!formData.firstName) errors.push('El nombre es requerido');
        if (!formData.lastName) errors.push('El apellido es requerido');
        if (!formData.email) errors.push('El correo electrónico es requerido');

        // Check password validation
        const passwordError = validatePassword(formData.password);
        const repPasswordError = validateRepPassword(formData.password, formData.repPassword);

        if (passwordError) errors.push(passwordError);
        if (repPasswordError) errors.push(repPasswordError);

        // If there are any errors, show them and stop
        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return;
        }

        setLoading(true);

        try {
            const userData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.toLowerCase().trim(),
                password: formData.password,
                repPassword: formData.repPassword,
                roles: formData.roles,
                confirmado: true
            };

            const response = await createUser(userData, token);

            if (response.success) {
                toast.success('Usuario creado exitosamente');
                navigate('/admin/users');
            } else {
                // If the API returns validation errors, show them
                if (response.errors && Array.isArray(response.errors)) {
                    response.errors.forEach(error => {
                        toast.error(error.msg);
                    });
                } else {
                    toast.error(response.msg || 'Error al crear el usuario');
                }
            }
        } catch (error) {
            if (error.errors && Array.isArray(error.errors)) {
                error.errors.forEach(err => {
                    toast.error(err.msg);
                });
            } else {
                toast.error(error.msg || 'Error al crear el usuario');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                    >
                        <HiArrowLeft className="h-5 w-5" />
                        <span>Volver a la lista</span>
                    </button>
                </div>

                {/* Main Form Card */}
                <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-slate-700">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <HiUser className="h-6 w-6 text-blue-400" />
                            Crear nuevo usuario
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Personal Information Section */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                                <HiUser className="h-5 w-5 text-blue-400" />
                                Información Personal
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">
                                        Apellido
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                    <HiMail className="h-4 w-4 text-blue-400" />
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Account Settings Section */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                                <HiKey className="h-5 w-5 text-blue-400" />
                                Configuración de cuenta
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={handlePasswordChange}
                                            className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-200 focus:ring-1 ${
                                                passwordValidation.errors.password
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                                    : 'border-slate-600 focus:border-blue-500 focus:ring-blue-500'
                                            }`}
                                            required
                                        />
                                        {passwordValidation.errors.password && (
                                            <div className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                                <HiExclamationCircle className="h-4 w-4" />
                                                {passwordValidation.errors.password}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">
                                        Confirmar Contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={formData.repPassword}
                                            onChange={handleConfirmPasswordChange}
                                            className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-200 focus:ring-1 ${
                                                passwordValidation.errors.repPassword
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                                    : 'border-slate-600 focus:border-blue-500 focus:ring-blue-500'
                                            }`}
                                            required
                                        />
                                        {passwordValidation.errors.repPassword && (
                                            <div className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                                <HiExclamationCircle className="h-4 w-4" />
                                                {passwordValidation.errors.repPassword}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                    <HiShieldCheck className="h-4 w-4 text-blue-400" />
                                    Rol del usuario
                                </label>
                                <select
                                    value={formData.roles[0]}
                                    onChange={handleRoleChange}
                                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="customer">Cliente</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6 border-t border-slate-700">
                            <button
                                type="submit"
                                disabled={loading || 
                                    passwordValidation.errors.password || 
                                    passwordValidation.errors.repPassword ||
                                    !formData.firstName ||
                                    !formData.lastName ||
                                    !formData.email}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creando...
                                    </span>
                                ) : (
                                    'Crear usuario'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export { AdminUserCreate };