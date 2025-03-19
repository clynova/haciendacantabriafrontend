import { useState } from 'react';
import { uploadImageToCloudinary } from '../../../../services/utilService';
import { toast } from 'react-hot-toast';

export const ImageUploadSection = ({ formData, onChange }) => {
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        const toastId = toast.loading('Subiendo imágenes...');

        try {
            const uploadPromises = files.map(async (file) => {
                const imageUrl = await uploadImageToCloudinary(file);
                if (!imageUrl) throw new Error('Error al subir imagen');
                return {
                    url: imageUrl,
                    textoAlternativo: file.name,
                    esPrincipal: false
                };
            });

            const newImages = await Promise.all(uploadPromises);
            
            // If it's the first image, mark it as principal
            if (!formData.multimedia?.imagenes?.length && newImages.length > 0) {
                newImages[0].esPrincipal = true;
            }

            onChange({
                target: {
                    name: 'imagenes',
                    value: [...(formData.multimedia?.imagenes || []), ...newImages]
                }
            }, 'multimedia');

            toast.success('Imágenes subidas correctamente', { id: toastId });
        } catch (error) {
            console.error('Error uploading images:', error);
            toast.error('Error al subir las imágenes', { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (index) => {
        const newImages = formData.multimedia.imagenes.filter((_, i) => i !== index);
        
        // If we removed the principal image and there are other images, make the first one principal
        if (formData.multimedia.imagenes[index].esPrincipal && newImages.length > 0) {
            newImages[0].esPrincipal = true;
        }

        onChange({
            target: {
                name: 'imagenes',
                value: newImages
            }
        }, 'multimedia');
    };

    const handleSetPrincipal = (index) => {
        const newImages = formData.multimedia.imagenes.map((img, i) => ({
            ...img,
            esPrincipal: i === index
        }));

        onChange({
            target: {
                name: 'imagenes',
                value: newImages
            }
        }, 'multimedia');
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-200">Imágenes del Producto</h2>
            <div className="bg-slate-700/50 p-4 rounded-lg space-y-4">
                {/* Current Images */}
                {formData.multimedia?.imagenes?.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.multimedia.imagenes.map((imagen, index) => (
                            <div key={index} className="relative group aspect-square">
                                <img
                                    src={imagen.url}
                                    alt={imagen.textoAlternativo}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                    <div className="absolute bottom-2 right-2 flex gap-2">
                                        {!imagen.esPrincipal && (
                                            <button
                                                type="button"
                                                onClick={() => handleSetPrincipal(index)}
                                                className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                                                title="Establecer como principal"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            title="Eliminar imagen"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    {imagen.esPrincipal && (
                                        <div className="absolute top-2 left-2">
                                            <span className="px-2 py-1 text-xs font-semibold bg-blue-500 text-white rounded-full">
                                                Principal
                                            </span>
                                        </div>
                                    )}
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="mt-2 text-sm text-slate-400">
                                {uploading ? 'Subiendo...' : 'Haz clic para subir imágenes'}
                            </p>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
};