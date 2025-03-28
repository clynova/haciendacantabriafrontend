import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';

const mockData = {
    aceite: {
        codigo: `ACE-${Date.now()}`,
        sku: `SKU-ACE-${Date.now()}`,
        nombre: 'Aceite de Oliva Extra Virgen Premium',
        descripcion: {
            corta: 'Aceite de oliva premium de primera prensada en frío',
            completa: 'Aceite de oliva extra virgen elaborado con aceitunas seleccionadas...'
        },
        precios: {
            base: '15990',
            descuentos: {
                regular: '5',
                transferencia: '10'
            }
        },
        infoAceite: {
            tipo: 'OLIVA',
            volumen: '500',
            envase: 'BOTELLA'
        },
        caracteristicas: {
            aditivos: ['ANTIOXIDANTES', 'VITAMINA_E'],
            filtracion: 'FILTRADO',
            acidez: '0.2',
            extraccion: 'PRENSADO_FRIO'
        },
        produccion: {
            metodo: 'PRENSADO_MECANICO',
            temperatura: '25',
            fechaEnvasado: '2024-03-24',
            fechaVencimiento: '2025-03-24'
        },
        estado: true,
        destacado: false,
    },
    carne: {
        codigo: `CAR-${Date.now()}`,
        sku: `SKU-CAR-${Date.now()}`,
        nombre: 'Lomo Vetado Premium',
        descripcion: {
            corta: 'Lomo vetado de primera calidad',
            completa: 'Corte premium de vacuno con excelente marmoleo...'
        },
        precios: {
            base: '25990',
            descuentos: {
                regular: '5',
                transferencia: '10'
            }
        },
        infoCarne: {
            tipoCarne: 'VACUNO',
            corte: 'LOMO_VETADO',
            nombreArgentino: 'Bife Ancho',
            nombreChileno: 'Lomo Vetado',
            precioPorKg: '29990'
        },
        caracteristicasCarne: {
            color: 'ROJO_CEREZA',
            textura: ['TIERNA', 'JUGOSA'],
            porcentajeGrasa: '15',
            marmoleo: 4
        },
        peso: {
            esPesoVariable: true,
            pesoPromedio: '1.2',
            pesoMinimo: '1.0',
            pesoMaximo: '1.4'
        },
        empaque: {
            tipo: 'VACIO',
            unidadesPorCaja: '10',
            pesoCaja: '12'
        },
        origen: {
            pais: 'CHILE',
            region: 'Región Metropolitana',
            productor: 'Hacienda Cantabria',
            raza: 'ANGUS',
            maduracion: '21'
        },
        procesamiento: {
            fechaFaenado: '2024-03-20',
            fechaEnvasado: '2024-03-22',
            fechaVencimiento: '2024-04-22',
            numeroLote: 'LOT-2024-001'
        },
        estado: true,
        destacado: false,
    },
    common: {
        seo: {
            metaTitulo: 'Producto Premium - Hacienda Cantabria',
            metaDescripcion: 'Descubre nuestro producto premium de alta calidad...',
            palabrasClave: ['premium', 'calidad', 'gourmet']
        },
        infoAdicional: {
            marca: 'Hacienda Cantabria',
            certificaciones: ['HACCP', 'ISO_22000']
        },
        conservacion: {
            requiereRefrigeracion: true,
            requiereCongelacion: false,
            vidaUtil: '30',
            instrucciones: 'Mantener refrigerado entre 0°C y 4°C'
        },
        infoNutricional: {
            porcion: '100',
            calorias: '200',
            proteinas: '20',
            grasaTotal: '15',
            grasaSaturada: '5',
            colesterol: '50',
            sodio: '400',
            carbohidratos: '0'
        }
    }
};

