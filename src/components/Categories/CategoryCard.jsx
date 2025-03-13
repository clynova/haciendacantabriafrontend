import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const CategoryCard = ({ title, image, href, description, color }) => {
  return (
    <Link
      to={href}
      className="group relative overflow-hidden rounded-2xl flex flex-col justify-end h-[300px]
                 transition-all duration-500"
    >
      {/* Fondo con imagen */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500
                     group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Gradiente personalizado por categoría */}
      <div className={`absolute inset-0 bg-gradient-to-t ${color} opacity-60
                      transition-opacity duration-500 group-hover:opacity-70`} />
      
      {/* Contenido */}
      <div className="relative p-6 sm:p-8 z-10 transform transition-transform duration-500
                    group-hover:translate-y-[-8px]">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2
                     drop-shadow-lg">{title}</h3>
        <p className="text-white/90 text-sm sm:text-base line-clamp-2
                    drop-shadow-lg max-w-md">{description}</p>
        
        {/* Botón con efecto hover */}
        <div className="mt-4 inline-flex items-center text-white font-medium
                      transition-all duration-300 group-hover:gap-2">
          <span>Explorar</span>
          <svg 
            className="w-5 h-5 transform transition-transform duration-300
                     group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
};

CategoryCard.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export { CategoryCard };
