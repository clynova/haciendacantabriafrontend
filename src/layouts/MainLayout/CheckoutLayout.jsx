import { useCart } from '../../context/CartContext';
import { Outlet, useLocation } from 'react-router-dom';

const CheckoutLayout = () => {
    const { cartItems, shippingInfo } = useCart();
    const location = useLocation();
    const isPaymentPage = location.pathname.includes('/checkout/pago');

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Calcular el peso total del carrito
    const calculateTotalWeight = () => {
        return cartItems.reduce((total, item) => total + (item.weight || 0) * item.quantity, 0);
    };

    // Determinar el costo de envío basado en el método seleccionado
    const getShippingCost = () => {
        if (shippingInfo && shippingInfo.baseCost) {
            // Usar directamente el costo base si está disponible
            return parseFloat(shippingInfo.baseCost);
        } else if (shippingInfo && shippingInfo.methodId) {
            const totalWeight = calculateTotalWeight();
            // Si el peso total es mayor que 1kg, calcular el costo adicional
            const extraWeight = Math.max(0, totalWeight - 1); // Peso adicional después del primer kg
            const baseCost = shippingInfo.baseCost || 0;
            const extraCostPerKg = shippingInfo.extraCostPerKg || 0;

            return baseCost + (extraWeight * extraCostPerKg);
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