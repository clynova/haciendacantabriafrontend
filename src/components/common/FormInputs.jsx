import React from 'react';
import PropTypes from 'prop-types';

export const FormInput = ({ 
    label, 
    name, 
    value, 
    onChange, 
    type = 'text', 
    helperText, 
    ...props 
}) => {
    const inputProps = { ...props };
    
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value || ''}
                onChange={onChange}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 
                         dark:border-slate-600 rounded-md text-gray-900 dark:text-white 
                         focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 
                         dark:focus:border-primary-500"
                {...inputProps}
            />
            {helperText && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {helperText}
                </p>
            )}
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                name={name}
                value={value.toString()}
                onChange={onChange}
                required={required}
                className="w-full bg-white dark:bg-slate-700 border border-gray-300 
                         dark:border-slate-600 rounded-lg px-3 py-2 text-gray-900 
                         dark:text-gray-200 focus:ring-primary-500 focus:border-primary-500"
                {...props}
            >
                {options.map(option => (
                    <option 
                        key={typeof option === 'object' ? option.value : option} 
                        value={typeof option === 'object' ? option.value : option}
                        className="bg-white dark:bg-slate-700"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                rows={rows}
                className="w-full bg-white dark:bg-slate-700 border border-gray-300 
                         dark:border-slate-600 rounded-lg px-3 py-2 text-gray-900 
                         dark:text-gray-200 focus:ring-primary-500 focus:border-primary-500"
                {...props}
            />
        </div>
    );
};

FormInput.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string,
    helperText: PropTypes.string
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