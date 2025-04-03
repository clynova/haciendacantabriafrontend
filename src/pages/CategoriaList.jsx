import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { motion } from 'framer-motion';
import imgCarne from '../images/categories/Carne.webp';
import imgAceite from '../images/categories/Aceite.webp';
import imgDestino from '../images/categories/destino.webp';
import imgAccesorios from '../images/categories/destino.webp';

const categories = [
  {
    title: "Carnes",
    description: "Las mejores carnes, con garantía de calidad y sabor excepcional",
    image: imgCarne,
    href: "/categoria/carne",
    color: "from-red-500/20 to-red-900/40",
    icon: "🥩",
    featured: true
  },
  {
    title: "Aceites",
    description: "Aceites de oliva y otros aceites premium para tus comidas",
    image: imgAceite,
    href: "/categoria/aceite",
    color: "from-green-500/20 to-green-900/40",
    icon: "🫒"
  },
  {
    title: "Ofertas",
    description: "Descubre nuestras mejores ofertas y promociones",
    image: imgDestino,
    href: "/categoria/ofertas",
    color: "from-yellow-500/20 to-yellow-900/40",
    icon: "🏷️"
  },
  {
    title: "Accesorios",
    description: "Encuentra los mejores accesorios para tu cocina y parrilla",
    image: imgAccesorios || imgDestino,
    href: "/categoria/accesorios",
    color: "from-blue-500/20 to-blue-900/40",
    icon: "🔪"
  }
];

// Variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const categoryVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, 
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const CategoryCard = ({ title, description, image, href, color, icon, featured }) => {
  return (
    <motion.div
      variants={categoryVariants}
      whileHover={{ scale: 1.03 }}
      className={`
        relative overflow-hidden rounded-xl shadow-lg h-full
        transition-all duration-300 cursor-pointer
        ${featured ? 'md:col-span-2' : ''}
      `}
    >
      <Link to={href} className="block h-full">
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${color} mix-blend-multiply`}
        />
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover absolute inset-0"
        />
        
        <div className="relative h-full p-6 sm:p-8 flex flex-col justify-end z-10 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">{icon}</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
          </div>
          <p className="text-white/80 text-sm sm:text-base line-clamp-2">{description}</p>
          
          <div className="mt-4 flex items-center">
            <span className="text-white font-medium text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center group">
              Explorar
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const CategoriaList = () => {
  const { setPageTitle } = useGlobal();

  useEffect(() => {
    setPageTitle('Categorías | Hacienda Cantabria');
  }, [setPageTitle]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="mb-12 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
          Explora nuestros productos
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Categorías de Productos
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Descubre nuestra selección premium de productos organizados para una experiencia de compra excepcional.
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {categories.map((category) => (
          <CategoryCard
            key={category.title}
            title={category.title}
            description={category.description}
            image={category.image}
            href={category.href}
            color={category.color}
            featured={category.featured}
            icon={category.icon}
          />
        ))}
      </motion.div>
    </div>
  );
};

export { CategoriaList };