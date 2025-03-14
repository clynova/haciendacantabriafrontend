import { NavLink } from 'react-router-dom';
import { FiHome, FiBox, FiList, FiUsers, FiTag } from 'react-icons/fi';

const AdminSidebar = () => {
  const menuItems = [
    { to: '/admin', icon: FiHome, label: 'Dashboard' },
    { to: '/admin/products', icon: FiBox, label: 'Productos' },
    { to: '/admin/orders', icon: FiList, label: 'Pedidos' },
    { to: '/admin/users', icon: FiUsers, label: 'Usuarios' },
    { to: '/admin/categories', icon: FiTag, label: 'Categorías' },
  ];

  return (
    <aside className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="mb-4 px-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Panel Admin</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Gestión de tienda</p>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                  }`
                }
                end
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export { AdminSidebar };