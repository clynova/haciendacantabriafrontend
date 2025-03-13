import PropTypes from 'prop-types';

const NextArrow = ({ onClick }) => (
    <button
        onClick={onClick}
        className="slick-arrow slick-next"
        aria-label="Siguiente"
    >
        {/* Ícono de flecha derecha */}
    </button>
);

NextArrow.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default NextArrow;