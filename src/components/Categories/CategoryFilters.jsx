import { Fragment } from 'react';

// Constants - Consider moving these to a shared location or passing all necessary ones as props
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

// Base component styles - Updated for a cleaner look
const baseInputStyles = `
    block w-full px-3 py-2 rounded-md shadow-sm
    bg-white dark:bg-gray-700
    border border-gray-300 dark:border-gray-600
    text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    text-sm transition duration-150 ease-in-out
`;

const baseCheckboxStyles = `
    h-4 w-4 rounded
    border-gray-300 dark:border-gray-600
    text-blue-600 focus:ring-blue-500
    cursor-pointer transition duration-150 ease-in-out
`;

const baseLabelStyles = `
    text-sm font-medium text-gray-700 dark:text-gray-300
`;

const filterSectionStyles = `
    py-5 px-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0
`;

const filterSectionTitleStyles = `
    text-base font-semibold text-gray-900 dark:text-white mb-4
`;

// Helper Components within CategoryFilters
const FilterSection = ({ title, children }) => (
    <div className={filterSectionStyles}>
        <h3 className={filterSectionTitleStyles}>
            {title}
        </h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const SelectFilter = ({ name, label, value, onChange, options, placeholder }) => (
    <div>
        {label && <label htmlFor={name} className={`${baseLabelStyles} block mb-1`}>{label}</label>}
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={baseInputStyles}
        >
            <option value="">{placeholder}</option>
            {options.map(opt => {
                const val = typeof opt === 'object' ? opt.value : opt;
                const displayLabel = typeof opt === 'object' ? opt.label : (typeof opt === 'string' ? opt.replace(/_/g, ' ') : opt);
                return (
                    <option key={val} value={val}>
                        {displayLabel}
                    </option>
                );
            })}
        </select>
    </div>
);

const InputFilter = ({ name, label, type = 'text', value, onChange, placeholder, min, max, step }) => (
    <div>
        {label && <label htmlFor={name} className={`${baseLabelStyles} block mb-1`}>{label}</label>}
        <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            className={baseInputStyles}
        />
    </div>
);

const CheckboxFilter = ({ name, label, checked, onChange }) => (
    <label className="flex items-center gap-2 cursor-pointer">
        <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            className={baseCheckboxStyles}
        />
        <span className={baseLabelStyles}>{label}</span>
    </label>
);

const TagFilter = ({ tags, selectedTags, onTagChange, matchAllTags, setMatchAllTags }) => (
    <FilterSection title="Etiquetas">
        <CheckboxFilter
            name="matchAllTags"
            label="Coincidir todas las etiquetas"
            checked={matchAllTags}
            onChange={(e) => setMatchAllTags(e.target.checked)}
        />
        <div className="flex flex-wrap gap-2 pt-2">
            {tags.map(tag => (
                <button
                    key={tag}
                    type="button" // Prevent form submission if wrapped in a form
                    onClick={() => onTagChange(tag)}
                    className={`
                        px-3 py-1.5 rounded-full text-xs font-medium border
                        transition-all duration-200 ease-in-out
                        ${selectedTags.includes(tag)
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm hover:bg-blue-700'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }
                    `}
                >
                    {tag}
                </button>
            ))}
        </div>
    </FilterSection>
);

export const CategoryFilters = ({ 
    filters, 
    handleFilterChange, 
    searchTerm, 
    setSearchTerm,
    categoryName, // Used to determine which filters to show
    TIPOS_ACEITE, // Passed from parent
    METODOS_COCCION, // Passed from parent
    TIPOS_ENVASE, // Passed from parent
    availableTags, 
    selectedTags, 
    onTagChange,
    matchAllTags,
    setMatchAllTags,
}) => {

    // Normalize category name for easier comparison
    const normalizedCategory = categoryName?.toUpperCase().replace(/ /g, '');

    // Define filter sections based on category
    const getCategorySpecificFilters = () => {
        switch (normalizedCategory) {
            case 'CARNE':
            case 'VACUNO':
            case 'CERDO':
            case 'POLLO':
            case 'CORDERO':
            case 'PAVO':
                return (
                    <Fragment>
                        <FilterSection title="Detalles de Carne">
                            <SelectFilter
                                name="tipoCarne"
                                label="Tipo de Carne"
                                value={filters.tipoCarne}
                                onChange={handleFilterChange}
                                options={TIPOS_CARNE} // Use local constant for now
                                placeholder="Todos los tipos"
                            />
                            {/* Show specific cuts only if type is Vacuno */}
                            {filters.tipoCarne === 'VACUNO' && (
                                <SelectFilter
                                    name="corte"
                                    label="Corte (Vacuno)"
                                    value={filters.corte}
                                    onChange={handleFilterChange}
                                    options={CORTES_VACUNO} // Use local constant
                                    placeholder="Todos los cortes"
                                />
                            )}
                            <SelectFilter
                                name="marmoleo"
                                label="Clasificación Marmoleo"
                                value={filters.marmoleo}
                                onChange={handleFilterChange}
                                options={CLASIFICACION_MARMOLEO} // Use local constant
                                placeholder="Cualquier marmoleo"
                            />
                             <div className="grid grid-cols-2 gap-3">
                                <InputFilter
                                    name="pesoMin"
                                    label="Peso Mín (kg)"
                                    type="number"
                                    value={filters.pesoMin}
                                    onChange={handleFilterChange}
                                    placeholder="Min"
                                    min="0"
                                    step="0.1"
                                />
                                <InputFilter
                                    name="pesoMax"
                                    label="Peso Máx (kg)"
                                    type="number"
                                    value={filters.pesoMax}
                                    onChange={handleFilterChange}
                                    placeholder="Max"
                                    min="0"
                                    step="0.1"
                                />
                            </div>
                            <div>
                                <label className={`${baseLabelStyles} block mb-2`}>Métodos de Cocción</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {METODOS_COCCION.map(metodo => (
                                        <CheckboxFilter
                                            key={metodo}
                                            name="metodosCoccion"
                                            label={metodo.replace(/_/g, ' ')}
                                            // Special handling for array checkbox group
                                            checked={filters.metodosCoccion?.includes(metodo)}
                                            onChange={(e) => {
                                                const { checked } = e.target;
                                                const currentMethods = filters.metodosCoccion || [];
                                                const updatedMethods = checked
                                                    ? [...currentMethods, metodo]
                                                    : currentMethods.filter(m => m !== metodo);
                                                // Synthesize event for handleFilterChange
                                                handleFilterChange({ target: { name: 'metodosCoccion', value: updatedMethods } });
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </FilterSection>
                    </Fragment>
                );
            case 'ACEITE':
                return (
                    <FilterSection title="Detalles de Aceite">
                        <SelectFilter
                            name="tipoAceite"
                            label="Tipo de Aceite"
                            value={filters.tipoAceite}
                            onChange={handleFilterChange}
                            options={TIPOS_ACEITE} // Use prop
                            placeholder="Todos los tipos"
                        />
                        <SelectFilter
                            name="tipoEnvase"
                            label="Tipo de Envase"
                            value={filters.tipoEnvase}
                            onChange={handleFilterChange}
                            options={TIPOS_ENVASE} // Use prop
                            placeholder="Todos los envases"
                        />
                        <div className="grid grid-cols-2 gap-3">
                             <InputFilter
                                name="volumenMin"
                                label="Volumen Mín (L)"
                                type="number"
                                value={filters.volumenMin}
                                onChange={handleFilterChange}
                                placeholder="Min"
                                min="0"
                                step="0.1"
                            />
                            <InputFilter
                                name="volumenMax"
                                label="Volumen Máx (L)"
                                type="number"
                                value={filters.volumenMax}
                                onChange={handleFilterChange}
                                placeholder="Max"
                                min="0"
                                step="0.1"
                            />
                        </div>
                    </FilterSection>
                );
            default:
                return null; // No specific filters for other categories yet
        }
    };

    return (
        <aside className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {/* Basic Filters - Always Shown */}
                <FilterSection title="Búsqueda y Precio">
                    <InputFilter
                        name="search"
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <InputFilter
                            name="precioMin"
                            label="Precio Mín"
                            type="number"
                            value={filters.precioMin}
                            onChange={handleFilterChange}
                            placeholder="Min"
                            min="0"
                        />
                         <InputFilter
                            name="precioMax"
                            label="Precio Máx"
                            type="number"
                            value={filters.precioMax}
                            onChange={handleFilterChange}
                            placeholder="Max"
                            min="0"
                        />
                    </div>
                     <CheckboxFilter
                        name="destacado"
                        label="Solo Productos Destacados"
                        checked={filters.destacado}
                        onChange={handleFilterChange}
                    />
                </FilterSection>

                {/* Category Specific Filters */}
                {getCategorySpecificFilters()}

                {/* Additional Generic Filters */}
                <FilterSection title="Otros Filtros">
                    <InputFilter
                        name="origen"
                        label="Origen"
                        placeholder="Filtrar por origen"
                        value={filters.origen}
                        onChange={handleFilterChange}
                    />
                    <InputFilter
                        name="marca"
                        label="Marca"
                        placeholder="Filtrar por marca"
                        value={filters.marca}
                        onChange={handleFilterChange}
                    />
                     {/* Example: Refrigeration/Freezing flags if applicable widely */}
                     {/* 
                     <CheckboxFilter 
                        name="requiereRefrigeracion"
                        label="Requiere Refrigeración"
                        checked={filters.requiereRefrigeracion}
                        onChange={handleFilterChange}
                     />
                     <CheckboxFilter
                        name="requiereCongelacion"
                        label="Requiere Congelación"
                        checked={filters.requiereCongelacion}
                        onChange={handleFilterChange}
                    /> 
                    */}
                </FilterSection>

                {/* Sorting */}
                <FilterSection title="Ordenar Por">
                    <SelectFilter
                        name="ordenar"
                        value={filters.ordenar}
                        onChange={handleFilterChange}
                        options={[
                            { value: 'precio-asc', label: 'Precio: Menor a Mayor' },
                            { value: 'precio-desc', label: 'Precio: Mayor a Menor' },
                            { value: 'nombre-asc', label: 'Nombre: A-Z' },
                            { value: 'nombre-desc', label: 'Nombre: Z-A' },
                            // Conditionally add sorting options if relevant
                            ...(normalizedCategory?.includes('CARNE') ? [{ value: 'marmoleo-desc', label: 'Mayor Marmoleo' }] : [])
                        ]}
                        placeholder="Relevancia"
                    />
                </FilterSection>

                {/* Tags Filter - Show if tags are available */}
                {availableTags && availableTags.length > 0 && (
                    <TagFilter 
                        tags={availableTags} 
                        selectedTags={selectedTags} 
                        onTagChange={onTagChange} 
                        matchAllTags={matchAllTags}
                        setMatchAllTags={setMatchAllTags}
                    />
                )}
            </div>
        </aside>
    );
};