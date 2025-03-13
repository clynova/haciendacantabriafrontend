import { useCart } from '../../context/CartContext';
import { FiArrowRight, FiLock } from 'react-icons/fi';
import { getImageUrl, formatCurrency } from '../../utils/funcionesReutilizables';
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
 */
const CartSummary = ({ 
    cartItems = [], 
    onContinue = () => {}, 
    shippingMethod = null,
    shippingInfo = null,
    paymentMethod = null,
    showButton = true,
    buttonText = "Continuar",
    loading = false
}) => {
    const { calculateSubtotal } = useCart();
    
    const subtotal = calculateSubtotal ? calculateSubtotal() : 
        cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Cálculo de envío - Ahora maneja tanto shippingMethod como shippingInfo
    let shippingCost = 0;
    
    if (shippingMethod?.base_cost) {
        // Si recibimos un método de envío específico (desde FormaEnvio)
        shippingCost = parseFloat(shippingMethod.base_cost);
    } else if (shippingInfo?.baseCost) {
        // Si recibimos la información completa de envío (desde SistemaDePago)
        shippingCost = parseFloat(shippingInfo.baseCost);
    }
    
    // Cálculo de comisión de pago
    let paymentCommission = 0;
    if (paymentMethod?.commission_percentage) {
        paymentCommission = ((subtotal + shippingCost) * paymentMethod.commission_percentage) / 100;
    }
    
    const total = subtotal + shippingCost + paymentCommission;
    
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
                        {cartItems.map((item) => (
                            <div key={item._id} className="flex items-start py-2 border-b">
                                <div className="h-12 w-12 rounded-md overflow-hidden mr-3 flex-shrink-0">
                                    <img src={getImageUrl(item.images?.[0])} alt={item.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm font-medium truncate">{item.name}</p>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>{item.quantity} x {formatCurrency(item.price)}</span>
                                        <span>{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
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
                        {shippingCost === 0 
                            ? 'Se calcula en el siguiente paso' 
                            : formatCurrency(shippingCost)
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
    loading: PropTypes.bool
};

export default CartSummary;