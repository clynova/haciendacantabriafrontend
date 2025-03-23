import { Fragment } from 'react';

// Add these constants at the top
const TIPOS_CARNE = ['VACUNO', 'CERDO', 'POLLO', 'CORDERO', 'PAVO'];
const CORTES_VACUNO = [
    'LOMO_VETADO', 'LOMO_LISO', 'ASADO_DEL_CARNICERO', 'PALANCA',
    'POSTA_ROSADA', 'OSOBUCO_DE_MANO', 'GANSO', 'POSTA_DE_PALETA',
    'CHOCLILLO', 'PUNTA_PICANA', 'ASIENTO', 'ENTRAÑA'
];

export const CategoryFilters = ({ 
    filters, 
    handleFilterChange, 
    searchTerm, 
    setSearchTerm,
    categoryName,
    CORTES_VACUNO,
    TIPOS_ACEITE,
    METODOS_COCCION,
    TIPOS_ENVASE
}) => {
    return (
        <div className="space-y-6 p-4">
            {/* Search input */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 
                             dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rango de Precio
                </h3>
                <div className="flex gap-2">
                    <input
                        type="number"
                        name="precioMin"
                        placeholder="Mín"
                        value={filters.precioMin}
                        onChange={handleFilterChange}
                        min="0"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 
                                 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        type="number"
                        name="precioMax"
                        placeholder="Máx"
                        value={filters.precioMax}
                        onChange={handleFilterChange}
                        min="0"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 
                                 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            {/* Category specific filters */}
            {categoryName === 'CARNE' && (
                <Fragment>
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tipo de Carne
                        </h3>
                        <select
                            name="tipoCarne"
                            value={filters.tipoCarne}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 
                                     dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Todos los tipos</option>
                            {TIPOS_CARNE.map(tipo => (
                                <option key={tipo} value={tipo}>
                                    {tipo.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {filters.tipoCarne === 'VACUNO' && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Corte
                            </h3>
                            <select
                                name="corteVacuno"
                                value={filters.corteVacuno}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 
                                         dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Todos los cortes</option>
                                {CORTES_VACUNO.map(corte => (
                                    <option key={corte} value={corte}>{corte.replace(/_/g, ' ')}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Método de Cocción
                        </h3>
                        <select
                            name="metodoCoccion"
                            value={filters.metodoCoccion}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 
                                     dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Todos los métodos</option>
                            {METODOS_COCCION.map(metodo => (
                                <option key={metodo} value={metodo}>{metodo}</option>
                            ))}
                        </select>
                    </div>
                </Fragment>
            )}

            {categoryName === 'VACUNO' && (
                <Fragment>
                    <div className="mb-6">
                        <select
                            name="corteVacuno"
                            value={filters.corteVacuno}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 
                                     dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Tipo de Corte</option>
                            {CORTES_VACUNO.map(corte => (
                                <option key={corte} value={corte}>{corte}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-6">
                        <select
                            name="metodoCoccion"
                            value={filters.metodoCoccion}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 
                                     dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Método de Cocción</option>
                            {METODOS_COCCION.map(metodo => (
                                <option key={metodo} value={metodo}>{metodo}</option>
                            ))}
                        </select>
                    </div>
                </Fragment>
            )}

            {categoryName === 'ACEITE' && (
                <Fragment>
                    <div className="mb-6">
                        <select
                            name="tipoAceite"
                            value={filters.tipoAceite}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 
                                     dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Tipo de Aceite</option>
                            {TIPOS_ACEITE.map(tipo => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-6">
                        <select
                            name="tipoEnvase"
                            value={filters.tipoEnvase}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 
                                     dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Tipo de Envase</option>
                            {TIPOS_ENVASE.map(tipo => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                        </select>
                    </div>
                </Fragment>
            )}

            <div className="mb-6">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="destacado"
                        checked={filters.destacado}
                        onChange={handleFilterChange}
                        className="rounded text-blue-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Destacados</span>
                </label>
            </div>

            <div className="mb-6">
                <select
                    name="ordenar"
                    value={filters.ordenar}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 
                             dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                    <option value="">Ordenar por</option>
                    <option value="precio-asc">Precio: Menor a Mayor</option>
                    <option value="precio-desc">Precio: Mayor a Menor</option>
                    <option value="nombre-asc">Nombre: A-Z</option>
                    <option value="nombre-desc">Nombre: Z-A</option>
                </select>
            </div>
        </div>
    );
};