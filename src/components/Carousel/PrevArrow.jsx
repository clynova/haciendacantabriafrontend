import PropTypes from 'prop-types';

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="slick-arrow slick-prev"
    aria-label="Anterior"
  >
    {/* Ícono de flecha izquierda */}
  </button>
);
PrevArrow.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default PrevArrow;