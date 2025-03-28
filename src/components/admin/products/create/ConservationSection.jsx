import { FormInput, FormTextarea } from '../../../common/FormInputs';

export const ConservationSection = ({ formData, handleInputChange }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-200">Conservación</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <input
                            type="checkbox"
                            id="requiereRefrigeracion"
                            name="requiereRefrigeracion"
                            checked={formData.conservacion.requiereRefrigeracion}
                            onChange={(e) => handleInputChange(e, 'conservacion')}
                            className="rounded border-slate-600 text-blue-500 focus:ring-blue-500"
                        />
                        <label htmlFor="requiereRefrigeracion" className="text-slate-300">
                            Requiere Refrigeración
                        </label>
                    </div>
                    <div className="flex items-center space-x-4">
                        <input
                            type="checkbox"
                            id="requiereCongelacion"
                            name="requiereCongelacion"
                            checked={formData.conservacion.requiereCongelacion}
                            onChange={(e) => handleInputChange(e, 'conservacion')}
                            className="rounded border-slate-600 text-blue-500 focus:ring-blue-500"
                        />
                        <label htmlFor="requiereCongelacion" className="text-slate-300">
                            Requiere Congelación
                        </label>
                    </div>
                </div>
                <div className="space-y-4">
                    <FormInput
                        label="Vida Útil"
                        name="vidaUtil"
                        value={formData.conservacion.vidaUtil}
                        onChange={(e) => handleInputChange(e, 'conservacion')}
                    />
                    <FormTextarea
                        label="Instrucciones de Conservación"
                        name="instrucciones"
                        value={formData.conservacion.instrucciones}
                        onChange={(e) => handleInputChange(e, 'conservacion')}
                    />
                </div>
            </div>
        </div>
    );
};