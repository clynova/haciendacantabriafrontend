import { FormInput, FormSelect } from '../../common/FormInputs';

// Define constants or import them from a shared constants file
const TIPO_ACEITE = ['MARAVILLA', 'OLIVA', 'CANOLA', 'MIXTO'];
const TIPO_ENVASE = ['VACIO', 'CAJA', 'BOTELLA', 'BIDON', 'BOLSA'];

export const AceiteForm = ({ formData, handleInputChange }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-200">Información del Aceite</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormSelect
                    label="Tipo de Aceite"
                    name="tipo"
                    value={formData.infoAceite.tipo}
                    onChange={(e) => handleInputChange(e, 'infoAceite')}
                    options={TIPO_ACEITE}
                    required
                />
                <FormInput
                    label="Volumen (ml)"
                    name="volumen"
                    type="number"
                    value={formData.infoAceite.volumen}
                    onChange={(e) => handleInputChange(e, 'infoAceite')}
                    min="0"
                    required
                />
                <FormSelect
                    label="Tipo de Envase"
                    name="envase"
                    value={formData.infoAceite.envase}
                    onChange={(e) => handleInputChange(e, 'infoAceite')}
                    options={TIPO_ENVASE}
                    required
                />
            </div>
        </div>
    );
};