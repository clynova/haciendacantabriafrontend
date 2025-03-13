import Slider from "react-slick";
import PropTypes from 'prop-types';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { products } from "../../data/products.js";
import { SlArrowLeftCircle, SlArrowRightCircle } from "react-icons/sl";
import { Link } from "react-router-dom";
// ...existing code...

// Flechas de navegación mejoradas para mayor visibilidad
const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-2xl transition"
    >
      <SlArrowRightCircle className="w-8 h-8 text-gray-900 dark:text-gray-100" />
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-2xl transition"
    >
      <SlArrowLeftCircle className="w-8 h-8 text-gray-900 dark:text-gray-100" />
    </div>
  );
};

const BestSellersCarousel = () => {
  const bestSellers = products.slice(0, 8);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow onClick={() => { }} />, // Pasa la función onClick
    prevArrow: <PrevArrow onClick={() => { }} />, // Pasa la función onClick
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div className="relative px-4 py-6">
      <Slider {...settings}>
        {bestSellers.map(product => (
          <div key={product._id} className="px-2">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-all p-6">
              <div className="aspect-square relative w-full overflow-hidden rounded-lg mb-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate">{product.name}</h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">${product.price.toFixed(2)}</p>
              <Link
                to={`/product/${product._id}`}
                className="block mt-4 text-center text-indigo-500 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-100 px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-indigo-200 dark:hover:bg-indigo-700"
              >
                Ver detalles
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

NextArrow.propTypes = {
  onClick: PropTypes.func.isRequired,
};

PrevArrow.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default BestSellersCarousel;
