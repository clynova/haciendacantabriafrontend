import axios from 'axios';
import api from "./api";

const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "hacienda_cantabria"); // Custom upload preset name

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/djgegk8jp/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data)
    if (data.error) {
      console.error("Error de Cloudinary:", data.error.message);
      return null;
    }
    return data.secure_url;
  } catch (error) {
    console.error("Error subiendo la imagen:", error);
    return null;
  }
};


const sendContactForm = async (formData) => {
  try {

    const response = await api.post(`/api/util/contact`, formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


const enviarEmailConfirmacionOrden = async (orderId, token) => {
  try {
    const response = await api.get(`/api/util/send-emailOrder/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

// pdfFile email documentType token
// /api/util/send-pdf

const enviarEmailPdf = async (pdfFile, email, documentType, token, orderId) => {
  try {
    // Verificar que los datos necesarios estén presentes
    if (!pdfFile || !email || !documentType || !token || !orderId) {
      throw new Error('Faltan datos requeridos para enviar el PDF');
    }

    // Asegurarse de que el pdfFile sea una cadena
    if (typeof pdfFile !== 'string') {
      throw new Error('El archivo PDF debe ser una cadena base64');
    }

    // Construir el objeto de datos para la solicitud
    const data = { pdfFile, email, documentType, orderId };

    // Realizar la solicitud POST con los headers correctos
    const response = await api.post('/api/util/send-pdf', data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al enviar el PDF:', error);
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
    }
    throw error.response?.data || error;
  }
};

export { uploadImageToCloudinary, enviarEmailConfirmacionOrden, sendContactForm, enviarEmailPdf };