import PropTypes from 'prop-types';

const InputField = ({
	id,
	label,
	placeholder,
	type = "text",
	icon: Icon,
	helpText,
	showHelp = false,
	onHelpClick,
	...rest
}) => {
	return (
		<div className="relative group">
			<label className="block text-gray-400 mb-2 inline-flex items-center" htmlFor={id}>
				{label}
				{onHelpClick && Icon && (
					<button
						type="button"
						onClick={onHelpClick}
						className="ml-2 text-gray-400 hover:text-green-400"
					>
						<Icon className="h-4 w-4" />
					</button>
				)}
			</label>
			<div className="relative">
				<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-400">
					{Icon && <Icon className="h-5 w-5" />}
				</div>
				<input
					type={type}
					id={id}
					placeholder={placeholder}
					className="block w-full pl-12 pr-4 py-3.5 text-sm rounded-xl bg-gray-800/50
					           border border-gray-700 focus:border-green-400/50 focus:ring-2 focus:ring-green-400/20
					           text-gray-200 placeholder:text-gray-500 transition duration-200 ease-in-out transform hover:border-gray-600"
					{...rest}
				/>
			</div>
			{showHelp && helpText && (
				<div className="mt-2 text-xs text-gray-400">{helpText}</div>
			)}
		</div>
	);
};

InputField.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	type: PropTypes.string,
	icon: PropTypes.elementType,
	helpText: PropTypes.string,
	showHelp: PropTypes.bool,
	onHelpClick: PropTypes.func,
};

export default InputField;