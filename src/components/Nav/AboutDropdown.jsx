import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiChevronDown } from "react-icons/hi";

const AboutDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  let timeoutId = null;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseEnter = () => {
    if (!isMobile) {
      if (timeoutId) clearTimeout(timeoutId);
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      timeoutId = setTimeout(() => {
        setIsOpen(false);
      }, 150);
    }
  };

  const handleClick = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      className={`relative group ${isMobile ? 'w-full' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >


      {isOpen && (
        <div
          className={`
            ${isMobile
              ? 'relative w-full bg-slate-800/50 mt-1'
              : 'absolute left-0 mt-1 w-48 bg-slate-800'}
            rounded-md shadow-lg py-1 z-50
          `}
        >
          <Link
            to="/about"
            className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-blue-400"
            onClick={() => setIsOpen(false)}
          >
            Nosotros
          </Link>
          <Link
            to="/faq"
            className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-blue-400"
            onClick={() => setIsOpen(false)}
          >
            FAQ
          </Link>
          <Link
            to="/contact"
            className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-blue-400"
            onClick={() => setIsOpen(false)}
          >
            Contacto
          </Link>
          <Link
            to="/policies"
            className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-blue-400"
            onClick={() => setIsOpen(false)}
          >
            Nuestras Políticas
          </Link>
          <Link
            to="/terms"
            className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-blue-400"
            onClick={() => setIsOpen(false)}
          >
            Terminos y Condiciones
          </Link>

        </div>
      )}
    </div>
  );
};

export { AboutDropdown };