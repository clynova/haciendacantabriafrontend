import { HiArrowLeft, HiPencil } from 'react-icons/hi';

export const ProductDetailsHeader = ({ product, onBack, onEdit }) => {
    return (
        <div className="space-y-6">
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-300 hover:text-white"
                >
                    <HiArrowLeft className="h-5 w-5" />
                    <span>Volver a la lista</span>
                </button>
                <button
                    onClick={onEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                    <HiPencil className="h-5 w-5" />
                    Editar
                </button>
            </div>

            {/* Product Title and Status */}
            <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-slate-700">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-white">{product.nombre}</h1>
                        <p className="text-slate-400 mt-2">ID: {product._id}</p>
                        <p className="text-slate-400">Slug: {product.slug}</p>
                    </div>
                    <ProductStatus estado={product.estado} />
                </div>
            </div>
        </div>
    );
};

// Status Badge Component
const ProductStatus = ({ estado }) => {
    const statusStyles = {
        ACTIVO: 'bg-green-100 text-green-800',
        INACTIVO: 'bg-red-100 text-red-800',
        SIN_STOCK: 'bg-yellow-100 text-yellow-800',
        default: 'bg-blue-100 text-blue-800'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            statusStyles[estado] || statusStyles.default
        }`}>
            {estado}
        </span>
    );
};