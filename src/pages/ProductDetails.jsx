import { useState, useEffect } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ImageGallery } from '../components/Products/ImageGallery';
import { ActionButtons } from '../components/Products/ActionButtons';
import { getProductById } from '../services/productService';
import { HiHome, HiChevronRight } from 'react-icons/hi';
import { formatCurrency } from '../utils/funcionesReutilizables';

const ProductDetails = () => {
  const { _id } = useParams();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const { setPageTitle } = useGlobal();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProduct = await getProductById(_id);
        setProduct(fetchedProduct.product);
      } catch (err) {
        setError('No se pudo cargar el producto. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [_id]);

  useEffect(() => {
    if (product) {
      setPageTitle(`${product.nombre} | Cohesa`);
    }
  }, [setPageTitle, product]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product || !product.multimedia) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-2xl text-gray-700 dark:text-gray-300 mb-4">
          {error || 'Producto no encontrado'}
        </p>
        <Link 
          to="/"
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  const stockStatus = () => {
    if (product.inventario.stockUnidades > 10) {
      return <span className="text-green-600 dark:text-green-400">En stock ({product.inventario.stockUnidades} unidades)</span>;
    } else if (product.inventario.stockUnidades > 0) {
      return <span className="text-yellow-600 dark:text-yellow-400">¡Últimas {product.inventario.stockUnidades} unidades!</span>;
    }
    return <span className="text-red-600 dark:text-red-400">Agotado</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ marginTop: '4rem' }}>
      {/* Breadcrumbs */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <HiHome className="w-5 h-5" />
            </Link>
          </li>
          <HiChevronRight className="w-5 h-5 text-gray-400" />
          <li>
            <Link 
              to={`/categoria/${product.categoria}`} 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {product.categoria}
            </Link>
          </li>
          <HiChevronRight className="w-5 h-5 text-gray-400" />
          <li className="text-gray-900 dark:text-white font-medium">{product.nombre}</li>
        </ol>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        <ImageGallery
          images={product.multimedia.imagenes}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />

        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            {product.nombre}
          </h1>

          {product.infoCarne && (
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-400">
                {product.infoCarne.tipoCarne} - {product.infoCarne.nombreArgentino}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl tracking-tight text-gray-900 dark:text-white font-bold">
                  {formatCurrency(product.precioFinal)}
                </p>
                {product.precioTransferencia && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Precio transferencia: {formatCurrency(product.precioTransferencia)}
                  </p>
                )}
              </div>
              {stockStatus()}
            </div>

            {product.sku && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                SKU: {product.sku}
              </p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Descripción</h3>
            <div className="text-base text-gray-700 dark:text-gray-300 space-y-6">
              <p>{product.descripcion.completa}</p>
            </div>
          </div>

          <ActionButtons product={product} addToCart={addToCart} />

          {/* Info de peso */}
          {product.opcionesPeso && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Información de peso</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Peso promedio: {product.opcionesPeso.pesoPromedio}g
              </p>
            </div>
          )}

          {/* Características del producto */}
          <div className="mt-10">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Características</h3>
            <div className="mt-4">
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 list-none">
                {product.caracteristicas && Object.entries(product.caracteristicas).map(([key, value]) => (
                  <li key={key} className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="font-medium">{key}:</span> {Array.isArray(value) ? value.join(', ') : value}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instrucciones de cocción */}
          {product.coccion && (
            <div className="mt-10">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Instrucciones de cocción</h3>
              <div className="mt-4">
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li><span className="font-medium">Métodos recomendados:</span> {product.coccion.metodos.join(', ')}</li>
                  <li><span className="font-medium">Temperatura ideal:</span> {product.coccion.temperaturaIdeal}</li>
                  <li><span className="font-medium">Tiempo estimado:</span> {product.coccion.tiempoEstimado}</li>
                </ul>
                {product.coccion.consejos && product.coccion.consejos.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Consejos:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {product.coccion.consejos.map((consejo, index) => (
                        <li className='text-white' key={index}>{consejo}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Conservación */}
          {product.conservacion && (
            <div className="mt-10">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Conservación</h3>
              <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <p><span className="font-medium">Vida útil:</span> {product.conservacion.vidaUtil}</p>
                <p>{product.conservacion.instrucciones}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { ProductDetails };
