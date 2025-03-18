const cortarTexto = (texto, longitud) => {
    if (texto.length <= longitud) return texto;
    return texto.slice(0, longitud) + '...';
}

const formateoNombre = (firstName, lastName) => {
    const nombreCompleto = `${firstName} ${lastName}`
    return nombreCompleto
}

const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder.png';
    
    // Si la ruta comienza con 'images/', es una imagen local
    if (imagePath.startsWith('images/')) {
        return `/${imagePath}`; // Agregamos / al inicio para acceder desde la carpeta public
    }
    
    // Para cualquier otra ruta, retornamos la ruta tal cual
    return imagePath;
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
    }).format(amount);
};

const formatCurrencyBoletas = (amount) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
    }).format(amount);
};

export { cortarTexto, formateoNombre, getImageUrl, formatCurrency, formatCurrencyBoletas };