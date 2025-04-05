import api from "./api";


/* Example response getProductById productType: ProductoCarne{
    "success": true,
    "msg": "Producto enviado",
    "product": {
        "infoCarne": {
            "tipoCarne": "VACUNO",
            "corte": "BIFE_ANGOSTO",
            "nombreArgentino": "Bife Angosto",
            "nombreChileno": "Lomo Vetado"
        },
        "caracteristicas": {
            "porcentajeGrasa": 8,
            "marmoleo": 3,
            "color": "Rojo brillante",
            "textura": [
                "Tierna",
                "Jugosa"
            ]
        },
        "infoNutricional": {
            "porcion": "100g",
            "calorias": 250,
            "proteinas": 26,
            "grasaTotal": 15,
            "grasaSaturada": 6,
            "colesterol": 75,
            "sodio": 50,
            "carbohidratos": 0
        },
        "coccion": {
            "metodos": [
                "PARRILLA",
                "SARTEN",
                "HORNO"
            ],
            "temperaturaIdeal": "200°C",
            "tiempoEstimado": "7 minutos por lado",
            "consejos": [
                "Dejar reposar 5 minutos antes de servir.",
                "Sazonar con sal justo antes de cocinar."
            ],
            "recetas": [
                {
                    "nombre": "Bife Angosto al Malbec",
                    "url": "https://ejemplo.com/recetas/bife-angosto-malbec",
                    "descripcion": "Una receta clásica argentina con vino Malbec.",
                    "_id": "67f087c0ddc8c38ace4961f3"
                }
            ]
        },
        "empaque": {
            "tipo": "VACIO",
            "unidadesPorCaja": 10,
            "pesoCaja": 10
        },
        "origen": {
            "pais": "Argentina",
            "region": "Pampa Húmeda",
            "productor": "Carnes Premium S.A.",
            "raza": "Angus",
            "maduracion": "21 días"
        },
        "procesamiento": {
            "fechaFaenado": "2023-09-01T10:00:00.000Z",
            "fechaEnvasado": "2023-09-02T10:00:00.000Z",
            "fechaVencimiento": "2023-09-10T10:00:00.000Z",
            "numeroLote": "LOTE-BIFE-001"
        },
        "descripcion": {
            "corta": "Un corte argentino clásico, ideal para asados.",
            "completa": "El bife angosto es un corte magro y tierno, perfecto para parrillas o planchas."
        },
        "multimedia": {
            "imagenes": [
                {
                    "url": "https://res-console.cloudinary.com/djgegk8jp/media_explorer_thumbnails/cedbe657dafb02e19fffa457d73437d0/detailed",
                    "textoAlternativo": "Bife angosto fresco",
                    "esPrincipal": true,
                    "_id": "67f087c0ddc8c38ace4961f0",
                    "id": "67f087c0ddc8c38ace4961f0"
                }
            ],
            "video": "https://ejemplo.com/videos/bife-angosto.mp4"
        },
        "seo": {
            "metaTitulo": "Bife Angosto - Corte Argentino Fresco",
            "metaDescripcion": "Compra bife angosto fresco y de alta calidad. Ideal para asados y parrillas.",
            "palabrasClave": [
                "bife angosto",
                "corte argentino",
                "carne vacuna"
            ]
        },
        "infoAdicional": {
            "origen": "Argentina",
            "marca": "Carnes Premium",
            "certificaciones": [
                "Certificación Orgánica",
                "Libre de Hormonas"
            ]
        },
        "conservacion": {
            "requiereRefrigeracion": true,
            "requiereCongelacion": false,
            "vidaUtil": "7 días",
            "instrucciones": "Mantener refrigerado a una temperatura entre 0°C y 4°C."
        },
        "opcionesPeso": {
            "esPesoVariable": true,
            "pesoPromedio": 1.2,
            "pesoMinimo": 1,
            "pesoMaximo": 2,
            "pesosEstandar": [
                {
                    "descuentos": {
                        "regular": 10
                    },
                    "peso": 500,
                    "unidad": "g",
                    "esPredeterminado": false,
                    "precio": 2500,
                    "sku": "CARNE-001-500G",
                    "stockDisponible": 30,
                    "umbralStockBajo": 5,
                    "ultimaActualizacion": "2023-10-01T10:00:00.000Z",
                    "_id": "67f087c0ddc8c38ace4961f1",
                    "id": "67f087c0ddc8c38ace4961f1"
                },
                {
                    "descuentos": {
                        "regular": 15
                    },
                    "peso": 1,
                    "unidad": "kg",
                    "esPredeterminado": true,
                    "precio": 5000,
                    "sku": "CARNE-001-1KG",
                    "stockDisponible": 20,
                    "umbralStockBajo": 5,
                    "ultimaActualizacion": "2023-10-01T10:00:00.000Z",
                    "_id": "67f087c0ddc8c38ace4961f2",
                    "id": "67f087c0ddc8c38ace4961f2"
                }
            ],
            "rangosPreferidos": []
        },
        "_id": "67f087c0ddc8c38ace4961ef",
        "sku": "CARNE-001",
        "nombre": "Bife Angosto",
        "slug": "bife-angosto",
        "categoria": "CARNE",
        "estado": true,
        "destacado": true,
        "tags": [
            "carne vacuna",
            "asado",
            "parrilla"
        ],
        "tipoProducto": "ProductoCarne",
        "fechaCreacion": "2025-04-05T01:30:40.686Z",
        "fechaActualizacion": "2025-04-05T01:30:40.687Z",
        "__v": 0,
        "precioVariantesPorPeso": [
            {
                "pesoId": "67f087c0ddc8c38ace4961f1",
                "peso": 500,
                "unidad": "g",
                "precio": 2500,
                "descuento": 10,
                "precioFinal": 2250,
                "stockDisponible": 30,
                "esPredeterminado": false,
                "sku": "CARNE-001-500G"
            },
            {
                "pesoId": "67f087c0ddc8c38ace4961f2",
                "peso": 1,
                "unidad": "kg",
                "precio": 5000,
                "descuento": 15,
                "precioFinal": 4250,
                "stockDisponible": 20,
                "esPredeterminado": true,
                "sku": "CARNE-001-1KG"
            }
        ],
        "variantePredeterminada": {
            "pesoId": "67f087c0ddc8c38ace4961f2",
            "peso": 1,
            "unidad": "kg",
            "precio": 5000,
            "descuento": 15,
            "precioFinal": 4250,
            "stockDisponible": 20,
            "esPredeterminado": true,
            "sku": "CARNE-001-1KG"
        }
    }
}

example response productType: ProductoAceite

{
    "success": true,
    "msg": "Producto enviado",
    "product": {
        "infoAceite": {
            "tipo": "OLIVA",
            "envase": "BOTELLA"
        },
        "caracteristicas": {
            "aditivos": [],
            "filtracion": "Filtrado fino",
            "acidez": "0.3%",
            "extraccion": "Prensado en frío"
        },
        "infoNutricional": {
            "porcion": "15ml",
            "calorias": 120,
            "grasaTotal": 14,
            "grasaSaturada": 2,
            "grasaTrans": 0,
            "grasaPoliinsaturada": 1.5,
            "grasaMonoinsaturada": 10
        },
        "produccion": {
            "metodo": "Prensado en frío",
            "temperatura": "Menos de 27°C",
            "fechaEnvasado": "2023-08-01T10:00:00.000Z",
            "fechaVencimiento": "2024-08-01T10:00:00.000Z"
        },
        "descripcion": {
            "corta": "Aceite de oliva extra virgen, ideal para ensaladas y cocina saludable.",
            "completa": "Nuestro aceite de oliva extra virgen proviene de olivares seleccionados y se prensa en frío para preservar sus propiedades."
        },
        "multimedia": {
            "imagenes": [
                {
                    "url": "https://res-console.cloudinary.com/djgegk8jp/media_explorer_thumbnails/40161b980d1f9033380ccfecd2bf4f23/detailed",
                    "textoAlternativo": "Botella de aceite de oliva",
                    "esPrincipal": true,
                    "_id": "67f087e3ddc8c38ace4961fc",
                    "id": "67f087e3ddc8c38ace4961fc"
                }
            ],
            "video": "https://ejemplo.com/videos/aceite-oliva.mp4"
        },
        "seo": {
            "metaTitulo": "Aceite de Oliva Extra Virgen - Prensado en Frío",
            "metaDescripcion": "Compra aceite de oliva extra virgen de alta calidad. Ideal para ensaladas y cocina saludable.",
            "palabrasClave": [
                "aceite de oliva",
                "extra virgen",
                "saludable"
            ]
        },
        "infoAdicional": {
            "origen": "España",
            "marca": "Olivos Premium",
            "certificaciones": [
                "Certificación Orgánica",
                "Extra Virgen Garantizado"
            ]
        },
        "conservacion": {
            "requiereRefrigeracion": false,
            "requiereCongelacion": false,
            "vidaUtil": "12 meses",
            "instrucciones": "Mantener en un lugar fresco y seco, alejado de la luz solar directa."
        },
        "opcionesPeso": {
            "esPesoVariable": false,
            "pesosEstandar": [
                {
                    "descuentos": {
                        "regular": 5
                    },
                    "peso": 500,
                    "unidad": "ml",
                    "esPredeterminado": false,
                    "precio": 1500,
                    "sku": "ACEITE-001-500ML",
                    "stockDisponible": 50,
                    "umbralStockBajo": 10,
                    "ultimaActualizacion": "2023-10-01T10:00:00.000Z",
                    "_id": "67f087e3ddc8c38ace4961fd",
                    "id": "67f087e3ddc8c38ace4961fd"
                },
                {
                    "descuentos": {
                        "regular": 5
                    },
                    "peso": 1,
                    "unidad": "L",
                    "esPredeterminado": true,
                    "precio": 3000,
                    "sku": "ACEITE-001-1L",
                    "stockDisponible": 30,
                    "umbralStockBajo": 10,
                    "ultimaActualizacion": "2023-10-01T10:00:00.000Z",
                    "_id": "67f087e3ddc8c38ace4961fe",
                    "id": "67f087e3ddc8c38ace4961fe"
                }
            ],
            "rangosPreferidos": []
        },
        "_id": "67f087e3ddc8c38ace4961fb",
        "sku": "ACEITE-001",
        "nombre": "Aceite de Oliva Extra Virgen",
        "slug": "aceite-de-oliva-extra-virgen",
        "categoria": "ACEITE",
        "estado": true,
        "destacado": true,
        "tags": [
            "aceite de oliva",
            "cocina saludable",
            "ensaladas"
        ],
        "tipoProducto": "ProductoAceite",
        "usosRecomendados": [
            "Ensaladas",
            "Cocina saludable",
            "Salsas"
        ],
        "fechaCreacion": "2025-04-05T01:31:15.404Z",
        "fechaActualizacion": "2025-04-05T01:31:15.404Z",
        "__v": 0,
        "precioVariantesPorPeso": [
            {
                "pesoId": "67f087e3ddc8c38ace4961fd",
                "peso": 500,
                "unidad": "ml",
                "precio": 1500,
                "descuento": 5,
                "precioFinal": 1425,
                "stockDisponible": 50,
                "esPredeterminado": false,
                "sku": "ACEITE-001-500ML"
            },
            {
                "pesoId": "67f087e3ddc8c38ace4961fe",
                "peso": 1,
                "unidad": "L",
                "precio": 3000,
                "descuento": 5,
                "precioFinal": 2850,
                "stockDisponible": 30,
                "esPredeterminado": true,
                "sku": "ACEITE-001-1L"
            }
        ],
        "variantePredeterminada": {
            "pesoId": "67f087e3ddc8c38ace4961fe",
            "peso": 1,
            "unidad": "L",
            "precio": 3000,
            "descuento": 5,
            "precioFinal": 2850,
            "stockDisponible": 30,
            "esPredeterminado": true,
            "sku": "ACEITE-001-1L"
        }
    }
}

*/

