import { HiChevronRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const CategoryBanner = ({ 
  title, 
  description, 
  imageUrl, 
  productsCount 
}) => {
  return (
    <div className="relative bg-gray-900 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-gray-900/70"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center text-sm mb-4 text-white/70 font-medium">
            <Link to="/" className="hover:opacity-80 transition-opacity">Inicio</Link>
            <HiChevronRight className="h-4 w-4 mx-2 opacity-50" />
            <span className="opacity-70">Categorías</span>
            <HiChevronRight className="h-4 w-4 mx-2 opacity-50" />
            <span className="text-white">{title}</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
            {description}
          </p>
          
          {/* Show product count if available */}
          {productsCount !== undefined && (
            <div className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-800 bg-gray-100/90">
              {productsCount} {productsCount === 1 ? 'producto' : 'productos'} disponibles
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CategoryBanner.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  productsCount: PropTypes.number
};

export { CategoryBanner };