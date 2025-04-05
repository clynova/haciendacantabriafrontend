import { HiMinus, HiPlus, HiX, HiTag } from 'react-icons/hi';
import { FaWeightHanging } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import PropTypes from 'prop-types';
import { getImageUrl, formatCurrency } from '../../utils/funcionesReutilizables';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

// Función auxiliar para obtener la URL de la imagen de forma segura
const getImageSrc = (multimedia) => {
  if (!multimedia) return '/images/placeholder.png';

  try {
    // Caso 1: Array de imágenes
    if (Array.isArray(multimedia.imagenes) && multimedia.imagenes.length > 0) {
      const firstImage = multimedia.imagenes[0];
      if (typeof firstImage === 'string') return getImageUrl(firstImage);
      if (firstImage?.url) return getImageUrl(firstImage.url);
    }

    // Caso 2: Objeto de imagen único
    if (multimedia.imagenes?.url) return getImageUrl(multimedia.imagenes.url);

    // Caso 3: URL directa en multimedia
    if (multimedia.url) return getImageUrl(multimedia.url);

    // Caso 4: Multimedia es una string (URL directa)
    if (typeof multimedia === 'string') return getImageUrl(multimedia);

  } catch (error) {
    console.error('Error al obtener imagen:', error);
  }

  return '/images/placeholder.png';
};

