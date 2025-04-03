import { useEffect } from "react";
import { useGlobal } from '../context/GlobalContext';
import ProductSlider from '../components/ProductSlider';
import { CategoriesGrid } from '../components/Categories/CategoriesGrid';
import ProductGrid from '../components/ProductGrid';
import BestSellersCarousel from '../components/Carousel/BestSellersCarousel';
import { Link } from "react-router-dom";

const Home = () => {
  const { setPageTitle } = useGlobal();

  useEffect(() => {
    setPageTitle('Inicio | Cohesa');
  }, [setPageTitle]);

  return (
    <div className="flex flex-col">
      {/* Hero Section con Slider */}
      <section className="w-full h-[65vh] relative">
        <ProductSlider />
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 pt-16 w-full">
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

      {/* Best Sellers Section */}
      <section className="w-full bg-gray-50 dark:bg-gray-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Los Más Vendidos
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                Los cortes preferidos por nuestros clientes, seleccionados por su calidad y sabor excepcional
              </p>
            </div>
            <a href="/mas-vendidos" className="mt-4 md:mt-0 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              Ver más vendidos →
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
              Explora nuestra selección premium de cortes argentinos, pollo fresco y aceite de la mejor calidad
            </p>
          </div>
          <Link to="/productos" className="mt-4 md:mt-0 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            Ver todo el catálogo →
          </Link>
        </div>
        <ProductGrid />
      </section>

      {/* Call to Action Section */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para disfrutar la mejor carne argentina?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad de amantes de la buena carne y descubre el auténtico sabor de la calidad premium
          </p>
          <Link 
            to="/productos" 
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full 
                     font-semibold hover:bg-gray-100 transition-all duration-300
                     transform hover:scale-105 active:scale-95"
          >
            Comprar ahora
          </Link>
        </div>
      </section>
    </div>
  );
};

export { Home };