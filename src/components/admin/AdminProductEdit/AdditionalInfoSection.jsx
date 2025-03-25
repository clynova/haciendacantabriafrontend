import React from 'react';
import PropTypes from 'prop-types';

export const AdditionalInfoSection = ({ data, onChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange('infoAdicional', {
            ...data.infoAdicional,
            [name]: value
        });
    };

    const handleTagsChange = (e) => {
        const tags = e.target.value.split(',').map(tag => tag.trim());
        onChange('infoAdicional', {
            ...data.infoAdicional,
            tags
        });
    };

    const handleCertificacionesChange = (e) => {
        const certificaciones = e.target.value.split(',').map(cert => cert.trim());
        onChange('infoAdicional', {
            ...data.infoAdicional,
            certificaciones
        });
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Información Adicional</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        País de Origen
                    </label>
                    <input
                        type="text"
                        name="paisOrigen"
                        value={data.infoAdicional?.paisOrigen || ''}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        placeholder="Ej: España, Italia, Chile..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Fabricante/Productor
                    </label>
                    <input
                        type="text"
                        name="fabricante"
                        value={data.infoAdicional?.fabricante || ''}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Etiquetas (separadas por comas)
                    </label>
                    <input
                        type="text"
                        name="tags"
                        value={(data.infoAdicional?.tags || []).join(', ')}
                        onChange={handleTagsChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        placeholder="Ej: orgánico, premium, importado"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Certificaciones (separadas por comas)
                    </label>
                    <input
                        type="text"
                        name="certificaciones"
                        value={(data.infoAdicional?.certificaciones || []).join(', ')}
                        onChange={handleCertificacionesChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        placeholder="Ej: ISO 9001, HACCP, Orgánico"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Notas Adicionales
                    </label>
                    <textarea
                        name="notas"
                        value={data.infoAdicional?.notas || ''}
                        onChange={handleChange}
                        rows="3"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        placeholder="Información adicional relevante..."
                    />
                </div>
            </div>
        </div>
    );
};

AdditionalInfoSection.propTypes = {
    data: PropTypes.shape({
        infoAdicional: PropTypes.shape({
            paisOrigen: PropTypes.string,
            fabricante: PropTypes.string,
            tags: PropTypes.arrayOf(PropTypes.string),
            certificaciones: PropTypes.arrayOf(PropTypes.string),
            notas: PropTypes.string
        })
    }).isRequired,
    onChange: PropTypes.func.isRequired
};