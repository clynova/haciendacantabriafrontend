import PropTypes from 'prop-types';

const PasswordStrengthMeter = ({ password }) => {
    const calculateStrength = () => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*]/.test(password)) strength++;
        return strength;
    };

    const getColor = () => {
        const strength = calculateStrength();
        if (strength <= 2) return 'bg-red-500';
        if (strength <= 3) return 'bg-yellow-500';
        if (strength <= 4) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const getLabel = () => {
        const strength = calculateStrength();
        if (strength <= 2) return 'Débil';
        if (strength <= 3) return 'Regular';
        if (strength <= 4) return 'Buena';
        return 'Fuerte';
    };

    const strength = calculateStrength();
    const width = (strength / 5) * 100;

    return (
        <div className="mt-2">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full ${getColor()} transition-all duration-300`}
                    style={{ width: `${width}%` }}
                ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
                Fortaleza: <span className="font-medium">{getLabel()}</span>
            </p>
        </div>
    );
};

PasswordStrengthMeter.propTypes = {
    password: PropTypes.string.isRequired,
};

export default PasswordStrengthMeter;