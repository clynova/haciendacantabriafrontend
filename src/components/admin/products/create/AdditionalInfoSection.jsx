import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormInput } from '../../../common/FormInputs';
import { HiX } from 'react-icons/hi';

export const AdditionalInfoSection = ({ formData, handleInputChange }) => {
    const [inputValue, setInputValue] = useState('');

    const handleCertificationChange = (e) => {
        setInputValue(e.target.value);
    };

    const addCertification = (newCert) => {
        const certification = newCert.trim();
        if (!certification) return;

        const currentCertifications = formData.infoAdicional.certificaciones || [];
        if (!currentCertifications.includes(certification)) {
            handleInputChange({
                target: {
                    name: 'certificaciones',
                    value: [...currentCertifications, certification]
                }
            }, 'infoAdicional');
        }
        setInputValue('');
    };

    const removeCertification = (certToRemove) => {
        const updatedCertifications = (formData.infoAdicional.certificaciones || [])
            .filter(cert => cert !== certToRemove);
        
        handleInputChange({
            target: {
                name: 'certificaciones',
                value: updatedCertifications
            }
        }, 'infoAdicional');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addCertification(inputValue);
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-200">Información Adicional</h2>

            <div className="grid grid-cols-1 gap-4">
                <FormInput
                    label="Origen del Producto"
                    name="origen"
                    value={formData.infoAdicional.origen || ''}
                    onChange={(e) => handleInputChange(e, 'infoAdicional')}
                    placeholder="Ej: Argentina"
                />
                <FormInput
                    label="Marca del Producto"
                    name="marca"
                    value={formData.infoAdicional.marca || ''}
                    onChange={(e) => handleInputChange(e, 'infoAdicional')}
                    placeholder="Ej: Hacienda Cantabria"
                />

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-200">
                        Certificaciones
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {formData.infoAdicional.certificaciones?.map((cert, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 
                                         text-blue-400 rounded-full text-sm"
                            >
                                {cert}
                                <button
                                    type="button"
                                    onClick={() => removeCertification(cert)}
                                    className="p-0.5 hover:bg-blue-500/20 rounded-full"
                                >
                                    <HiX className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleCertificationChange}
                            onKeyDown={handleKeyDown}
                            onBlur={() => addCertification(inputValue)}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 
                                     rounded-md text-white"
                            placeholder="Ej: HACCP, ISO 22000, ORGANICO"
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        Presiona Enter, coma o clic fuera del campo para añadir una certificación
                    </p>
                </div>
            </div>
        </div>
    );
};

AdditionalInfoSection.propTypes = {
    formData: PropTypes.shape({
        infoAdicional: PropTypes.shape({
            origen: PropTypes.string,
            marca: PropTypes.string,
            certificaciones: PropTypes.arrayOf(PropTypes.string)
        }).isRequired
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired
};