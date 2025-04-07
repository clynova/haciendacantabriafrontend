import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';

const mockData = {
    aceite: {
        sku: `TEST-ACC-${Date.now()}`,
        nombre: 'Aceite de Oliva 2L',
        tipoProducto: 'ProductoAceite',
        categoria: 'ACEITE',
        estado: true,
        destacado: false,
        descripcion: {
            corta: 'Aceite premium de oliva extra virgen',
            completa: 'Aceite de oliva extra virgen premium elaborado con aceitunas seleccionadas'
        },
        multimedia: {
            imagenes: [],
            video: 'https://www.youtube.com/watch?v=ANDVYKTZMGs'
        },
        seo: {
            metaTitulo: 'Aceite de Oliva Extra Virgen Premium | Hacienda Cantabria',
            metaDescripcion: 'Aceite de oliva extra virgen premium, prensado en frío, ideal para ensaladas y cocina gourmet. Producido en Argentina.',
            palabrasClave: [
                'aceite de oliva',
                'extra virgen',
                'premium',
                'gourmet',
                'prensado en frío',
                'Argentina',
                'Hacienda Cantabria'
            ]
        },
        infoAdicional: {
            origen: 'Valle de Uco, Mendoza, Argentina',
            marca: 'Hacienda Cantabria',
            certificaciones: [
                'HACCP',
                'FSSC_22000',
                'ISO_22000',
                'KOSHER',
                'ORGANICO'
            ]
        },
        conservacion: {
            requiereRefrigeracion: false,
            requiereCongelacion: false,
            vidaUtil: '24 meses desde la fecha de envasado',
            instrucciones: 'Conservar en lugar fresco y seco, protegido de la luz directa. Una vez abierto, consumir dentro de 6 meses.'
        },
        tags: [
            'PREMIUM',
            'ORGANICO',
            'GOURMET',
            'ACEITE',
            'OLIVA',
            'IMPORTADO',
            'ARGENTINA'
        ],
        opcionesPeso: {
            esPesoVariable: false,
            pesoPromedio: null,
            pesoMinimo: null,
            pesoMaximo: null,
            pesosEstandar: [
                {
                    peso: 250,
                    unidad: 'ml',
                    esPredeterminado: false,
                    precio: 8990,
                    sku: 'TEST-ACC-001-250ML',
                    stockDisponible: 100,
                    umbralStockBajo: 10,
                    descuentos: {
                        regular: 0
                    }
                },
                {
                    peso: 500,
                    unidad: 'ml',
                    esPredeterminado: true,
                    precio: 15990,
                    sku: 'TEST-ACC-001-500ML',
                    stockDisponible: 75,
                    umbralStockBajo: 8,
                    descuentos: {
                        regular: 10
                    }
                },
                {
                    peso: 1000,
                    unidad: 'ml',
                    esPredeterminado: false,
                    precio: 29990,
                    sku: 'TEST-ACC-001-1L',
                    stockDisponible: 50,
                    umbralStockBajo: 5,
                    descuentos: {
                        regular: 15
                    }
                },
                {
                    peso: 2000,
                    unidad: 'ml',
                    esPredeterminado: true,
                    precio: 25000,
                    sku: 'TEST-ACC-001-2L',
                    stockDisponible: 50,
                    umbralStockBajo: 5,
                    descuentos: {
                        regular: 0
                    }
                },
                {
                    peso: 5000,
                    unidad: 'ml',
                    esPredeterminado: false,
                    precio: 50000,
                    sku: 'TEST-ACC-001-5L',
                    stockDisponible: 30,
                    umbralStockBajo: 3,
                    descuentos: {
                        regular: 0
                    }
                }
            ],
            rangosPreferidos: [
                {
                    nombre: 'Uso Personal',
                    pesoMinimo: 250,
                    pesoMaximo: 500,
                    descripcion: 'Ideal para consumo individual o familiar pequeño',
                    esPredeterminado: true
                },
                {
                    nombre: 'Uso Familiar',
                    pesoMinimo: 750,
                    pesoMaximo: 1000,
                    descripcion: 'Perfecto para familias grandes o uso frecuente',
                    esPredeterminado: false
                }
            ]
        },
        infoNutricional: {
            porcion: '15 ml (1 cucharada)',
            calorias: 120,
            proteinas: 0,
            grasaTotal: 14,
            grasaSaturada: 2,
            grasaTrans: 0,
            grasaPoliinsaturada: 1.5,
            grasaMonoinsaturada: 10,
            colesterol: 0,
            sodio: 0,
            carbohidratos: 0
        },
        infoAceite: {
            tipo: 'OLIVA',
            envase: 'BOTELLA'
        },
        caracteristicas: {
            aditivos: ['ANTIOXIDANTES', 'VITAMINA_E'],  // Asegurar que sean valores del enum
            filtracion: 'FILTRADO',  // Asegurar que sea un valor válido
            acidez: 0.2,  // Debe ser número, no string
            extraccion: 'PRENSADO_FRIO'  // Asegurar que sea un valor válido
        },
        usosRecomendados: [
            'ENSALADAS',
            'COCINA',
            'MARINADOS',
            'ADEREZOS'
        ],
        produccion: {
            metodo: 'PRENSADO_MECANICO',
            temperatura: 'Ambiente (18-22°C)',
            fechaEnvasado: new Date().toISOString(),
            fechaVencimiento: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString() // 2 años
        }
    },
    carne: {
        sku: `TEST-CAR-${Date.now()}`,
        nombre: 'Lomo Vetado Premium',
        tipoProducto: 'ProductoCarne',
        categoria: 'CARNE',
        estado: true,
        destacado: false,
        descripcion: {
            corta: 'Lomo vetado premium de primera calidad',
            completa: 'Corte premium de vacuno con excelente marmoleo y textura'
        },
        multimedia: {
            imagenes: [],
            video: ''
        },
        seo: {
            metaTitulo: 'LOMO VETADO PREMIUM | HACIENDA CANTABRIA',
            metaDescripcion: 'Corte premium de vacuno con excelente marmoleo',
            palabrasClave: ['premium', 'carne', 'vacuno', 'lomo']
        },
        infoAdicional: {
            origen: 'Argentina',
            marca: 'Hacienda Cantabria',
            certificaciones: ['HACCP', 'FSSC_22000']
        },
        conservacion: {
            requiereRefrigeracion: true,
            requiereCongelacion: false,
            vidaUtil: '7 días',
            instrucciones: 'Mantener refrigerado entre 0°C y 4°C'
        },
        opcionesPeso: {
            esPesoVariable: true,
            pesoPromedio: 1000,
            pesoMinimo: 800,
            pesoMaximo: 1200,
            pesosEstandar: [
                {
                    peso: 1000,
                    unidad: 'g',
                    esPredeterminado: true,
                    precio: 25000,
                    sku: 'TEST-CAR-001-1K',
                    stockDisponible: 20,
                    umbralStockBajo: 5,
                    descuentos: {
                        regular: 0
                    }
                }
            ],
            rangosPreferidos: [
                {
                    nombre: 'Porción Individual',
                    pesoMinimo: 200,
                    pesoMaximo: 300,
                    descripcion: 'Ideal para una persona',
                    esPredeterminado: true
                }
            ]
        },
        infoCarne: {
            tipoCarne: 'VACUNO',
            corte: 'LOMO_VETADO',
            nombreArgentino: 'Bife Ancho',
            nombreChileno: 'Lomo Vetado'
        },
        caracteristicas: {
            porcentajeGrasa: 15,
            marmoleo: 4,
            color: 'ROJO_CEREZA',
            textura: ['TIERNA', 'JUGOSA']
        },
        infoNutricional: {
            porcion: '100g',
            calorias: 250,
            proteinas: 26,
            grasaTotal: 17,
            grasaSaturada: 7,
            colesterol: 80,
            sodio: 60,
            carbohidratos: 0
        },
        coccion: {
            metodos: ['PARRILLA', 'HORNO'],
            temperaturaIdeal: '75°C',
            tiempoEstimado: '20-25 minutos',
            consejos: ['Dejar reposar 5 minutos antes de cortar'],
            recetas: [
                {
                    nombre: 'Lomo a la parrilla',
                    url: 'https://ejemplo.com/receta',
                    descripcion: 'Receta tradicional argentina'
                }
            ]
        },
        empaque: {
            tipo: 'VACIO',
            unidadesPorCaja: 10,
            pesoCaja: 10.5
        },
        origen: {
            pais: 'ARGENTINA',
            region: 'Pampa Húmeda',
            productor: 'Hacienda Los Pampas',
            raza: 'ANGUS',
            maduracion: '21'  // días de maduración
        },
        procesamiento: {
            fechaFaenado: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días atrás
            fechaEnvasado: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 días atrás
            fechaVencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días adelante
            numeroLote: `LOT-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`
        }
    }
};

