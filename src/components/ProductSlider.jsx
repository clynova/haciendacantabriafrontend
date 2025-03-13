import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import img1 from '../images/sliders/premium.webp';
import img2 from '../images/sliders/oferta.webp';
import img3 from '../images/sliders/masvendidos.webp';
import { SlArrowLeftCircle, SlArrowRightCircle } from "react-icons/sl";

const slides = [
  {
    image: img1,
    title: "Accesorios Premium",
    description: "Descubre nuestra nueva colección 2024",
    cta: "Ver Colección",
    link: "/categoria/accesorios"
  },
  {
    image: img2,
    title: "Ofertas Especiales",
    description: "Hasta 50% de descuento en productos seleccionados",
    cta: "Ver Ofertas",
    link: "/ofertas"
  },
  {
    image: img3,
    title: "Lo Más Vendido",
    description: "Los productos favoritos de nuestros clientes",
    cta: "Explorar",
    link: "/mas-vendidos"
  }
];

const ProductSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setCurrent(c => (c + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isPaused]);

  const nextSlide = () => setCurrent((current + 1) % slides.length);
  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  return (
    <div 
      className="relative h-full overflow-hidden" 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Carrusel de productos destacados"
    >
      {/* Slides */}
      <div 
        className="absolute inset-0 flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
            {/* Overlay con gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent flex items-center justify-center">
              <div className="text-center text-white max-w-2xl px-4">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeIn">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl mb-8 animate-fadeIn delay-100">
                  {slide.description}
                </p>
                <Link 
                  to={slide.link}
                  className="inline-block bg-white text-black px-8 py-3 rounded-full 
                           font-semibold hover:bg-gray-200 transition-all duration-300
                           hover:scale-105 active:scale-95 animate-fadeIn delay-200"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 
                 bg-white/30 p-3 rounded-full hover:bg-white/50 transition-all
                 duration-300 hover:scale-110 active:scale-95"
        aria-label="Slide anterior"
      >
        <SlArrowLeftCircle className="w-6 h-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 
                 bg-white/30 p-3 rounded-full hover:bg-white/50 transition-all
                 duration-300 hover:scale-110 active:scale-95"
        aria-label="Siguiente slide"
      >
        <SlArrowRightCircle className="w-6 h-6" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 
              ${current === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
            aria-label={`Ir al slide ${index + 1}`}
            aria-current={current === index ? "true" : "false"}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;
