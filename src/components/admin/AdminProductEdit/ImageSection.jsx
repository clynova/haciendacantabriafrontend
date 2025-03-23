import React from 'react';
import { HiTrash } from 'react-icons/hi';

export const ImageSection = ({ data, onChange, onUpload }) => {
    const handleImageUpload = (e) => {
        const files = e.target.files;
        if (files?.length > 0) {
            onUpload(files);
        }
    };

    const handleRemoveImage = (index) => {
        const newImages = data.multimedia.imagenes.filter((_, i) => i !== index);
        onChange('multimedia', {
            imagenes: newImages
        });
    };

    // Helper function to get image URL
    const getImageUrl = (image) => {
        return typeof image === 'string' ? image : image?.url || '';
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Imágenes</h2>
            
            {/* Current Images */}
            {data.multimedia?.imagenes?.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {data.multimedia.imagenes.map((image, index) => (
                        <div key={index} className="relative group aspect-square">
                            <img
                                src={getImageUrl(image)}
                                alt={`Imagen ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                <div className="absolute top-2 right-2">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        title="Eliminar imagen"
                                    >
                                        <HiTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Control */}
            <div className="flex items-center justify-center">
                <label className="w-full cursor-pointer">
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-600 rounded-lg hover:border-slate-500">
                        <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p className="mt-2 text-sm text-slate-400">
                            Haz clic para subir imágenes
                        </p>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>
                </label>
            </div>
        </div>
    );
};