export const TestingTools = ({ onTestDataFill }) => {
    const [expanded, setExpanded] = useState(false);

    const handleFillTestData = (type) => {
        const testData = mockData[type];
        if (testData) {
            console.log(`Cargando datos de prueba para ${type}:`, testData);
            onTestDataFill(testData);
            toast.success(`Datos de prueba para ${type} cargados`);
        }
    };

    if (!expanded) {
        return (
            <button 
                className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg z-50"
                onClick={() => setExpanded(true)}
                title="Herramientas de prueba"
            >
                🧪
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 w-64">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Datos de Prueba</h3>
                <button 
                    onClick={() => setExpanded(false)}
                    className="text-gray-400 hover:text-white"
                >
                    ✕
                </button>
            </div>
            
            <div className="space-y-2">
                <button
                    className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-2 px-3 rounded text-sm"
                    onClick={() => handleFillTestData('aceite')}
                >
                    Cargar Aceite de Prueba
                </button>
                
                <button
                    className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-2 px-3 rounded text-sm"
                    onClick={() => handleFillTestData('carne')}
                >
                    Cargar Carne de Prueba
                </button>
            </div>
            
            <p className="text-xs text-gray-400 mt-3">
                Datos de prueba actualizados según el esquema actual
            </p>
        </div>
    );
};

TestingTools.propTypes = {
    onTestDataFill: PropTypes.func.isRequired
};