import { Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Categorias } from "../pages/Categorias";
import { ProductDetails2 } from "../pages/ProductDetails2";
import { MainLayout } from "../layouts/MainLayout/MainLayout";

const homeRoutes = [
  <Route key="main" path="/" element={<MainLayout />}>
    <Route index element={<Home />} />
    <Route path="product/:slug" element={<ProductDetails2 />} />
  </Route>,
  <Route key="categories" path="/categoria/:nombre" element={<MainLayout />}>
    <Route index element={<Categorias />} />
  </Route>
];

export default homeRoutes;