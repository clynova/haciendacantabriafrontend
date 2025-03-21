import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { createQuotation } from '../../services/quotationService';
import { HiCheckCircle, HiInformationCircle } from 'react-icons/hi';
import { FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import CartSummary from '../../components/Cart/CartSummary';
import { formatCurrency } from '../../utils/funcionesReutilizables';
import { s } from 'framer-motion/client';

const SolicitudDeCotizacion = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const { cartItems, shippingInfo } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validityDays, setValidityDays] = useState(7);

    useEffect(() => {
        // Verificar que tenemos la información necesaria
        if (!shippingInfo || !shippingInfo.address) {
            toast.error("Por favor selecciona una dirección de envío primero");
            navigate('/checkout/envio');
            return;
        }

        // Verificar que la dirección no es de Valparaíso
        if (shippingInfo.address.state === 'Valparaíso' || shippingInfo.address.city === 'Valparaíso') {
            toast.error("No se pueden generar cotizaciones para la región de Valparaíso");
            navigate('/checkout/envio');
            return;
        }
    }, [shippingInfo, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            console.log(shippingInfo);
            const quotationData = {
                shippingAddressId: shippingInfo.address._id,
                shippingMethod: shippingInfo.carrierId,
                recipientName: shippingInfo.recipientInfo.recipientName,
                phoneContact: shippingInfo.recipientInfo.phoneContact,
                additionalInstructions: shippingInfo.recipientInfo.additionalInstructions,
                validityDays
            };

            const response = await createQuotation(quotationData, token);

            if (response.success) {
                toast.success("Cotización creada exitosamente");
                // Aquí podrías redirigir a una página de confirmación o al historial de cotizaciones
                navigate('/perfil/cotizaciones');
            } else {
                throw new Error(response.msg || "Error al crear la cotización");
            }
        } catch (error) {
            toast.error(error.message || "Error al procesar la cotización");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!shippingInfo || !cartItems.length) {
        return null; // O un componente de carga
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <button
                    onClick={() => navigate('/checkout/envio')}
                    className="flex items-center text-blue-500 hover:text-blue-700"
                >
                    <FiArrowLeft className="mr-2" /> Volver a selección de envío
                </button>
            </div>

            <h1 className="text-3xl font-bold mb-2 text-white">Solicitud de Cotización</h1>
            <p className="text-gray-400 mb-8">
                Revisa los detalles de tu cotización antes de confirmar
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {/* Información de envío */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4">Información de Envío</h2>
                        
                        <div className="border-b pb-4 mb-4">
                            <h3 className="font-medium text-gray-700 mb-2">Dirección de Entrega</h3>
                            <p className="text-gray-600">{shippingInfo.address.recipient}</p>
                            <p className="text-gray-600">
                                {shippingInfo.address.street} {shippingInfo.address.number}
                                {shippingInfo.address.interior && `, Int. ${shippingInfo.address.interior}`}
                            </p>
                            <p className="text-gray-600">
                                {shippingInfo.address.suburb}, {shippingInfo.address.city}
                            </p>
                            <p className="text-gray-600">{shippingInfo.address.state}</p>
                            <p className="text-gray-600">CP: {shippingInfo.address.zipCode}</p>
                        </div>

                        <div className="border-b pb-4 mb-4">
                            <h3 className="font-medium text-gray-700 mb-2">Destinatario</h3>
                            <p className="text-gray-600">
                                Nombre: {shippingInfo.recipientInfo.recipientName}
                            </p>
                            <p className="text-gray-600">
                                Teléfono: {shippingInfo.recipientInfo.phoneContact}
                            </p>
                            {shippingInfo.recipientInfo.additionalInstructions && (
                                <p className="text-gray-600">
                                    Instrucciones: {shippingInfo.recipientInfo.additionalInstructions}
                                </p>
                            )}
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-700 mb-2">Método de Envío</h3>
                            <p className="text-gray-600">{shippingInfo.carrierName}</p>
                            <p className="text-gray-600">{shippingInfo.methodName}</p>
                            <p className="text-gray-600">Tiempo estimado: {shippingInfo.deliveryTime}</p>
                        </div>
                    </div>

                    {/* Validez de la cotización */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4">Validez de la Cotización</h2>
                        <div className="flex items-center space-x-4">
                            <select
                                value={validityDays}
                                onChange={(e) => setValidityDays(Number(e.target.value))}
                                className="form-select block w-full max-w-xs mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            >
                                <option value="7">7 días</option>
                                <option value="15">15 días</option>
                                <option value="30">30 días</option>
                            </select>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            <HiInformationCircle className="inline-block mr-1" />
                            La cotización será válida por el período seleccionado desde su fecha de emisión.
                        </p>
                    </div>

                    {/* Botón de confirmación */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`w-full py-4 px-6 rounded-lg text-white font-medium flex items-center justify-center ${
                            isSubmitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        <HiCheckCircle className="mr-2" />
                        {isSubmitting ? 'Procesando...' : 'Confirmar Solicitud de Cotización'}
                    </button>
                </div>

                {/* Resumen del carrito */}
                <div className="lg:col-span-1">
                    <CartSummary
                        cartItems={cartItems}
                        shippingMethod={{
                            base_cost: shippingInfo.baseCost,
                            name: shippingInfo.methodName,
                            delivery_time: shippingInfo.deliveryTime,
                            free_shipping_threshold: shippingInfo.free_shipping_threshold
                        }}
                        showButton={false}
                    />
                </div>
            </div>
        </div>
    );
};

export { SolicitudDeCotizacion };