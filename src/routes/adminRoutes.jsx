import { Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout/MainLayout";
import { AdminLayout } from "../layouts/MainLayout/AdminLayout";
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { AdminProducts } from "../pages/admin/AdminProducts";
import { AdminProductCreate } from "../pages/admin/AdminProductCreate";
import { AdminProductEdit } from "../pages/admin/AdminProductEdit";
import { AdminProductDetails } from "../pages/admin/AdminProductDetails";
import { AdminOrders } from "../pages/admin/AdminOrders";
import { AdminOrderDetails } from "../pages/admin/AdminOrderDetails";
import { AdminMetodosDePago } from "../pages/admin/AdminMetodosDePago";
import { AdminMetodosDeEnvio } from "../pages/admin/AdminMetodosDeEnvio";
import { AdminUsers } from "../pages/admin/AdminUsers";
import { AdminUserCreate } from "../pages/admin/AdminUserCreate";
import { AdminUserDetails } from "../pages/admin/AdminUserDetails";
import { AdminCotizaciones } from "../pages/admin/AdminCotizaciones";
import { AdminQuotationDetails } from "../pages/admin/AdminQuotationDetails";
import { AdminCategories } from "../pages/admin/AdminCategories";
import { AdminRegionesDeEnvio } from "../pages/admin/AdminRegionesDeEnvio";
import { AdminRoute } from "../components/AdminRoute";

const adminRoutes = (
  <Route path="/admin" element={<AdminRoute><MainLayout /></AdminRoute>}>
    <Route element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="products">
        <Route index element={<AdminProducts />} />
        <Route path="create" element={<AdminProductCreate />} />
        <Route path=":productId/edit" element={<AdminProductEdit />} />
        <Route path=":productId" element={<AdminProductDetails />} />
      </Route>
      <Route path="orders">
        <Route index element={<AdminOrders />} />
        <Route path=":orderId" element={<AdminOrderDetails />} />
      </Route>
      <Route path="payment-methods" element={<AdminMetodosDePago />} />
      <Route path="shipping-methods" element={<AdminMetodosDeEnvio />} />
      <Route path="users">
        <Route index element={<AdminUsers />} />
        <Route path="new" element={<AdminUserCreate />} />
        <Route path=":userId" element={<AdminUserDetails />} />
      </Route>
      <Route path="quotations">
        <Route index element={<AdminCotizaciones />} />
        <Route path=":quotationId" element={<AdminQuotationDetails />} />
      </Route>
      <Route path="categories" element={<AdminCategories />} />
      <Route path="shipping-regions" element={<AdminRegionesDeEnvio />} />
    </Route>
  </Route>
);

export default adminRoutes;