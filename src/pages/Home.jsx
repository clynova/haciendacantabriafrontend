import { useEffect } from "react";
import { useGlobal } from '../context/GlobalContext';
import ProductSlider from '../components/ProductSlider';
import { CategoriesGrid } from '../components/Categories/CategoriesGrid';
import ProductGrid from '../components/ProductGrid';
import BestSellersCarousel from '../components/Carousel/BestSellersCarousel';

const Home = () => {
  const { setPageTitle } = useGlobal();

  useEffect(() => {
    setPageTitle('Inicio | LynFront');
  }, [setPageTitle]);

  return (
    <div className="flex flex-col">
      {/* Hero Section con Slider */}
      <section className="w-full h-[80vh] relative">
        <ProductSlider />
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 w-full">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Explora nuestras Categorías
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                Encuentra todo lo que necesitas para tu vehículo, desde accesorios hasta herramientas especializadas
              </p>
            </div>
            <a href="/categorias" className="mt-4 md:mt-0 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              Ver todas las categorías →
            </a>
          </div>
          <CategoriesGrid />
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="w-full bg-gray-50 dark:bg-gray-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Productos Más Vendidos
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                Los favoritos de nuestros clientes, seleccionados por su calidad y popularidad
              </p>
            </div>
            <a href="/mas-vendidos" className="mt-4 md:mt-0 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              Ver todos los más vendidos →
            </a>
          </div>
          <div className="max-w-7xl mx-auto">
            <BestSellersCarousel />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 w-full">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Productos Destacados
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Descubre nuestra selección de productos premium cuidadosamente elegidos para ti
            </p>
          </div>
          <a href="/productos" className="mt-4 md:mt-0 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            Ver todos los productos →
          </a>
        </div>
        <ProductGrid />
      </section>

      {/* Call to Action Section */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para mejorar tu vehículo?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad y descubre las últimas tendencias en accesorios y mejoras para tu auto
          </p>
          <a 
            href="/auth/signup" 
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full 
                     font-semibold hover:bg-gray-100 transition-all duration-300
                     transform hover:scale-105 active:scale-95"
          >
            Comenzar ahora
          </a>
        </div>
      </section>
    </div>
  );
};

export { Home };