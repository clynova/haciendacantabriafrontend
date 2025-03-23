export const ImageModal = ({ image, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
            <div className="relative max-w-4xl w-full aspect-square" onClick={e => e.stopPropagation()}>
                <img
                    src={image.url}
                    alt={image.textoAlternativo}
                    className="w-full h-full object-contain"
                />
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white"
                >
                    <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};