import PropTypes from 'prop-types';
import { getImageUrl } from '../../utils/funcionesReutilizables';

const ImageGallery = ({ images, selectedImage, setSelectedImage }) => {
    return (
        <div className="flex flex-col">
            <div className="relative">
                <img
                    src={getImageUrl(images[selectedImage].url)}
                    alt={images[selectedImage].textoAlternativo}
                    className="w-full h-96 object-cover rounded-lg"
                />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative rounded-lg overflow-hidden ${selectedImage === idx ? 'ring-2 ring-blue-500' : ''
                            }`}
                    >
                        <img
                            src={getImageUrl(img.url)}
                            alt={img.textoAlternativo}
                            className="w-full h-24 object-cover"
                        />
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