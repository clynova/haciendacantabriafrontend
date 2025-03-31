import { Fragment } from 'react';

// Constants
const TIPOS_CARNE = ['VACUNO', 'CERDO', 'POLLO', 'CORDERO', 'PAVO'];
const CORTES_VACUNO = [
    'BIFE_ANCHO', 'BIFE_ANGOSTO', 'BIFE_DE_PALETA', 'BIFE_DE_VACIO',
    'BOLA_DE_LOMO', 'BRAZUELO', 'CARNAZA_DE_CUADRADA', 'CARNAZA_PALETA',
    'CHINGOLO', 'COGOTE', 'COLITA_DE_CUADRIL', 'CORAZON_DE_CUADRIL',
    'ENTRAÑA_FINA', 'FALDA_DESHUESADA', 'GARRON', 'HUACHALOMO',
    'LOMO', 'MARUCHA', 'NALGA_DE_ADENTRO', 'PECETO',
    'PECHO', 'SOBRECOSTILLA', 'TAPA_DE_BIFE_ANCHO', 'TAPA_DE_CUADRIL',
    'TORTUGUITA', 'VACIO'
];

const CLASIFICACION_MARMOLEO = [
    { value: 1, label: 'Marmoleo Bajo' },
    { value: 2, label: 'Marmoleo Medio-Bajo' },
    { value: 3, label: 'Marmoleo Medio' },
    { value: 4, label: 'Marmoleo Medio-Alto' },
    { value: 5, label: 'Marmoleo Alto' }
];

// Base component styles
const baseInputStyles = `
    w-full px-3 py-2 rounded-lg 
    bg-white dark:bg-gray-700
    border border-gray-200 dark:border-gray-600
    text-gray-800 dark:text-gray-100
    focus:ring-2 focus:ring-blue-500 focus:border-transparent
    transition-colors duration-200
`;

const baseCheckboxStyles = `
    w-4 h-4 rounded 
    border-gray-300 dark:border-gray-600
    text-blue-500 focus:ring-blue-500
    cursor-pointer transition-colors duration-200
`;

