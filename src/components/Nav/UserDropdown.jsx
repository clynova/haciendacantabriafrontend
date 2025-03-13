import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiUser, HiShoppingBag, HiCog, HiLogout, HiShoppingCart } from 'react-icons/hi';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formateoNombre, cortarTexto } from '../../utils/funcionesReutilizables';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const { setIsCartOpen } = useCart();
  const { logout, isLoggingOut, user } = useAuth();
  const navigate = useNavigate();
  
  useOnClickOutside(dropdownRef, () => setIsOpen(false));
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  
  const menuItems = [
    { icon: <HiUser className="w-5 h-5" />, label: 'Mi Perfil', to: '/profile' },
    { icon: <HiShoppingCart className="w-5 h-5" />, label: 'Carrito', to: '/checkout' },
    { icon: <HiShoppingBag className="w-5 h-5" />, label: 'Mis Compras', to: '/profile/orders' },
    { icon: <HiCog className="w-5 h-5" />, label: 'Configuración', to: '/profile/settings' },
    { icon: <HiLogout className="w-5 h-5" />, label: 'Cerrar Sesión', onClick: handleLogout },
  ];

  // Determinar si hay una imagen de perfil
  const profileImage = user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName || 'User'}`;
  
  // Truncar el nombre de usuario si es muy largo
  const displayName = formateoNombre(user.firstName, user.lastName) || 'Usuario';
  const truncatedName = cortarTexto(displayName, 15); // Limitar a 15 caracteres

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-slate-800/50"
        aria-label="Menú de usuario"
        aria-expanded={isOpen}
      >
        <div className="relative">
          <img
            src={profileImage}
            alt="Avatar"
            className="w-8 h-8 rounded-full border-2 border-blue-500 object-cover"
            onError={(e) => {
              e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Fallback";
            }}
          />
          <div className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900`}></div>
        </div>
        <span className="font-medium hidden sm:inline max-w-[120px] truncate"> 
          {truncatedName} 
        </span>
      </button>
      
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-64 rounded-lg bg-white dark:bg-gray-800 shadow-lg py-1 z-50 overflow-hidden animate-fadeIn"
          style={{
            transformOrigin: 'top right',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {/* Cabecera del menú con información del usuario */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <img 
                src={profileImage}
                alt="Avatar" 
                className="w-12 h-12 rounded-full border-2 border-blue-500"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">
                  {displayName}
                </p>
                <p className="text-sm text-gray-400 truncate" title={user.email}>
                  {user.email}
                </p>
              </div>
            </div>
          </div>
          
          {/* Opciones del menú */}
          <div className="py-1">
            {menuItems.map((item, index) => (
              item.onClick ? (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  disabled={item.label === 'Cerrar Sesión' && isLoggingOut}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                    ${item.label === 'Cerrar Sesión' && isLoggingOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="text-blue-500">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.label === 'Cerrar Sesión' && isLoggingOut && (
                    <div className="ml-auto animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                  )}
                </button>
              ) : (
                <Link
                  key={index}
                  to={item.to}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-blue-500">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
