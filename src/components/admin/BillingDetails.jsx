import { useState } from 'react';
import { HiDocumentDownload, HiUpload, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { enviarEmailPdf } from '../../services/utilService';

const BillingDetails = ({ order, token }) => {
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [facturaStatus, setFacturaStatus] = useState(false);

    // Destructuramos los datos de facturación del pedido
    const facturacion = order.facturacion || {};
    const comprobanteTipo = facturacion.comprobanteTipo || order.comprobanteTipo || 'boleta';
    const { rut, razonSocial, giro, direccionFacturacion } = facturacion;
    // Inicializamos el estado local con el valor del servidor
    const status = facturaStatus || facturacion.status || false; // Status como booleano (true=enviada, false=pendiente)
    const email = order.userId?.email;
    const orderId = order._id;

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSendPdf = async () => {
        if (!selectedFile) {
            toast.error('Debes seleccionar un archivo PDF');
            return;
        }

        if (selectedFile.type !== 'application/pdf') {
            toast.error('El archivo debe ser un PDF');
            return;
        }

        try {
            setLoading(true);
            
            // Convertir el archivo a base64
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            
            reader.onloadend = async () => {
                try {
                    // Enviar el string base64 completo, incluyendo el prefijo data:application/pdf;base64,
                    const result = await enviarEmailPdf(
                        reader.result, // Enviar el resultado completo
                        email, 
                        comprobanteTipo === 'factura' ? 'Factura' : 'Boleta',
                        token,
                        orderId
                    );
                    
                    if (result && result.success) {
                        toast.success(`${comprobanteTipo === 'factura' ? 'Factura' : 'Boleta'} enviada correctamente al cliente`);
                        setSelectedFile(null);
                        // Actualizamos el estado local para reflejar que la factura ha sido enviada
                        setFacturaStatus(true);
                    } else {
                        throw new Error(result?.msg || 'Error al enviar el documento');
                    }
                } catch (error) {
                    console.error('Error en el envío:', error);
                    toast.error(error.message || 'Error al enviar el documento');
                } finally {
                    setLoading(false);
                }
            };
            
            reader.onerror = () => {
                toast.error('Error al leer el archivo');
                setLoading(false);
            };
        } catch (error) {
            console.error('Error al procesar el PDF:', error);
            toast.error('Error al procesar el documento');
            setLoading(false);
        }
    };

    const renderFacturaStatus = () => {
        if (comprobanteTipo !== 'factura') return null;
        
        return (
            <div className="flex items-center mt-1">
                <span className="text-xs font-medium mr-1">Estado:</span>
                {status === true ? (
                    <span className="text-xs text-green-400 flex items-center">
                        <HiCheckCircle className="h-3 w-3 mr-1" />
                        Enviada
                    </span>
                ) : (
                    <span className="text-xs text-yellow-400 flex items-center">
                        <HiXCircle className="h-3 w-3 mr-1" />
                        Pendiente
                    </span>
                )}
            </div>
        );
    };

    // Si es boleta, mostrar un mensaje simple
    if (comprobanteTipo === 'boleta') {
        return (
            <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-200">Boleta</span>
                <span className="text-xs text-slate-400">No Aplica</span>
                
                <div className="mt-2 flex items-center space-x-2">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id={`pdf-upload-${order._id}`}
                    />
                    <label
                        htmlFor={`pdf-upload-${order._id}`}
                        className="cursor-pointer text-xs text-blue-400 hover:text-blue-300 flex items-center"
                    >
                        <HiUpload className="h-4 w-4 mr-1" />
                        Subir PDF
                    </label>
                    
                    {selectedFile && (
                        <button
                            onClick={handleSendPdf}
                            disabled={loading}
                            className="text-xs text-green-400 hover:text-green-300 disabled:opacity-50 flex items-center"
                        >
                            <HiDocumentDownload className="h-4 w-4 mr-1" />
                            Enviar
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Si es factura, mostrar todos los datos
    if (comprobanteTipo === 'factura') {
        return (
            <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-200">Factura</span>
                <div className="text-xs text-slate-400 space-y-1 mt-1">
                    <p><span className="font-medium">Razón Social:</span> {razonSocial || 'No especificada'}</p>
                    <p><span className="font-medium">RUT:</span> {rut || 'No especificado'}</p>
                    <p><span className="font-medium">Giro:</span> {giro || 'No especificado'}</p>
                    <p><span className="font-medium">Dirección:</span> {direccionFacturacion || 'No especificada'}</p>
                    {renderFacturaStatus()}
                </div>
                
                <div className="mt-2 flex items-center space-x-2">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id={`pdf-upload-${order._id}`}
                    />
                    <label
                        htmlFor={`pdf-upload-${order._id}`}
                        className="cursor-pointer text-xs text-blue-400 hover:text-blue-300 flex items-center"
                    >
                        <HiUpload className="h-4 w-4 mr-1" />
                        Subir PDF
                    </label>
                    
                    {selectedFile && (
                        <button
                            onClick={handleSendPdf}
                            disabled={loading}
                            className="text-xs text-green-400 hover:text-green-300 disabled:opacity-50 flex items-center"
                        >
                            <HiDocumentDownload className="h-4 w-4 mr-1" />
                            Enviar
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Para cualquier otro tipo o si no hay tipo especificado
    return (
        <div className="flex flex-col">
            <span className="text-sm text-slate-400">No especificado</span>
        </div>
    );
};

export default BillingDetails;