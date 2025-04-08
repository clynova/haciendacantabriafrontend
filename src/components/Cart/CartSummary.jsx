import { FiArrowRight, FiLock } from 'react-icons/fi';
import { formatCurrency } from '../../utils/funcionesReutilizables';
import PropTypes from 'prop-types';

/**
 * Componente reutilizable para mostrar el resumen de la compra
 * 
 * @param {Object} props
 * @param {Array} props.cartItems - Productos en el carrito
 * @param {Function} props.onContinue - Función a ejecutar al hacer clic en continuar
 * @param {Object} props.shippingMethod - Método de envío seleccionado (opcional)
 * @param {Object} props.shippingInfo - Información completa de envío (opcional)
 * @param {Object} props.paymentMethod - Método de pago seleccionado (opcional)
 * @param {Boolean} props.showButton - Indica si se debe mostrar el botón de continuar
 * @param {String} props.buttonText - Texto del botón de continuar
 * @param {Boolean} props.loading - Indica si está cargando
 * @param {Function} props.calculateSubtotal - Función para calcular el subtotal (opcional)
 * @param {Function} props.calculateTotalWeight - Función para calcular el peso total (opcional)
 * @param {Number} props.shippingCost - Costo de envío (opcional)
 */
const CartSummary = ({ 
    cartItems = [], 
    onContinue = () => {}, 
    shippingMethod = null,
    shippingInfo = null,
    paymentMethod = null,
    showButton = true,
    buttonText = "Continuar",
    loading = false,
    calculateSubtotal = null,
    calculateTotalWeight = null,
    shippingCost = null
}) => {
    // Calcular el subtotal usando la función proporcionada o calcular con la nueva estructura de datos
    const subtotal = calculateSubtotal ? calculateSubtotal() : 
        cartItems.reduce((total, item) => {
            const product = item.productId;
            const variant = item.variant;
            
            // Buscar la información de precio para esta variante
            const variantInfo = product.precioVariantesPorPeso?.find(v => v.pesoId === variant.pesoId);
            
            // Usar el precio final si está disponible, de lo contrario usar el precio normal
            const price = variantInfo?.precioFinal || variant.precio;
            
            return total + (price * item.quantity);
        }, 0);
    
    // Cálculo de peso total si no se proporciona
    const calculateWeight = () => {
        if (calculateTotalWeight) {
            return calculateTotalWeight();
        }
        
        return cartItems.reduce((total, item) => {
            const variant = item.variant;
            let weight = variant.peso || 0;
            
            // Convertir a kg si es necesario para uniformidad
            if (variant.unidad === 'g') {
                weight = weight / 1000;
            }
            
            return total + (weight * item.quantity);
        }, 0);
    };
    
    // Determinar el costo de envío si no se proporciona
    const getShippingCost = () => {
        if (shippingCost !== null) {
            return shippingCost;
        }
        
        if (shippingMethod?.base_cost) {
            // Verificar si aplica envío gratis
            if (shippingMethod.free_shipping_threshold && subtotal >= shippingMethod.free_shipping_threshold) {
                return 0;
            }
            
            // Cálculo basado en peso si hay costo extra por kg
            if (shippingMethod.extra_cost_per_kg) {
                const totalWeight = calculateWeight();
                const extraWeight = Math.max(0, totalWeight - 1);
                return shippingMethod.base_cost + (extraWeight * shippingMethod.extra_cost_per_kg);
            }
            
            return parseFloat(shippingMethod.base_cost);
        } 
        
        if (shippingInfo?.baseCost) {
            // Verificar si aplica envío gratis usando la información de shippingInfo
            if (shippingInfo.free_shipping_threshold && subtotal >= shippingInfo.free_shipping_threshold) {
                return 0;
            }
            
            // Cálculo basado en peso si hay costo extra por kg
            if (shippingInfo.extraCostPerKg) {
                const totalWeight = calculateWeight();
                const extraWeight = Math.max(0, totalWeight - 1);
                return parseFloat(shippingInfo.baseCost) + (extraWeight * shippingInfo.extraCostPerKg);
            }
            
            return parseFloat(shippingInfo.baseCost);
        }
        
        return 0;
    };
    
    const finalShippingCost = getShippingCost();
    const isShippingFree = finalShippingCost === 0 && (shippingMethod || shippingInfo);
    
    // Cálculo de comisión de pago
    let paymentCommission = 0;
    if (paymentMethod?.commission_percentage) {
        paymentCommission = ((subtotal + finalShippingCost) * paymentMethod.commission_percentage) / 100;
    }
    
    const total = subtotal + finalShippingCost + paymentCommission;
    
    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 sticky top-4">
                <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-600">Resumen del Pedido</h2>
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 sticky top-4">
            <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-600">Resumen del Pedido</h2>
            
            {cartItems.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-medium text-gray-600 mb-2">Productos ({cartItems.length})</h3>
                    <div className="max-h-48 overflow-y-auto mb-4">
                        {cartItems.map((item, index) => {
                            const product = item.productId;
                            const variant = item.variant;
                            
                            // Buscar información de precio para esta variante
                            const variantInfo = product.precioVariantesPorPeso?.find(v => v.pesoId === variant.pesoId);
                            const price = variantInfo?.precioFinal || variant.precio;
                            const totalItemPrice = price * item.quantity;
                            
                            // Conseguir la URL de la imagen principal
                            const getImageUrl = () => {
                                if (product && product.multimedia && product.multimedia.imagenes && product.multimedia.imagenes.length > 0) {
                                    return product.multimedia.imagenes[0].url;
                                }
                                return '/images/optimized/placeholder-large.webp'; // Imagen por defecto
                            };
                            
                            return (
                                <div key={`${product._id}-${variant.pesoId}-${index}`} className="flex items-start py-2 border-b">
                                    <div className="h-12 w-12 rounded-md overflow-hidden mr-3 flex-shrink-0">
                                        <img 
                                            src={getImageUrl()} 
                                            alt={product.nombre} 
                                            className="h-full w-full object-cover" 
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm font-medium truncate">{product.nombre}</p>
                                        <p className="text-xs text-gray-500">{variant.peso} {variant.unidad}</p>
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>{item.quantity} x {formatCurrency(price)}</span>
                                            <span>{formatCurrency(totalItemPrice)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            
            <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                    <span className="text-gray-500">Envío</span>
                    <span>
                        {finalShippingCost === 0 && !shippingMethod && !shippingInfo
                            ? 'Se calcula en el siguiente paso'
                            : isShippingFree
                            ? 'Gratis'
                            : formatCurrency(finalShippingCost)
                        }
                    </span>
                </div>
                
                {paymentCommission > 0 && (
                    <div className="flex justify-between">
                        <span className="text-gray-500">Comisión de pago</span>
                        <span>{formatCurrency(paymentCommission)}</span>
                    </div>
                )}
                
                <div className="flex justify-between border-t pt-2 font-bold mt-2">
                    <span>Total</span>
                    <span className="text-blue-500 text-xl">{formatCurrency(total)}</span>
                </div>
            </div>
            
            {/* Información de envío si está disponible */}
            {shippingInfo && shippingInfo.address && (
                <div className="mt-4 pt-4 border-t">
                    <h3 className="font-medium text-gray-600 mb-2">Dirección de envío</h3>
                    <p className="text-sm text-gray-500">{shippingInfo.address.recipient || shippingInfo.recipientInfo?.recipientName}</p>
                    <p className="text-sm text-gray-500">{shippingInfo.address.street}, {shippingInfo.address.number}</p>
                    <p className="text-sm text-gray-500">{shippingInfo.address.suburb}, {shippingInfo.address.city}</p>
                    <p className="text-sm text-gray-500">{shippingInfo.address.state}, CP: {shippingInfo.address.zipCode}</p>
                    {shippingInfo.carrierName && shippingInfo.methodName && (
                        <p className="text-sm text-blue-500 mt-2">
                            {shippingInfo.carrierName} - {shippingInfo.methodName}
                        </p>
                    )}
                </div>
            )}
            
            {showButton && (
                <>
                    <button
                        onClick={onContinue}
                        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                        {buttonText} <FiArrowRight />
                    </button>
                    
                    <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                        <FiLock className="mr-1" />
                        <span>Compra 100% segura</span>
                    </div>
                    
                    <div className="mt-4">
                        <p className="text-xs text-gray-500 text-center">
                            Al continuar, aceptas nuestros términos y condiciones de compra
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

CartSummary.propTypes = {
    cartItems: PropTypes.array,
    onContinue: PropTypes.func,
    shippingMethod: PropTypes.object,
    shippingInfo: PropTypes.object,
    paymentMethod: PropTypes.object,
    showButton: PropTypes.bool,
    buttonText: PropTypes.string,
    loading: PropTypes.bool,
    calculateSubtotal: PropTypes.func,
    calculateTotalWeight: PropTypes.func,
    shippingCost: PropTypes.number
};

export default CartSummary;