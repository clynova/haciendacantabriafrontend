import api from './api';


export const createQuotation = async (quotationData, token) => {
    try {
        const response = await api.post('/api/quotations', quotationData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating quotation:', error);
        throw error.response?.data || error;
    }
};

/**
 * Get a list of quotations for the current user
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} List of quotations
 */
export const getQuotations = async (token) => {
    try {
        const response = await api.get('/api/quotations', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching quotations:', error);
        throw error.response?.data || error;
    }
};

/**
 * Get a specific quotation by ID
 * @param {string} quotationId - The ID of the quotation to fetch
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} The quotation data
 */
export const getQuotationById = async (quotationId, token) => {
    try {
        const response = await api.get(`/api/quotations/${quotationId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching quotation:', error);
        throw error.response?.data || error;
    }
};

/**
 * Cancel a quotation
 * @param {string} quotationId - The ID of the quotation to cancel
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} The cancelled quotation data
 */
export const cancelQuotation = async (quotationId, token) => {
    try {
        const response = await api.patch(`/api/quotations/${quotationId}/cancel`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error cancelling quotation:', error);
        throw error.response?.data || error;
    }
};