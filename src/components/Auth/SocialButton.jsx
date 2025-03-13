import PropTypes from 'prop-types';

const SocialButton = ({ onClick, iconImageSrc, alt, className = "" }) => {
	return (
		<button
			onClick={onClick}
			className={`flex items-center justify-center px-4 py-3 border border-gray-700 rounded-xl
			             hover:border-gray-600 bg-gray-800/30 transition-colors duration-200 ${className}`}
		>
			<img src={iconImageSrc} alt={alt} className="w-5 h-5" />
		</button>
	);
};
SocialButton.propTypes = {
	onClick: PropTypes.func.isRequired,
	iconImageSrc: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
	className: PropTypes.string,
};
export default SocialButton;