export const CategoryFilters = ({ 
    filters, 
    handleFilterChange, 
    searchTerm, 
    setSearchTerm,
    categoryName,
    TIPOS_ACEITE,
    METODOS_COCCION,
    TIPOS_ENVASE,
    availableTags,
    selectedTags,
    onTagChange,
    matchAllTags,
    setMatchAllTags,
}) => {
    const FilterSection = ({ title, children }) => (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">
                {title}
            </h3>
            {children}
        </div>
    );

    const SelectFilter = ({ name, value, onChange, options, placeholder }) => (
        <select
            name={name}
            value={value}
            onChange={onChange}
            className={baseInputStyles}
        >
            <option value="">{placeholder}</option>
            {options.map(opt => {
                if (typeof opt === 'object' && opt.value !== undefined) {
                    return (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    );
                }
                return (
                    <option key={opt} value={opt}>
                        {typeof opt === 'string' ? opt.replace(/_/g, ' ') : opt}
                    </option>
                );
            })}
        </select>
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg divide-y divide-gray-200 dark:divide-gray-700">
            <FilterSection title="Búsqueda">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`${baseInputStyles} mb-3`}
                />
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="destacado"
                        checked={filters.destacado}
                        onChange={handleFilterChange}
                        className={baseCheckboxStyles}
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                        Productos Destacados
                    </span>
                </label>
            </FilterSection>

            <FilterSection title="Rango de Precio">
                <div className="flex gap-3">
                    <input
                        type="number"
                        name="precioMin"
                        placeholder="Mínimo"
                        value={filters.precioMin}
                        onChange={handleFilterChange}
                        min="0"
                        className={`${baseInputStyles} w-1/2`}
                    />
                    <input
                        type="number"
                        name="precioMax"
                        placeholder="Máximo"
                        value={filters.precioMax}
                        onChange={handleFilterChange}
                        min="0"
                        className={`${baseInputStyles} w-1/2`}
                    />
                </div>
            </FilterSection>

            {/* Conservation Section */}
            <FilterSection title="Conservación">
                <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="requiereRefrigeracion"
                            checked={filters.requiereRefrigeracion}
                            onChange={handleFilterChange}
                            className={baseCheckboxStyles}
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                            Requiere Refrigeración
                        </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="requiereCongelacion"
                            checked={filters.requiereCongelacion}
                            onChange={handleFilterChange}
                            className={baseCheckboxStyles}
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                            Requiere Congelación
                        </span>
                    </label>
                </div>
            </FilterSection>

            {/* Meat Specific Filters */}
            {categoryName === 'CARNE' && (
                <>
                    <FilterSection title="Especificaciones de Carne">
                        <div className="space-y-4">
                            <SelectFilter
                                name="tipoCarne"
                                value={filters.tipoCarne}
                                onChange={handleFilterChange}
                                options={TIPOS_CARNE}
                                placeholder="Tipo de carne"
                            />
                            {filters.tipoCarne === 'VACUNO' && (
                                <SelectFilter
                                    name="corte" // Changed from corteVacuno to corte to match the filter property
                                    value={filters.corte}
                                    onChange={handleFilterChange}
                                    options={CORTES_VACUNO}
                                    placeholder="Seleccionar corte"
                                />
                            )}
                            <SelectFilter
                                name="marmoleo"
                                value={filters.marmoleo}
                                onChange={handleFilterChange}
                                options={CLASIFICACION_MARMOLEO}
                                placeholder="Nivel de Marmoleo"
                            />
                            <div className="space-y-2">
                                <h4 className="text-sm text-gray-600 dark:text-gray-400">
                                    Rango de Peso (g)
                                </h4>
                                <div className="flex gap-3">
                                    <input
                                        type="number"
                                        name="pesoMin"
                                        placeholder="Mínimo"
                                        value={filters.pesoMin}
                                        onChange={handleFilterChange}
                                        min="0"
                                        className={`${baseInputStyles} w-1/2`}
                                    />
                                    <input
                                        type="number"
                                        name="pesoMax"
                                        placeholder="Máximo"
                                        value={filters.pesoMax}
                                        onChange={handleFilterChange}
                                        min="0"
                                        className={`${baseInputStyles} w-1/2`}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm text-gray-600 dark:text-gray-400">
                                    Métodos de Cocción
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {METODOS_COCCION.map(metodo => (
                                        <label key={metodo} className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                name="metodosCoccion"
                                                value={metodo}
                                                checked={filters.metodosCoccion?.includes(metodo)}
                                                onChange={handleFilterChange}
                                                className={baseCheckboxStyles}
                                            />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                {metodo.replace(/_/g, ' ')}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FilterSection>
                </>
            )}

            {/* Oil Specific Filters */}
            {categoryName === 'ACEITE' && (
                <FilterSection title="Especificaciones de Aceite">
                    <div className="space-y-4">
                        <SelectFilter
                            name="tipoAceite"
                            value={filters.tipoAceite}
                            onChange={handleFilterChange}
                            options={TIPOS_ACEITE}
                            placeholder="Tipo de Aceite"
                        />
                        <SelectFilter
                            name="tipoEnvase"
                            value={filters.tipoEnvase}
                            onChange={handleFilterChange}
                            options={TIPOS_ENVASE}
                            placeholder="Tipo de Envase"
                        />
                        <div className="space-y-2">
                            <h4 className="text-sm text-gray-600 dark:text-gray-400">
                                Volumen (ml)
                            </h4>
                            <div className="flex gap-3">
                                <input
                                    type="number"
                                    name="volumenMin"
                                    placeholder="Mínimo"
                                    value={filters.volumenMin}
                                    onChange={handleFilterChange}
                                    min="0"
                                    className={`${baseInputStyles} w-1/2`}
                                />
                                <input
                                    type="number"
                                    name="volumenMax"
                                    placeholder="Máximo"
                                    value={filters.volumenMax}
                                    onChange={handleFilterChange}
                                    min="0"
                                    className={`${baseInputStyles} w-1/2`}
                                />
                            </div>
                        </div>
                    </div>
                </FilterSection>
            )}

            {/* Additional Filters Section */}
            <FilterSection title="Filtros Adicionales">
                <div className="space-y-4">
                    <input
                        type="text"
                        name="origen"
                        placeholder="Filtrar por origen"
                        value={filters.origen}
                        onChange={handleFilterChange}
                        className={baseInputStyles}
                    />
                    <input
                        type="text"
                        name="marca"
                        placeholder="Filtrar por marca"
                        value={filters.marca}
                        onChange={handleFilterChange}
                        className={baseInputStyles}
                    />
                </div>
            </FilterSection>

            <FilterSection title="Ordenar Por">
                <select
                    name="ordenar"
                    value={filters.ordenar}
                    onChange={handleFilterChange}
                    className={baseInputStyles}
                >
                    <option value="">Seleccionar orden</option>
                    <option value="precio-asc">Precio: Menor a Mayor</option>
                    <option value="precio-desc">Precio: Mayor a Menor</option>
                    <option value="nombre-asc">Nombre: A-Z</option>
                    <option value="nombre-desc">Nombre: Z-A</option>
                    {categoryName === 'CARNE' && (
                        <option value="marmoleo-desc">Mayor Marmoleo</option>
                    )}
                </select>
            </FilterSection>

            {availableTags.length > 0 && (
                <FilterSection title="Etiquetas">
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={matchAllTags}
                                onChange={(e) => setMatchAllTags(e.target.checked)}
                                className={baseCheckboxStyles}
                            />
                            <span className="text-gray-600 dark:text-gray-400">
                                Coincidir todas las etiquetas
                            </span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {availableTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => onTagChange(tag)}
                                    className={`
                                        px-3 py-1.5 rounded-full text-sm font-medium
                                        transition-all duration-200 
                                        ${selectedTags.includes(tag)
                                            ? 'bg-blue-500 text-white shadow-sm'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }
                                    `}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </FilterSection>
            )}
        </div>
    );
};