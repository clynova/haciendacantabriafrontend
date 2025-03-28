import React from 'react';
import PropTypes from 'prop-types';
import { FormInput } from '../../../common/FormInputs';

export const SeoSection = ({ formData, handleInputChange }) => {
    const handleKeywordsChange = (e) => {
        const keywords = e.target.value.split(',').map(kw => kw.trim());
        handleInputChange({
            target: {
                name: 'palabrasClave',
                value: keywords
            }
        }, 'seo');
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">
                SEO (Optimización para buscadores)
            </h2>
            <div className="grid grid-cols-1 gap-4">
                <FormInput
                    label="Título para SEO *"
                    name="metaTitulo"
                    value={formData.seo.metaTitulo || ''}
                    onChange={(e) => handleInputChange(e, 'seo')}
                    maxLength={60}
                    helperText="Máximo 60 caracteres"
                />
                
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Meta Descripción *
                    </label>
                    <textarea
                        name="metaDescripcion"
                        value={formData.seo.metaDescripcion || ''}
                        onChange={(e) => handleInputChange(e, 'seo')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                        rows={3}
                        maxLength={160}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Máximo 160 caracteres. Descripción que aparecerá en los resultados de búsqueda.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Palabras Clave *
                    </label>
                    <input
                        type="text"
                        name="palabrasClave"
                        value={formData.seo.palabrasClave.join(', ')}
                        onChange={handleKeywordsChange}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                        placeholder="Palabra1, Palabra2, Palabra3"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Separa las palabras clave con comas
                    </p>
                </div>

                {/* Añadir campo para slug */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        URL amigable (slug) *
                    </label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.seo.slug || ''}
                        onChange={(e) => handleInputChange(e, 'seo')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                        placeholder="nombre-del-producto"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Identificador único para la URL del producto. Se genera automáticamente si se deja en blanco.
                    </p>
                </div>
            </div>
        </div>
    );
};

SeoSection.propTypes = {
    formData: PropTypes.shape({
        seo: PropTypes.shape({
            metaTitulo: PropTypes.string,
            metaDescripcion: PropTypes.string,
            palabrasClave: PropTypes.arrayOf(PropTypes.string),
            slug: PropTypes.string
        }).isRequired
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired
};