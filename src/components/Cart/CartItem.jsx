import { HiMinus, HiPlus, HiX } from 'react-icons/hi';
import { useCart } from '../../context/CartContext';
import PropTypes from 'prop-types';
import { getImageUrl, formatCurrency } from '../../utils/funcionesReutilizables';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      await removeFromCart(item._id);
      // No necesitamos toast aquí ya que removeFromCart ya lo maneja internamente
    } catch (error) {
      toast.error('Error al eliminar el producto');
      console.error('Error al eliminar el producto:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex items-start p-4">
      <img
        src={getImageUrl(item.multimedia.imagenes[0].url)}
        alt={item.nombre}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex-1 ml-4">
        <h3 className="text-sm font-medium text-slate-200">{item.nombre}</h3>
        <p className="text-sm text-slate-400">{formatCurrency(item.precioFinal)}</p>
        <div className="flex items-center mt-2">
          <button
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
            className="p-1 text-slate-400 hover:text-slate-200"
          >
            <HiMinus className="h-4 w-4" />
          </button>
          <span className="mx-2 text-slate-300">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
            className="p-1 text-slate-400 hover:text-slate-200"
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
    multimedia: PropTypes.shape({
      imagenes: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string,
        textoAlternativo: PropTypes.string,
        esPrincipal: PropTypes.bool,
        _id: PropTypes.string,
      })).isRequired,
    }).isRequired,
    inventario: PropTypes.shape({
      stockUnidades: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export { CartItem };
