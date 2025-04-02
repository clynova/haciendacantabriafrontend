import React from 'react';
import PropTypes from 'prop-types';

export const ImageUploader = ({ images, onUpload, onDelete, onUpdateAltText, onVideoChange }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">Multimedia</h2>
            
            {/* Image Upload Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium text-slate-300">Imágenes del Producto</h3>
                    <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md cursor-pointer">
                        <span className="text-sm text-white">Subir Imágenes</span>
                        <input
                            type="file"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={onUpload}
                        />
                    </label>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative bg-slate-700 rounded-lg p-3 space-y-2">
                            <img
                                src={image.url}
                                alt={image.textoAlternativo || image.nombre}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Texto alternativo para la imagen"
                                    value={image.textoAlternativo || ''}
                                    onChange={(e) => onUpdateAltText(index, e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-white text-sm"
                                />
                                <div className="flex justify-between items-center">
                                    <label className="flex items-center space-x-2 text-sm">
                                        <input
                                            type="radio"
                                            name="imagenPrincipal"
                                            checked={image.esPrincipal}
                                            onChange={() => onUpdateAltText(index, image.textoAlternativo, true)}
                                            className="text-blue-600"
                                        />
                                        <span className="text-slate-300">Imagen principal</span>
                                    </label>
                                    <button
                                        onClick={() => onDelete(index)}
                                        className="text-red-400 hover:text-red-300 text-sm"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Video URL Section */}
            <div className="space-y-2">
                <h3 className="text-md font-medium text-slate-300">Video del Producto (opcional)</h3>
                <div className="flex gap-4">
                    <input
                        type="url"
                        placeholder="URL del video (YouTube, Vimeo, etc.)"
                        onChange={onVideoChange}
                        className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                    />
                </div>
                <p className="text-xs text-gray-400">
                    Ingresa la URL del video de YouTube o Vimeo que muestre el producto
                </p>
            </div>
        </div>
    );
};

ImageUploader.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string.isRequired,
        nombre: PropTypes.string.isRequired,
        textoAlternativo: PropTypes.string,
        esPrincipal: PropTypes.bool,
        id: PropTypes.string
    })).isRequired,
    onUpload: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onUpdateAltText: PropTypes.func.isRequired,
    onVideoChange: PropTypes.func.isRequired
};