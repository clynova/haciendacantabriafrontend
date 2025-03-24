import React from 'react';
import PropTypes from 'prop-types';
import { FormInput } from '../../common/FormInputs';

const CERTIFICACIONES = [
    'HACCP',
    'ISO_22000',
    'BRC',
    'IFS',
    'FSSC_22000',
    'ORGANICO',
    'KOSHER',
    'HALAL',
    'SQF',
    'GLOBAL_GAP'
];

export const AdditionalInfoSection = ({ formData, handleInputChange }) => {
    const handleCertificationChange = (e) => {
        const { checked, value } = e.target;
        const currentCerts = formData.infoAdicional.certificaciones || [];
        
        const updatedCerts = checked
            ? [...currentCerts, value]
            : currentCerts.filter(cert => cert !== value);

        handleInputChange({
            target: {
                name: 'certificaciones',
                value: updatedCerts
            }
        }, 'infoAdicional');
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-200">Información Adicional</h2>
            
            <div className="grid grid-cols-1 gap-4">
                <FormInput
                    label="Marca del Producto"
                    name="marca"
                    value={formData.infoAdicional.marca || ''}
                    onChange={(e) => handleInputChange(e, 'infoAdicional')}
                    placeholder="Ej: Hacienda Cantabria"
                    required
                />

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-200">
                        Certificaciones
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {CERTIFICACIONES.map((cert) => (
                            <div key={cert} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`cert-${cert}`}
                                    value={cert}
                                    checked={formData.infoAdicional.certificaciones?.includes(cert)}
                                    onChange={handleCertificationChange}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-500 bg-gray-700"
                                />
                                <label 
                                    htmlFor={`cert-${cert}`}
                                    className="text-sm text-gray-300 cursor-pointer"
                                >
                                    {cert.replace(/_/g, ' ')}
                                </label>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        Selecciona todas las certificaciones aplicables al producto
                    </p>
                </div>
            </div>
        </div>
    );
};

AdditionalInfoSection.propTypes = {
    formData: PropTypes.shape({
        infoAdicional: PropTypes.shape({
            marca: PropTypes.string,
            certificaciones: PropTypes.arrayOf(PropTypes.string)
        }).isRequired
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired
};