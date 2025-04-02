import { HiMinus, HiPlus, HiX } from 'react-icons/hi';
import { useCart } from '../../context/CartContext';
import PropTypes from 'prop-types';
import { getImageUrl, formatCurrency } from '../../utils/funcionesReutilizables';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

// Función auxiliar para obtener la URL de la imagen de forma segura
const getImageSrc = (multimedia) => {
  try {
    // Si multimedia.imagenes es un array y tiene elementos
    if (Array.isArray(multimedia.imagenes) && multimedia.imagenes.length > 0) {
      // Si el primer elemento es un objeto con URL
      if (multimedia.imagenes[0]?.url) {
        return getImageUrl(multimedia.imagenes[0].url);
      }
      // Si el primer elemento es una URL directa
      if (typeof multimedia.imagenes[0] === 'string') {
        return getImageUrl(multimedia.imagenes[0]);
      }
    }
    // Si multimedia.imagenes es un objeto (no array) con una URL
    if (!Array.isArray(multimedia.imagenes) && multimedia.imagenes?.url) {
      return getImageUrl(multimedia.imagenes.url);
    }
  } catch (error) {
    console.error('Error al obtener imagen del producto:', error);
  }
  
  // Imagen por defecto si no se encuentra ninguna
  return '/images/placeholder.png';
};

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      await removeFromCart(item._id);
    } catch (error) {
      toast.error('Error al eliminar el producto');
      console.error('Error al eliminar el producto:', error);
    } finally {
      setIsRemoving(false);
    }
  };
  
  // Verificar si el inventario tiene stockUnidades, usar un valor predeterminado si no
  const stockUnidades = item.inventario?.stockUnidades !== undefined ? 
    item.inventario.stockUnidades : (item.inventario?.stock || 250);

  return (
    <div className="flex items-start p-4">
      <img
        src={getImageSrc(item.multimedia)}
        alt={item.nombre}
        className="w-16 h-16 object-cover rounded"
        onError={(e) => { e.target.src = '/images/placeholder.png'; }}
      />
      <div className="flex-1 ml-4">
        <h3 className="text-sm font-medium text-slate-200">{item.nombre}</h3>
        <p className="text-sm text-slate-400">{formatCurrency(item.precioFinal)}</p>
        <div className="flex items-center mt-2">
          <button
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
            className="p-1 text-slate-400 hover:text-slate-200"
            disabled={isRemoving}
          >
            <HiMinus className="h-4 w-4" />
          </button>
          <span className="mx-2 text-slate-300">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
            className="p-1 text-slate-400 hover:text-slate-200"
            disabled={isRemoving || item.quantity >= stockUnidades}
          >
            <HiPlus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <button
        onClick={handleRemove}
        disabled={isRemoving}
        className="p-2 text-slate-400 hover:text-red-400 disabled:opacity-50"
      >
        <HiX className="h-5 w-5" />
      </button>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    precioFinal: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    multimedia: PropTypes.object.isRequired,
    inventario: PropTypes.object,
  }).isRequired,
};

export { CartItem };
