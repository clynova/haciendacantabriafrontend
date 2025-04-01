import { useEffect, memo } from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { SlArrowLeftCircle, SlArrowRightCircle } from "react-icons/sl";
import { useProducts } from '../../context/ProductContext';
import ProductCard from './ProductCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NextArrow = memo(({ onClick }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-3
             bg-white dark:bg-gray-800 rounded-full shadow-lg 
             hover:shadow-xl transition-all duration-300
             group"
    aria-label="Siguiente"
  >
    <SlArrowRightCircle className="w-7 h-7 text-blue-600 dark:text-blue-400 
                                  group-hover:text-blue-700 transition-colors" />
  </motion.button>
));

const PrevArrow = memo(({ onClick }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-3
             bg-white dark:bg-gray-800 rounded-full shadow-lg 
             hover:shadow-xl transition-all duration-300
             group"
    aria-label="Anterior"
  >
    <SlArrowLeftCircle className="w-7 h-7 text-blue-600 dark:text-blue-400 
                                 group-hover:text-blue-700 transition-colors" />
  </motion.button>
));

const settings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 4,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  autoplay: true,
  autoplaySpeed: 5000,
  pauseOnHover: true,
  cssEase: "cubic-bezier(0.87, 0, 0.13, 1)",
  responsive: [
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 3,
      }
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      }
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        dots: false
      }
    }
  ],
  dotsClass: "slick-dots !bottom-[-2.5rem]"
};

const BestSellersCarousel = () => {
  const { products, loading, error, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-lg">Error al cargar los productos</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  const bestSellers = products ? products.slice(0, 8) : [];

  if (bestSellers.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <p className="text-lg">No hay productos disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="relative px-8 pb-12">
      <Slider {...settings}>
        {bestSellers.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="px-3"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </Slider>
    </div>
  );
};

export default memo(BestSellersCarousel);
