import { HiX, HiOutlineShoppingBag } from 'react-icons/hi';
import { useCart } from '../../context/CartContext';
import { CartItem } from './CartItem';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/funcionesReutilizables';
import { useMemo } from 'react';

// Función auxiliar para validar que un item del carrito tiene todas las propiedades requeridas
const isValidCartItem = (item) => {
  if (!item) return false;

  // Para el nuevo formato con variant y productId
  if (item.variant && item.productId) {
    return (
      // Verificar que existe la variante y sus propiedades básicas
      item.variant && 
      typeof item.variant === 'object' &&
      // Verificar que existe el producto y sus propiedades básicas
      item.productId && 
      typeof item.productId === 'object' &&
      // Asegurar que tenemos al menos un ID y un nombre
      (item.productId._id || item.productId.id) &&
      item.productId.nombre &&
      // Verificar que hay una cantidad
      typeof item.quantity === 'number'
    );
  }
  
  // Para productos con selectedWeightOption
  if (item.selectedWeightOption) {
    return (
      item._id &&
      item.nombre &&
      typeof item.quantity === 'number' &&
      item.selectedWeightOption &&
      typeof item.selectedWeightOption === 'object'
    );
  }
  
  // Para el formato básico
  return (
    // Verificar ID y nombre
    (item._id || item.id) &&
    item.nombre &&
    // Verificar que hay un precio (cualquier formato válido)
    (item.precioFinal !== undefined || 
     item.precio !== undefined || 
     (item.variant && item.variant.precio !== undefined)) &&
    // Verificar cantidad
    typeof item.quantity === 'number'
  );
};

// Función para eliminar duplicados en el carrito y mantener solo la entrada más reciente
const removeDuplicateItems = (items) => {
  const uniqueItems = new Map();
  
  // Recorrer los items en orden inverso para quedarnos con el más reciente
  // cuando hay múltiples items con el mismo ID/variante
  [...items].reverse().forEach(item => {
    const itemKey = getItemKey(item);
    if (!uniqueItems.has(itemKey)) {
      uniqueItems.set(itemKey, item);
    }
  });
  
  return Array.from(uniqueItems.values());
};

// Función para generar una clave única para cada item basada en su ID y variante
const getItemKey = (item) => {
  if (item.variant && item.productId) {
    return `${item.productId._id}-${item.variant.pesoId}`;
  } else if (item.selectedWeightOption && item._id) {
    return `${item._id}-${item.selectedWeightOption.pesoId || item.selectedWeightOption.peso}`;
  }
  return item._id;
};

const CartDrawer = () => {
  // Obtener cartTotal directamente del contexto
  const { cartItems, isCartOpen, setIsCartOpen, isLoading, cartTotal } = useCart();
  
  // Filtrar items válidos y eliminar duplicados
  const validUniqueCartItems = useMemo(() => {
    const validItems = cartItems.filter(isValidCartItem);
    return removeDuplicateItems(validItems);
  }, [cartItems]);
  
  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 z-50 shadow-xl transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-800">
            <h2 className="text-lg font-medium text-gray-900 dark:text-slate-200">Tu carrito de compras</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
              aria-label="Cerrar carrito"
            >
              <HiX className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                <p className="text-gray-500 dark:text-slate-400">Cargando tu carrito...</p>
              </div>
            ) : validUniqueCartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <HiOutlineShoppingBag className="h-16 w-16 text-gray-300 dark:text-slate-700 mb-4" />
                <p className="text-gray-500 dark:text-slate-400 text-center mb-2">Tu carrito está vacío</p>
                <p className="text-gray-400 dark:text-slate-500 text-center text-sm mb-6">Agrega algunos productos para comenzar</p>
                <Link
                  to="/products"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  onClick={() => setIsCartOpen(false)}
                >
                  Ver productos
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {validUniqueCartItems.map(item => (
                  <CartItem 
                    key={getItemKey(item)} 
                    item={item} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {validUniqueCartItems.length > 0 && (
            <div className="border-t border-gray-200 dark:border-slate-800 p-4 bg-gray-50 dark:bg-slate-800/50">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-400">Subtotal:</span>
                  <span className="text-gray-800 dark:text-slate-200 font-medium">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-slate-500">Envío:</span>
                  <span className="text-gray-700 dark:text-slate-300">Se calcula en el checkout</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4 py-2 border-t border-gray-200 dark:border-slate-700">
                <span className="text-gray-800 dark:text-white font-semibold text-lg">Total:</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                  {formatCurrency(cartTotal)}
                </span>
              </div>
              
              <Link
                to="/checkout"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 
                         hover:from-blue-600 hover:to-indigo-600 text-white py-3 px-4 
                         rounded-lg text-center font-medium transition-all duration-200
                         flex items-center justify-center"
                onClick={() => setIsCartOpen(false)}
              >
                Proceder al pago
              </Link>
              
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full mt-2 text-gray-600 dark:text-slate-400 hover:text-gray-800 
                         dark:hover:text-white text-sm font-medium py-2"
              >
                Continuar comprando
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export { CartDrawer };