const getProductById = async (_IdOrSlug) => {
    try {
        // Si el ID es un objeto, intentar extraer el _id
        const productId = typeof _IdOrSlug === 'object' ? _IdOrSlug._id : _IdOrSlug;

        if (!productId) {
            throw new Error('ID o slug de producto inválido');
        }

        const response = await api.get(`/api/product/${productId}`);
        if (!response.data) {
            throw new Error('No se recibieron datos del servidor');
        }
        if (!response.data.success) {
            throw new Error(response.data.msg || 'Error al obtener el producto');
        }
        return response.data;
    }
    catch (error) {
        if (error.response?.data) {
            throw error.response.data;
        }
        return {
            success: false,
            msg: error.message || 'Error al obtener el producto',
            product: null
        };
    }
}

const searchProducts = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();

        // Add filters to query params
        if (filters.categoria) {
            queryParams.append('categoria', filters.categoria);
        }

        // Always get active products
        queryParams.append('estado', 'active');

        const response = await api.get(`/api/product/active?${queryParams.toString()}`);

        if (!response.data) {
            throw new Error('No se recibieron datos del servidor');
        }

        return {
            success: true,
            products: response.data.products || [],
            total: response.data.total || 0
        };
    } catch (error) {
        return {
            success: false,
            products: [],
            total: 0,
            error: error.response?.data?.message || error.message || 'Error al buscar productos'
        };
    }
};