export const TestingTools = ({ 
    onTestDataFill, 
    selectedType = 'ProductoAceite',
    selectedCategoria = 'ACEITE'
}) => {
    const [expanded, setExpanded] = useState(false);

    // Datos de prueba para un producto de aceite
    const aceiteTestData = {
        sku: 'TEST-AC-001',
        nombre: 'Aceite de Oliva Extra Virgen Test',
        categoria: 'ACEITE',
        descripcion: {
            corta: 'Aceite de oliva de prueba para desarrollo',
            completa: 'Este es un producto de prueba para desarrollo y testing.'
        },
        precios: {
            base: '12500',
            descuentos: {
                regular: 10
            }
        },
        infoAceite: {
            tipo: 'OLIVA',
            volumen: '500',
            envase: 'BOTELLA'
        },
        caracteristicasAceite: {
            aditivos: [],
            filtracion: 'FILTRADO',
            acidez: '0.3',
            extraccion: 'PRENSADO_FRIO'
        }
    };

    // Datos de prueba para un producto de carne
    const carneTestData = {
        sku: 'TEST-CA-001',
        nombre: 'Lomo Vetado Premium Test',
        categoria: 'CARNE',
        descripcion: {
            corta: 'Corte de carne de prueba',
            completa: 'Este es un producto de prueba para desarrollo y testing de carnes.'
        },
        precios: {
            base: '18500',
            descuentos: {
                regular: 5
            }
        },
        infoCarne: {
            tipoCarne: 'VACUNO',
            corte: 'LOMO_VETADO',
            nombreArgentino: 'Bife Ancho',
            nombreChileno: 'Lomo Vetado'
        },
        caracteristicasCarne: {
            porcentajeGrasa: '15',
            marmoleo: 3,
            color: 'ROJO_CEREZA',
            textura: ['TIERNA', 'JUGOSA']
        },
        opcionesPeso: {
            esPesoVariable: true,
            pesoPromedio: '0.8',
            pesoMinimo: '0.7',
            pesoMaximo: '0.9'
        }
    };

    // Añadir datos de prueba para condimentos
    const condimentoTestData = {
        sku: 'TEST-COND-001',
        nombre: 'Mix de Especias Premium Test',
        codigo: `CODE-COND-${Date.now()}`, // Solución temporal
        categoria: 'CONDIMENTO',
        tipoProducto: 'ProductoBase',
        tipoCondimento: 'Mezcla de Especias',
        contenidoNeto: 250,
        // Resto de datos de prueba para condimentos...
    };

    // Añadir datos de prueba para accesorios
    const accesorioTestData = {
        sku: 'TEST-ACC-001',
        nombre: 'Cuchillo para Carne Premium Test',
        codigo: `CODE-ACC-${Date.now()}`, // Solución temporal
        categoria: 'ACCESORIO',
        tipoProducto: 'ProductoBase',
        tipoAccesorio: 'Cuchillo',
        material: 'Acero Inoxidable',
        dimensiones: '30cm x 5cm',
        // Resto de datos de prueba para accesorios...
    };

    const handleFillAceite = () => {
        console.log('Cargando datos de prueba para aceite:', aceiteTestData);
        onTestDataFill(aceiteTestData);
        toast.success('Datos de prueba para aceite cargados');
    };

    const handleFillCarne = () => {
        console.log('Cargando datos de prueba para carne:', carneTestData);
        onTestDataFill(carneTestData);
        toast.success('Datos de prueba para carne cargados');
    };

    if (!expanded) {
        return (
            <button 
                className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg z-50"
                onClick={() => setExpanded(true)}
                title="Herramientas de prueba"
                aria-label="Herramientas de prueba"
            >
                🧪
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 w-64">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Herramientas de Prueba</h3>
                <button 
                    onClick={() => setExpanded(false)}
                    className="text-gray-400 hover:text-white"
                    aria-label="Cerrar"
                >
                    ✕
                </button>
            </div>
            
            <div className="space-y-2">
                <button
                    className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-2 px-3 rounded text-sm"
                    onClick={handleFillAceite}
                >
                    Cargar Aceite de Prueba
                </button>
                
                <button
                    className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-2 px-3 rounded text-sm"
                    onClick={handleFillCarne}
                >
                    Cargar Carne de Prueba
                </button>

                <button
                    className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-2 px-3 rounded text-sm"
                    onClick={() => onTestDataFill(condimentoTestData)}
                >
                    Cargar Condimento de Prueba
                </button>

                <button
                    className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-2 px-3 rounded text-sm"
                    onClick={() => onTestDataFill(accesorioTestData)}
                >
                    Cargar Accesorio de Prueba
                </button>
            </div>
            
            <p className="text-xs text-gray-400 mt-3">
                Estas opciones rellenan el formulario con datos de prueba para desarrollo y testing.
            </p>
        </div>
    );
};

TestingTools.propTypes = {
    onTestDataFill: PropTypes.func.isRequired,
    selectedType: PropTypes.string,
    selectedCategoria: PropTypes.string
};