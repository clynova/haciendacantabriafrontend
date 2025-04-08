import { CategoryCard } from './CategoryCard';

const categories = [
  {
    title: "Carnes",
    description: "Las mejores carnes, con garantía de calidad y sabor excepcional",
    image: "/images/categories/Carne.webp",
    href: "/categoria/carne",
    color: "",
    featured: true // Add this to mark as featured
  },
  {
    title: "Aceites",
    description: "Aceites de oliva y otros aceites premium para tus comidas",
    image: "/images/categories/Aceite.webp",
    href: "/categoria/aceite",
    color: "from-green-500/20 to-green-900/40"
  },
  {
    title: "Ofertas",
    description: "Encuentra los mejores ofertas para tu cocina y parrilla",
    image: "/images/categories/destino.webp",
    href: "/categoria/ofertas",
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
