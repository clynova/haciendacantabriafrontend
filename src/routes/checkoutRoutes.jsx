import { Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout/MainLayout";
import { CheckoutLayout } from "../layouts/MainLayout/CheckoutLayout";
import { CarroDeCompras } from "../pages/payment/CarroDeCompras";
import { FormaEnvio } from "../pages/payment/FormaEnvio";
import { SistemaDePago } from "../pages/payment/SistemaDePago";
import { SolicitudDeCotizacion } from "../pages/payment/SolicitudDeCotizacion";
import { QuotationsCheckout } from "../pages/payment/QuotationsCheckout";
import { Confirmation } from "../pages/payment/Confirmation";
import { PaymentFailure } from "../pages/payment/PaymentFailure";
import { ConfirmacionCotizacion } from "../pages/payment/ConfirmacionCotizacion";
import { ProtectedRoute } from "../components/ProtectedRoute";

const checkoutRoutes = (
  <Route path="/checkout" element={
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  }>
    <Route element={<CheckoutLayout />}>
      <Route index element={<CarroDeCompras />} />
      <Route path="envio" element={<FormaEnvio />} />
      <Route path="pago" element={<SistemaDePago />} />
      <Route path="cotizacion" element={<SolicitudDeCotizacion />} />
      <Route path="quotation/:quotationId" element={<QuotationsCheckout />} />
    </Route>
    <Route path="confirmation/success" element={<Confirmation />} />
    <Route path="confirmation/failure" element={<PaymentFailure />} />
    <Route path="confirmation/cotizacion" element={<ConfirmacionCotizacion />} />
  </Route>
);

export default checkoutRoutes;