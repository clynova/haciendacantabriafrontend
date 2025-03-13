import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const PaymentFailure = () => {
    const [orderDetails, setOrderDetails] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const orderId = params.get('order_id') || location.state?.orderId;;
        const reason = params.get('reason') || 'rejected';

        if (!orderId) {
            toast.error('No se encontró información de la orden');
            navigate('/');
            return;
        }

        setOrderDetails({
            orderId,
            reason: reason || 'rejected'
        });

    }, [location, navigate]);

    if (!orderDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold">Cargando información...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Pago No Completado</h2>
                <p className="text-gray-600 mt-2">
                    Lo sentimos, no pudimos procesar tu pago.
                </p>
                <p className="text-gray-500 mt-1">
                    Motivo: {orderDetails.reason === 'rejected' ? 'Pago rechazado' : orderDetails.reason}
                </p>
                <div className="mt-6 space-y-3">
                    <button
                        onClick={() => navigate('/checkout/pago')}
                        className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Intentar pagar nuevamente
                    </button>
                    <Link
                        to="/profile/orders"
                        className="block w-full text-gray-600 underline py-2"
                    >
                        Ver mis pedidos
                    </Link>
                </div>
            </div>
        </div>
    );
};

export { PaymentFailure }; 