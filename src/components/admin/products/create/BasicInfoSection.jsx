import { useState } from 'react';
import { FormInput, FormTextarea, FormSelect } from '../../../common/FormInputs';
import { toast } from 'react-hot-toast';
import { getAllProducts } from '../../../../services/adminService';
import { useAuth } from '../../../../context/AuthContext';

export const BasicInfoSection = ({ 
    data, 
    onChange, 
    mode = 'create',
    displayFields = ['sku', 'nombre', 'estado', 'destacado', 'descripcion']
}) => {
    const { token } = useAuth();
    const [verifyingSku, setVerifyingSku] = useState(false);
    const [skuVerified, setSkuVerified] = useState(false);
    const [originalSku] = useState(mode === 'edit' ? data.sku : ''); // Track original SKU for edit mode

    // Adaptador para distintos patrones de manejo de cambios
    const handleChange = (field, value, section) => {
        // Reset verification status if SKU changes
        if (field === 'sku' && value !== data.sku) {
            setSkuVerified(false);
        }

        // Unified change handling for both create and edit modes
        if (section) {
            onChange({
                target: {
                    name: field,
                    value
                }
            }, section);
        } else {
            onChange({
                target: {
                    name: field,
                    value: field === 'estado' || field === 'destacado' 
                        ? value === 'true' || value === true
                        : value
                }
            });
        }
    };

    const verifySkuUniqueness = async () => {
        if (!data.sku?.trim()) {
            toast.error("Ingrese un SKU para verificar");
            return;
        }

        // In edit mode, if SKU hasn't changed, consider it valid
        if (mode === 'edit' && data.sku === originalSku) {
            setSkuVerified(true);
            toast.success(`El SKU "${data.sku}" es válido (sin cambios)`);
            return;
        }

        setVerifyingSku(true);
        try {
            const response = await getAllProducts(token, { sku: data.sku?.trim() });
            
            const isDuplicate = response.products && response.products.some(product => 
                product.sku.toLowerCase().trim() === data.sku.toLowerCase().trim() && 
                (mode !== 'edit' || product._id !== data._id) // In edit mode, exclude current product
            );
            
            if (isDuplicate) {
                toast.error(`El SKU "${data.sku}" ya está en uso.`);
                setSkuVerified(false);
            } else {
                toast.success(`El SKU "${data.sku}" está disponible y es válido.`);
                setSkuVerified(true);
            }
        } catch (error) {
            console.error("Error al verificar SKU:", error);
            toast.error("Error al verificar disponibilidad del SKU");
            setSkuVerified(false);
        } finally {
            setVerifyingSku(false);
        }
    };

    return (
        <div className="bg-slate-800 rounded-lg p-5">
            <h2 className="text-xl font-semibold text-white mb-4">Información Básica</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* SKU Field */}
                {displayFields.includes('sku') && (
                    <div className="col-span-1">
                        <div className="space-y-2">
                            <FormInput
                                label="SKU *"
                                name="sku"
                                value={data.sku || ''}
                                onChange={(e) => handleChange('sku', e.target.value)}
                                required
                                validate={skuVerified ? 'success' : null}
                            />
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    onClick={verifySkuUniqueness}
                                    disabled={verifyingSku || !data.sku?.trim()}
                                    className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-md text-white disabled:opacity-50 transition-colors"
                                >
                                    {verifyingSku ? 'Verificando...' : 'Verificar disponibilidad'}
                                </button>
                                {skuVerified && (
                                    <span className="text-green-500 text-sm ml-2 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        SKU válido
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Nombre */}
                {displayFields.includes('nombre') && (
                    <div className="col-span-1">
                        <FormInput
                            label="Nombre *"
                            name="nombre"
                            value={data.nombre || ''}
                            onChange={(e) => handleChange('nombre', e.target.value)}
                            required
                        />
                    </div>
                )}

                {/* Estado */}
                {displayFields.includes('estado') && (
                    <div className="col-span-1">
                        <FormSelect
                            label="Estado"
                            name="estado"
                            value={data.estado}
                            onChange={(e) => handleChange('estado', e.target.value)}
                            options={[
                                { value: true, label: 'Activo' },
                                { value: false, label: 'Inactivo' }
                            ]}
                        />
                    </div>
                )}

                {/* Destacado */}
                {displayFields.includes('destacado') && (
                    <div className="col-span-1">
                        <FormSelect
                            label="Destacado"
                            name="destacado"
                            value={data.destacado}
                            onChange={(e) => handleChange('destacado', e.target.value)}
                            options={[
                                { value: false, label: 'No' },
                                { value: true, label: 'Sí' }
                            ]}
                        />
                    </div>
                )}
            </div>

            {/* Descripción */}
            {displayFields.includes('descripcion') && (
                <div className="mt-6">
                    <div className="grid grid-cols-1 gap-4">
                        <FormInput
                            label="Descripción Corta"
                            name="descripcion.corta"
                            value={data.descripcion?.corta || ''}
                            onChange={(e) => handleChange('corta', e.target.value, 'descripcion')}
                            maxLength={160}
                            hint="Máximo 160 caracteres. Se mostrará en resultados de búsqueda."
                        />
                        <FormTextarea
                            label="Descripción Completa"
                            name="descripcion.completa"
                            value={data.descripcion?.completa || ''}
                            onChange={(e) => handleChange('completa', e.target.value, 'descripcion')}
                            rows={4}
                            hint="Descripción detallada del producto que se mostrará en su página."
                        />
                    </div>
                </div>
            )}
        </div>
    );
};