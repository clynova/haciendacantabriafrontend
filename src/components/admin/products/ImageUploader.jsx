import { useRef } from 'react';

export const ImageUploader = ({ images, onUpload, onDelete }) => {
    const fileInputRef = useRef(null);

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-200">Imágenes del Producto</h2>

            {/* Upload Button */}
            <div className="flex items-center space-x-4">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Subir Imágenes
                </button>
                <span className="text-sm text-slate-400">
                    Formatos permitidos: JPG, PNG, WEBP. Máximo 5MB por imagen.
                </span>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onUpload}
                    className="hidden"
                />
            </div>

            {/* Images Preview */}
            {images?.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div key={image.url || index} className="relative group">
                            <img
                                src={image.url}
                                alt={image.nombre || `Producto ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            {/* Delete Button */}
                            <button
                                type="button"
                                onClick={() => onDelete(index)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full 
                                         opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-5 w-5" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                >
                                    <path 
                                        fillRule="evenodd" 
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                                        clipRule="evenodd" 
                                    />
                                </svg>
                            </button>
                            {/* Image Info */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 
                                          opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                                {image.nombre}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!images?.length && (
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                    <p className="text-slate-400">
                        No hay imágenes cargadas. Haz clic en "Subir Imágenes" para agregar.
                    </p>
                </div>
            )}
        </div>
    );
};