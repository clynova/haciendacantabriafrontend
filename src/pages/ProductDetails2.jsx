import { useState, useEffect } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ImageGallery } from '../components/Products/ImageGallery';
import { ActionButtons } from '../components/Products/ActionButtons';
import { getProductById } from '../services/productService';
import { HiHome, HiChevronRight, HiScale, HiClock, HiShieldCheck, HiInformationCircle } from 'react-icons/hi';
import { formatCurrency } from '../utils/funcionesReutilizables';
import toast from 'react-hot-toast';

const ProductDetails2 = () => {
  const { _id, slug } = useParams();
  const navigate = useNavigate();
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
        const fetchedProduct = await getProductById(_id || slug);
        
        if (fetchedProduct.success) {
          setProduct(fetchedProduct.product);
          
          // Redirect to slug URL if we're on ID URL
          if (_id && fetchedProduct.product.slug && !window.location.pathname.includes('/product/')) {
            navigate(`/product/${fetchedProduct.product.seo.slug}`, { replace: true });
          }
        } else {
          throw new Error(fetchedProduct.msg || 'Error al cargar el producto');
        }
      } catch (err) {
        setError('No se pudo cargar el producto. Por favor, intente nuevamente.');
        toast.error('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [_id, slug, navigate]);

  useEffect(() => {
    if (product) {
      setPageTitle(`${product.nombre} | Hacienda Cantabria`);
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

  const renderProductTypeSpecificInfo = () => {
    switch (product.tipoProducto) {
      case 'ProductoCarne':
        return (
          <div className="space-y-6">
            {/* Info de Carne */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Información del Corte
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Tipo de Carne:</span> {product.infoCarne.tipoCarne}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Corte:</span> {product.infoCarne.corte}
                  </p>
                  {product.infoCarne.nombreArgentino && (
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Nombre Argentino:</span> {product.infoCarne.nombreArgentino}
                    </p>
                  )}
                  {product.infoCarne.nombreChileno && (
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Nombre Chileno:</span> {product.infoCarne.nombreChileno}
                    </p>
                  )}
                </div>
                {product.caracteristicas && (
                  <div>
                    {product.caracteristicas.porcentajeGrasa && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Porcentaje de Grasa:</span> {product.caracteristicas.porcentajeGrasa}%
                      </p>
                    )}
                    {product.caracteristicas.marmoleo && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Marmoleo:</span> {product.caracteristicas.marmoleo}/5
                      </p>
                    )}
                    {product.caracteristicas.color && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Color:</span> {product.caracteristicas.color}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Info Nutricional */}
            {product.infoNutricional && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Información Nutricional
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Calorías</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {product.infoNutricional.calorias}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Proteínas</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {product.infoNutricional.proteinas}g
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Grasa Total</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {product.infoNutricional.grasaTotal}g
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Porción</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {product.infoNutricional.porcion}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Cocción */}
            {product.coccion && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Recomendaciones de Cocción
                </h3>
                <div className="grid gap-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <HiScale className="w-5 h-5" />
                    <span>Métodos recomendados: {product.coccion.metodos.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <HiClock className="w-5 h-5" />
                    <span>Tiempo estimado: {product.coccion.tiempoEstimado}</span>
                  </div>
                  {product.coccion.temperaturaIdeal && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <HiInformationCircle className="w-5 h-5" />
                      <span>Temperatura ideal: {product.coccion.temperaturaIdeal}</span>
                    </div>
                  )}
                  {product.coccion.consejos && product.coccion.consejos.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Consejos:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                        {product.coccion.consejos.map((consejo, index) => (
                          <li key={index}>{consejo}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 'ProductoAceite':
        return (
          <div className="space-y-6">
            {/* Info de Aceite */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Información del Aceite
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Tipo:</span> {product.infoAceite.tipo}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Volumen:</span> {product.infoAceite.volumen}ml
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Envase:</span> {product.infoAceite.envase}
                  </p>
                </div>
                {product.caracteristicas && (
                  <div>
                    {product.caracteristicas.acidez && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Acidez:</span> {product.caracteristicas.acidez}
                      </p>
                    )}
                    {product.caracteristicas.extraccion && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Método de extracción:</span> {product.caracteristicas.extraccion}
                      </p>
                    )}
                    {product.caracteristicas.filtracion && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Filtración:</span> {product.caracteristicas.filtracion}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Info Nutricional */}
            {product.infoNutricional && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Información Nutricional
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(product.infoNutricional).map(([key, value]) => (
                    key !== 'porcion' && (
                      <div key={key} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {value}g
                        </p>
                      </div>
                    )
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Porción: {product.infoNutricional.porcion}
                </p>
              </div>
            )}

            {/* Usos Recomendados */}
            {product.usosRecomendados && product.usosRecomendados.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Usos Recomendados
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {product.usosRecomendados.map((uso, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {uso}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Características del Producto
            </h3>
            {product.caracteristicas && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.caracteristicas).map(([key, value]) => (
                  <p key={key} className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{key}:</span> {
                      Array.isArray(value) ? value.join(', ') : value
                    }
                  </p>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

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
        {/* Galería de imágenes */}
        <ImageGallery
          images={product.multimedia.imagenes}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />

        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            {product.nombre}
          </h1>

          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                {product.precios?.base && product.precioFinal < product.precios.base && (
                  <div className="flex items-center gap-2">
                    <p className="text-lg line-through text-gray-500 dark:text-gray-400">
                      {formatCurrency(product.precios.base)}
                    </p>
                    <span className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-sm px-2 py-0.5 rounded-full">
                      -{Math.round((1 - (product.precioFinal / product.precios.base)) * 100)}%
                    </span>
                  </div>
                )}
                <p className="text-3xl tracking-tight text-gray-900 dark:text-white font-bold">
                  {formatCurrency(product.precioFinal)}
                </p>
                {product.precioTransferencia && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
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

          {/* Peso y opciones específicas según tipo de producto */}
          {product.opcionesPeso && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Información de peso
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">
                  Peso promedio: {product.opcionesPeso.pesoPromedio}g
                </p>
                {product.opcionesPeso.esPesoVariable && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    El peso final puede variar ligeramente
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* Información específica según tipo de producto */}
          <div className="mt-8">
            {renderProductTypeSpecificInfo()}
          </div>

          {/* Conservación */}
          {product.conservacion && (
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <HiShieldCheck className="w-6 h-6 text-green-500" />
                Conservación
              </h3>
              <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <p><span className="font-medium">Vida útil:</span> {product.conservacion.vidaUtil}</p>
                <p>{product.conservacion.instrucciones}</p>
                {product.conservacion.requiereRefrigeracion && (
                  <p className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <HiInformationCircle className="w-5 h-5" />
                    Requiere refrigeración
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { ProductDetails2 };