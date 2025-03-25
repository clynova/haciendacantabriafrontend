import React from 'react';
import PropTypes from 'prop-types';
import { HiPlus, HiX, HiPencil } from 'react-icons/hi';
import { uploadImageToCloudinary } from '../../../services/utilService';
import { toast } from 'react-hot-toast';

export const ImageSection = ({ data, onChange }) => {
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);

        try {
            const uploadPromises = files.map(async (file) => {
                const cloudinaryUrl = await uploadImageToCloudinary(file);
                if (cloudinaryUrl) {
                    return {
                        url: cloudinaryUrl,
                        nombre: file.name,
                        textoAlternativo: file.name,
                        esPrincipal: false
                    };
                }
                throw new Error(`Failed to upload ${file.name}`);
            });

            const uploadedImages = await Promise.all(uploadPromises);
            const currentImages = data.multimedia?.imagenes || [];

            onChange('multimedia', {
                ...data.multimedia,
                imagenes: [
                    ...currentImages,
                    ...uploadedImages.map((img, idx) => ({
                        ...img,
                        esPrincipal: currentImages.length === 0 && idx === 0
                    }))
                ]
            });

            toast.success(`${uploadedImages.length} imágenes subidas exitosamente`);
        } catch (error) {
            console.error('Error processing images:', error);
            toast.error('Error al subir las imágenes');
        }
    };

    const handleDeleteImage = (index) => {
        const newImages = [...(data.multimedia?.imagenes || [])];
        newImages.splice(index, 1);

        // If we deleted the principal image, make the first remaining image principal
        if (newImages.length > 0 && data.multimedia?.imagenes[index]?.esPrincipal) {
            newImages[0].esPrincipal = true;
        }

        onChange('multimedia', {
            ...data.multimedia,
            imagenes: newImages
        });

        toast.success('Imagen eliminada');
    };

    const handleUpdateAltText = (index, newAltText, setPrincipal = false) => {
        const updatedImages = [...(data.multimedia?.imagenes || [])];
        
        if (setPrincipal) {
            updatedImages.forEach((img, i) => {
                img.esPrincipal = i === index;
            });
        } else {
            updatedImages[index] = {
                ...updatedImages[index],
                textoAlternativo: newAltText
            };
        }

        onChange('multimedia', {
            ...data.multimedia,
            imagenes: updatedImages
        });
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">Multimedia</h2>
            
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
                            onChange={handleImageUpload}
                        />
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.multimedia?.imagenes?.map((image, index) => (
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
                                    onChange={(e) => handleUpdateAltText(index, e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-white text-sm"
                                />
                                <div className="flex justify-between items-center">
                                    <label className="flex items-center space-x-2 text-sm">
                                        <input
                                            type="radio"
                                            name="imagenPrincipal"
                                            checked={image.esPrincipal}
                                            onChange={() => handleUpdateAltText(index, image.textoAlternativo, true)}
                                            className="text-blue-600"
                                        />
                                        <span className="text-slate-300">Imagen principal</span>
                                    </label>
                                    <button
                                        onClick={() => handleDeleteImage(index)}
                                        className="text-red-400 hover:text-red-300 text-sm"
                                        type="button"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

ImageSection.propTypes = {
    data: PropTypes.shape({
        multimedia: PropTypes.shape({
            imagenes: PropTypes.arrayOf(PropTypes.shape({
                url: PropTypes.string.isRequired,
                nombre: PropTypes.string,
                textoAlternativo: PropTypes.string,
                esPrincipal: PropTypes.bool
            }))
        })
    }).isRequired,
    onChange: PropTypes.func.isRequired
};