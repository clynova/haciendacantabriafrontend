import PropTypes from 'prop-types';

const AuthIllustration = ({ illustration }) => {
    return (
        <div className="hidden lg:flex w-1/2 relative overflow-hidden">
            {/* ...existing background grid and estilos... */}
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]"></div>
            <div className="absolute inset-0 flex items-center justify-center p-10">
                <img
                    src={illustration}
                    alt="Illustration"
                    className="max-w-2xl w-full h-auto object-contain animate-float filter drop-shadow-2xl"
                />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-32 to-transparent"></div>
        </div>
    );
};

AuthIllustration.propTypes = {
    illustration: PropTypes.string.isRequired,
};

export default AuthIllustration;
