import api from "./api";

export const getAllTags = async () => {
  try {
    const response = await api.get('/api/tags');
    return {
      success: true,
      tags: response.data.tags || []
    };
  } catch (error) {
    return {
      success: false,
      tags: [],
      error: error.response?.data?.message || 'Error al obtener etiquetas'
    };
  }
};

export const getProductsByTags = async (tags, matchAll = true) => {
  try {
    const queryParams = new URLSearchParams();
    if (Array.isArray(tags)) {
      tags.forEach(tag => queryParams.append('tags', tag));
    } else {
      queryParams.append('tags', tags);
    }
    queryParams.append('matchAll', matchAll);

    const response = await api.get(`/api/tags/products?${queryParams.toString()}`);
    return {
      success: true,
      products: response.data.products || []
    };
  } catch (error) {
    return {
      success: false,
      products: [],
      error: error.response?.data?.message || 'Error al buscar productos por etiquetas'
    };
  }
};