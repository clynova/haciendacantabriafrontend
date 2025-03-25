import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

export const SeoSection = ({ data, onChange }) => {
    const generateSlug = (text) => {
        if (!text) return '';
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            .trim();
    };

    // Initial slug generation on mount and when metaTitulo changes
    useEffect(() => {
        if (data.seo?.metaTitulo) {
            const newSlug = generateSlug(data.seo.metaTitulo);
            if (!data.seo?.slug || data.seo.slug !== newSlug) {
                onChange('seo', {
                    ...data.seo,
                    slug: newSlug
                });
            }
        }
    }, [data.seo?.metaTitulo]);

    // Ensure SEO object exists with default values
    useEffect(() => {
        if (!data.seo) {
            onChange('seo', {
                metaTitulo: '',
                metaDescripcion: '',
                palabrasClave: [],
                slug: ''
            });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange('seo', {
            ...data.seo,
            [name]: value,
            ...(name === 'metaTitulo' ? { slug: generateSlug(value) } : {})
        });
    };

    const handleKeywordsChange = (e) => {
        const palabrasClave = e.target.value
            .split(',')
            .map(k => k.trim())
            .filter(k => k.length > 0);

        onChange('seo', {
            ...data.seo,
            palabrasClave
        });
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Optimización SEO</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Meta Título
                    </label>
                    <input
                        type="text"
                        name="metaTitulo"
                        value={data.seo?.metaTitulo || ''}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        maxLength={60}
                    />
                    <p className="mt-1 text-xs text-slate-400">
                        {`${data.seo?.metaTitulo?.length || 0}/60 caracteres`}
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Meta Descripción
                    </label>
                    <textarea
                        name="metaDescripcion"
                        value={data.seo?.metaDescripcion || ''}
                        onChange={handleChange}
                        rows="3"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        maxLength={160}
                    />
                    <p className="mt-1 text-xs text-slate-400">
                        {`${data.seo?.metaDescripcion?.length || 0}/160 caracteres`}
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Palabras Clave (separadas por comas)
                    </label>
                    <input
                        type="text"
                        name="palabrasClave"
                        value={(data.seo?.palabrasClave || []).join(', ')}
                        onChange={handleKeywordsChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        placeholder="Ej: aceite, oliva, extra virgen"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        URL Amigable (generada automáticamente)
                    </label>
                    <input
                        type="text"
                        name="slug"
                        value={data.seo?.slug || ''}
                        readOnly
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white cursor-not-allowed opacity-75"
                    />
                    <p className="mt-1 text-xs text-slate-400">
                        La URL amigable se genera automáticamente del título
                    </p>
                </div>
            </div>
        </div>
    );
};

SeoSection.propTypes = {
    data: PropTypes.shape({
        seo: PropTypes.shape({
            metaTitulo: PropTypes.string,
            metaDescripcion: PropTypes.string,
            palabrasClave: PropTypes.arrayOf(PropTypes.string),
            slug: PropTypes.string
        })
    }).isRequired,
    onChange: PropTypes.func.isRequired
};