import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaCreditCard,
  FaPaypal,
} from 'react-icons/fa';
import { SiWebmoney } from 'react-icons/si'; // Add SiWebmoney for Webpay
import logo from '/images/optimized/logo.webp';
import webpay from  '/images/logo-web-pay-plus.png'// Update this path to match your logo location

export const Footer = () => {
  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo Column */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" aria-label="Volver a la página de inicio">
              <img
                src={logo}
                alt="Logo de COHESA shop"
                className="h-18 w-18 object-contain mb-4"
              />
            </Link>
            <span 
              className="hidden md:block text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-indigo-300 transition-all duration-300"
              style={{ fontFamily: "Kaushan Script, cursive "}}
            >
              COHESA shop
            </span>
            <p className="text-xs text-slate-400 italic mt-2 text-center md:text-left max-w-[200px]">
              Donde la experiencia local se combina con una visión global
            </p>
          </div>

          {/* About Column */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Sobre Cohesa</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-white" aria-label="Conoce más sobre nuestra empresa">Sobre Nosotros</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white" aria-label="Instrucciones detalladas de compra">¿Cómo Comprar?</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white" aria-label="Información sobre nuestros métodos de despacho">Sobre Despachos</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white" aria-label="Formulario de contacto">Contacto</Link>
              </li>
            </ul>
          </div>

          {/* Legal Info Column */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Información Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="hover:text-white" aria-label="Leer términos y condiciones completos">Términos y Condiciones</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white" aria-label="Conocer nuestra política de privacidad">Política de Privacidad</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white" aria-label="Información sobre reembolsos y devoluciones">Políticas de Reembolso</Link>
              </li>
            </ul>
          </div>

          {/* Social and Payment Column */}
          <div className="space-y-8">
            {/* Redes Sociales */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                {/* <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                   className="text-2xl hover:text-white" aria-label="Síguenos en Facebook">
                  <FaFacebook />
                  <span className="sr-only">Facebook</span>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                   className="text-2xl hover:text-white" aria-label="Síguenos en Twitter">
                  <FaTwitter />
                  <span className="sr-only">Twitter</span>
                </a> */}
                <a href="https://www.instagram.com/hacienda.cantabria" target="_blank" rel="noopener noreferrer"
                   className="text-2xl hover:text-white" aria-label="Síguenos en Instagram">
                  <FaInstagram />
                  <span className="sr-only">Instagram</span>
                </a>
              </div>
            </div>

            {/* Métodos de Pago */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Medios de Pago</h3>
              <div className="flex ">
                <img 
                  src={webpay}
                  alt="Aceptamos pagos con Webpay Plus" 
                  className="h-12 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-slate-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © {new Date().getFullYear()} Cohesa. Todos los derechos reservados.
            </p>
            <div className="mt-4 md:mt-0">
              <Link to="/terms" className="text-sm hover:text-white mx-2" aria-label="Ver toda nuestra información legal">
                Términos y Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};