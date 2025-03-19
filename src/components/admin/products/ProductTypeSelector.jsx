export const ProductTypeSelector = ({ selectedType, onChange }) => {
    return (
        <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">Tipo de Producto</h2>
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => onChange({ target: { value: 'ProductoAceite' }})}
                    className={`p-4 rounded-lg border-2 transition-all ${
                        selectedType === 'ProductoAceite'
                            ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                            : 'border-slate-600 hover:border-slate-500 text-slate-300'
                    }`}
                >
                    <div className="text-3xl mb-2">🫒</div>
                    <div className="font-medium">Aceite</div>
                </button>
                <button
                    type="button"
                    onClick={() => onChange({ target: { value: 'ProductoCarne' }})}
                    className={`p-4 rounded-lg border-2 transition-all ${
                        selectedType === 'ProductoCarne'
                            ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                            : 'border-slate-600 hover:border-slate-500 text-slate-300'
                    }`}
                >
                    <div className="text-3xl mb-2">🥩</div>
                    <div className="font-medium">Carne</div>
                </button>
            </div>
        </div>
    );
};