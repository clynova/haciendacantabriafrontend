const cortarTexto = (texto, longitud) => {
    if (texto.length <= longitud) return texto;
    return texto.slice(0, longitud) + '...';
}

const formateoNombre = (firstName, lastName) => {
    const nombreCompleto = `${firstName} ${lastName}`
    return nombreCompleto
}

const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/optimized/placeholder-large.webp';
    
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
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

const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

export { cortarTexto, formateoNombre, getImageUrl, formatCurrency, formatCurrencyBoletas,formatDate };