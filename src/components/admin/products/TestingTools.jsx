import React from 'react';
import PropTypes from 'prop-types';

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

export const TestingTools = ({ onFill, selectedType }) => {
    const handleFill = () => {
        const baseData = mockData[selectedType === 'ProductoAceite' ? 'aceite' : 'carne'];
        const commonData = mockData.common;
        onFill({ ...baseData, ...commonData });
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="flex flex-col gap-2">
                <button
                    type="button"
                    onClick={handleFill}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    Rellenar con Datos de Prueba
                </button>
            </div>
        </div>
    );
};

TestingTools.propTypes = {
    onFill: PropTypes.func.isRequired,
    selectedType: PropTypes.oneOf(['ProductoAceite', 'ProductoCarne']).isRequired
};