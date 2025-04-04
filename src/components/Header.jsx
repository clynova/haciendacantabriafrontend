import { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenuAlt3, HiX, HiSearch, HiShoppingCart } from "react-icons/hi";
import  SearchBar  from "./SearchBar/SearchBar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { CartDrawer } from "./Cart/CartDrawer";
import UserDropdown from './Nav/UserDropdown';
import { AboutDropdown } from "./Nav/AboutDropdown";

// Componente Navigation extraído para mejor organización
const Navigation = ({ links, onMobileClick = null }) => {
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          to={link.href}
          className="text-slate-300 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
          onClick={onMobileClick}
        >
          {link.name}
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
        </Link>
      ))}
    </>
  );
};

// Componente AuthButtons extraído
const AuthButtons = ({ onMobileClick = null }) => (
  <>
    <Link
      to="/auth"
      className="text-slate-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors duration-200"
      onClick={onMobileClick}
    >
      Ingresar
    </Link>
    <Link
      to="/auth/signup"
      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600
      text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
      transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
      onClick={onMobileClick}
    >
      Registrarse
    </Link>
  </>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Ofertas", href: "/categoria/ofertas" },
    { name: "Carnes", href: "/categoria/carne" },    
    { name: "Aceites", href: "/categoria/aceite" },
  ];

  // Componente para el menú móvil
  const renderMobileMenu = () => (
    <div
      className={`${isMenuOpen ? "translate-x-0" : "-translate-x-full"} 
      md:hidden fixed top-16 left-0 right-0 bottom-0 
      bg-slate-900 backdrop-blur-lg transition-transform duration-300 ease-in-out z-40`}
    >
      <div className="flex flex-col p-4 space-y-4 bg-slate-900">
        <div className="mb-2">
          <SearchBar isExpanded={true} onToggle={() => { }} />
        </div>
        <div className="flex flex-col space-y-4">
          <Navigation links={navLinks} onMobileClick={() => setIsMenuOpen(false)} />
          <AboutDropdown />
        </div>
        <div className="border-t border-slate-800 pt-4">
          {user ? (
            <>
              <Link
                to="/profile"
                className="block w-full text-center text-slate-300 hover:text-white px-4 py-2 text-lg font-medium mb-3 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Mi Perfil
              </Link>
              {user.roles?.includes('admin') && (
                <Link
                  to="/admin"
                  className="block w-full text-center text-slate-300 hover:text-white px-4 py-2 text-lg font-medium mb-3 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Panel Admin
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-center bg-red-500 hover:bg-red-600
                text-white px-4 py-2 rounded-lg text-lg font-medium transition-all duration-200"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <div className="space-y-3 flex flex-col">
              <AuthButtons onMobileClick={() => setIsMenuOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <nav className="fixed w-full z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 md:w-1/4 flex items-center">
              <Link
                to="/"
                className="flex items-center"
              >
                <img 
                  src="/src/images/logo.svg"
                  alt="COHESA Logo"
                  className="h-8 w-8 mr-2"
                />
                <span 
                  className="hidden md:block text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-indigo-300 transition-all duration-300"
                  style={{ fontFamily: "Kaushan Script, cursive "}}
                >
                  COHESA shop
                </span>
              </Link>
            </div>

            {/* Contenedor de navegación - Se ajusta según el tamaño de pantalla */}
            <div className="hidden md:flex w-2/4 justify-center">
              {!isSearchExpanded ? (
                <div className="flex space-x-8">
                  <Navigation links={navLinks} />
                  <AboutDropdown />
                </div>
              ) : (
                <div className="w-full max-w-xl px-4">
                  <SearchBar
                    isExpanded={isSearchExpanded}
                    onToggle={setIsSearchExpanded}
                  />
                </div>
              )}
            </div>

            {/* Contenedor derecho */}
            <div className="flex-1 flex justify-end items-center md:w-1/4">
              {/* Botones de búsqueda y carrito - Agrupados en un contenedor flex */}
              <div className="hidden md:flex items-center space-x-2">
                {!isSearchExpanded && (
                  <>
                    <button
                      onClick={() => setIsSearchExpanded(true)}
                      className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors duration-200"
                      aria-label="Buscar productos"
                    >
                      <HiSearch className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setIsCartOpen(true)}
                      className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors duration-200 relative"
                      aria-label="Ver carrito de compras"
                    >
                      <HiShoppingCart className="h-5 w-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  </>
                )}
              </div>

              {/* Separador */}
              <div className="hidden md:block w-4"></div>

              <div className="hidden md:block">
                {user ? (
                  <UserDropdown />
                ) : (
                  <div className="hidden md:flex items-center space-x-4">
                    <AuthButtons />
                  </div>
                )}
              </div>

              {/* Botón de menú móvil */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors duration-200 relative"
                  aria-label="Ver carrito de compras"
                >
                  <HiShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-slate-300 hover:text-white p-2"
                  aria-label="Abrir menú"
                >
                  {isMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenuAlt3 className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {renderMobileMenu()}
      </nav>
      <CartDrawer />
    </>
  );
};

export { Header };