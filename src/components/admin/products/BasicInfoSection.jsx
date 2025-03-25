import { FormInput, FormTextarea, FormSelect } from '../../common/FormInputs';

export const BasicInfoSection = ({ formData, handleInputChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información Básica */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-200">Información Básica</h2>
                <div className="space-y-4">
                    <FormInput
                        label="Código *"
                        name="codigo"
                        value={formData.codigo}
                        onChange={handleInputChange}
                        required
                    />
                    <FormInput
                        label="SKU *"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        required
                    />
                    <FormInput
                        label="Nombre *"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                    />
                    <FormSelect
                        label="Estado"
                        name="estado"
                        value={formData.estado}
                        onChange={(e) => handleInputChange({
                            target: {
                                name: 'estado',
                                value: e.target.value === 'true'
                            }
                        })}
                        options={[
                            { value: true, label: 'Activo' },
                            { value: false, label: 'Inactivo' }
                        ]}
                    />
                    <FormSelect
                        label="Destacado"
                        name="destacado"
                        value={formData.destacado}
                        onChange={(e) => handleInputChange({
                            target: {
                                name: 'destacado',
                                value: e.target.value === 'true'
                            }
                        })}
                        options={[
                            { value: false, label: 'No' },
                            { value: true, label: 'Sí' }
                        ]}
                    />
                </div>
            </div>

            {/* Descripción */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-200">Descripción</h2>
                <div className="space-y-4">
                    <FormInput
                        label="Descripción Corta"
                        name="corta"
                        value={formData.descripcion.corta}
                        onChange={(e) => handleInputChange(e, 'descripcion')}
                        maxLength={160}
                    />
                    <FormTextarea
                        label="Descripción Completa"
                        name="completa"
                        value={formData.descripcion.completa}
                        onChange={(e) => handleInputChange(e, 'descripcion')}
                        rows={3}
                    />
                </div>
            </div>
        </div>
    );
};