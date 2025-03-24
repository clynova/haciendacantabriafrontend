import { FormInput } from '../../common/FormInputs';
import PropTypes from 'prop-types';

export const NutritionalInfoSection = ({ formData, handleInputChange }) => {
    const infoNutricional = formData.infoNutricional || {};

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-200">Información Nutricional</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                    label="Porción (g)"
                    type="number"
                    name="porcion"
                    value={infoNutricional.porcion || ''}
                    onChange={(e) => handleInputChange(e, 'infoNutricional')}
                    min="0"
                />
                <FormInput
                    label="Calorías"
                    type="number"
                    name="calorias"
                    value={infoNutricional.calorias || ''}
                    onChange={(e) => handleInputChange(e, 'infoNutricional')}
                    min="0"
                />
                <FormInput
                    label="Proteínas (g)"
                    type="number"
                    name="proteinas"
                    value={infoNutricional.proteinas || ''}
                    onChange={(e) => handleInputChange(e, 'infoNutricional')}
                    min="0"
                />
                <FormInput
                    label="Grasa Total (g)"
                    type="number"
                    name="grasaTotal"
                    value={infoNutricional.grasaTotal || ''}
                    onChange={(e) => handleInputChange(e, 'infoNutricional')}
                    min="0"
                />
                <FormInput
                    label="Grasa Saturada (g)"
                    type="number"
                    name="grasaSaturada"
                    value={infoNutricional.grasaSaturada || ''}
                    onChange={(e) => handleInputChange(e, 'infoNutricional')}
                    min="0"
                />
                <FormInput
                    label="Colesterol (mg)"
                    type="number"
                    name="colesterol"
                    value={infoNutricional.colesterol || ''}
                    onChange={(e) => handleInputChange(e, 'infoNutricional')}
                    min="0"
                />
                <FormInput
                    label="Sodio (mg)"
                    type="number"
                    name="sodio"
                    value={infoNutricional.sodio || ''}
                    onChange={(e) => handleInputChange(e, 'infoNutricional')}
                    min="0"
                />
                <FormInput
                    label="Carbohidratos (g)"
                    type="number"
                    name="carbohidratos"
                    value={infoNutricional.carbohidratos || ''}
                    onChange={(e) => handleInputChange(e, 'infoNutricional')}
                    min="0"
                />
            </div>
        </div>
    );
};

NutritionalInfoSection.propTypes = {
    formData: PropTypes.shape({
        infoNutricional: PropTypes.object
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired
};