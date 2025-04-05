import { useEffect, useState } from "react";
import Lenis from '@studio-freight/lenis';
import { useGlobal } from '../context/GlobalContext';
import ProductSlider from '../components/ProductSlider';
import { CategoriesGrid } from '../components/Categories/CategoriesGrid';
//import ProductGrid from '../components/ProductGrid';
import BestSellersCarousel from '../components/Carousel/BestSellersCarousel';
import { Link } from "react-router-dom";
import CompaniesCarousel from '../components/Companies/CompaniesCarousel';
import CallToAction from '../components/CallToAction/CallToAction';

const Home = () => {
  const { setPageTitle } = useGlobal();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setPageTitle('Inicio | Cohesa');

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Add scroll listener
    lenis.on('scroll', ({ progress, scroll }) => {
      // Calculate scroll progress for the first 500px
      const scrollValue = Math.min(scroll / 500, 1);
      setScrollProgress(scrollValue);
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [setPageTitle]);

  // Calculate transform values based on scroll
  const scale = 1 - (scrollProgress * 0.8); // Will scale from 1 to 0.5
  const opacity = 1 - scrollProgress; // Will fade from 1 to 0
  const translateY = scrollProgress * 50; // Will move up 50px

  return (
    <div className="flex flex-col">
      {/* Hero Section con Slider */}
      <section
        className="w-full h-[65vh]  opacity-0 animate-fadeIn sticky top-0 z-10"
        style={{
          transform: `scale(${scale}) translateY(-${translateY}px)`,
          opacity: opacity,
        }}
      >
        <ProductSlider />
      </section>

      {/* Rest of your sections with adjusted z-index */}
      <div className="relative z-20 bg-white dark:bg-gray-900">
        {/* Categories Section */}
        <section className="max-w-7xl mx-auto px-4 pt-16 w-full opacity-0 animate-fadeIn"
          style={{ animationDelay: '0.2s' }}>
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Nuestras Categorías
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                  Descubre nuestra selección de cortes argentinos premium, pollo de primera calidad y aceite Maravilla
                </p>
              </div>
              <Link to="/categorias" className="mt-4 md:mt-0 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                Ver todas las categorías →
              </Link>
            </div>
            <CategoriesGrid />
          </div>
        </section>

        {/* Companies Section */}
        <section className="w-full bg-gray-900  py-16 opacity-0 animate-fadeIn"
          style={{ animationDelay: '0.3s' }}>
          <div className="max-w-7xl mx-auto px-4">
            <CompaniesCarousel />
          </div>
        </section>

        {/* Best Sellers Section */}
        <section className="w-full bg-gray-50 dark:bg-gray-800/50 py-12 md:py-16 opacity-0 animate-fadeIn"
          style={{ animationDelay: '0.4s' }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Productos Destacados

                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                  Explora nuestra selección premium de cortes argentinos, pollo fresco y aceite de la mejor calidad
                </p>
              </div>
              <a href="/mas-vendidos" className="mt-4 md:mt-0 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                Ver todo el catálogo →
              </a>
            </div>
            <BestSellersCarousel />
          </div>
        </section>

        {/* Replace the old CTA section with the new component */}
        <CallToAction />

        {/* Featured Products Section */}
        <section className="max-w-7xl mx-auto px-4 py-16 w-full opacity-0 animate-fadeIn"
          style={{ animationDelay: '0.6s' }}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Productos Destacados
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                Explora nuestra selección premium de cortes argentinos, pollo fresco y aceite de la mejor calidad
              </p>
            </div>
            <Link to="/productos" className="mt-4 md:mt-0 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              Ver todo el catálogo →
            </Link>
          </div>
          {/*<ProductGrid  /> */}
        </section>
      </div>
    </div>
  );
};

export { Home };