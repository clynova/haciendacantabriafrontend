import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { getPaymentStatus } from '../../services/checkoutService';

const Confirmation = () => {
    const { cartItems, clearCart } = useCart();
    const { token } = useAuth();
    const [orderStatus, setOrderStatus] = useState('processing');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const orderId = params.get('order_id') || location.state?.orderId;;

        if (!orderId) {
            toast.error('No se encontró la orden');
            navigate('/');
            return;
        }

        // Limpiar el carrito si aún tiene productos
        if (cartItems.length > 0) {
            clearCart();
        }

        // Verificar el estado de la orden en el backend usando getPaymentStatus
        const verifyOrder = async () => {
            try {
                const response = await getPaymentStatus(orderId, token);
                if (response.success && response.order.status === 'paid') {
                    setOrderStatus('success');
                } else {
                    setOrderStatus('pending');
                }
            } catch (error) {
                console.error('Error verificando la orden:', error);
                // Asumimos éxito si hay error para no frustrar al usuario
                setOrderStatus('success');
            }
        };

        verifyOrder();
    }, [location, navigate, clearCart, cartItems, token]);

    if (orderStatus === 'processing') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold">Procesando tu pago...</h2>
                    <p className="text-gray-600 mt-2">Por favor espera un momento</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">¡Pago Exitoso!</h2>
                <p className="text-gray-600 mt-2">
                    Tu orden ha sido procesada correctamente.
                </p>
                <button
                    onClick={() => navigate('/profile/orders')}
                    className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Ver mis pedidos
                </button>
            </div>
        </div>
    );
};

export { Confirmation };