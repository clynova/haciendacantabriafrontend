import { HiChevronRight } from "react-icons/hi";
import { Link } from "react-router-dom";

const CategoryBanner = ({ title, description, imageUrl, productsCount }) => {
    return (
        <div className="relative overflow-hidden">
            {/* Background image with gradient overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    filter: 'blur(1px)',
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

            {/* Content */}
            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className="max-w-3xl">
                    <div className="flex items-center text-sm mb-4 text-white/70 font-medium">
                        <Link to="/" className="hover:opacity-80 transition-opacity">Inicio</Link>
                        <HiChevronRight className="h-4 w-4 mx-2 opacity-50" />
                        <span className="opacity-70">Categorías</span>
                        <HiChevronRight className="h-4 w-4 mx-2 opacity-50" />
                        <span className="text-white">{title}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-3 text-white tracking-tight">{title}</h1>

                    <p className="text-white/90 text-lg max-w-2xl mb-6">{description}</p>

                    <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                        <span className="text-white/70 text-sm mr-2">Productos</span>
                        <span className="text-2xl font-bold text-white">{productsCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { CategoryBanner };