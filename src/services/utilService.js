import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

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


export const sendContactForm = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/api/util/contact`, formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export { uploadImageToCloudinary };