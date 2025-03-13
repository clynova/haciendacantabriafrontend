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
      setPageTitle(`${product.name} | LynFront`);
    }
  }, [setPageTitle, product]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product || !product.images) {
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
    if (product.stock > 10) {
      return <span className="text-green-600 dark:text-green-400">En stock ({product.stock} unidades)</span>;
    } else if (product.stock > 0) {
      return <span className="text-yellow-600 dark:text-yellow-400">¡Últimas {product.stock} unidades!</span>;
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
              to={`/categoria/${product.category}`} 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {product.category}
            </Link>
          </li>
          <HiChevronRight className="w-5 h-5 text-gray-400" />
          <li className="text-gray-900 dark:text-white font-medium">{product.name}</li>
        </ol>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        <ImageGallery
          images={product.images}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />

        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            {product.name}
          </h1>

          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center">
              <p className="text-3xl tracking-tight text-gray-900 dark:text-white font-bold">
                {formatCurrency(product.price)}
              </p>
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
              <p>{product.description}</p>
            </div>
          </div>

          <ActionButtons product={product} addToCart={addToCart} />

          {/* Características del producto */}
          <div className="mt-10">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Características</h3>
            <div className="mt-4">
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 list-none">
                {product.features ? (
                  Object.entries(product.features).map(([key, value]) => (
                    <li key={key} className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="font-medium">{key}:</span> {value}
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Garantía de 12 meses</span>
                    </li>
                    <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Envío gratis</span>
                    </li>
                    <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Devolución gratuita por 30 días</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProductDetails };
