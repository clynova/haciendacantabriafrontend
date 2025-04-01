import { useEffect } from "react";
import { useGlobal } from '../context/GlobalContext';
import ProductSlider from '../components/ProductSlider';
import { CategoriesGrid } from '../components/Categories/CategoriesGrid';
import ProductGrid from '../components/ProductGrid';
import BestSellersCarousel from '../components/Carousel/BestSellersCarousel';
import { motion } from 'framer-motion'; // Añadimos animaciones

const Home = () => {
  const { setPageTitle } = useGlobal();

  useEffect(() => {
    setPageTitle('Inicio | Cohesa');
  }, [setPageTitle]);

  return (
    <div className="flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section Mejorado */}
      <section className="w-full h-[75vh] relative">
        <ProductSlider />
      </section>

      {/* Categories Section con Animaciones */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 pt-20 w-full"
      >
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                Explora Nuestras Categorías
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                Descubre nuestra selección premium de productos cuidadosamente seleccionados para ti
              </p>
            </div>
            <a href="/categorias" className="group mt-4 md:mt-0 flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-all">
              <span className="text-lg font-medium">Ver todo</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
          <CategoriesGrid />
        </div>
      </motion.section>

      {/* Best Sellers Section Mejorado */}
      <section className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800/50 dark:to-indigo-900/30 py-20">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Productos Más Vendidos
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                Los favoritos de nuestra comunidad, elegidos por su calidad excepcional
              </p>
            </div>
            <a href="/mas-vendidos" className="group mt-4 md:mt-0 flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <span className="text-lg font-medium">Ver más</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
          <div className="max-w-7xl mx-auto">
            <BestSellersCarousel />
          </div>
        </motion.div>
      </section>

{/* Featured Products Section Mejorado */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 py-20 w-full"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
              Productos Destacados
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
              Una selección premium de nuestros mejores productos
            </p>
          </div>
          <a href="/productos" className="group mt-4 md:mt-0 flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <span className="text-lg font-medium">Ver catálogo completo</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
        <ProductGrid />
      </motion.section>

      {/* Call to Action Section Mejorado */}
      <section className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para una experiencia gastronómica única?
          </h2>
          <p className="text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
            Únete a nuestra comunidad y descubre el verdadero sabor de la calidad premium
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="/productos" 
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg
                       hover:bg-gray-100 transition-all duration-300 transform hover:scale-105
                       active:scale-95 shadow-lg hover:shadow-xl"
            >
              Explorar productos
            </a>
            <a 
              href="/auth/signup" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full
                       font-semibold text-lg hover:bg-white/10 transition-all duration-300
                       transform hover:scale-105 active:scale-95"
            >
              Crear cuenta
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export { Home };