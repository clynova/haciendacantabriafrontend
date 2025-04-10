import PropTypes from 'prop-types';
import { getImageUrl } from '../../utils/funcionesReutilizables';
import { FaSnowflake, FaTemperatureLow, FaLeaf } from 'react-icons/fa';

const ImageGallery = ({ images, selectedImage, setSelectedImage, conservacion, origen, tipoProducto }) => {
    // Verificar si es carne argentina
    const isArgentinianMeat = tipoProducto === 'ProductoCarne' && 
                             origen?.pais?.toLowerCase() === 'argentina';
                             
    // Función para obtener información sobre el tipo de conservación
    const getConservationInfo = () => {
        if (conservacion?.requiereCongelacion) {
            return {
                icon: <FaSnowflake className="w-full h-full text-blue-500" />,
                text: 'Congelado',
                bgColor: 'bg-blue-100/90',
                textColor: 'text-blue-700'
            };
        } else if (conservacion?.requiereRefrigeracion) {
            return {
                icon: <FaTemperatureLow className="w-full h-full text-cyan-500" />,
                text: 'Refrigerado',
                bgColor: 'bg-cyan-100/90',
                textColor: 'text-cyan-700'
            };
        }
        return {
            icon: <FaLeaf className="w-full h-full text-green-500" />,
            text: 'Fresco',
            bgColor: 'bg-green-100/90',
            textColor: 'text-green-700'
        };
    };
    
    const conservationInfo = getConservationInfo();
    
    return (
        <div className="flex flex-col">
            <div className="relative h-[480px] w-full border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                    <img
                        src={getImageUrl(images[selectedImage].url)}
                        alt={images[selectedImage].textoAlternativo}
                        className="max-h-full max-w-full object-contain"
                        width="480"
                        height="480"
                        style={{ aspectRatio: "1/1" }}
                    />
                </div>
                
                {/* Bandera de Argentina */}
                {isArgentinianMeat && (
                    <div className="absolute top-4 left-4 z-20">
                        <img
                            src="/images/optimized/flags/argentina-flag.webp"
                            alt="Origen Argentina"
                            className="w-10 h-10 rounded-full shadow-md border-2 border-white"
                            title="Producto de origen argentino"
                        />
                    </div>
                )}
                
                {/* Etiqueta de conservación (refrigeración/congelación) */}
                {conservacion && (
                    <div className={`absolute bottom-4 left-4 z-20 flex items-center gap-1.5 
                                    px-3 py-1.5 rounded-full shadow-md ${conservationInfo.bgColor}`}>
                        <div className="w-5 h-5">
                            {conservationInfo.icon}
                        </div>
                        <span className={`text-sm font-medium ${conservationInfo.textColor}`}>
                            {conservationInfo.text}
                        </span>
                    </div>
                )}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative h-24 rounded-lg overflow-hidden ${
                            selectedImage === idx ? 'ring-2 ring-blue-500' : 'ring-1 ring-slate-200 dark:ring-slate-700'
                        }`}
                    >
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-800">
                            <img
                                src={getImageUrl(img.url)}
                                alt={img.textoAlternativo}
                                className="max-h-full max-w-full object-contain p-1"
                                width="96"
                                height="96"
                            />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

ImageGallery.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string.isRequired,
        textoAlternativo: PropTypes.string.isRequired,
        esPrincipal: PropTypes.bool,
        _id: PropTypes.string
    })).isRequired,
    selectedImage: PropTypes.number.isRequired,
    setSelectedImage: PropTypes.func.isRequired,
    conservacion: PropTypes.shape({
        requiereRefrigeracion: PropTypes.bool,
        requiereCongelacion: PropTypes.bool,
        vidaUtil: PropTypes.string,
        instrucciones: PropTypes.string
    }),
    origen: PropTypes.shape({
        pais: PropTypes.string,
        region: PropTypes.string,
        productor: PropTypes.string
    }),
    tipoProducto: PropTypes.string
};

export { ImageGallery };