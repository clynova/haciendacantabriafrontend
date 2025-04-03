import { Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Categorias } from "../pages/Categorias";
import { ProductDetails2 } from "../pages/ProductDetails2";
import { MainLayout } from "../layouts/MainLayout/MainLayout";
import { CategoriaList } from "../pages/CategoriaList";
import TopProducts from "../pages/TopProducts";
import AllProducts from "../pages/AllProducts";

const homeRoutes = [
  <Route key="main" path="/" element={<MainLayout />}>
    <Route index element={<Home />} />
    <Route path="categorias" element={<CategoriaList />} />
    <Route path="categoria/:nombre" element={<Categorias />} />
    <Route path="product/:slug" element={<ProductDetails2 />} />
    <Route path="/productos" element={<AllProducts />} />
    <Route path="/mas-vendidos" element={<TopProducts />} />
  </Route>
];

export default homeRoutes;