const CartItem = ({ item }) => {
  const { removeFromCart, updateItemQuantityAction } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Handle all possible product formats
  const isNewFormat = Boolean(item.variant && item.productId);
  const hasSelectedWeightOption = Boolean(item.selectedWeightOption);

  // Get product details based on format
  const productId = isNewFormat ? item.productId._id : item._id;
  const variantId = isNewFormat ? item.variant.pesoId : item.variantId ||
    (hasSelectedWeightOption ? item.selectedWeightOption._id : null);
  const productName = isNewFormat ? item.productId.nombre : item.nombre;
  const productPrice = isNewFormat ? (item.variant.precio || 0) :
    hasSelectedWeightOption ? (item.selectedWeightOption.precio || 0) :
      (item.precioFinal || item.precio || 0);

  // Mejorar la obtención de la imagen del producto
  const productImage = isNewFormat ?
    getImageSrc(item.productId.multimedia || item.multimedia) :
    getImageSrc(item.multimedia);

  // Get weight variant info for all formats
  const weightInfo = isNewFormat ? {
    peso: item.variant.peso,
    unidad: item.variant.unidad,
    sku: item.variant.sku || 'N/A'
  } : hasSelectedWeightOption ? {
    peso: item.selectedWeightOption.peso,
    unidad: item.selectedWeightOption.unidad,
    sku: item.selectedWeightOption.sku || 'N/A'
  } : null;

  // Get available stock based on format
  const getAvailableStock = () => {
    if (isNewFormat) {
      const variantWithStock = item.productId.opcionesPeso?.pesosEstandar?.find(
        option => option.peso === item.variant.peso && option.unidad === item.variant.unidad
      );
      return variantWithStock?.stockDisponible || 250;
    } else if (hasSelectedWeightOption) {
      return item.selectedWeightOption.stockDisponible || 250;
    } else {
      return item.inventario?.stockUnidades !== undefined ?
        item.inventario.stockUnidades : (item.inventario?.stock || 250);
    }
  };

  const availableStock = getAvailableStock();
  const isLowStock = availableStock > 0 && availableStock <= 5;

  const handleRemove = async () => {
    if (isPending) return;

    try {
      setIsPending(true);
      setIsRemoving(true);

      // Obtener los IDs correctamente
      const productId = isNewFormat ? item.productId._id : item._id;
      const variantId = isNewFormat ? item.variant.pesoId : item.variantId ||
        (hasSelectedWeightOption ? item.selectedWeightOption._id : null);

        console.log('productId:', productId);
        console.log('variantId:', variantId);
      const result = await removeFromCart(productId, variantId);

      // Si la eliminación fue exitosa, no necesitamos hacer nada más
      // El estado del carrito se actualizará automáticamente a través del contexto

    } catch (error) {
      // Si hay un error, revertimos el estado visual
      setIsRemoving(false);
      toast.error('Error al eliminar el producto del carrito');
      console.error('Error al eliminar el producto:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className={`rounded-lg border dark:border-slate-700 overflow-hidden transition-opacity duration-300 ${isRemoving ? 'opacity-50' : 'opacity-100'}`}>
      <div className="flex flex-col sm:flex-row">
        {/* Imagen del producto */}
        <div className="w-full sm:w-24 h-24 bg-gray-100 dark:bg-slate-800 relative overflow-hidden">
          <img
            src={productImage}
            alt={productName}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = '/images/placeholder.png'; }}
          />
          {isLowStock && (
            <div className="absolute top-0 left-0 bg-amber-500 text-white text-xs px-1.5 py-0.5">
              ¡Últimas unidades!
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="flex-1 p-3 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{productName}</h3>

                {/* Mostrar información del peso siempre que esté disponible */}
                {weightInfo && (
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <div className="inline-flex items-center text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                      <FaWeightHanging className="mr-1 h-3 w-3" />
                      <span>{weightInfo.peso} {weightInfo.unidad}</span>
                    </div>

                    {weightInfo.sku && weightInfo.sku !== 'N/A' && (
                      <div className="inline-flex items-center text-xs bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                        <HiTag className="mr-1 h-3 w-3" />
                        {weightInfo.sku}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
           
            <button
              onClick={handleRemove}
              disabled={isPending}
              className="p-1 text-gray-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Eliminar producto"
            >
              <HiX className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex items-center">
              {/* Botón para decrementar cantidad productId, variantId, quantity, action, token */}
              <button
                onClick={() => updateItemQuantityAction(productId, variantId, 1, 'decrement')}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 bg-gray-100 dark:bg-slate-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isPending || item.quantity <= 1} // Deshabilitar si está pendiente o la cantidad es 1
              >
                <HiMinus className="h-3 w-3" />
              </button>
              <span className="mx-2 text-sm text-gray-700 dark:text-slate-300 min-w-[20px] text-center">
                {item.quantity}
              </span>
              {/* Botón para incrementar cantidad */}
              <button
                onClick={() => updateItemQuantityAction(productId, variantId, 1, 'increment')}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 bg-gray-100 dark:bg-slate-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isPending || item.quantity >= availableStock} // Deshabilitar si está pendiente o se alcanzó el stock
              >
                <HiPlus className="h-3 w-3" />
              </button>
            </div>

            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(productPrice * item.quantity)}
              </div>
              <div className="text-xs text-gray-500 dark:text-slate-400">
                {formatCurrency(productPrice)} c/u
                {weightInfo && (
                  <span className="ml-1">
                    ({formatCurrency(productPrice / weightInfo.peso)}/{weightInfo.unidad})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.oneOfType([
    // New format with variant and productId
    PropTypes.shape({
      variant: PropTypes.shape({
        pesoId: PropTypes.string,
        peso: PropTypes.number,
        unidad: PropTypes.string,
        precio: PropTypes.number,
        sku: PropTypes.string,
      }),
      productId: PropTypes.shape({
        _id: PropTypes.string,
        nombre: PropTypes.string,
        multimedia: PropTypes.object,
        opcionesPeso: PropTypes.object,
      }),
      quantity: PropTypes.number,
    }),
    // Format with selectedWeightOption
    PropTypes.shape({
      _id: PropTypes.string,
      nombre: PropTypes.string,
      selectedWeightOption: PropTypes.shape({
        _id: PropTypes.string,
        peso: PropTypes.number,
        unidad: PropTypes.string,
        precio: PropTypes.number,
        sku: PropTypes.string,
        stockDisponible: PropTypes.number,
      }),
      quantity: PropTypes.number,
      multimedia: PropTypes.object,
    }),
    // Legacy format
    PropTypes.shape({
      _id: PropTypes.string,
      nombre: PropTypes.string,
      precioFinal: PropTypes.number,
      quantity: PropTypes.number,
      multimedia: PropTypes.object,
      inventario: PropTypes.object,
    })
  ]).isRequired,
};

export { CartItem };
