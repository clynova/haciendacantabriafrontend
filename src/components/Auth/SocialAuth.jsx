import PropTypes from 'prop-types';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

// Usar parámetro por defecto de JavaScript para isLoading
const SocialAuth = ({ onSocialLogin, isLoading = false }) => {
    const providers = [
        {
            id: 'google',
            name: 'Google',
            icon: FcGoogle,
            className: 'bg-white hover:bg-gray-50 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300',
        },
        {
            id: 'github',
            name: 'GitHub',
            icon: FaGithub,
            className: 'bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-700 dark:hover:bg-gray-600',
        },
    ];

    return (
        <div className="space-y-4">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                        o continúa con
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {providers.map(({ id, name, icon: Icon, className }) => (
                    <button
                        key={id}
                        onClick={() => onSocialLogin(id)}
                        disabled={isLoading}
                        className={`flex items-center justify-center px-4 py-3 space-x-3 rounded-lg
                                  border border-gray-300 dark:border-gray-600
                                  transition-all duration-200 ${className}
                                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

SocialAuth.propTypes = {
    onSocialLogin: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

export default SocialAuth;