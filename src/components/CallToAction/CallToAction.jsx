import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
// Import images directly
import heroCarnes from '../../images/sliders/heroCarnes.webp';
import masvendidos from '../../images/sliders/masvendidos.webp';
import oferta from '../../images/sliders/oferta.webp';

const ctaImages = [
  heroCarnes,
  masvendidos,
  oferta
];

const CallToAction = () => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Auto-change image effect
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % ctaImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Visibility observer effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    const section = sectionRef.current;
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-[70vh] w-full overflow-hidden"
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {ctaImages.map((img, idx) => (
          <div
            key={img}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: idx === imageIndex ? 1 : 0,
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        {/* Add overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div 
        className={`relative max-w-7xl mx-auto px-4 h-full flex items-center transform transition-all duration-1000
                   ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        <div className="w-full max-w-3xl text-center mx-auto py-24">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            ¿Listo para disfrutar la mejor carne argentina?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
            Únete a nuestra comunidad de amantes de la buena carne y 
            descubre el auténtico sabor de la calidad premium
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link 
              to="/productos" 
              className="group relative overflow-hidden bg-white text-blue-600 
                       px-8 py-4 rounded-full text-lg font-semibold 
                       hover:bg-gray-100 transition-all duration-300
                       transform hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Comprar ahora</span>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-50 to-transparent
                           transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </Link>
            <Link 
              to="/categorias" 
              className="group px-8 py-4 rounded-full text-lg font-semibold 
                       text-white border-2 border-white/30 hover:border-white 
                       transition-all duration-300 transform hover:scale-105 
                       active:scale-95 hover:bg-white/10"
            >
              Ver categorías
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 
                     animate-bounce text-white/70">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default CallToAction;