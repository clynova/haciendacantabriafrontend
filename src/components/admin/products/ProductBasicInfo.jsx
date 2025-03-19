export const ProductBasicInfo = ({ product }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-200">Información Básica</h2>
            <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                <InfoItem label="Código" value={product.codigo} />
                <InfoItem label="SKU" value={product.sku} />
                <InfoItem label="Categoría" value={product.categoria} />
                <InfoItem label="Tipo" value={product.tipoProducto} />
                <InfoItem 
                    label="Destacado" 
                    value={product.destacado ? 'Sí' : 'No'} 
                />
            </div>
        </div>
    );
};

// Reusable InfoItem component
const InfoItem = ({ label, value }) => (
    <p className="text-slate-300">
        <span className="text-slate-400">{label}:</span> {value}
    </p>
);