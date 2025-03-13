import { Helmet } from 'react-helmet-async';
import { useGlobal } from '../context/GlobalContext';

const PageTitle = () => {
  const { pageTitle } = useGlobal();

  return (
    <Helmet>
      {/* Título básico de la página */}
      <title>{pageTitle}</title>

      {/* Meta tags para SEO */}
      <meta name="description" content="Tu tienda de accesorios para automóviles" />
      <meta name="keywords" content="accesorios, autos, repuestos, autopartes" />

      {/* Meta tags para redes sociales (Open Graph) */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content="Tu tienda de accesorios para automóviles" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/ruta-a-tu-imagen.jpg" />

      {/* Meta tags para Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content="Tu tienda de accesorios para automóviles" />

      {/* Otros meta tags útiles */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#000000" />
      
      {/* Links (por ejemplo, para favicon o fuentes) */}
      <link rel="icon" href="/favicon_io/favicon.ico" />
      <link rel="canonical" href="https://tudominio.com" />
    </Helmet>
  );
};

export { PageTitle };
