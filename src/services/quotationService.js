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

export const getQuotations = async (token) => {
    try {
        const response = await api.get('/api/quotations/user', {
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

export const getAllQuotations = async (token) => {
    try {
        const response = await api.get('/api/quotations/all', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching all quotations:', error);
        throw error.response?.data || error;
    }
}

export const updateQuotation = async (_id, updatedData, token) => {
    try {
        const response = await api.put(`/api/quotations/${_id}`, updatedData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating quotation:', error);
        throw error.response?.data || error;
    }
};