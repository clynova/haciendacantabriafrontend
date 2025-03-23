import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/funcionesReutilizables';

const OrderItem = ({ order, formatDate, getStatusBadgeColor }) => {
    const navigate = useNavigate();
    
    // Verificar si products existe antes de usar reduce
    const totalProducts = order.products 
        ? order.products.reduce((acc, item) => acc + item.quantity, 0) 
        : 0;
    
    return (
        <div 
            onClick={() => navigate(`/profile/orders/${order._id}`)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 dark:border-gray-700"
        >
            <div className="flex flex-col sm:flex-row justify-between gap-4 p-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">Pedido #{order._id.slice(-6)}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(order.status)}`}>
                            {order.status === 'completed' ? 'Completado' : 
                             order.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Fecha: {formatDate(order.orderDate)}
                    </p>
                    <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {totalProducts} producto{totalProducts !== 1 ? 's' : ''}
                        </p>
                        {order.shipping?.carrier && (
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Envío: {order.shipping.carrier.name} - {order.shipping.method}
                            </p>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg text-gray-900 dark:text-white">{formatCurrency(order.total)}</p>
                    {order.payment?.provider && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {order.payment.provider}
                        </p>
                    )}
                </div>
            </div>
            <div className="px-4 pb-4 text-indigo-600 dark:text-indigo-400 text-sm hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                Ver detalles →
            </div>
        </div>
    );
};

OrderItem.propTypes = {
    order: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        orderDate: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        products: PropTypes.arrayOf(
            PropTypes.shape({
                product: PropTypes.shape({
                    name: PropTypes.string,
                }),
                quantity: PropTypes.number,
                price: PropTypes.number
            })
        ), // Removida la validación .isRequired
        total: PropTypes.number.isRequired,
        shipping: PropTypes.shape({
            carrier: PropTypes.shape({
                name: PropTypes.string
            }),
            method: PropTypes.string
        }), // Removida la validación .isRequired
        payment: PropTypes.shape({
            provider: PropTypes.string
        }) // Removida la validación .isRequired
    }).isRequired,
    formatDate: PropTypes.func.isRequired,
    getStatusBadgeColor: PropTypes.func.isRequired
};

export { OrderItem };