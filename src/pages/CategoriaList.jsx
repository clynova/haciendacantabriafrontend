import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { CategoryCard } from '../components/Categories/CategoryCard';
import imgCarne from '../images/categories/Carne.webp';
import imgAceite from '../images/categories/Aceite.webp';
import imgDestino from '../images/categories/destino.webp';

const categories = [
  {
    title: "Carnes",
    description: "Las mejores carnes, con garantía de calidad y sabor excepcional",
    image: imgCarne,
    href: "/categoria/carne",
    color: "from-red-500/20 to-red-900/40",
    featured: true
  },
  {
    title: "Aceites",
    description: "Aceites de oliva y otros aceites premium para tus comidas",
    image: imgAceite,
    href: "/categoria/aceite",
    color: "from-green-500/20 to-green-900/40"
  },
  {
    title: "Ofertas",
    description: "Descubre nuestras mejores ofertas y promociones",
    image: imgDestino,
    href: "/categoria/ofertas",
    color: "from-yellow-500/20 to-yellow-900/40"
  },
  {
    title: "Accesorios",
    description: "Encuentra los mejores accesorios para tu cocina y parrilla",
    image: imgDestino,
    href: "/categoria/accesorios",
    color: "from-blue-500/20 to-blue-900/40"
  }
];

const CategoriaList = () => {
  const { setPageTitle } = useGlobal();

  useEffect(() => {
    setPageTitle('Categorías | Hacienda Cantabria');
  }, [setPageTitle]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Nuestras Categorías
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Explora nuestra selección de productos por categoría
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard
            key={category.title}
            title={category.title}
            description={category.description}
            image={category.image}
            href={category.href}
            color={category.color}
            featured={category.featured}
          />
        ))}
      </div>
    </div>
  );
};

export { CategoriaList };