import api from "./api";

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