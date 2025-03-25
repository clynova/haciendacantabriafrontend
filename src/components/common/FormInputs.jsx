import PropTypes from 'prop-types';

export const FormInput = ({ 
    label, 
    value = '', // Add default value
    ...props 
}) => {
    return (
        <div className="form-group">
            <label className="block text-sm font-medium text-gray-200 mb-1">
                {label}
            </label>
            <input
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                value={value}
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
                value={value.toString()} // Convert boolean to string
                onChange={onChange}
                required={required}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                {...props}
            >
                {options.map(option => (
                    <option 
                        key={typeof option === 'object' ? option.value : option} 
                        value={typeof option === 'object' ? option.value : option}
                    >
                        {typeof option === 'object' ? option.label : option}
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
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string,
    name: PropTypes.string.isRequired
};

FormSelect.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.number
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                value: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.bool,
                    PropTypes.number
                ]).isRequired,
                label: PropTypes.string.isRequired
            })
        ])
    ).isRequired,
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