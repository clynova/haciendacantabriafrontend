const products = [
  {
    _id: 1,
    name: "Llanta Michelin",
    description: "Llanta Michelin Pilot Sport 4 con tecnología de alto rendimiento para máximo agarre y durabilidad",
    price: 299.99,
    images: ["/images/products/llantaMichielin.png", "/images/products/tapetesGoma.png", "/images/products/3.webp"],
    categoryId: "65f4c3e21d41c89231c88e01", // ID ejemplo para categoría "neumaticos"
    stock: 15,
    brandId: "65f4c3e21d41c89231c88e10", // ID ejemplo para marca "Michelin"
    modelId: "65f4c3e21d41c89231c88e20", // ID ejemplo para modelo específico
  },
  {
    _id: 2,
    name: "Kit de Limpieza Automotriz",
    description: "Kit completo de limpieza que incluye shampoo, cera, microfibras y esponjas de aplicación",
    price: 45.99,
    images: ["/images/products/llantaMichielin.png", "/images/products/tapetesGoma.png", "/images/products/3.webp"],
    categoryId: "65f4c3e21d41c89231c88e02", // ID ejemplo para categoría "limpieza"
    stock: 30,
    brandId: "65f4c3e21d41c89231c88e11",
    modelId: null,
  },
  {
    _id: 3,
    name: "Tapetes de Goma",
    description: "Tapetes de goma resistentes y duraderos para proteger el interior del vehículo",
    price: 29.99,
    images: ["/images/products/llantaMichielin.png", "/images/products/tapetesGoma.png", "/images/products/3.webp"],
    categoryId: "65f4c3e21d41c89231c88e03", // ID ejemplo para categoría "accesorios"
    stock: 50,
    brandId: "65f4c3e21d41c89231c88e12",
    modelId: null,
  },
  {
    _id: 4,
    name: "Aceite Motor Sintético",
    description: "Aceite sintético de alta calidad para un rendimiento óptimo del motor",
    price: 89.99,
    images: ["/images/products/llantaMichielin.png", "/images/products/tapetesGoma.png", "/images/products/3.webp"],
    categoryId: "65f4c3e21d41c89231c88e04", // ID ejemplo para categoría "aceites"
    stock: 20,
    brandId: "65f4c3e21d41c89231c88e13",
    modelId: null,
  },
  {
    _id: 5,
    name: "Filtro de Aire K&N",
    description: "Filtro de aire de alto rendimiento para mejorar la eficiencia del motor",
    price: 59.99,
    images: ["/images/products/llantaMichielin.png", "/images/products/tapetesGoma.png", "/images/products/3.webp"],
    categoryId: "65f4c3e21d41c89231c88e05", // ID ejemplo para categoría "filtros"
    stock: 25,
    brandId: "65f4c3e21d41c89231c88e14",
    modelId: null,
  },
  {
    _id: 6,
    name: "Batería Bosch",
    description: "Batería de larga duración y alto rendimiento para todo tipo de vehículos",
    price: 159.99,
    images: ["/images/products/llantaMichielin.png", "/images/products/tapetesGoma.png", "/images/products/3.webp"],
    categoryId: "65f4c3e21d41c89231c88e06", // ID ejemplo para categoría "baterias"
    stock: 10,
    brandId: "65f4c3e21d41c89231c88e15",
    modelId: null,
  },
  {
    _id: 7,
    name: "Pastillas de Freno Brembo",
    description: "Pastillas de freno de alto rendimiento para una frenada segura y eficiente",
    price: 79.99,
    images: ["/images/products/llantaMichielin.png", "/images/products/tapetesGoma.png", "/images/products/3.webp"],
    categoryId: "65f4c3e21d41c89231c88e07", // ID ejemplo para categoría "frenos"
    stock: 40,
    brandId: "65f4c3e21d41c89231c88e16",
    modelId: null,
  },
  {
    _id: 8,
    name: "Amortiguadores Monroe",
    description: "Amortiguadores de alta calidad para una conducción suave y cómoda",
    price: 129.99,
    images: ["/images/products/llantaMichielin.png", "/images/products/tapetesGoma.png", "/images/products/3.webp"],
    categoryId: "65f4c3e21d41c89231c88e08", // ID ejemplo para categoría "suspension"
    stock: 15,
    brandId: "65f4c3e21d41c89231c88e17",
    modelId: null,
  },
  {
    _id: 9,
    name: "Cera Pulidora 3M",
    description: "Cera pulidora de alta calidad para un acabado brillante y duradero",
    price: 24.99,
    images: ["/images/products/llantaMichielin.png", "/images/products/tapetesGoma.png", "/images/products/3.webp"],
    categoryId: "65f4c3e21d41c89231c88e02", // ID ejemplo para categoría "limpieza"
    stock: 35,
    brandId: "65f4c3e21d41c89231c88e18",
    modelId: null,
  },
  {
    _id: 10,
    name: "Bujías NGK",
    description: "Bujías de alto rendimiento para una mejor combustión y eficiencia del motor",
    price: 15.99,
    images: ["/images/products/llantaMichielin.png", "/images/products/tapetesGoma.png", "/images/products/3.webp"],
    categoryId: "65f4c3e21d41c89231c88e09", // ID ejemplo para categoría "encendido"
    stock: 60,
    brandId: "65f4c3e21d41c89231c88e19",
    modelId: null,
  },
  {
    _id: 11,
    name: "Funda para Asiento",
    description: "Funda de asiento de alta calidad para proteger y embellecer el interior del vehículo",
    price: 34.99,
    images: ["/images/products/11.webp"],
    categoryId: "65f4c3e21d41c89231c88e03", // ID ejemplo para categoría "accesorios"
    stock: 45,
    brandId: "65f4c3e21d41c89231c88e20",
    modelId: null,
  },
  {
    _id: 12,
    name: "Anticongelante Prestone",
    description: "Anticongelante de alta calidad para proteger el sistema de refrigeración del vehículo",
    price: 19.99,
    images: ["/images/products/12.webp"],
    categoryId: "65f4c3e21d41c89231c88e10", // ID ejemplo para categoría "refrigeracion"
    stock: 50,
    brandId: "65f4c3e21d41c89231c88e21",
    modelId: null,
  },
  {
    _id: 13,
    name: "Kit de Herramientas Básico",
    description: "Kit de herramientas básico para realizar reparaciones y mantenimiento del vehículo",
    price: 149.99,
    images: ["/images/products/13.webp"],
    categoryId: "65f4c3e21d41c89231c88e11", // ID ejemplo para categoría "herramientas"
    stock: 20,
    brandId: "65f4c3e21d41c89231c88e22",
    modelId: null,
  },
  {
    _id: 14,
    name: "Sensor de Oxígeno Bosch",
    description: "Sensor de oxígeno de alta calidad para un rendimiento óptimo del motor",
    price: 89.99,
    images: ["/images/products/14.webp"],
    categoryId: "65f4c3e21d41c89231c88e12", // ID ejemplo para categoría "sensores"
    stock: 25,
    brandId: "65f4c3e21d41c89231c88e23",
    modelId: null,
  },
  {
    _id: 15,
    name: "Líquido de Frenos DOT 4",
    description: "Líquido de frenos de alta calidad para un rendimiento óptimo del sistema de frenos",
    price: 12.99,
    images: ["/images/products/15.webp"],
    categoryId: "65f4c3e21d41c89231c88e07", // ID ejemplo para categoría "frenos"
    stock: 40,
    brandId: "65f4c3e21d41c89231c88e24",
    modelId: null,
  },
  {
    _id: 16,
    name: "Correa de Distribución Gates",
    description: "Correa de distribución de alta calidad para un rendimiento óptimo del motor",
    price: 45.99,
    images: ["/images/products/16.webp"],
    categoryId: "65f4c3e21d41c89231c88e13", // ID ejemplo para categoría "motor"
    stock: 30,
    brandId: "65f4c3e21d41c89231c88e25",
    modelId: null,
  },
  {
    _id: 17,
    name: "Bomba de Agua GMB",
    description: "Bomba de agua de alta calidad para un rendimiento óptimo del sistema de refrigeración",
    price: 69.99,
    images: ["/images/products/17.webp"],
    categoryId: "65f4c3e21d41c89231c88e10", // ID ejemplo para categoría "refrigeracion"
    stock: 20,
    brandId: "65f4c3e21d41c89231c88e26",
    modelId: null,
  },
  {
    _id: 18,
    name: "Luz LED para Faro",
    description: "Luz LED de alta calidad para una mejor visibilidad y seguridad en la conducción",
    price: 39.99,
    images: ["/images/products/18.webp"],
    categoryId: "65f4c3e21d41c89231c88e14", // ID ejemplo para categoría "iluminacion"
    stock: 50,
    brandId: "65f4c3e21d41c89231c88e27",
    modelId: null,
  },
  {
    _id: 19,
    name: "Filtro de Aceite Mann",
    description: "Filtro de aceite de alta calidad para un rendimiento óptimo del motor",
    price: 14.99,
    images: ["/images/products/19.webp"],
    categoryId: "65f4c3e21d41c89231c88e05", // ID ejemplo para categoría "filtros"
    stock: 35,
    brandId: "65f4c3e21d41c89231c88e28",
    modelId: null,
  },
  {
    _id: 20,
    name: "Embellecedor de Neumáticos",
    description: "Producto especializado para dar brillo y protección a los neumáticos",
    price: 16.99,
    images: ["/images/products/20.webp"],
    categoryId: "65f4c3e21d41c89231c88e02", // ID ejemplo para categoría "limpieza"
    stock: 45,
    brandId: "65f4c3e21d41c89231c88e19",
    modelId: null,
  }
];

export { products };
