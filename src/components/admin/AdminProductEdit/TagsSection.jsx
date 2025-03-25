import React from 'react';
import PropTypes from 'prop-types';

export const TagsSection = ({ data, onChange }) => {
    const handleTagsChange = (e) => {
        const tagsString = e.target.value;
        const tagsArray = tagsString
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
        
        onChange('tags', tagsArray);
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Etiquetas</h2>
            
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                    Etiquetas (separadas por comas)
                </label>
                <input
                    type="text"
                    value={Array.isArray(data.tags) ? data.tags.join(', ') : ''}
                    onChange={handleTagsChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                    placeholder="Ej: premium, oferta, nuevo"
                />
                <p className="mt-1 text-xs text-slate-400">
                    Agrega etiquetas relevantes para categorizar el producto
                </p>
            </div>
        </div>
    );
};

TagsSection.propTypes = {
    data: PropTypes.shape({
        tags: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    onChange: PropTypes.func.isRequired
};