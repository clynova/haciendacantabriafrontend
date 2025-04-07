import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const CategoryCard = ({ 
  title, 
  image, 
  href, 
  description, 
  color = "from-black/50 to-black/80", // Default gradient 
  className = '',
  icon 
}) => {
  return (
    <Link
      to={href}
      className={`group relative overflow-hidden flex flex-col justify-end 
                transition-all duration-500 rounded-xl ${className}`}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500
                 group-hover:scale-110"
          loading="lazy"
          width="600"
          height="400"
          style={{ aspectRatio: '3/2' }}
        />
      </div>

      {/* Gradient overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t ${color || "from-black/50 to-black/80"} opacity-60
                  transition-opacity duration-500 group-hover:opacity-70`} 
      />
      
      {/* Content */}
      <div className="relative p-4 sm:p-6 z-10 transform transition-transform duration-500
                  group-hover:translate-y-[-8px]">
        {/* Optional icon */}
        {icon && (
          <div className="mb-3">
            {icon}
          </div>
        )}
        
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2
                     drop-shadow-lg">{title}</h3>
        <p className="text-white/90 text-sm sm:text-base line-clamp-2
                    drop-shadow-lg max-w-md">{description}</p>
        
        {/* Button with hover effect */}
        <div className="mt-3 sm:mt-4 inline-flex items-center text-white font-medium
                     transition-all duration-300 group-hover:gap-2">
          <span>Explorar</span>
          <svg 
            className="w-4 h-4 sm:w-5 sm:h-5 transform transition-transform duration-300
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
  color: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.node
};

export { CategoryCard };