const getTopProducts = async (limit = 10) => {
    try {
        const response = await api.get(`/api/util/top-products?limit=${limit}`);

        if (!response.data || !response.data.success) {
            throw new Error('No se recibieron datos del servidor');
        }

        // Get full product details for each top product
        const productDetailsPromises = response.data.data.map(async (item) => {
            try {
                const productResponse = await api.get(`/api/product/${item._id}`);
                if (productResponse.data && productResponse.data.success) {
                    return {
                        ...productResponse.data.product,
                        totalVendido: item.totalVendido,
                        totalIngresos: item.totalIngresos
                    };
                }
                return null;
            } catch (error) {
                return null;
            }
        });

        const products = (await Promise.all(productDetailsPromises))
            .filter(product => product !== null);

        return {
            success: true,
            products: products,
            total: products.length
        };
    } catch (error) {
        return {
            success: false,
            products: [],
            total: 0,
            error: error.response?.data?.message || error.message || 'Error al obtener los productos más vendidos'
        };
    }
};


// /api/tags/products/all?tags=Destacado&limit=8 

/* example response  getProductsByTags {
    "success": true,
    "msg": "Productos que coinciden con todas las etiquetas",
    "count": 2,
    "products": [
        {
            "infoCarne": {
                "tipoCarne": "VACUNO",
                "corte": "BIFE_ANGOSTO",
                "nombreArgentino": "Bife Angosto",
                "nombreChileno": "Lomo Vetado"
            },
            "caracteristicas": {
                "porcentajeGrasa": 8,
                "marmoleo": 3,
                "color": "Rojo brillante",
                "textura": [
                    "Tierna",
                    "Jugosa"
                ]
            },
            "infoNutricional": {
                "porcion": "100g",
                "calorias": 250,
                "proteinas": 26,
                "grasaTotal": 15,
                "grasaSaturada": 6,
                "colesterol": 75,
                "sodio": 50,
                "carbohidratos": 0
            },
            "coccion": {
                "metodos": [
                    "PARRILLA",
                    "SARTEN",
                    "HORNO"
                ],
                "temperaturaIdeal": "200°C",
                "tiempoEstimado": "7 minutos por lado",
                "consejos": [
                    "Dejar reposar 5 minutos antes de servir.",
                    "Sazonar con sal justo antes de cocinar."
                ],
                "recetas": [
                    {
                        "nombre": "Bife Angosto al Malbec",
                        "url": "https://ejemplo.com/recetas/bife-angosto-malbec",
                        "descripcion": "Una receta clásica argentina con vino Malbec.",
                        "_id": "67f087c0ddc8c38ace4961f3"
                    }
                ]
            },
            "empaque": {
                "tipo": "VACIO",
                "unidadesPorCaja": 10,
                "pesoCaja": 10
            },
            "origen": {
                "pais": "Argentina",
                "region": "Pampa Húmeda",
                "productor": "Carnes Premium S.A.",
                "raza": "Angus",
                "maduracion": "21 días"
            },
            "procesamiento": {
                "fechaFaenado": "2023-09-01T10:00:00.000Z",
                "fechaEnvasado": "2023-09-02T10:00:00.000Z",
                "fechaVencimiento": "2023-09-10T10:00:00.000Z",
                "numeroLote": "LOTE-BIFE-001"
            },
            "descripcion": {
                "corta": "Un corte argentino clásico, ideal para asados.",
                "completa": "El bife angosto es un corte magro y tierno, perfecto para parrillas o planchas."
            },
            "multimedia": {
                "imagenes": [
                    {
                        "url": "https://res-console.cloudinary.com/djgegk8jp/media_explorer_thumbnails/cedbe657dafb02e19fffa457d73437d0/detailed",
                        "textoAlternativo": "Bife angosto fresco",
                        "esPrincipal": true,
                        "_id": "67f087c0ddc8c38ace4961f0",
                        "id": "67f087c0ddc8c38ace4961f0"
                    }
                ],
                "video": "https://ejemplo.com/videos/bife-angosto.mp4"
            },
            "seo": {
                "metaTitulo": "Bife Angosto - Corte Argentino Fresco",
                "metaDescripcion": "Compra bife angosto fresco y de alta calidad. Ideal para asados y parrillas.",
                "palabrasClave": [
                    "bife angosto",
                    "corte argentino",
                    "carne vacuna"
                ]
            },
            "infoAdicional": {
                "origen": "Argentina",
                "marca": "Carnes Premium",
                "certificaciones": [
                    "Certificación Orgánica",
                    "Libre de Hormonas"
                ]
            },
            "conservacion": {
                "requiereRefrigeracion": true,
                "requiereCongelacion": false,
                "vidaUtil": "7 días",
                "instrucciones": "Mantener refrigerado a una temperatura entre 0°C y 4°C."
            },
            "opcionesPeso": {
                "esPesoVariable": true,
                "pesoPromedio": 1.2,
                "pesoMinimo": 1,
                "pesoMaximo": 2,
                "pesosEstandar": [
                    {
                        "descuentos": {
                            "regular": 10
                        },
                        "peso": 500,
                        "unidad": "g",
                        "esPredeterminado": false,
                        "precio": 2500,
                        "sku": "CARNE-001-500G",
                        "stockDisponible": 30,
                        "umbralStockBajo": 5,
                        "ultimaActualizacion": "2023-10-01T10:00:00.000Z",
                        "_id": "67f087c0ddc8c38ace4961f1",
                        "id": "67f087c0ddc8c38ace4961f1"
                    },
                    {
                        "descuentos": {
                            "regular": 15
                        },
                        "peso": 1,
                        "unidad": "kg",
                        "esPredeterminado": true,
                        "precio": 5000,
                        "sku": "CARNE-001-1KG",
                        "stockDisponible": 20,
                        "umbralStockBajo": 5,
                        "ultimaActualizacion": "2023-10-01T10:00:00.000Z",
                        "_id": "67f087c0ddc8c38ace4961f2",
                        "id": "67f087c0ddc8c38ace4961f2"
                    }
                ],
                "rangosPreferidos": []
            },
            "_id": "67f087c0ddc8c38ace4961ef",
            "sku": "CARNE-001",
            "nombre": "Bife Angosto",
            "slug": "bife-angosto",
            "categoria": "CARNE",
            "estado": true,
            "destacado": true,
            "tags": [
                "carne vacuna",
                "asado",
                "parrilla",
                "Destacado"
            ],
            "tipoProducto": "ProductoCarne",
            "fechaCreacion": "2025-04-05T01:30:40.686Z",
            "fechaActualizacion": "2025-04-05T12:19:35.529Z",
            "__v": 1,
            "precioVariantesPorPeso": [
                {
                    "pesoId": "67f087c0ddc8c38ace4961f1",
                    "peso": 500,
                    "unidad": "g",
                    "precio": 2500,
                    "descuento": 10,
                    "precioFinal": 2250,
                    "stockDisponible": 30,
                    "esPredeterminado": false,
                    "sku": "CARNE-001-500G"
                },
                {
                    "pesoId": "67f087c0ddc8c38ace4961f2",
                    "peso": 1,
                    "unidad": "kg",
                    "precio": 5000,
                    "descuento": 15,
                    "precioFinal": 4250,
                    "stockDisponible": 20,
                    "esPredeterminado": true,
                    "sku": "CARNE-001-1KG"
                }
            ],
            "variantePredeterminada": {
                "pesoId": "67f087c0ddc8c38ace4961f2",
                "peso": 1,
                "unidad": "kg",
                "precio": 5000,
                "descuento": 15,
                "precioFinal": 4250,
                "stockDisponible": 20,
                "esPredeterminado": true,
                "sku": "CARNE-001-1KG"
            }
        },
        {
            "infoAceite": {
                "tipo": "OLIVA",
                "envase": "BOTELLA"
            },
            "caracteristicas": {
                "aditivos": [],
                "filtracion": "Filtrado fino",
                "acidez": "0.3%",
                "extraccion": "Prensado en frío"
            },
            "infoNutricional": {
                "porcion": "15ml",
                "calorias": 120,
                "grasaTotal": 14,
                "grasaSaturada": 2,
                "grasaTrans": 0,
                "grasaPoliinsaturada": 1.5,
                "grasaMonoinsaturada": 10
            },
            "produccion": {
                "metodo": "Prensado en frío",
                "temperatura": "Menos de 27°C",
                "fechaEnvasado": "2023-08-01T10:00:00.000Z",
                "fechaVencimiento": "2024-08-01T10:00:00.000Z"
            },
            "descripcion": {
                "corta": "Aceite de oliva extra virgen, ideal para ensaladas y cocina saludable.",
                "completa": "Nuestro aceite de oliva extra virgen proviene de olivares seleccionados y se prensa en frío para preservar sus propiedades."
            },
            "multimedia": {
                "imagenes": [
                    {
                        "url": "https://res-console.cloudinary.com/djgegk8jp/media_explorer_thumbnails/40161b980d1f9033380ccfecd2bf4f23/detailed",
                        "textoAlternativo": "Botella de aceite de oliva",
                        "esPrincipal": true,
                        "_id": "67f087e3ddc8c38ace4961fc",
                        "id": "67f087e3ddc8c38ace4961fc"
                    }
                ],
                "video": "https://ejemplo.com/videos/aceite-oliva.mp4"
            },
            "seo": {
                "metaTitulo": "Aceite de Oliva Extra Virgen - Prensado en Frío",
                "metaDescripcion": "Compra aceite de oliva extra virgen de alta calidad. Ideal para ensaladas y cocina saludable.",
                "palabrasClave": [
                    "aceite de oliva",
                    "extra virgen",
                    "saludable"
                ]
            },
            "infoAdicional": {
                "origen": "España",
                "marca": "Olivos Premium",
                "certificaciones": [
                    "Certificación Orgánica",
                    "Extra Virgen Garantizado"
                ]
            },
            "conservacion": {
                "requiereRefrigeracion": false,
                "requiereCongelacion": false,
                "vidaUtil": "12 meses",
                "instrucciones": "Mantener en un lugar fresco y seco, alejado de la luz solar directa."
            },
            "opcionesPeso": {
                "esPesoVariable": false,
                "pesosEstandar": [
                    {
                        "descuentos": {
                            "regular": 5
                        },
                        "peso": 500,
                        "unidad": "ml",
                        "esPredeterminado": false,
                        "precio": 1500,
                        "sku": "ACEITE-001-500ML",
                        "stockDisponible": 50,
                        "umbralStockBajo": 10,
                        "ultimaActualizacion": "2023-10-01T10:00:00.000Z",
                        "_id": "67f087e3ddc8c38ace4961fd",
                        "id": "67f087e3ddc8c38ace4961fd"
                    },
                    {
                        "descuentos": {
                            "regular": 5
                        },
                        "peso": 1,
                        "unidad": "L",
                        "esPredeterminado": true,
                        "precio": 3000,
                        "sku": "ACEITE-001-1L",
                        "stockDisponible": 30,
                        "umbralStockBajo": 10,
                        "ultimaActualizacion": "2023-10-01T10:00:00.000Z",
                        "_id": "67f087e3ddc8c38ace4961fe",
                        "id": "67f087e3ddc8c38ace4961fe"
                    }
                ],
                "rangosPreferidos": []
            },
            "_id": "67f087e3ddc8c38ace4961fb",
            "sku": "ACEITE-001",
            "nombre": "Aceite de Oliva Extra Virgen",
            "slug": "aceite-de-oliva-extra-virgen",
            "categoria": "ACEITE",
            "estado": true,
            "destacado": true,
            "tags": [
                "aceite de oliva",
                "cocina saludable",
                "ensaladas",
                "Destacado"
            ],
            "tipoProducto": "ProductoAceite",
            "usosRecomendados": [
                "Ensaladas",
                "Cocina saludable",
                "Salsas"
            ],
            "fechaCreacion": "2025-04-05T01:31:15.404Z",
            "fechaActualizacion": "2025-04-05T12:19:53.079Z",
            "__v": 1,
            "precioVariantesPorPeso": [
                {
                    "pesoId": "67f087e3ddc8c38ace4961fd",
                    "peso": 500,
                    "unidad": "ml",
                    "precio": 1500,
                    "descuento": 5,
                    "precioFinal": 1425,
                    "stockDisponible": 50,
                    "esPredeterminado": false,
                    "sku": "ACEITE-001-500ML"
                },
                {
                    "pesoId": "67f087e3ddc8c38ace4961fe",
                    "peso": 1,
                    "unidad": "L",
                    "precio": 3000,
                    "descuento": 5,
                    "precioFinal": 2850,
                    "stockDisponible": 30,
                    "esPredeterminado": true,
                    "sku": "ACEITE-001-1L"
                }
            ],
            "variantePredeterminada": {
                "pesoId": "67f087e3ddc8c38ace4961fe",
                "peso": 1,
                "unidad": "L",
                "precio": 3000,
                "descuento": 5,
                "precioFinal": 2850,
                "stockDisponible": 30,
                "esPredeterminado": true,
                "sku": "ACEITE-001-1L"
            }
        }
    ]
} */

const getProductsByTags = async (tags, limit = 8) => { 
    try {
        const response = await api.get(`/api/tags/products/all?tags=${tags}&limit=${limit}`);
        if (!response.data) {
            throw new Error('No se recibieron datos del servidor');
        }
        if (!response.data.success) {
            throw new Error(response.data.msg || 'Error al obtener los productos por etiquetas');
        }
        return {
            success: true,
            msg: response.data.msg,
            count: response.data.count || 0,
            products: response.data.products || []
        };
    } catch (error) {
        return {
            success: false,
            msg: error.response?.data?.message || error.message || 'Error al obtener los productos por etiquetas',
            count: 0,
            products: []
        };
    }
};





export { getProductById, searchProducts, getTopProducts, getProductsByTags };