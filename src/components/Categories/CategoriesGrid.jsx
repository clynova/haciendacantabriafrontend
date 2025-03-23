import { CategoryCard } from './CategoryCard';
import imgNeumatico from '../../images/categories/Neumáticos.webp';
import imgAccesorios from '../../images/categories/Accesorios.webp';
import imgHerramientas from '../../images/categories/Herramientas.webp';
import imgLimpieza from '../../images/categories/Limpieza.webp';

const categories = [
  {
    title: "Carnes",
    description: "Las mejores marcas en neumáticos para tu vehículo, con garantía de calidad y durabilidad",
    image: imgNeumatico,
    href: "/categoria/carne",
    color: "from-blue-500/20 to-blue-900/40",
    featured: true // Add this to mark as featured
  },
  {
    title: "Aceites",
    description: "Productos especializados para mantener tu auto impecable, interior y exterior",
    image: imgLimpieza,
    href: "/categoria/aceite",
    color: "from-green-500/20 to-green-900/40"
  },
  {
    title: "Accesorios",
    description: "Personaliza y mejora tu experiencia de manejo con nuestros accesorios premium",
    image: imgAccesorios,
    href: "/categoria/accesorios",
    color: "from-purple-500/20 to-purple-900/40"
  }
];

const CategoriesGrid = () => {
  const featuredCategory = categories.find(cat => cat.featured);
  const regularCategories = categories.filter(cat => !cat.featured);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {/* Featured Category */}
      <div 
        className="transform transition-all duration-300 hover:scale-[1.02] h-[400px] md:h-full"
        style={{ 
          animation: 'fadeInUp 0.6s ease-out forwards'
        }}
      >
        <CategoryCard {...featuredCategory} className="h-full w-full" />
      </div>

      {/* Regular Categories Column */}
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {regularCategories.map((category, index) => (
          <div 
            key={category.title}
            className="transform transition-all duration-300 hover:scale-[1.02] h-[300px]"
            style={{ 
              animationDelay: `${(index + 1) * 150}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            <CategoryCard {...category} className="h-full w-full" />
          </div>
        ))}
      </div>

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
