import { useState, useEffect, memo } from 'react';
import Slider from 'react-slick';
import { SlArrowLeftCircle, SlArrowRightCircle } from "react-icons/sl";
import ProductCard from './ProductCard';
import { getProductsByTags } from '../../services/productService';
import { motion } from 'framer-motion';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Flechas del carrusel rediseñadas
const NextArrow = memo(({ onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.1, backgroundColor: "#ffffff" }}
    whileTap={{ scale: 0.95 }}
    className="absolute -right-2 md:-right-7 top-1/2 -translate-y-1/2 z-10 p-3
               bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg 
               hover:shadow-xl transition-all duration-300
               border border-gray-100 dark:border-gray-700
               group"
    aria-label="Siguiente"
  >
    <SlArrowRightCircle className="w-6 h-6 md:w-7 md:h-7 text-blue-600 dark:text-blue-400 
                                  group-hover:text-blue-500 transition-colors" />
  </motion.button>
));

const PrevArrow = memo(({ onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.1, backgroundColor: "#ffffff" }}
    whileTap={{ scale: 0.95 }}
    className="absolute -left-2 md:-left-7 top-1/2 -translate-y-1/2 z-10 p-3
               bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg 
               hover:shadow-xl transition-all duration-300
               border border-gray-100 dark:border-gray-700
               group"
    aria-label="Anterior"
  >
    <SlArrowLeftCircle className="w-6 h-6 md:w-7 md:h-7 text-blue-600 dark:text-blue-400 
                                 group-hover:text-blue-500 transition-colors" />
  </motion.button>
));

// Configuración optimizada del carrusel
const settings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 4,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  autoplay: true,
  autoplaySpeed: 4000,
  pauseOnHover: true,
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
  dotsClass: "slick-dots !bottom-[-1.5rem] sm:!bottom-[-2.5rem]",
  customPaging: () => (
    <div className="w-2.5 h-2.5 md:w-3 md:h-3 mx-1 rounded-full bg-gray-300 hover:bg-blue-400 dark:bg-gray-600 dark:hover:bg-blue-500 transition-colors duration-300"></div>
  )
};

const BestSellersCarousel = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      setLoading(true);
      try {
        // Obtenemos productos destacados usando la etiqueta "Destacado"
        const response = await getProductsByTags('Destacado', 8);

        if (response.success) {
          setBestSellers(response.products);
        } else {
          setError(response.msg);
        }
      } catch (err) {
        setError('Error al cargar los productos destacados');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  // Componente de carga rediseñado
  if (loading) {
    return (
      <div className="w-full">
        <div className="flex justify-center items-center h-48 md:h-64 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 shadow-md">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 md:h-16 md:w-16 border-t-3 border-b-3 border-blue-500"></div>
            <p className="mt-4 text-sm md:text-base text-blue-600 dark:text-blue-400 font-medium">Cargando productos...</p>
          </div>
        </div>
      </div>
    );
  }

  // Manejo de errores rediseñado
  if (error) {
    return (
      <div className="w-full">
        <div className="flex justify-center items-center h-48 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 shadow-md">
          <div className="text-center p-4 md:p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-12 md:w-12 text-red-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-base md:text-lg font-bold text-red-700 dark:text-red-400 mb-1">No pudimos cargar los productos</h3>
            <p className="text-sm md:text-base text-red-600 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado vacío rediseñado
  if (bestSellers.length === 0) {
    return (
      <div className="w-full">
        <div className="flex justify-center items-center h-48 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md">
          <div className="text-center p-4 md:p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-12 md:w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-base md:text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">No hay productos destacados</h3>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">No se encontraron productos destacados.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Contenedor del carrusel con efectos visuales */}
      <div className="relative">
        {/* Decorador visual (círculo) - solo visible en desktop */}
        <div className="hidden md:block absolute -top-10 -right-10 w-40 h-40 bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-3xl -z-10"></div>
        <div className="hidden md:block absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-100/50 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10"></div>

        {/* Carrusel */}
        <div className="py-1 px-1 md:py-4 md:px-4 ">
          <Slider {...settings}>
            {bestSellers.map(product => (
              <div key={product._id} className="px-1 py-1 md:px-2 md:py-2">
                <ProductCard product={product}>
                  <div className="relative overflow-hidden aspect-square rounded-xl">
                    <div className="relative w-full h-full bg-gray-100 dark:bg-gray-800 rounded-xl">
                      {/* Pre-reserve space for image with aspect-ratio */}
                      <div style={{ position: "relative", width: "100%", height: "100%" }} className="rounded-xl overflow-hidden">
                        <img
                          src={product.multimedia?.imagenes?.[0]?.url || '/images/placeholder.png'}
                          alt={product.nombre}
                          className="w-full h-full object-cover rounded-xl"
                          width="300"
                          height="300"
                          loading="lazy"
                          onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                        />
                      </div>
                    </div>
                  </div>
                </ProductCard>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default memo(BestSellersCarousel);