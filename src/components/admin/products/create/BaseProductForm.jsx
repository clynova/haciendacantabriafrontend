import React from 'react';
import PropTypes from 'prop-types';
import { BasicInfoSection } from './BasicInfoSection';
import { ImageUploader } from './ImageUploader';
import { AdditionalInfoSection } from './AdditionalInfoSection';
import { ConservationSection } from './ConservationSection';
import { TagsInput } from './TagsInput';
import { SeoSection } from './SeoSection';
import { WeightOptionsSection } from './WeightOptionsSection';

const BaseProductForm = ({
    formData,
    handleInputChange,
    handleImageUpload,
    handleImageDelete,
    handleUpdateAltText,
    handleVideoChange,
    handleTagChange
}) => {
    return (
        <div className="space-y-8">
            {/* Sección de información básica */}
            <BasicInfoSection
                data={formData}
                onChange={handleInputChange}
                mode="create"
            />
                        {/* Sección de opciones de peso */}
                        <WeightOptionsSection
                formData={formData}
                handleInputChange={handleInputChange}
            />

            {/* Sección de información adicional */}
            <AdditionalInfoSection
                formData={formData}
                handleInputChange={handleInputChange}
            />

            {/* Sección de conservación */}
            <ConservationSection
                formData={formData}
                handleInputChange={handleInputChange}
            />
            {/* Sección de etiquetas */}
            <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Etiquetas</h3>
                <TagsInput
                    tags={formData.tags}
                    onChange={handleTagChange}
                    placeholder="Agregar etiqueta y presionar Enter"
                    helperText="Las etiquetas ayudan a categorizar y buscar el producto (ej: orgánico, sin-gluten, premium)"
                />
            </div>

            {/* Sección de multimedia */}

            <ImageUploader
                images={formData.multimedia.imagenes}
                onUpload={handleImageUpload}
                onDelete={handleImageDelete}
                onUpdateAltText={handleUpdateAltText}
                onVideoChange={handleVideoChange}
                videoUrl={formData.multimedia.video}
            />
            {/* Sección SEO */}
            <SeoSection
                formData={formData}
                handleInputChange={handleInputChange}
            />
        </div>
    );
};

BaseProductForm.propTypes = {
    formData: PropTypes.shape({
        sku: PropTypes.string,
        nombre: PropTypes.string,
        categoria: PropTypes.string,
        estado: PropTypes.bool,
        destacado: PropTypes.bool,
        descripcion: PropTypes.shape({
            corta: PropTypes.string,
            completa: PropTypes.string
        }),
        multimedia: PropTypes.shape({
            imagenes: PropTypes.arrayOf(PropTypes.shape({
                url: PropTypes.string,
                textoAlternativo: PropTypes.string,
                esPrincipal: PropTypes.bool
            })),
            video: PropTypes.string
        }),
        seo: PropTypes.shape({
            metaTitulo: PropTypes.string,
            metaDescripcion: PropTypes.string,
            palabrasClave: PropTypes.arrayOf(PropTypes.string)
        }),
        infoAdicional: PropTypes.shape({
            origen: PropTypes.string,
            marca: PropTypes.string,
            certificaciones: PropTypes.arrayOf(PropTypes.string)
        }),
        conservacion: PropTypes.shape({
            requiereRefrigeracion: PropTypes.bool,
            requiereCongelacion: PropTypes.bool,
            vidaUtil: PropTypes.string,
            instrucciones: PropTypes.string
        }),
        inventario: PropTypes.shape({
            stockUnidades: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            umbralStockBajo: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        }),
        opcionesPeso: PropTypes.shape({
            esPesoVariable: PropTypes.bool,
            pesoPromedio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            pesoMinimo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            pesoMaximo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            pesosEstandar: PropTypes.arrayOf(PropTypes.shape({
                peso: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                unidad: PropTypes.string,
                esPredeterminado: PropTypes.bool,
                precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                sku: PropTypes.string,
                stockDisponible: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                umbralStockBajo: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            })),
            rangosPreferidos: PropTypes.arrayOf(PropTypes.shape({
                nombre: PropTypes.string,
                pesoMinimo: PropTypes.number,
                pesoMaximo: PropTypes.number,
                descripcion: PropTypes.string,
                esPredeterminado: PropTypes.bool
            }))
        }).isRequired,
        tags: PropTypes.arrayOf(PropTypes.string),
        metadatos: PropTypes.object
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleImageUpload: PropTypes.func.isRequired,
    handleImageDelete: PropTypes.func.isRequired,
    handleUpdateAltText: PropTypes.func.isRequired,
    handleVideoChange: PropTypes.func.isRequired,
    handleTagChange: PropTypes.func.isRequired
};

export default BaseProductForm;