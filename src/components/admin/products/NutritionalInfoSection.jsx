import { FormInput } from '../../common/FormInputs';

export const NutritionalInfoSection = ({ formData, handleInputChange }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-200">Información Nutricional</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormInput
                    label="Porción"
                    name="porcion"
                    value={formData.infoNutricional.porcion}
                    onChange={(e) => handleInputChange(e, 'infoNutricional')}
                />
                <FormInput
                    label="Calorías"
                    name="calorias"
                    type="number"
                    value={formData.infoNutricional.calorias}
                    onChange={(e) => handleInputChange(e, 'infoNutricional')}
                />
                <FormInput
                    label="Proteínas (g)"
                    name="proteinas"
                    type="number"
                    value={formData.infoNutricional.proteinas}
                    onChange={(e) => handleInputChange(e, 'infoNutricional')}
                />
                <FormInput
                    label="Grasa Total (g)"
                    name="grasaTotal"
                    type="number"
                    value={formData.infoNutricional.grasaTotal}
                    onChange={(e) => handleInputChange(e, 'infoNutricional')}
                />
                {formData.tipoProducto === 'ProductoAceite' && (
                    <>
                        <FormInput
                            label="Grasa Trans (g)"
                            name="grasaTrans"
                            type="number"
                            value={formData.infoNutricional.grasaTrans}
                            onChange={(e) => handleInputChange(e, 'infoNutricional')}
                        />
                        <FormInput
                            label="Grasa Poliinsaturada (g)"
                            name="grasaPoliinsaturada"
                            type="number"
                            value={formData.infoNutricional.grasaPoliinsaturada}
                            onChange={(e) => handleInputChange(e, 'infoNutricional')}
                        />
                    </>
                )}
            </div>
        </div>
    );
};