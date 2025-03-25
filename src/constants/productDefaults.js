export const PRODUCT_TYPES = {
    ACEITE: 'ACEITE',
    CARNE: 'CARNE'
};

export const DEFAULT_VALUES = {
    common: {
        estado: true,
        destacado: false,
        tags: [], // Add this line
        descripcion: { corta: '', completa: '' },
        multimedia: { imagenes: [] },
        precios: { base: 0, descuentos: { regular: 0, transferencia: 0 } },
        inventario: { stockUnidades: 0, umbralStockBajo: 0 },
        conservacion: {
            requiereRefrigeracion: false,
            requiereCongelacion: false,
            vidaUtil: '',
            instrucciones: ''
        },
        seo: {
            metaTitle: '',
            metaDescription: '',
            keywords: [],
            slug: ''
        }
    },
    [PRODUCT_TYPES.ACEITE]: {
        categoria: PRODUCT_TYPES.ACEITE,
        tipoProducto: 'ProductoAceite',
        infoAceite: {
            tipo: '',
            volumen: 0,
            envase: '',
            acidez: 0,
            origen: ''
        }
    },
    [PRODUCT_TYPES.CARNE]: {
        categoria: PRODUCT_TYPES.CARNE,
        tipoProducto: 'ProductoCarne',
        infoCarne: {
            tipoCarne: '',
            corte: '',
            precioPorKg: 0,
            nombreChileno: '',
            nombreArgentino: '',
            coccion: {
                metodos: [],
                temperaturaRecomendada: '',
                tiempoCoccion: ''
            }
        }
    }
};