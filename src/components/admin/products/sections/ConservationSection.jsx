export const ConservationSection = ({ formData, onChange }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-200">Conservación</h2>
            <div className="bg-slate-700/50 p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="requiereRefrigeracion"
                            name="requiereRefrigeracion"
                            checked={formData.conservacion?.requiereRefrigeracion || false}
                            onChange={(e) => onChange(e, 'conservacion')}
                            className="w-4 h-4 text-blue-600 border-slate-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="requiereRefrigeracion" className="text-sm text-slate-300">
                            Requiere Refrigeración
                        </label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="requiereCongelacion"
                            name="requiereCongelacion"
                            checked={formData.conservacion?.requiereCongelacion || false}
                            onChange={(e) => onChange(e, 'conservacion')}
                            className="w-4 h-4 text-blue-600 border-slate-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="requiereCongelacion" className="text-sm text-slate-300">
                            Requiere Congelación
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                        Vida Útil
                    </label>
                    <input
                        type="text"
                        name="vidaUtil"
                        value={formData.conservacion?.vidaUtil || ''}
                        onChange={(e) => onChange(e, 'conservacion')}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                        placeholder="Ej: 12 meses"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                        Instrucciones de Conservación
                    </label>
                    <textarea
                        name="instrucciones"
                        value={formData.conservacion?.instrucciones || ''}
                        onChange={(e) => onChange(e, 'conservacion')}
                        rows="3"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                        placeholder="Instrucciones específicas de conservación..."
                    />
                </div>
            </div>
        </div>
    );
};