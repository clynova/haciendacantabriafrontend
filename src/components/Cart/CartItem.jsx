import { HiMinus, HiPlus, HiX, HiTag } from 'react-icons/hi';
import { FaWeightHanging } from 'react-icons/fa';
import { MdDiscount } from 'react-icons/md';
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

  if (!item || !item.productId || !item.variant) {
    console.warn("Item de carrito con formato inválido:", item);
    return null;
  }
  
  // Extraer información del producto y variante
  const productId = typeof item.productId === 'object' ? item.productId._id : item.productId;
  const variantId = item.variant.pesoId;
  const productName = typeof item.productId === 'object' ? item.productId.nombre : 'Producto';
  
  // Obtener la imagen del producto
  const productImage = typeof item.productId === 'object' ? 
    getImageSrc(item.productId.multimedia) : '/images/placeholder.png';
  
  // Determinar si la variante tiene descuento
  let originalPrice = item.variant.precio || 0;
  let finalPrice = originalPrice;
  let discountPercentage = 0;
  
  // Buscar información de descuento en las variantes del producto
  if (typeof item.productId === 'object' && item.productId.precioVariantesPorPeso) {
    const variantInfo = item.productId.precioVariantesPorPeso.find(
      v => v.pesoId === item.variant.pesoId
    );
    
    if (variantInfo) {
      originalPrice = variantInfo.precio || originalPrice;
      finalPrice = variantInfo.precioFinal || originalPrice;
      discountPercentage = variantInfo.descuento || 0;
    }
  }
  
  // Calcular información de stock
  let availableStock = 999;
  
  if (typeof item.productId === 'object' && item.productId.opcionesPeso?.pesosEstandar) {
    const variantStock = item.productId.opcionesPeso.pesosEstandar.find(
      opt => opt._id === item.variant.pesoId || opt.pesoId === item.variant.pesoId
    );
    
    if (variantStock && variantStock.stockDisponible !== undefined) {
      availableStock = variantStock.stockDisponible;
    }
  }
  
  const isLowStock = availableStock > 0 && availableStock <= 5;
  const hasDiscount = discountPercentage > 0;

  // Preparar información del peso
  const weightInfo = {
    peso: item.variant.peso,
    unidad: item.variant.unidad,
    sku: item.variant.sku || 'N/A'
  };

  const handleRemove = async () => {
    if (isPending) return;

    try {
      setIsPending(true);
      setIsRemoving(true);
      await removeFromCart(productId, variantId);
    } catch (error) {
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
            width="96"
            height="96"
            style={{ aspectRatio: '1/1' }}
          />
          {isLowStock && (
            <div className="absolute top-0 left-0 bg-amber-500 text-white text-xs px-1.5 py-0.5">
              ¡Últimas unidades!
            </div>
          )}
          {hasDiscount && (
            <div className="absolute bottom-0 right-0 bg-green-500 text-white text-xs px-1.5 py-0.5 flex items-center">
              <MdDiscount className="mr-0.5" />
              {discountPercentage}% OFF
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="flex-1 p-3 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{productName}</h3>

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
              {/* Botón para decrementar cantidad */}
              <button
                onClick={() => updateItemQuantityAction(productId, variantId, 1, 'decrement')}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 bg-gray-100 dark:bg-slate-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isPending || item.quantity <= 1}
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
                disabled={isPending || item.quantity >= availableStock}
              >
                <HiPlus className="h-3 w-3" />
              </button>
            </div>

            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(finalPrice * item.quantity)}
              </div>
              <div className="text-xs text-gray-500 dark:text-slate-400">
                {hasDiscount && (
                  <span className="line-through mr-1 text-red-400">{formatCurrency(originalPrice)}</span>
                )}
                <span>{formatCurrency(finalPrice)} c/u</span>
                {weightInfo && (
                  <span className="ml-1">
                    ({formatCurrency(finalPrice / weightInfo.peso)}/{weightInfo.unidad})
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
  item: PropTypes.shape({
    variant: PropTypes.shape({
      pesoId: PropTypes.string.isRequired,
      peso: PropTypes.number.isRequired,
      unidad: PropTypes.string.isRequired,
      precio: PropTypes.number.isRequired,
      sku: PropTypes.string,
    }).isRequired,
    productId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        nombre: PropTypes.string.isRequired,
        multimedia: PropTypes.object,
        opcionesPeso: PropTypes.object,
        precioVariantesPorPeso: PropTypes.array,
      })
    ]).isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};

export { CartItem };
