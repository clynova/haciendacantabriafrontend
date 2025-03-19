import { useState } from 'react';
import { ImageModal } from '../ImageModal';

export const ImageGallery = ({ images, productName }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    if (!images?.length) {
        return (
            <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                </svg>
                <p className="mt-2 text-sm text-slate-400">No hay imágenes disponibles</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((imagen, index) => (
                    <div 
                        key={index} 
                        className="relative group aspect-square bg-slate-700 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => setSelectedImage(imagen)}
                    >
                        <img
                            src={imagen.url}
                            alt={imagen.textoAlternativo || `${productName} - Imagen ${index + 1}`}
                            className="w-full h-full object-contain hover:object-cover transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="p-2 bg-white/90 rounded-full">
                                    <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        {imagen.esPrincipal && (
                            <div className="absolute top-2 left-2">
                                <span className="px-2 py-1 text-xs font-semibold bg-blue-500 text-white rounded-full">
                                    Principal
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            {selectedImage && (
                <ImageModal 
                    image={selectedImage} 
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </>
    );
};