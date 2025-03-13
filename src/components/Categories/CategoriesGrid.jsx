import { CategoryCard } from './CategoryCard';
import imgNeumatico from '../../images/categories/Neumáticos.webp';
import imgAccesorios from '../../images/categories/Accesorios.webp';
import imgHerramientas from '../../images/categories/Herramientas.webp';
import imgLimpieza from '../../images/categories/Limpieza.webp';

const categories = [
  {
    title: "Neumáticos",
    description: "Las mejores marcas en neumáticos para tu vehículo, con garantía de calidad y durabilidad",
    image: imgNeumatico,
    href: "/categoria/neumaticos",
    color: "from-blue-500/20 to-blue-900/40"
  },
  {
    title: "Limpieza",
    description: "Productos especializados para mantener tu auto impecable, interior y exterior",
    image: imgLimpieza,
    href: "/categoria/limpieza",
    color: "from-green-500/20 to-green-900/40"
  },
  {
    title: "Accesorios",
    description: "Personaliza y mejora tu experiencia de manejo con nuestros accesorios premium",
    image: imgAccesorios,
    href: "/categoria/accesorios",
    color: "from-purple-500/20 to-purple-900/40"
  },
  {
    title: "Herramientas",
    description: "Todo lo necesario para el mantenimiento y reparación de tu vehículo",
    image: imgHerramientas,
    href: "/categoria/herramientas",
    color: "from-orange-500/20 to-orange-900/40"
  }
];

const CategoriesGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {categories.map((category, index) => (
        <div key={category.title} 
             className="transform transition-all duration-300 hover:scale-[1.02]"
             style={{ 
               animationDelay: `${index * 150}ms`,
               animation: 'fadeInUp 0.6s ease-out forwards'
             }}
        >
          <CategoryCard {...category} />
        </div>
      ))}
      
      <style jsx="true">{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export { CategoriesGrid };
