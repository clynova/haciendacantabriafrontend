
import { motion } from 'framer-motion';
import { CategoryCard } from './CategoryCard';
import imgCarne from '../../images/categories/Carne.webp';
import imgDestino from '../../images/categories/destino.webp';
import imgAceite from '../../images/categories/Aceite.webp';

const categories = [
  {
    title: "Carnes Premium",
    description: "Descubre nuestra selección de cortes argentinos de la más alta calidad",
    image: imgCarne,
    href: "/categoria/carne",
    color: "from-red-500/20 to-red-900/40",
    featured: true
  },
  {
    title: "Aceites Gourmet",
    description: "Aceites seleccionados para realzar el sabor de tus comidas",
    image: imgAceite,
    href: "/categoria/aceite",
    color: "from-green-500/20 to-green-900/40"
  },
  {
    title: "Accesorios Premium",
    description: "Todo lo necesario para una experiencia culinaria perfecta",
    image: imgDestino,
    href: "/categoria/accesorios",
    color: "from-purple-500/20 to-purple-900/40"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const CategoriesGrid = () => {
  const featuredCategory = categories.find(cat => cat.featured);
  const regularCategories = categories.filter(cat => !cat.featured);

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Featured Category */}
      <motion.div 
        className="transform transition-all duration-500 hover:scale-[1.02] h-[500px] md:h-full
                   rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl"
        variants={itemVariants}
      >
        <CategoryCard {...featuredCategory} className="h-full w-full" />
      </motion.div>

      {/* Regular Categories Column */}
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {regularCategories.map((category, index) => (
          <motion.div 
            key={category.title}
            className="transform transition-all duration-500 hover:scale-[1.02] h-[240px]
                     rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl"
            variants={itemVariants}
          >
            <CategoryCard {...category} className="h-full w-full" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export { CategoriesGrid };
