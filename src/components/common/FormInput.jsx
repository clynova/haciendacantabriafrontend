export const FormInput = ({ label, name, value, onChange, type = "text", required = false, ...props }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
                {label}
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