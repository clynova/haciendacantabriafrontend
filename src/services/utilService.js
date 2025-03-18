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

export { uploadImageToCloudinary };