import PropTypes from 'prop-types';
import { getImageUrl } from '../../utils/funcionesReutilizables';

const ImageGallery = ({ images, selectedImage, setSelectedImage }) => {
    return (
        <div className="flex flex-col">
            <div className="relative h-[480px] w-full border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="absolute inset-0 flex items-center justify-center  bg-slate-100 dark:bg-slate-800">
                    <img
                        src={getImageUrl(images[selectedImage].url)}
                        alt={images[selectedImage].textoAlternativo}
                        className="max-h-full max-w-full object-contain"
                    />
                </div>
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
};

export { ImageGallery };