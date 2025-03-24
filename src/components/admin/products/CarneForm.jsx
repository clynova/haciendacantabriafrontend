import { FormInput, FormSelect } from '../../common/FormInputs';

// Updated enum values to match backend schema
const TIPO_CARNE = ['VACUNO', 'CERDO', 'POLLO', 'CORDERO', 'PAVO'];
const CORTES_VACUNO = [
    // Cortes Argentinos
    'BIFE_ANCHO', 'BIFE_ANGOSTO', 'BIFE_DE_PALETA', 'BIFE_DE_VACIO',
    'BOLA_DE_LOMO', 'BRAZUELO', 'CARNAZA_DE_CUADRADA', 'CARNAZA_PALETA',
    'CHINGOLO', 'COGOTE', 'COLITA_DE_CUADRIL', 'CORAZON_DE_CUADRIL',
    'ENTRAÑA_FINA', 'FALDA_DESHUESADA', 'GARRON', 'HUACHALOMO',
    'LOMO', 'MARUCHA', 'NALGA_DE_ADENTRO', 'PECETO',
    'PECHO', 'SOBRECOSTILLA', 'TAPA_DE_BIFE_ANCHO', 'TAPA_DE_CUADRIL',
    'TORTUGUITA', 'VACIO',

    // Cortes Chilenos
    'LOMO_VETADO', 'LOMO_LISO', 'ASADO_DEL_CARNICERO', 'PALANCA',
    'POSTA_ROSADA', 'OSOBUCO_DE_MANO', 'GANSO', 'POSTA_DE_PALETA',
    'CHOCLILLO', 'PUNTA_PICANA', 'ASIENTO', 'ENTRAÑA',
    'ALETILLA', 'OSOBUCO_DE_PIERNA', 'FILETE', 'PUNTA_DE_PALETA',
    'POSTA_NEGRA', 'POLLO_DE_GANSO', 'TAPAPECHO', 'PLATEADA',
    'PUNTA_DE_GANSO', 'ABASTERO', 'TAPABARRIGA',

    // Adicionales
    'MOLIDA_ESPECIAL', 'MOLIDA_CORRIENTE'
];

const formatCorteLabel = (corte) => {
    return corte
        .split('_')
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ');
};

export const CarneForm = ({ formData = {}, handleInputChange }) => {
    const infoCarne = formData.infoCarne || {};
    const precios = formData.precios || {};

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-200">Información de la Carne</h2>
            <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        label="Precio por Kg"
                        name="precioPorKg"
                        type="number"
                        value={precios.precioPorKg || ''}
                        onChange={(e) => handleInputChange(e, 'precios')}
                        step="0.01"
                    />
                    <FormSelect
                        label="Tipo de Carne"
                        name="tipoCarne"
                        value={infoCarne.tipoCarne || ''}
                        onChange={(e) => handleInputChange(e, 'infoCarne')}
                        options={TIPO_CARNE}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Corte *
                    </label>
                    <select
                        name="corte"
                        value={formData.infoCarne.corte}
                        onChange={(e) => handleInputChange(e, 'infoCarne')}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                        required
                    >
                        {CORTES_VACUNO.map(corte => (
                            <option key={corte} value={corte}>
                                {formatCorteLabel(corte)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                    label="Precio por Kg *"
                    name="precioPorKg"
                    type="number"
                    value={formData.infoCarne.precioPorKg}
                    onChange={(e) => handleInputChange(e, 'infoCarne')}
                    min="0"
                    step="0.01"
                    required
                />

                <FormInput
                    label="Stock (Kg) *"
                    name="stockKg"
                    type="number"
                    value={formData.inventario.stockKg}
                    onChange={(e) => handleInputChange(e, 'inventario')}
                    min="0"
                    step="0.01"
                    required
                />

                <FormInput
                    label="Nombre Argentino"
                    name="nombreArgentino"
                    value={formData.infoCarne.nombreArgentino}
                    onChange={(e) => handleInputChange(e, 'infoCarne')}
                />

                <FormInput
                    label="Nombre Chileno"
                    name="nombreChileno"
                    value={formData.infoCarne.nombreChileno}
                    onChange={(e) => handleInputChange(e, 'infoCarne')}
                />
            </div>

            {/* Características de la Carne */}
            <div className="mt-6">
                <h3 className="text-md font-semibold text-slate-300 mb-4">Características</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label="Porcentaje de Grasa"
                        name="porcentajeGrasa"
                        type="number"
                        value={formData.caracteristicasCarne.porcentajeGrasa}
                        onChange={(e) => handleInputChange(e, 'caracteristicasCarne')}
                        min="0"
                        max="100"
                    />
                    <FormInput
                        label="Marmoleo (1-5)"
                        name="marmoleo"
                        type="number"
                        value={formData.caracteristicasCarne.marmoleo}
                        onChange={(e) => handleInputChange(e, 'caracteristicasCarne')}
                        min="1"
                        max="5"
                    />
                </div>
            </div>
        </div>
    );
};