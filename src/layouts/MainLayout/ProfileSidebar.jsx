import { NavLink } from 'react-router-dom';
import { 
  FaUser, 
  FaHistory, 
  FaHeart, 
  FaAddressCard, 
  FaCreditCard,
  FaCog 
} from 'react-icons/fa';

const ProfileSidebar = () => {
  const menuItems = [
    { to: '/profile', icon: FaUser, label: 'Información Personal' },
    { to: '/profile/orders', icon: FaHistory, label: 'Mis Pedidos' },
    { to: '/profile/wishlist', icon: FaHeart, label: 'Lista de Deseos' },
    { to: '/profile/addresses', icon: FaAddressCard, label: 'Direcciones' },
    { to: '/profile/settings', icon: FaCog, label: 'Configuración' },
    { to: '/profile/quotations', icon: FaCreditCard, label: 'Mis Cotizaciones' },
  ];

  return (
    <aside className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export { ProfileSidebar };