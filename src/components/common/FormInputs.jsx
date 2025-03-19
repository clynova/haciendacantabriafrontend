import PropTypes from 'prop-types';

export const FormInput = ({ 
    label, 
    name, 
    value, 
    onChange, 
    type = "text", 
    required = false, 
    ...props 
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                {...props}
            />
        </div>
    );
};

export const FormSelect = ({ 
    label, 
    name, 
    value, 
    onChange, 
    options = [], 
    required = false, 
    ...props 
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                {...props}
            >
                {options.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export const FormTextarea = ({
    label,
    name,
    value,
    onChange,
    required = false,
    rows = 3,
    ...props
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                rows={rows}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                {...props}
            />
        </div>
    );
};

FormInput.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string,
    required: PropTypes.bool
};

FormSelect.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    required: PropTypes.bool
};

FormTextarea.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    rows: PropTypes.number
};