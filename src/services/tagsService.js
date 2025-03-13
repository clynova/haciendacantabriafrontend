import api from "./api";

// URL SOLICITADA {{dev_url}}/api/tags/products?tags=eco-friendly,oferta&matchAll=false
/*
   Response
{
    "success": true,
    "msg": "Productos que coinciden con al menos una etiqueta",
    "count": 2,
    "products": [
        {
            "_id": "67d069fa853cafffd5f0f2d6",
            "name": "Tapetes de Goma Premium",
            "description": "Tapetes resistentes al agua y al polvo, ideales para cualquier clima.",
            "price": 5000,
            "images": [
                "images/products/llantaMichielin.png",
                "images/products/llantaMichielin.png"
            ],
            "stock": 29,
            "tags": [
                "oferta",
                "eco-friendly"
            ],
            "createdAt": "2025-03-11T16:51:06.100Z",
            "updatedAt": "2025-03-11T18:21:33.340Z",
            "__v": 0
        },
        {
            "_id": "67d06a30853cafffd5f0f2ea",
            "name": "Soporte para Celular Magnético",
            "description": "Soporte ajustable con imán de alta resistencia para el tablero.",
            "price": 20000,
            "images": [
                "images/products/llantaMichielin.png",
                "images/products/llantaMichielin.png"
            ],
            "stock": 49,
            "tags": [
                "tecnología",
                "oferta"
            ],
            "createdAt": "2025-03-11T16:52:00.983Z",
            "updatedAt": "2025-03-11T18:21:33.549Z",
            "__v": 0
        }
    ]
}

*/

const getProductsByTags = async (tags, matchAll = true) => {
  try {
    const response = await api.get(`/api/tags/products?tags=${tags}&matchAll=${matchAll}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by tags:', error);
    return null;
  }
}

export { getProductsByTags };