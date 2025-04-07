import { useCart } from '../../context/CartContext';
import { Outlet, useLocation } from 'react-router-dom';

const CheckoutLayout = () => {
    const { cartItems, shippingInfo } = useCart();
    const location = useLocation();
    const isPaymentPage = location.pathname.includes('/checkout/pago');

    // Calcular el subtotal del carrito usando la nueva estructura de datos
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const product = item.productId;
            const variant = item.variant;
            
            // Buscar la información de precio para esta variante
            const variantInfo = product.precioVariantesPorPeso?.find(v => v.pesoId === variant.pesoId);
            
            // Usar el precio final si está disponible, de lo contrario usar el precio normal
            const price = variantInfo?.precioFinal || variant.precio;
            
            return total + (price * item.quantity);
        }, 0);
    };

    // Calcular el peso total del carrito con la nueva estructura
    const calculateTotalWeight = () => {
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

    // Determinar el costo de envío basado en el método seleccionado
    const getShippingCost = () => {
        if (shippingInfo && shippingInfo.baseCost) {
            // Verificar si aplica envío gratis por monto mínimo
            if (shippingInfo.free_shipping_threshold) {
                const subtotal = calculateSubtotal();
                if (subtotal >= shippingInfo.free_shipping_threshold) {
                    return 0;
                }
            }
            
            // Cálculo de envío basado en peso si hay costo extra por kg
            if (shippingInfo.extraCostPerKg) {
                const totalWeight = calculateTotalWeight();
                // Si el peso total es mayor que 1kg, calcular el costo adicional
                const extraWeight = Math.max(0, totalWeight - 1); // Peso adicional después del primer kg
                return shippingInfo.baseCost + (extraWeight * shippingInfo.extraCostPerKg);
            }
            
            // Devolver el costo base de envío
            return parseFloat(shippingInfo.baseCost);
        }
        return 0;
    };

    const shippingCost = getShippingCost();
    const total = calculateSubtotal() + shippingCost;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
            <div className={`grid grid-cols-1 ${isPaymentPage ? 'md:grid-cols-2' : 'md:grid-cols-6'} gap-6`}>
                <main className='md:col-span-8' >
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export { CheckoutLayout };